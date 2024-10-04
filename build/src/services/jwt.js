"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRECT = "Super1234";
class JWTService {
    static async generateTokenForUser(user) {
        const payload = {
            id: user.id,
            email: user.email,
        };
        const token = jsonwebtoken_1.default.sign(payload, JWT_SECRECT);
        return token;
    }
    static async decodeToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, JWT_SECRECT);
        }
        catch (error) {
            return null;
        }
    }
}
exports.default = JWTService;
