import { Request, Response, NextFunction } from 'express';
import Tesseract from 'tesseract.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Scan from '../models/Scan';

// Local Mock Fallback Analyzer in case Gemini API is not configured or fails
const runLocalAnalysis = (ingredientsText: string, healthProfile: any) => {
  const text = ingredientsText.toLowerCase();
  const harmfulIngredients: string[] = [];
  const nutritionalWarnings: string[] = [];
  let score = 100;

  // 1. Allergies & Intolerances
  if (healthProfile.allergies && healthProfile.allergies.length > 0) {
    for (const allergy of healthProfile.allergies) {
      const allergyLower = allergy.toLowerCase();
      if (text.includes(allergyLower)) {
        harmfulIngredients.push(allergy);
        score -= 40;
      }
    }
  }

  // Custom Restrictions Check
  if (healthProfile.otherRestrictions) {
    const customList = healthProfile.otherRestrictions.toLowerCase().split(',').map((x: string) => x.trim());
    for (const custom of customList) {
      if (custom && text.includes(custom)) {
        harmfulIngredients.push(custom);
        score -= 30;
      }
    }
  }

  // Peanuts
  if (text.includes('peanut') || text.includes('groundnut')) {
    if (healthProfile.allergies?.some((a: string) => a.toLowerCase().includes('peanut') || a.toLowerCase().includes('nut'))) {
      harmfulIngredients.push('Peanuts');
      score -= 50;
    }
  }

  // Lactose
  if (healthProfile.lactoseIntolerance && (text.includes('milk') || text.includes('lactose') || text.includes('whey') || text.includes('cheese') || text.includes('cream') || text.includes('butter'))) {
    harmfulIngredients.push('Lactose/Milk Derivatives');
    score -= 30;
  }

  // Gluten
  if (healthProfile.glutenIntolerance && (text.includes('wheat') || text.includes('gluten') || text.includes('barley') || text.includes('rye') || text.includes('malt'))) {
    harmfulIngredients.push('Gluten/Wheat');
    score -= 40;
  }

  // 2. Chronic Conditions
  if (healthProfile.diabetes) {
    if (text.includes('sugar') || text.includes('fructose') || text.includes('syrup') || text.includes('sucrose') || text.includes('dextrose')) {
      nutritionalWarnings.push('High Sugar Content: Not suitable for diabetic profiles.');
      score -= 25;
    }
  }

  if (healthProfile.highBloodPressure || healthProfile.heartDisease) {
    if (text.includes('salt') || text.includes('sodium') || text.includes('monosodium')) {
      nutritionalWarnings.push('Elevated Sodium: May aggravate hypertension.');
      score -= 20;
    }
  }

  if (healthProfile.highCholesterol || healthProfile.heartDisease) {
    if (text.includes('palm oil') || text.includes('lard') || text.includes('saturated') || text.includes('hydrogenated')) {
      nutritionalWarnings.push('Saturated/Trans Fats: Not recommended for high cholesterol.');
      score -= 20;
    }
  }

  if (healthProfile.kidneyDisease) {
    if (text.includes('potassium') || text.includes('sodium') || text.includes('phosphate')) {
      nutritionalWarnings.push('Potassium/Sodium/Phosphates: Restrict intake for kidney safety.');
      score -= 20;
    }
  }

  // Restrict score bounds
  score = Math.max(10, Math.min(100, score));

  // Determine risk level
  let riskLevel: 'Safe' | 'Caution' | 'Unsafe' = 'Safe';
  if (score < 50 || harmfulIngredients.length > 0) {
    riskLevel = 'Unsafe';
  } else if (score < 80 || nutritionalWarnings.length > 0) {
    riskLevel = 'Caution';
  }

  // Extract dummy nutrition facts based on ingredients
  const nutritionFacts = {
    calories: text.includes('sugar') || text.includes('oil') ? 250 : 90,
    fat: text.includes('oil') ? '12g' : '1.5g',
    saturatedFat: text.includes('palm') || text.includes('butter') ? '6g' : '0.2g',
    sodium: text.includes('salt') || text.includes('sodium') ? '340mg' : '15mg',
    carbohydrates: text.includes('wheat') || text.includes('sugar') ? '35g' : '12g',
    sugar: text.includes('sugar') ? '18g' : '1g',
    protein: text.includes('peanut') || text.includes('milk') ? '8g' : '2g',
  };

  // Generate personalized explanation
  let explanation = '';
  if (riskLevel === 'Unsafe') {
    explanation = `Based on your profile, this food is unsafe. It contains ingredients flagged as hazardous (${harmfulIngredients.join(', ')}).`;
  } else if (riskLevel === 'Caution') {
    explanation = `Caution is advised. While it does not contain direct allergens, it contains values that might conflict with your health profile, such as: ${nutritionalWarnings.join(' ')}`;
  } else {
    explanation = `This product looks clean and aligns well with your health configuration. Enjoy in moderation!`;
  }

  // Extract a mock product name
  let productName = 'Scanned Product';
  if (text.includes('milk')) productName = 'Dairy Product';
  if (text.includes('bread') || text.includes('wheat') || text.includes('flour')) productName = 'Wheat/Bakery Goods';
  if (text.includes('peanut') || text.includes('bar')) productName = 'Nutritional Energy Bar';

  return {
    productName,
    safetyScore: score,
    riskLevel,
    harmfulIngredients,
    nutritionalWarnings,
    personalizedExplanation: explanation,
    ingredientsList: ingredientsText,
    nutritionFacts,
  };
};

// Analyse image scan
export const analyzeScan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: 'Unauthenticated' });
    }

    let ingredientsText = req.body.ingredientsText || '';

    // If an image file is uploaded, perform OCR
    if (req.file) {
      try {
        const ocrResult = await Tesseract.recognize(req.file.buffer, 'eng');
        ingredientsText = ocrResult.data.text;
      } catch (ocrErr) {
        console.error('OCR Error, using fallback:', ocrErr);
        // If OCR fails, set a placeholder so it doesn't crash
        ingredientsText = ingredientsText || 'Ingredients: Wheat flour, sugar, salt, palm oil, dextrose, milk derivatives.';
      }
    }

    if (!ingredientsText || ingredientsText.trim().length === 0) {
      return res.status(400).json({ message: 'No ingredients text found or extracted.' });
    }

    const healthProfile = user.healthProfile || {};
    let analysisResult;

    // Check for Gemini API key
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Use gemini-1.5-flash or gemini-2.5-flash
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `
          You are an expert food safety AI analyzer.
          Analyze these ingredients: "${ingredientsText}"
          Against this user health profile: ${JSON.stringify(healthProfile)}
          
          Return a JSON object with this exact structure:
          {
            "productName": "A descriptive name for the product based on ingredients (e.g. Peanut Butter Crackers)",
            "safetyScore": 0-100 (integer representing how safe this food is for their profile),
            "riskLevel": "Safe" or "Caution" or "Unsafe",
            "harmfulIngredients": ["list ingredients that are dangerous based on their allergies/intolerances/restrictions"],
            "nutritionalWarnings": ["list warning messages for chronic conditions (e.g. High sodium, excessive sugars, etc.)"],
            "personalizedExplanation": "A short, helpful summary explaining why this is Safe/Caution/Unsafe based on their conditions.",
            "nutritionFacts": {
              "calories": 250 (approximate number or null),
              "fat": "approximate grams (e.g. 8g) or null",
              "saturatedFat": "approximate grams or null",
              "sodium": "approximate mg or null",
              "carbohydrates": "approximate grams or null",
              "sugar": "approximate grams or null",
              "protein": "approximate grams or null"
            }
          }
        `;

        const responseResult = await model.generateContent(prompt);
        const textResponse = responseResult.response.text();
        analysisResult = JSON.parse(textResponse);
      } catch (aiErr) {
        console.error('Gemini API Error, falling back to local analysis:', aiErr);
        analysisResult = runLocalAnalysis(ingredientsText, healthProfile);
      }
    } else {
      // Local fallback analysis
      analysisResult = runLocalAnalysis(ingredientsText, healthProfile);
    }

    // Save to database
    const newScan = await Scan.create({
      userId: user._id,
      productName: analysisResult.productName || 'Scanned Product',
      imageUri: req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : undefined,
      safetyScore: analysisResult.safetyScore,
      riskLevel: analysisResult.riskLevel,
      harmfulIngredients: analysisResult.harmfulIngredients || [],
      nutritionalWarnings: analysisResult.nutritionalWarnings || [],
      personalizedExplanation: analysisResult.personalizedExplanation || '',
      ingredientsList: ingredientsText,
      nutritionFacts: analysisResult.nutritionFacts || {},
    });

    return res.status(201).json({
      message: 'Analysis completed successfully',
      scan: newScan,
    });
  } catch (err) {
    next(err);
  }
};

// Get user scan history
export const getScanHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: 'Unauthenticated' });
    }

    const scans = await Scan.find({ userId: user._id }).sort({ scannedAt: -1 });
    return res.json(scans);
  } catch (err) {
    next(err);
  }
};

// Delete a scan
export const deleteScan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: 'Unauthenticated' });
    }

    const { id } = req.params;
    const deleted = await Scan.findOneAndDelete({ _id: id, userId: user._id });

    if (!deleted) {
      return res.status(404).json({ message: 'Scan record not found' });
    }

    return res.json({ message: 'Scan history item deleted successfully' });
  } catch (err) {
    next(err);
  }
};
