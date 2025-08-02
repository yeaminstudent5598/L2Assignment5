"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = require("./modules/auth/auth.routes");
const user_routes_1 = require("./modules/user/user.routes");
const parcel_routes_1 = require("./modules/parcel/parcel.routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Routes
app.use('/api/auth', auth_routes_1.AuthRoutes);
app.use('/api/users', user_routes_1.UserRoutes);
app.use('/api/parcels', parcel_routes_1.parcelRoutes);
// Health check or root
app.get('/', (req, res) => {
    res.send('Parcel Delivery API is running');
});
exports.default = app;
