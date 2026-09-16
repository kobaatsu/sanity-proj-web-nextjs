import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { VisualEditing } from 'next-sanity/visual-editing';
import { SanityLive } from '@/lib/sanity/live';
import './globals.css';

export const metadata: Metadata = {
	title: 'Next.js + TailwindCSS',
};

export default async function RootLayout({ children }: LayoutProps<'/'>) {
	const { isEnabled: isDraftMode } = await draftMode();

	return (
		<html lang="ja">
			<body>
				{children}
				<SanityLive />
				{isDraftMode && <VisualEditing />}
			</body>
		</html>
	);
}
