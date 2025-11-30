"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Assessment_1 = __importDefault(require("../models/Assessment"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateToken);
router.post('/', async (req, res) => {
    try {
        const { type, answers, score, riskLevel } = req.body;
        const assessment = new Assessment_1.default({
            userId: req.user.id,
            type,
            answers,
            score,
            riskLevel,
        });
        await assessment.save();
        res.status(201).json(assessment);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to save assessment' });
    }
});
router.get('/', async (req, res) => {
    try {
        const assessments = await Assessment_1.default.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(assessments);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch assessments' });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const result = await Assessment_1.default.deleteOne({
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
