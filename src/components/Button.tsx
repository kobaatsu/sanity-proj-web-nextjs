'use client';

// Click button, get confetti!
// Styled by Tailwind :)
import confetti from 'canvas-confetti';
import type { ReactNode } from 'react';

export function Button({ children }: { children: ReactNode }) {
	return (
		<button
			type="button"
			onClick={() => confetti()}
			className="appearance-none py-2 px-4 bg-purple-500 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75"
		>
			{children}
		</button>
	);
}
