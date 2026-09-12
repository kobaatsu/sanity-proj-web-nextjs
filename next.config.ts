import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	pageExtensions: ['ts', 'tsx', 'mdx'],
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.sanity.io',
			},
		],
	},
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
