"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AssessmentSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    type: { type: String, enum: ['self', 'curing'], required: true },
    answers: { type: Object, required: true },
    score: Number,
    riskLevel: String,
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Assessment', AssessmentSchema);
