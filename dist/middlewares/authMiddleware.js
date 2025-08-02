"use strict";
// src/middlewares/authMiddleware.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authenticate = void 0;
const user_model_1 = require("../modules/user/user.model");
const env_1 = require("../config/env");
const jwt_1 = require("../utils/jwt");
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        console.log('Authorization Header:', authHeader);
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('No Bearer token found');
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const token = authHeader.split(' ')[1];
        console.log('Token:', token);
        const decoded = (0, jwt_1.verifyToken)(token, env_1.envVars.JWT_ACCESS_SECRET);
        console.log('Decoded token:', decoded);
        const user = yield user_model_1.User.findById(decoded.userId);
        console.log('User from DB:', user);
        if (!user) {
            console.log('User not found');
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (user.isBlocked) {
            console.log('User is blocked');
            return res.status(403).json({ message: 'User is blocked' });
        }
        req.user = {
            id: user._id.toString(),
            role: user.role,
        };
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
});
exports.authenticate = authenticate;
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
