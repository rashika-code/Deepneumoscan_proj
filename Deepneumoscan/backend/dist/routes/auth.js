"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
router.post('/signup', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name)
            return res.status(400).json({ error: 'Missing fields' });
        const existing = await User_1.default.findOne({ email });
        if (existing)
            return res.status(400).json({ error: 'User exists' });
        const user = new User_1.default({ email, password, name });
        await user.save();
        const token = jsonwebtoken_1.default.sign({ id: user._id.toString() }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email, password });
        if (!user)
            return res.status(401).json({ error: 'Invalid credentials' });
        const token = jsonwebtoken_1.default.sign({ id: user._id.toString() }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });
    }
    catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
