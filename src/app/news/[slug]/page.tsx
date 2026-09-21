import {PortableText} from '@portabletext/react'
import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {stegaClean} from 'next-sanity'
import {urlFor} from '@/lib/sanity/image'
import {getNewsBySlug, getNewsSlugs} from '@/lib/sanity/queries'

type Props = {
  params: Promise<{slug: string}>
}

export async function generateStaticParams() {
  const slugs = await getNewsSlugs()
  return slugs.map(({slug}) => ({slug}))
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const item = await getNewsBySlug(slug)
  return {
    title: stegaClean(item?.title) ?? 'お知らせが見つかりません',
  }
}

export default async function NewsDetailPage({params}: Props) {
  const {slug} = await params
  const item = await getNewsBySlug(slug)

  if (!item) {
    notFound()
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <p className="text-sm text-gray-500">
        {item.publishedAt && new Date(item.publishedAt).toLocaleDateString('ja-JP')}
      </p>
      <h1 className="mb-4 text-2xl font-bold">{item.title}</h1>
      {item.mainImage && (
        <Image
          src={urlFor(item.mainImage).width(800).url()}
          alt={stegaClean(item.title) ?? ''}
          width={800}
          height={450}
          className="mb-6"
        />
      )}
      {item.body && (
        <div className="prose">
          <PortableText value={item.body} />
        </div>
      )}
      <Link href="/news" className="mt-8 inline-block underline">
        お知らせ一覧へ戻る
      </Link>
    </main>
  )
}
