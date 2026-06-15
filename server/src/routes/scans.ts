import { Router } from 'express';
import multer from 'multer';
import passport from '../config/passport';
import { analyzeScan, getScanHistory, deleteScan } from '../controllers/scanController';

const router = Router();

// Setup Multer memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // limit 5MB
});

// Protect all routes with JWT Strategy
const auth = passport.authenticate('jwt', { session: false });

router.post('/analyze', auth, upload.single('image'), analyzeScan);
router.get('/', auth, getScanHistory);
router.delete('/:id', auth, deleteScan);

export default router;
