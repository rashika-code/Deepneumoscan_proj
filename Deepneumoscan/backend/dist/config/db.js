"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error("MONGO_URI is missing in .env file!");
        }
        await mongoose_1.default.connect(uri);
        console.log("✅ MongoDB connected");
    }
    catch (err) {
        console.error("MongoDB connection error:", err);
    }
};
exports.default = connectDB;
