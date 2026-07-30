"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const firebaseAdmin_1 = require("../lib/firebaseAdmin");
/**
 * Authorization: Bearer <idToken> を検証するミドルウェア
 * 検証に失敗した場合はハンドラに進ませない
 */
const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: '認証情報がありません' });
    }
    const idToken = authHeader.split('Bearer ')[1];
    if (!idToken) {
        return res.status(401).json({ error: '認証情報がありません' });
    }
    try {
        const decoded = await firebaseAdmin_1.adminAuth.verifyIdToken(idToken);
        req.user = {
            uid: decoded.uid,
            email: decoded.email,
        };
        next();
    }
    catch (error) {
        console.error('IDトークンの検証に失敗:', error);
        return res.status(401).json({ error: '認証に失敗しました' });
    }
};
exports.verifyToken = verifyToken;
