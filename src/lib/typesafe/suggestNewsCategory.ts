const TYPESAFE_API_URL = 'https://api.typesafe.ai/v1/systemone'

export interface NewsCategoryOption {
  id: string
  title: string
}

export interface CategorySuggestion {
  categoryId: string
  confidence: number
  probabilities: Record<string, number>
}

interface TypeSafeChoiceAnswer {
  choice: string
  confidence: number
  probabilities: Record<string, number>
}

interface TypeSafeSystemOneResponse {
  answers?: {
    category?: TypeSafeChoiceAnswer
  }
  error?: {
    message: string
  }
}

export const NONE_OPTION_ID = '__none__'

/**
 * 記事タイトル・本文から、既存の「お知らせカテゴリ」一覧の中で
 * 最も適切なものを TypeSafe (Jev) の Choice プリミティブで判定する。
 *
 * ブラウザ (Sanity Studio) から直接 TypeSafe API を呼ぶと CORS で
 * ブロックされるため、このサーバー側 (Route Handler) を経由させる。
 */
export async function suggestNewsCategory(
  article: {title: string; body: string},
  categories: NewsCategoryOption[],
): Promise<CategorySuggestion> {
  const apiKey = process.env.TYPESAFE_API_KEY
  if (!apiKey) {
    throw new Error('TYPESAFE_API_KEY が設定されていません。.env.local を確認してください。')
  }

  if (categories.length === 0) {
    throw new Error('カテゴリーが1件も登録されていません。先にお知らせカテゴリを作成してください。')
  }

  const criteria: Record<string, string> = Object.fromEntries(
    categories.map((category) => [category.id, category.title]),
  )
  criteria[NONE_OPTION_ID] = 'どのカテゴリーにも当てはまらない'

  const response = await fetch(TYPESAFE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'jev-latest',
      state: {
        title: article.title,
        body: article.body,
      },
      questions: {
        category: {
          type: 'choice',
          instructions:
            'このお知らせ記事の`title`と`body`の内容から、最も適切なカテゴリーを1つ選んでください。',
          criteria,
        },
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`TypeSafe APIの呼び出しに失敗しました (status: ${response.status})`)
  }

  const data = (await response.json()) as TypeSafeSystemOneResponse

  if (data.error) {
    throw new Error(`TypeSafe APIエラー: ${data.error.message}`)
  }

  const answer = data.answers?.category
  if (!answer) {
    throw new Error('TypeSafe APIから想定外のレスポンスが返されました。')
  }

  return {
    categoryId: answer.choice,
    confidence: answer.confidence,
    probabilities: answer.probabilities,
  }
}
