"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const XrayResult_1 = __importDefault(require("../models/XrayResult"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Configure multer
const storage = multer_1.default.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg') {
            cb(null, true);
        }
        else {
            cb(new Error('Only JPEG images allowed'));
        }
    },
});
router.use(auth_1.authenticateToken);
// Mock AI prediction function
function mockPredict(age, smoking) {
    const confidence = 70 + Math.random() * 30; // 70–100%
    const model = confidence >= 90 ? 'KNN' : 'SVM';
    const prediction = Math.random() > 0.4 ? 'Pneumonia' : 'Normal';
    return { prediction, confidence, model };
}
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { age, gender, smoking, medicalHistory } = req.body;
        if (!req.file)
            return res.status(400).json({ error: 'Image required' });
        const mock = mockPredict(parseInt(age), smoking === 'true');
        const result = new XrayResult_1.default({
            userId: req.user.id,
            imageUrl: `/uploads/${req.file.filename}`,
            age: parseInt(age),
            gender,
            smoking: smoking === 'true',
            medicalHistory: medicalHistory || '',
            prediction: mock.prediction,
            confidence: mock.confidence,
            modelUsed: mock.model,
        });
        await result.save();
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Upload failed' });
    }
});
router.get('/', async (req, res) => {
    try {
        const results = await XrayResult_1.default.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(results);
    }
    catch (err) {
        res.status(500).json({ error: 'Fetch failed' });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const result = await XrayResult_1.default.deleteOne({
            _id: req.params.id,
            userId: req.user.id,
        });
        if (result.deletedCount === 0)
            return res.status(404).json({ error: 'Not found' });
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: 'Delete failed' });
    }
});
exports.default = router;
