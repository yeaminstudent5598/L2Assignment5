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
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_model_1 = require("../auth/auth.model");
const jwt_1 = require("../../utils/jwt");
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
exports.AuthService = {
    register: (userData) => __awaiter(void 0, void 0, void 0, function* () {
        const { phoneNumber, password, role, name } = userData;
        const existingUser = yield auth_model_1.User.findOne({ phoneNumber });
        if (existingUser) {
            throw new AppError_1.default(400, 'User with this phone number already exists');
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
        const user = yield auth_model_1.User.create({
            name,
            phoneNumber,
            password: hashedPassword,
            role,
        });
        const userObj = user.toObject();
        delete userObj.password;
        return userObj;
    }),
    login: (loginData) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = loginData;
        const user = yield auth_model_1.User.findOne({ email }).select('+password');
        if (!user) {
            throw new AppError_1.default(401, 'Invalid email or password');
        }
        if (!user.password) {
            throw new AppError_1.default(401, 'Password not set for this user');
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new AppError_1.default(401, 'Invalid email or password');
        }
        const accessToken = (0, jwt_1.generateToken)({ userId: user._id.toString(), role: user.role }, env_1.envVars.JWT_ACCESS_SECRET, env_1.envVars.JWT_ACCESS_EXPIRES);
        const refreshToken = (0, jwt_1.generateToken)({ userId: user._id.toString(), role: user.role }, env_1.envVars.JWT_REFRESH_SECRET, env_1.envVars.JWT_REFRESH_EXPIRES);
        return {
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }),
    getNewAccessToken: (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
        if (!refreshToken) {
            throw new AppError_1.default(400, 'Refresh token is required');
        }
        let decoded;
        try {
            decoded = (0, jwt_1.verifyToken)(refreshToken, env_1.envVars.JWT_REFRESH_SECRET);
        }
        catch (err) {
            throw new AppError_1.default(401, 'Invalid refresh token');
        }
        const user = yield auth_model_1.User.findById(decoded.userId);
        if (!user) {
            throw new AppError_1.default(404, 'User not found');
        }
        const accessToken = (0, jwt_1.generateToken)({ userId: user._id.toString(), role: user.role }, env_1.envVars.JWT_ACCESS_SECRET, env_1.envVars.JWT_ACCESS_EXPIRES);
        return {
            accessToken,
        };
    }),
    resetPassword: (oldPassword, newPassword, user) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = user === null || user === void 0 ? void 0 : user.id;
        if (!userId) {
            throw new AppError_1.default(401, 'Unauthorized');
        }
        const foundUser = yield auth_model_1.User.findById(userId).select('+password');
        if (!foundUser) {
            throw new AppError_1.default(404, 'User not found');
        }
        if (!foundUser.password) {
            throw new AppError_1.default(400, 'Password not set for this user');
        }
        const isOldPasswordValid = yield bcryptjs_1.default.compare(oldPassword, foundUser.password);
        if (!isOldPasswordValid) {
            throw new AppError_1.default(400, 'Old password is incorrect');
        }
        const hashedNewPassword = yield bcryptjs_1.default.hash(newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
        foundUser.password = hashedNewPassword;
        yield foundUser.save();
        return { message: 'Password changed successfully' };
    }),
};
