"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const profile_1 = __importDefault(require("./routes/profile"));
const skills_1 = __importDefault(require("./routes/skills"));
const achievements_1 = __importDefault(require("./routes/achievements"));
const contact_1 = __importDefault(require("./routes/contact"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// 許可するオリジンを環境変数から読み込む（カンマ区切り）
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // curl や Postman など Origin ヘッダを持たないリクエストは許可
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`許可されていないオリジンです: ${origin}`));
    },
}));
app.use(express_1.default.json());
// ヘルスチェック
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
// ルーティング
app.use('/profile', profile_1.default);
app.use('/skills', skills_1.default);
app.use('/achievements', achievements_1.default);
app.use('/contact', contact_1.default);
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`許可オリジン: ${allowedOrigins.join(', ')}`);
});
