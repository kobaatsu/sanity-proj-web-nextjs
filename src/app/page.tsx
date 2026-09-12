import Link from 'next/link';
import { Button } from '@/components/Button';

export default function Home() {
	return (
		<div className="grid place-items-center h-screen content-center">
			<Button>Tailwind Button in Next.js!</Button>
			<Link href="/markdown-page" className="p-4 underline">
				Markdown is also supported...
			</Link>
			<Link href="/news" className="p-4 underline">
				お知らせ
			</Link>
			<Link href="/company" className="p-4 underline">
				企業情報
			</Link>
		</div>
	);
}
