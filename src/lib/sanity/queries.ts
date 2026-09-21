import {defineQuery} from 'next-sanity'
import type {NEWS_SLUGS_QUERY_RESULT} from '@/sanity.types'
import {sanityFetch} from './live'
import {sanityClient} from './client'

export const NEWS_LIST_QUERY = defineQuery(
  `*[_type == "news" && defined(slug.current)] | order(publishedAt desc){
    _id, title, slug, publishedAt, "category": category->{title, slug}, excerpt
  }`,
)

export const NEWS_BY_SLUG_QUERY = defineQuery(
  `*[_type == "news" && slug.current == $slug][0]{
    _id, title, publishedAt, "category": category->{title, slug}, mainImage, body
  }`,
)

export const NEWS_SLUGS_QUERY = defineQuery(
  `*[_type == "news" && defined(slug.current)]{ "slug": slug.current }`,
)

export const COMPANY_INFO_QUERY = defineQuery(`*[_type == "companyInfo"][0]`)

export async function getNewsList() {
  const {data} = await sanityFetch({query: NEWS_LIST_QUERY})
  return data
}

export async function getNewsBySlug(slug: string) {
  const {data} = await sanityFetch({query: NEWS_BY_SLUG_QUERY, params: {slug}})
  return data
}

export async function getNewsSlugs(): Promise<NEWS_SLUGS_QUERY_RESULT> {
  // generateStaticParamsは公開データのみで良く、Draft Mode購読は不要なため通常のclientで取得
  return await sanityClient.fetch(NEWS_SLUGS_QUERY)
}

export async function getCompanyInfo() {
  const {data} = await sanityFetch({query: COMPANY_INFO_QUERY})
  return data
}
