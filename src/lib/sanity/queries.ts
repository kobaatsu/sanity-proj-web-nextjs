import { defineQuery } from 'groq';
import type {
	COMPANY_INFO_QUERY_RESULT,
	NEWS_BY_SLUG_QUERY_RESULT,
	NEWS_LIST_QUERY_RESULT,
	NEWS_SLUGS_QUERY_RESULT,
} from '@/sanity.types';
import { sanityClient } from './client';

export const NEWS_LIST_QUERY = defineQuery(
	`*[_type == "news" && defined(slug.current)] | order(publishedAt desc){
    _id, title, slug, publishedAt, category, excerpt
  }`,
);

export const NEWS_BY_SLUG_QUERY = defineQuery(
	`*[_type == "news" && slug.current == $slug][0]{
    _id, title, publishedAt, category, mainImage, body
  }`,
);

export const NEWS_SLUGS_QUERY = defineQuery(
	`*[_type == "news" && defined(slug.current)]{ "slug": slug.current }`,
);

export const COMPANY_INFO_QUERY = defineQuery(`*[_type == "companyInfo"][0]`);

export async function getNewsList(): Promise<NEWS_LIST_QUERY_RESULT> {
	return await sanityClient.fetch(NEWS_LIST_QUERY);
}

export async function getNewsBySlug(slug: string): Promise<NEWS_BY_SLUG_QUERY_RESULT> {
	return await sanityClient.fetch(NEWS_BY_SLUG_QUERY, { slug });
}

export async function getNewsSlugs(): Promise<NEWS_SLUGS_QUERY_RESULT> {
	return await sanityClient.fetch(NEWS_SLUGS_QUERY);
}

export async function getCompanyInfo(): Promise<COMPANY_INFO_QUERY_RESULT> {
	return await sanityClient.fetch(COMPANY_INFO_QUERY);
}
