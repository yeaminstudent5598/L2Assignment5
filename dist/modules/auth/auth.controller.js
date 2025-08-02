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
exports.AuthControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const setCookie_1 = require("../../utils/setCookie");
const auth_service_1 = require("./auth.service");
const credentialsLogin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Email and password are required');
    }
    const user = yield auth_service_1.AuthService.login({ email, password });
    (0, setCookie_1.setAuthCookie)(res, {
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'User logged in successfully',
        data: {
            accessToken: user.accessToken,
            refreshToken: user.refreshToken,
            user: user.user,
        },
    });
}));
const getNewAccessToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'No refresh token received from cookies');
    }
    const tokenInfo = yield auth_service_1.AuthService.getNewAccessToken(refreshToken);
    (0, setCookie_1.setAuthCookie)(res, {
        accessToken: tokenInfo.accessToken,
        refreshToken, // you might want to issue a new refreshToken as well depending on your logic
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'New access token retrieved successfully',
        data: tokenInfo,
    });
}));
const resetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = req.body;
    const decodedToken = req.user;
    console.log('Decoded User:', req.user);
    if (!decodedToken) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, 'Unauthorized');
    }
    yield auth_service_1.AuthService.resetPassword(oldPassword, newPassword, decodedToken);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Password changed successfully',
        data: null,
    });
}));
const logout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Logout called');
    console.log('Cookies:', req.cookies);
    console.log('Headers:', req.headers.authorization);
    res.clearCookie('accessToken', { httpOnly: true, secure: false, sameSite: 'lax' });
    res.clearCookie('refreshToken', { httpOnly: true, secure: false, sameSite: 'lax' });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'User logged out successfully',
        data: null,
    });
}));
exports.AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    resetPassword,
    logout,
};
