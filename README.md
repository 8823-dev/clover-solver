# clover-solver

「ことばのクローバー！」の模範回答を作るアプリです。

## 技術スタック

- Next.js
- TypeScript
- Tailwind CSS
- yarn
- Docker

## 開発

### 環境変数

OpenAI API を利用するには `OPENAI_API_KEY` が必要です。
実際の API key は Git 管理対象に含めないでください。

```bash
cp .env.example .env.local
```

`.env.local` に API key を設定します。

```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-5.4-mini
```

`OPENAI_MODEL` は省略可能です。
未設定の場合はアプリ側の既定値が使われます。

API key が未設定の状態で回答生成 API を呼び出すと、サーバー設定エラーとして扱われます。
画面上には詳細を出さず、汎用的なエラーメッセージを表示します。

### ローカル起動

```bash
yarn install
yarn dev
```

http://localhost:3000 を開きます。

## Docker

Docker で起動する場合は、shell の環境変数または Compose 用の `.env` から `OPENAI_API_KEY` を渡します。

```bash
cp .env.example .env
```

`.env` に API key を設定したうえで起動します。

```bash
docker compose up
```

shell から直接渡す場合は次のように起動できます。

```bash
OPENAI_API_KEY=your_openai_api_key docker compose up
```

## 品質確認

```bash
yarn lint
yarn test
yarn build
```
