"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Assessment_1 = __importDefault(require("../models/Assessment"));
const XrayResult_1 = __importDefault(require("../models/XrayResult"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateToken);
router.get('/', async (req, res) => {
    try {
        const assessments = await Assessment_1.default.find({ userId: req.user.id }).sort({ createdAt: -1 });
        const xrayResults = await XrayResult_1.default.find({ userId: req.user.id }).sort({ createdAt: -1 });
        // Optional: Log to History collection
        // Uncomment below if you want to maintain a unified history log
        /*
        for (const a of assessments) {
          await History.create({
            userId: req.user!.id,
            type: 'assessment',
            referenceId: a._id.toString(),
          });
        }
        for (const x of xrayResults) {
          await History.create({
            userId: req.user!.id,
            type: 'xray',
            referenceId: x._id.toString(),
          });
        }
        */
        res.json({
            assessments,
            xrayResults,
        });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});
exports.default = router;
