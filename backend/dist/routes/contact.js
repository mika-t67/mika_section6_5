"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET /contact（要認証・管理画面用）
router.get('/', auth_1.verifyToken, async (req, res) => {
    try {
        const contacts = await prisma_1.default.contact.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(contacts);
    }
    catch (error) {
        console.error('お問い合わせ取得エラー:', error);
        res.status(500).json({ error: 'お問い合わせの取得に失敗しました' });
    }
});
// POST /contact（公開・訪問者からの送信）
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ error: '名前・メールアドレス・メッセージは必須です' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: '有効なメールアドレスを入力してください' });
        }
        const contact = await prisma_1.default.contact.create({
            data: { name, email, message },
        });
        res.status(201).json({ message: 'お問い合わせを受け付けました', contact });
    }
    catch (error) {
        console.error('お問い合わせ保存エラー:', error);
        res.status(500).json({ error: 'お問い合わせの送信に失敗しました' });
    }
});
exports.default = router;
