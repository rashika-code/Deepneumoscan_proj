"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const HistorySchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    type: { type: String, enum: ['assessment', 'xray'], required: true },
    referenceId: { type: String, required: true },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('History', HistorySchema);
