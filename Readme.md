# EmbedBuilder

## 概要

[Discord.js](https://github.com/discordjs/discord.js)を使用して作成されたDiscord上で動く埋め込み作成ボットです。

## クローンする場合

このリポジトリをクローンした後、`.env.example` にそって環境変数を設定してください。

```
$ pnpm i

$ pnpm start or pnpm watch
```

整形したい場合は `lint` コマンドを使用してください、

```
$ pnpm lint
```

## 注意

このコードはビルドを前提としておらず、[tsx](https://github.com/privatenumber/tsx)ライブラリでTypeScriptのまま起動することを想定しています。

また、`.editorconfig` を使用しています。

また、`/help` コマンド等はありません。

## データベース

`database/index.ts` は、`mysql2/promise` で実現可能です。
