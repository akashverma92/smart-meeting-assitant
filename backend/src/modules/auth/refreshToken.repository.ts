import { RefreshTokenModel } from "./auth.schema";
import mongoose from "mongoose";

export const RefreshTokenRepository = {
    async findValid(token: string) {
        return RefreshTokenModel.findOne({
            token,
            revoked: false,
            expiresAt: { $gt: new Date() },
        });
    },

    async revoke(token: string) {
        return RefreshTokenModel.findOneAndUpdate({ token }, { revoked: true });
    },

    async create(userId: string, token: string, expiresAt: Date) {
        return RefreshTokenModel.create({
            user: new mongoose.Types.ObjectId(userId),
            token,
            expiresAt,
        });
    },
};
