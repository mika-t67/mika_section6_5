"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="node" />
require("dotenv/config");
const client_1 = require("@prisma/client");
const LOCAL = process.env.DATABASE_URL;
const REMOTE = process.env.PRODUCTION_DATABASE_URL;
if (!LOCAL)
    throw new Error('DATABASE_URL（コピー元）が設定されていません');
if (!REMOTE)
    throw new Error('PRODUCTION_DATABASE_URL（コピー先）が設定されていません');
if (LOCAL === REMOTE)
    throw new Error('コピー元とコピー先が同じDBです。中断しました');
const local = new client_1.PrismaClient({ datasourceUrl: LOCAL });
const remote = new client_1.PrismaClient({ datasourceUrl: REMOTE });
const force = process.argv.includes('--force');
const main = async () => {
    const [profiles, skills, achievements] = await Promise.all([
        local.profile.findMany(),
        local.skill.findMany(),
        local.achievement.findMany(),
    ]);
    console.log(`コピー元: プロフィール ${profiles.length} 件 / スキル ${skills.length} 件 / 実績 ${achievements.length} 件`);
    if (skills.length === 0) {
        throw new Error('コピー元にデータがありません。Dockerが起動しているか確認してください');
    }
    // 意図しない上書きを防ぐ
    const existing = (await remote.profile.count()) +
        (await remote.skill.count()) +
        (await remote.achievement.count());
    if (existing > 0) {
        if (!force) {
            throw new Error(`コピー先に既にデータが ${existing} 件あります。上書きする場合は --force を付けて再実行してください`);
        }
        await remote.achievement.deleteMany();
        await remote.skill.deleteMany();
        await remote.profile.deleteMany();
        console.log('コピー先の既存データを削除しました');
    }
    // idもそのまま引き継ぐ（フォールバックデータと整合させるため）
    await remote.profile.createMany({ data: profiles });
    await remote.skill.createMany({ data: skills });
    await remote.achievement.createMany({ data: achievements });
    console.log('✅ コピー完了');
    console.log(`  プロフィール: ${await remote.profile.count()} 件`);
    console.log(`  スキル: ${await remote.skill.count()} 件`);
    console.log(`  実績: ${await remote.achievement.count()} 件`);
};
main()
    .catch((e) => {
    console.error('❌', e.message);
    process.exit(1);
})
    .finally(async () => {
    await local.$disconnect();
    await remote.$disconnect();
});
