"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const redis_1 = __importDefault(require("../lib/redis"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const CACHE_KEY = 'skills';
const CACHE_TTL = 60 * 60; // 1時間
// GET /skills（公開）
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
        const skills = await prisma_1.default.skill.findMany({ orderBy: { createdAt: 'asc' } });
        // キャッシュに保存
        try {
            await redis_1.default.set(CACHE_KEY, JSON.stringify(skills), 'EX', CACHE_TTL);
        }
        catch (redisError) {
            console.error('Redisキャッシュ保存失敗:', redisError);
        }
        res.json(skills);
    }
    catch (error) {
        res.status(500).json({ error: 'スキルの取得に失敗しました' });
    }
});
// POST /skills（要認証）
router.post('/', auth_1.verifyToken, async (req, res) => {
    try {
        const { name, category, level } = req.body;
        const skill = await prisma_1.default.skill.create({
            data: { name, category, level: parseInt(level) },
        });
        // キャッシュ削除
        try {
            await redis_1.default.del(CACHE_KEY);
        }
        catch (redisError) {
            console.error('Redisキャッシュ削除失敗:', redisError);
        }
        res.status(201).json(skill);
    }
    catch (error) {
        res.status(500).json({ error: 'スキルの作成に失敗しました' });
    }
});
// PUT /skills/:id（要認証）
router.put('/:id', auth_1.verifyToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: '無効なIDです' });
        }
        const existing = await prisma_1.default.skill.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'スキルが存在しません' });
        }
        const { name, category, level } = req.body;
        const skill = await prisma_1.default.skill.update({
            where: { id },
            data: { name, category, level: parseInt(level) },
        });
        // キャッシュ削除
        try {
            await redis_1.default.del(CACHE_KEY);
        }
        catch (redisError) {
            console.error('Redisキャッシュ削除失敗:', redisError);
        }
        res.json(skill);
    }
    catch (error) {
        res.status(500).json({ error: 'スキルの更新に失敗しました' });
    }
});
// DELETE /skills/:id（要認証）
router.delete('/:id', auth_1.verifyToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: '無効なIDです' });
        }
        const existing = await prisma_1.default.skill.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'スキルが存在しません' });
        }
        await prisma_1.default.skill.delete({ where: { id } });
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
        res.status(500).json({ error: 'スキルの削除に失敗しました' });
    }
});
exports.default = router;
