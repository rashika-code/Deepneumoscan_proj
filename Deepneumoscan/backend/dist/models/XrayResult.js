"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const XrayResultSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    imageUrl: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    smoking: { type: Boolean, required: true },
    medicalHistory: String,
    prediction: { type: String, enum: ['Pneumonia', 'Normal'], required: true },
    confidence: { type: Number, required: true },
    modelUsed: { type: String, enum: ['KNN', 'SVM'], required: true },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('XrayResult', XrayResultSchema);
