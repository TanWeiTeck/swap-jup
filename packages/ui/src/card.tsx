import { type ReactNode } from 'react';

export function Card({
  title,
  children,
  href,
}: {
  title: string;
  children: ReactNode;
  href?: string;
}) {
  return (
    <a
      className="bg-green-300 group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-neutral-700 hover:bg-red-800"
      href={href || '#'}
      rel="noopener noreferrer"
      target="_blank"
    >
      <h2 className="mb-3 text-2xl font-semibold">
        {title}{' '}
        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
          -&gt;
        </span>
      </h2>
      <p className="m-0 max-w-[30ch] text-sm opacity-50">{children}</p>
    </a>
  );
}
