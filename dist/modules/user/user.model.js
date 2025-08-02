"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const user_constant_1 = require("./user.constant");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        enum: Object.values(user_constant_1.USER_ROLE),
        required: true,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform(_, ret) {
            // Cast ret to any to allow delete
            const obj = ret;
            if (obj.password)
                delete obj.password;
            if (obj.__v !== undefined)
                delete obj.__v;
        },
    },
});
// Password hashing middleware
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password'))
            return next();
        if (!this.password) {
            return next(new Error('Password is missing'));
        }
        try {
            const saltRounds = Number(env_1.envVars.BCRYPT_SALT_ROUND) || 10;
            this.password = yield bcryptjs_1.default.hash(this.password, saltRounds);
            next();
        }
        catch (error) {
            next(error);
        }
    });
});
// Add your method if needed here (optional)
// e.g., userSchema.methods.isPasswordMatched = async function(...) { ... }
exports.User = mongoose_1.models.User || (0, mongoose_1.model)('User', userSchema);
