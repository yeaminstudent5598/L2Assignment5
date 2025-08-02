"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUpdateSchema = exports.userLoginSchema = exports.userRegisterSchema = void 0;
const zod_1 = require("zod");
const user_constant_1 = require("./user.constant");
// Validation schema for user registration
exports.userRegisterSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name should be at least 2 characters long'),
    phoneNumber: zod_1.z.string().min(10, 'Phone number is required'),
    password: zod_1.z.string().min(6, 'Password should be at least 6 characters long'),
    role: zod_1.z.enum([user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.SENDER, user_constant_1.USER_ROLE.RECEIVER]),
});
// Validation schema for user login
exports.userLoginSchema = zod_1.z.object({
    phoneNumber: zod_1.z.string().min(10, 'Phone number is required'),
    password: zod_1.z.string().min(6, 'Password is required'),
});
// Validation schema for updating user info (partial)
exports.userUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    phoneNumber: zod_1.z.string().min(10).optional(),
    role: zod_1.z.enum([user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.SENDER, user_constant_1.USER_ROLE.RECEIVER]).optional(),
    isBlocked: zod_1.z.boolean().optional(),
});
