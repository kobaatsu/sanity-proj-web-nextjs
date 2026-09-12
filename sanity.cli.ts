import { defineCliConfig } from 'sanity/cli';

// このアプリは Sanity Studio を含まないスタンドアロンのフロントエンドです。
// TypeGen（`sanity typegen generate`）でクエリの型を生成するためだけに使用します。
// スキーマは studio/ からエクスポートした schema.json を利用します。
export default defineCliConfig({
	typegen: {
		enabled: true,
		schema: './schema.json',
		generates: './sanity.types.ts',
	},
});
