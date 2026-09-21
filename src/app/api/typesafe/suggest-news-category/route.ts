import {NextResponse} from 'next/server'
import {suggestNewsCategory, type NewsCategoryOption} from '@/lib/typesafe/suggestNewsCategory'

interface SuggestNewsCategoryRequestBody {
  title?: string
  body?: string
  categories?: NewsCategoryOption[]
}

// Sanity Studio (ブラウザ) からの直接アクセスを許可する。
const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ?? '*'

function withCors(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', ALLOWED_ORIGIN)
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-Internal-Secret')
  return response
}

export async function OPTIONS() {
  return withCors(new NextResponse(null, {status: 204}))
}

export async function POST(request: Request) {
  // このエンドポイントは Sanity の認証を経由しない公開エンドポイントのため、
  // Studio とのみ共有する簡易シークレットで最低限のアクセス制限をかける。
  // 実運用に乗せる際はより堅牢な認証方式へ置き換えること。
  const expectedSecret = process.env.INTERNAL_API_SECRET
  if (expectedSecret) {
    const providedSecret = request.headers.get('x-internal-secret')
    if (providedSecret !== expectedSecret) {
      return withCors(NextResponse.json({error: '認証に失敗しました。'}, {status: 401}))
    }
  }

  let body: SuggestNewsCategoryRequestBody
  try {
    body = (await request.json()) as SuggestNewsCategoryRequestBody
  } catch {
    return withCors(
      NextResponse.json({error: 'リクエストボディがJSONではありません。'}, {status: 400}),
    )
  }

  const {title, body: articleBody, categories} = body

  if (typeof articleBody !== 'string' || articleBody.length === 0) {
    return withCors(NextResponse.json({error: '本文 (body) は必須です。'}, {status: 400}))
  }
  if (!Array.isArray(categories) || categories.length === 0) {
    return withCors(
      NextResponse.json({error: 'カテゴリー一覧 (categories) は必須です。'}, {status: 400}),
    )
  }

  try {
    const suggestion = await suggestNewsCategory(
      {title: title ?? '', body: articleBody},
      categories,
    )
    return withCors(NextResponse.json(suggestion))
  } catch (error) {
    const message = error instanceof Error ? error.message : '不明なエラーが発生しました。'
    return withCors(NextResponse.json({error: message}, {status: 502}))
  }
}
