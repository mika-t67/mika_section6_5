"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = void 0;
const app_1 = require("firebase-admin/app");
const auth_1 = require("firebase-admin/auth");
/**
 * .env からコピーする際に混入しやすいゴミを除去する
 * - 前後の空白
 * - 末尾のカンマ（JSONから行ごとコピーした場合に残る）
 * - 前後のクォート
 */
const sanitize = (raw) => raw?.trim().replace(/,$/, '').replace(/^["']|["']$/g, '');
const projectId = sanitize(process.env.FIREBASE_PROJECT_ID);
const clientEmail = sanitize(process.env.FIREBASE_CLIENT_EMAIL);
/**
 * 環境変数から読んだ秘密鍵をPEM形式に整える
 * - 前後に残ったクォートを除去
 * - 文字列 "\n"（2文字）を実際の改行に変換
 * - Windows由来の CR を除去（PEMのデコードに失敗する原因になる）
 */
const normalizePrivateKey = (raw) => raw
    .trim()
    .replace(/^["']|["']$/g, '')
    .replace(/\\n/g, '\n')
    .replace(/\r/g, '');
const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;
const privateKey = rawPrivateKey ? normalizePrivateKey(rawPrivateKey) : undefined;
if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Firebase Admin SDK の環境変数が設定されていません（FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY）');
}
if (!privateKey.startsWith('-----BEGIN PRIVATE KEY-----')) {
    throw new Error('FIREBASE_PRIVATE_KEY が PEM 形式になっていません。.env の値がクォートで囲まれているか、改行が正しいか確認してください');
}
// ホットリロードなどで多重初期化されるのを防ぐ
if (!(0, app_1.getApps)().length) {
    (0, app_1.initializeApp)({
        credential: (0, app_1.cert)({
            projectId,
            clientEmail,
            privateKey,
        }),
    });
}
exports.adminAuth = (0, auth_1.getAuth)();
