import type {Metadata} from 'next'
import Link from 'next/link'
import {stegaClean} from 'next-sanity'
import {getNewsList} from '@/lib/sanity/queries'

export const metadata: Metadata = {
  title: 'お知らせ',
}

export default async function NewsListPage() {
  const news = await getNewsList()

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-2xl font-bold">お知らせ</h1>
      {news.length === 0 ? (
        <p>お知らせはまだありません。</p>
      ) : (
        <ul className="space-y-4">
          {news.map((item) => (
            <li key={item._id} className="border-b pb-4">
              <Link href={`/news/${stegaClean(item.slug?.current)}`} className="block">
                <p className="text-sm text-gray-500">
                  {item.publishedAt && new Date(item.publishedAt).toLocaleDateString('ja-JP')}
                  {item.category?.title && ` ・ ${stegaClean(item.category.title)}`}
                </p>
                <h2 className="text-lg font-semibold underline">{item.title}</h2>
                {item.excerpt && <p className="text-gray-700">{item.excerpt}</p>}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Link href="/" className="mt-8 inline-block underline">
        トップへ戻る
      </Link>
    </main>
  )
}
