import {PortableText} from '@portabletext/react'
import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {stegaClean} from 'next-sanity'
import {urlFor} from '@/lib/sanity/image'
import {getNewsBySlug, getNewsSlugs} from '@/lib/sanity/queries'

const BODY_IMAGE_WIDTH = 800

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
      {item.mainImage?.asset && (
        <Image
          src={urlFor(item.mainImage).width(800).url()}
          alt={item.mainImage.omitAlt ? '' : (stegaClean(item.mainImage.alt ?? item.title) ?? '')}
          width={800}
          height={450}
          className="mb-6"
        />
      )}
      {item.body && (
        <div className="prose">
          {item.body.map((section) => {
            if (section._type === 'richText') {
              return section.content && <PortableText key={section._key} value={section.content} />
            }
            if (!section.asset) return null
            return (
              <Image
                key={section._key}
                src={urlFor(section).width(BODY_IMAGE_WIDTH).url()}
                alt={section.omitAlt ? '' : (stegaClean(section.alt) ?? '')}
                width={BODY_IMAGE_WIDTH}
                height={
                  section.aspectRatio ? Math.round(BODY_IMAGE_WIDTH / section.aspectRatio) : 450
                }
              />
            )
          })}
        </div>
      )}
      <Link href="/news" className="mt-8 inline-block underline">
        お知らせ一覧へ戻る
      </Link>
    </main>
  )
}
