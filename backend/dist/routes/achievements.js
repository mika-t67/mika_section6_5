"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const upload_1 = __importDefault(require("../middleware/upload"));
const redis_1 = __importDefault(require("../lib/redis"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const CACHE_KEY = 'achievements';
const CACHE_TTL = 60 * 60; // 1時間
// GET /achievements（公開）
router.get('/', async (req, res) => {
    try {
        // キャッシュ確認
        try {
            const cached = await redis_1.default.get(CACHE_KEY);
            if (cached) {
                try {
                    return res.json(JSON.parse(cached));
                }
                catch (parseError) {
                    console.error('Redisキャッシュのパース失敗、DBにフォールバック:', parseError);
                }
            }
        }
        catch (redisError) {
            console.error('Redisキャッシュ取得失敗、DBにフォールバック:', redisError);
        }
        const achievements = await prisma_1.default.achievement.findMany({ orderBy: { createdAt: 'desc' } });
        // キャッシュに保存
        try {
            await redis_1.default.set(CACHE_KEY, JSON.stringify(achievements), 'EX', CACHE_TTL);
        }
        catch (redisError) {
            console.error('Redisキャッシュ保存失敗:', redisError);
        }
        res.json(achievements);
    }
    catch (error) {
        res.status(500).json({ error: '実績の取得に失敗しました' });
    }
});
// POST /achievements（要認証）
router.post('/', auth_1.verifyToken, upload_1.default.single('image'), async (req, res) => {
    try {
        const { title, description, tags, url, imageAlt } = req.body;
        let imageUrl;
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                cloudinary_1.default.uploader.upload_stream({ folder: 'portfolio/achievements' }, (error, result) => {
                    if (error || !result)
                        reject(error);
                    else
                        resolve(result.secure_url);
                }).end(req.file.buffer);
            });
            imageUrl = result;
        }
        const achievement = await prisma_1.default.achievement.create({
            data: { title, description, tags, url, imageUrl, imageAlt },
        });
        // キャッシュ削除
        try {
            await redis_1.default.del(CACHE_KEY);
        }
        catch (redisError) {
            console.error('Redisキャッシュ削除失敗:', redisError);
        }
        res.status(201).json(achievement);
    }
    catch (error) {
        res.status(500).json({ error: '実績の作成に失敗しました' });
    }
});
// PUT /achievements/:id（要認証）
router.put('/:id', auth_1.verifyToken, upload_1.default.single('image'), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: '無効なIDです' });
        }
        const existing = await prisma_1.default.achievement.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: '実績が存在しません' });
        }
        const { title, description, tags, url, imageAlt } = req.body;
        let imageUrl;
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                cloudinary_1.default.uploader.upload_stream({ folder: 'portfolio/achievements' }, (error, result) => {
                    if (error || !result)
                        reject(error);
                    else
                        resolve(result.secure_url);
                }).end(req.file.buffer);
            });
            imageUrl = result;
        }
        const achievement = await prisma_1.default.achievement.update({
            where: { id },
            data: {
                title, description, tags, url, imageAlt,
                ...(imageUrl && { imageUrl }),
            },
        });
        // キャッシュ削除
        try {
            await redis_1.default.del(CACHE_KEY);
        }
        catch (redisError) {
            console.error('Redisキャッシュ削除失敗:', redisError);
        }
        res.json(achievement);
    }
    catch (error) {
        res.status(500).json({ error: '実績の更新に失敗しました' });
    }
});
// DELETE /achievements/:id（要認証）
router.delete('/:id', auth_1.verifyToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: '無効なIDです' });
        }
        const existing = await prisma_1.default.achievement.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: '実績が存在しません' });
        }
        await prisma_1.default.achievement.delete({ where: { id } });
        // キャッシュ削除
        try {
            await redis_1.default.del(CACHE_KEY);
        }
        catch (redisError) {
            console.error('Redisキャッシュ削除失敗:', redisError);
        }
        res.json({ message: '削除しました' });
    }
    catch (error) {
        res.status(500).json({ error: '実績の削除に失敗しました' });
    }
});
exports.default = router;
