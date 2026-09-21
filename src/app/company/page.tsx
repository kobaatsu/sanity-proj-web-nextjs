import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {stegaClean} from 'next-sanity'
import {urlFor} from '@/lib/sanity/image'
import {getCompanyInfo} from '@/lib/sanity/queries'

export const metadata: Metadata = {
  title: '企業情報',
}

export default async function CompanyPage() {
  const company = await getCompanyInfo()

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-2xl font-bold">企業情報</h1>
      {company ? (
        <div className="space-y-4">
          {company.logo && (
            <Image
              src={urlFor(company.logo).width(200).url()}
              alt={stegaClean(company.name) ?? ''}
              width={200}
              height={200}
            />
          )}
          <h2 className="text-xl font-semibold">{company.name}</h2>
          {company.description && <p>{company.description}</p>}
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
            {company.representative && (
              <>
                <dt className="font-semibold">代表者</dt>
                <dd>{company.representative}</dd>
              </>
            )}
            {company.establishedDate && (
              <>
                <dt className="font-semibold">設立日</dt>
                <dd>{new Date(company.establishedDate).toLocaleDateString('ja-JP')}</dd>
              </>
            )}
            {company.capital && (
              <>
                <dt className="font-semibold">資本金</dt>
                <dd>{company.capital}</dd>
              </>
            )}
            {company.address && (
              <>
                <dt className="font-semibold">所在地</dt>
                <dd>{company.address}</dd>
              </>
            )}
            {company.phone && (
              <>
                <dt className="font-semibold">電話番号</dt>
                <dd>{company.phone}</dd>
              </>
            )}
            {company.email && (
              <>
                <dt className="font-semibold">メール</dt>
                <dd>{company.email}</dd>
              </>
            )}
            {company.website && (
              <>
                <dt className="font-semibold">Webサイト</dt>
                <dd>
                  <a href={stegaClean(company.website)} className="underline">
                    {company.website}
                  </a>
                </dd>
              </>
            )}
          </dl>
        </div>
      ) : (
        <p>企業情報はまだ登録されていません。Studioから「企業情報」を追加してください。</p>
      )}
      <Link href="/" className="mt-8 inline-block underline">
        トップへ戻る
      </Link>
    </main>
  )
}
