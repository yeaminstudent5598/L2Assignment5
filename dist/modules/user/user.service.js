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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_model_1 = require("./user.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const user_constant_1 = require("./user.constant");
const parcel_model_1 = require("../parcel/parcel.model");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    if (!email || !password) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Email and password are required');
    }
    const existingUser = yield user_model_1.User.findOne({ email });
    if (existingUser) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'User already exists');
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const user = yield user_model_1.User.create(Object.assign({ email, password: hashedPassword }, rest));
    return user;
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find().select('-password');
    const totalUsers = yield user_model_1.User.countDocuments();
    return {
        data: users,
        meta: { total: totalUsers },
    };
});
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id).select('-password');
    if (!user)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'User not found');
    return user;
});
const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'User not found');
    if (payload.role) {
        // Normalize role strings to uppercase to avoid case mismatch
        const requesterRole = (decodedToken.role || '').toUpperCase();
        if (requesterRole !== user_constant_1.USER_ROLE.ADMIN) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, 'Not authorized to change roles');
        }
        if (payload.role.toUpperCase() === user_constant_1.USER_ROLE.ADMIN && requesterRole !== user_constant_1.USER_ROLE.ADMIN) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, 'Only admin can assign admin role');
        }
    }
    if (payload.password) {
        payload.password = yield bcryptjs_1.default.hash(payload.password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    }
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    return updatedUser;
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findByIdAndDelete(id);
    if (!user)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'User not found or already deleted');
    return user;
});
const blockUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
    if (!user)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'User not found or already blocked');
    return user;
});
const unblockUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
    if (!user)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'User not found or already unblocked');
    return user;
});
const getParcelsBySender = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcels = yield parcel_model_1.Parcel.find({ sender: userId });
    return parcels;
});
const getParcelsForReceiver = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcels = yield parcel_model_1.Parcel.find({ receiver: userId });
    return parcels;
});
const confirmParcelDelivery = (parcelId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Parcel not found');
    parcel.status = 'DELIVERED';
    yield parcel.save();
    return parcel;
});
exports.UserService = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
    blockUser,
    unblockUser,
    getParcelsBySender,
    getParcelsForReceiver,
    confirmParcelDelivery,
};
