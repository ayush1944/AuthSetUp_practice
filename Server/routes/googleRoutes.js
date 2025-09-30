import express from 'express'
import { googleCallbackController, googleController } from '../controllers/googleControllers.js';
const router = express.Router();

router.get("/google", googleController);
router.get("/google/callback", googleCallbackController)


export default router