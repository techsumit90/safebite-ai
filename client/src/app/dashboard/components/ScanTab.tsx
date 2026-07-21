import React from 'react';
import { Camera, Image as ImageIcon, FileText, Sparkles, Loader2, AlertOctagon, AlertTriangle } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

interface ScanTabProps {
  ingredientsText: string;
  setIngredientsText: (text: string) => void;
  imagePreview: string | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  analyzing: boolean;
  analysisResult: any;
  handleAnalyze: () => void;
  getRadarData: (result: any) => any[];
}

export default function ScanTab({
  ingredientsText,
  setIngredientsText,
  imagePreview,
  handleImageUpload,
  analyzing,
  analysisResult,
  handleAnalyze,
  getRadarData,
}: ScanTabProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="glow-card" style={{ padding: 32 }}>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          {/* Input Panel */}
          <div style={{ flex: 1, minWidth: 300, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Camera size={18} style={{ color: 'var(--primary)' }} /> Upload Label Image
              </h3>
              <p style={{ fontSize: 13, color: 'rgba(248, 250, 252, 0.4)', marginBottom: 12 }}>
                Take a photo of the ingredients list or nutrition facts.
              </p>
              
              <label
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '32px 24px',
                  border: '2px dashed rgba(255, 255, 255, 0.1)',
                  borderRadius: 16,
                  background: 'rgba(255, 255, 255, 0.02)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                }}
              >
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                
                {imagePreview ? (
                  <div style={{ position: 'absolute', inset: 0, padding: 8 }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                    >
                      <span style={{ color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <ImageIcon size={16} /> Change Image
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 50,
                        background: 'rgba(99, 102, 241, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 12,
                        color: 'var(--primary)',
                      }}
                    >
                      <ImageIcon size={24} />
                    </div>
                    <span style={{ fontWeight: 600, color: 'white', fontSize: 14 }}>Click to upload</span>
                    <span style={{ fontSize: 12, color: 'rgba(248, 250, 252, 0.4)', marginTop: 4 }}>
                      JPEG, PNG, WebP up to 5MB
                    </span>
                  </>
                )}
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'rgba(248, 250, 252, 0.3)', fontSize: 12 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.1)' }} />
              OR ENTER MANUALLY
              <div style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.1)' }} />
            </div>

            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={18} style={{ color: '#22d3ee' }} /> Ingredients Text
              </h3>
              <textarea
                rows={4}
                placeholder="Paste ingredients here..."
                value={ingredientsText}
                onChange={(e) => setIngredientsText(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 12,
                  color: '#fff',
                  fontSize: 14,
                  outline: 'none',
                  resize: 'none',
                }}
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={analyzing || (!imagePreview && !ingredientsText.trim())}
              className="btn-primary"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '14px',
              }}
            >
              {analyzing ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Analyzing Ingredients...
                </>
              ) : (
                <>
                  <Sparkles size={18} /> Analyze Food Safety
                </>
              )}
            </button>
          </div>

          {/* Loader/Scan Results Display Panel */}
          <div style={{ flex: 1 }}>
            {analyzing && (
              <div
                className="glow-card scan-overlay"
                style={{
                  padding: '40px',
                  minHeight: 400,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 20,
                }}
              >
                <Loader2 size={40} className="animate-spin" style={{ color: 'var(--accent)' }} />
                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ fontWeight: 700, fontSize: 16, color: 'white', marginBottom: 4 }}>
                    Scanning & Extracting Text...
                  </h4>
                  <p style={{ fontSize: 13, color: 'rgba(248, 250, 252, 0.5)' }}>
                    Running local OCR and querying health engine
                  </p>
                </div>
              </div>
            )}

            {!analyzing && !analysisResult && (
              <div
                className="glow-card"
                style={{
                  padding: '40px',
                  minHeight: 400,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(248,250,252,0.4)',
                  textAlign: 'center',
                }}
              >
                <Camera size={44} style={{ marginBottom: 16, opacity: 0.5 }} />
                <h4 style={{ fontWeight: 700, fontSize: 16, color: 'white', marginBottom: 4 }}>
                  Awaiting Scan Input
                </h4>
                <p style={{ fontSize: 13, maxWidth: 300 }}>
                  Provide an ingredient label image or paste manual text on the left to review safety assessments.
                </p>
              </div>
            )}

            {/* Successful Scan results */}
            {!analyzing && analysisResult && (
              <div className="glow-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Header Details */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>{analysisResult.productName}</h4>
                    <div style={{ fontSize: 12, color: 'rgba(248,250,252,0.4)', marginTop: 2 }}>
                      Analyzed at {new Date(analysisResult.scannedAt).toLocaleTimeString()}
                    </div>
                  </div>
                  <span
                    className={
                      analysisResult.riskLevel === 'Safe'
                        ? 'badge-safe'
                        : analysisResult.riskLevel === 'Caution'
                          ? 'badge-caution'
                          : 'badge-danger'
                    }
                    style={{
                      padding: '6px 14px',
                      borderRadius: 50,
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  >
                    {analysisResult.riskLevel.toUpperCase()}
                  </span>
                </div>

                {/* Score display */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: 12 }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 50,
                      border: `3px solid ${analysisResult.riskLevel === 'Safe' ? '#10b981' : analysisResult.riskLevel === 'Caution' ? '#f59e0b' : '#ef4444'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: 16,
                      color: 'white',
                      background: 'rgba(0,0,0,0.3)',
                    }}
                  >
                    {analysisResult.safetyScore}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'white' }}>Safety Score</div>
                    <div style={{ fontSize: 12, color: 'rgba(248,250,252,0.4)' }}>
                      Based on personal health restrictions matching
                    </div>
                  </div>
                </div>

                {/* Explanations */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(248, 250, 252, 0.6)' }}>AI Verdict Rationale</div>
                  <p style={{ fontSize: 14, color: 'rgba(248, 250, 252, 0.8)', lineHeight: 1.6 }}>
                    {analysisResult.personalizedExplanation}
                  </p>
                </div>

                {/* Warning Ingredients */}
                {analysisResult.harmfulIngredients && analysisResult.harmfulIngredients.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <AlertOctagon size={16} /> Flagged Ingredients
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {analysisResult.harmfulIngredients.map((ing: string, idx: number) => (
                        <span
                          key={idx}
                          style={{
                            padding: '4px 12px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            color: '#ef4444',
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Warning Chronic Banner */}
                {analysisResult.nutritionalWarnings && analysisResult.nutritionalWarnings.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <AlertTriangle size={16} /> Nutritional Warnings
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {analysisResult.nutritionalWarnings.map((warn: string, idx: number) => (
                        <div
                          key={idx}
                          style={{
                            padding: '8px 12px',
                            background: 'rgba(245, 158, 11, 0.08)',
                            border: '1px solid rgba(245, 158, 11, 0.15)',
                            color: '#f59e0b',
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                        >
                          {warn}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Radar Chart */}
                {analysisResult.nutritionFacts && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(248, 250, 252, 0.6)' }}>Nutritional Values Radar</div>
                    <div style={{ width: '100%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getRadarData(analysisResult)}>
                          <PolarGrid stroke="rgba(255,255,255,0.08)" />
                          <PolarAngleAxis dataKey="name" stroke="rgba(248,250,252,0.4)" fontSize={10} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} stroke="rgba(255,255,255,0.08)" />
                          <Radar
                            name="Nutrition"
                            dataKey="val"
                            stroke="var(--primary)"
                            fill="var(--primary)"
                            fillOpacity={0.25}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Disclaimer */}
                <footer
                  style={{
                    marginTop: 12,
                    padding: '12px',
                    border: '1px solid rgba(245,158,11,0.2)',
                    background: 'rgba(245,158,11,0.04)',
                    borderRadius: 10,
                    fontSize: 11,
                    color: 'rgba(248,250,252,0.45)',
                    lineHeight: 1.5,
                  }}
                >
                  ⚠️ <strong>Medical Disclaimer:</strong> SafeBite AI provides automated ingredient assessments for informational purposes only. Do not rely solely on this analysis for diagnosing, treating, or managing medical conditions. Consult a qualified professional before making food decisions.
                </footer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
