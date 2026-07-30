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
const CACHE_KEY = 'profile';
const CACHE_TTL = 60 * 60; // 1時間
// GET /profile（公開）
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
        const profile = await prisma_1.default.profile.findFirst();
        // プロフィールが存在する場合のみキャッシュに保存
        // 未作成時はキャッシュしないことで、作成後すぐに正しいデータが返るようにする
        if (profile) {
            try {
                await redis_1.default.set(CACHE_KEY, JSON.stringify(profile), 'EX', CACHE_TTL);
            }
            catch (redisError) {
                console.error('Redisキャッシュ保存失敗:', redisError);
            }
        }
        res.json(profile);
    }
    catch (error) {
        res.status(500).json({ error: 'プロフィールの取得に失敗しました' });
    }
});
// POST /profile（要認証）
router.post('/', auth_1.verifyToken, upload_1.default.single('avatar'), async (req, res) => {
    try {
        const existing = await prisma_1.default.profile.findFirst();
        if (existing) {
            return res.status(400).json({ error: 'プロフィールは既に存在します' });
        }
        const { name, nameEn, role, bio, email, githubUrl, twitterUrl } = req.body;
        let avatarUrl;
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                cloudinary_1.default.uploader.upload_stream({ folder: 'portfolio/avatar' }, (error, result) => {
                    if (error || !result)
                        reject(error);
                    else
                        resolve(result.secure_url);
                }).end(req.file.buffer);
            });
            avatarUrl = result;
        }
        const profile = await prisma_1.default.profile.create({
            data: { name, nameEn, role, bio, email, githubUrl, twitterUrl, avatarUrl },
        });
        // キャッシュ削除
        try {
            await redis_1.default.del(CACHE_KEY);
        }
        catch (redisError) {
            console.error('Redisキャッシュ削除失敗:', redisError);
        }
        res.status(201).json(profile);
    }
    catch (error) {
        res.status(500).json({ error: 'プロフィールの作成に失敗しました' });
    }
});
// PUT /profile/:id（要認証）
router.put('/:id', auth_1.verifyToken, upload_1.default.single('avatar'), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: '無効なIDです' });
        }
        const existing = await prisma_1.default.profile.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'プロフィールが存在しません' });
        }
        const { name, nameEn, role, bio, email, githubUrl, twitterUrl } = req.body;
        let avatarUrl;
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                cloudinary_1.default.uploader.upload_stream({ folder: 'portfolio/avatar' }, (error, result) => {
                    if (error || !result)
                        reject(error);
                    else
                        resolve(result.secure_url);
                }).end(req.file.buffer);
            });
            avatarUrl = result;
        }
        const profile = await prisma_1.default.profile.update({
            where: { id },
            data: {
                name, nameEn, role, bio, email, githubUrl, twitterUrl,
                ...(avatarUrl && { avatarUrl }),
            },
        });
        // キャッシュ削除
        try {
            await redis_1.default.del(CACHE_KEY);
        }
        catch (redisError) {
            console.error('Redisキャッシュ削除失敗:', redisError);
        }
        res.json(profile);
    }
    catch (error) {
        res.status(500).json({ error: 'プロフィールの更新に失敗しました' });
    }
});
exports.default = router;
