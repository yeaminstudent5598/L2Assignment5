import { Response } from "express";

export interface AuthTokens {
    accessToken?: string;
    refreshToken?: string;
}

export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {
    const isProduction = process.env.NODE_ENV === "production";

    // সমাধান: (res as any) ব্যবহার করা হয়েছে যাতে টাইপস্ক্রিপ্ট বিল্ড এরর না দেয়
    if (tokenInfo.accessToken) {
        (res as any).cookie("accessToken", tokenInfo.accessToken, {
            httpOnly: true,
            secure: isProduction, 
            sameSite: isProduction ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });
    }

    if (tokenInfo.refreshToken) {
        (res as any).cookie("refreshToken", tokenInfo.refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }
};