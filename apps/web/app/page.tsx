import Image from 'next/image';
import { Card } from '@repo/ui/src/card';
import { Gradient } from '@repo/ui/src/gradient';
import { TurborepoLogo } from '@repo/ui/src/turborepo-logo';

const LINKS = [
  {
    title: 'Docs',
    href: 'https://turborepo.com/docs',
    description: 'Find in-depth information about Turborepo features and API.',
  },
  {
    title: 'Learn',
    href: 'https://turborepo.com/docs/handbook',
    description: 'Learn more about monorepos with our handbook.',
  },
  {
    title: 'Templates',
    href: 'https://turborepo.com/docs/getting-started/from-example',
    description: 'Choose from over 15 examples and deploy with a single click.',
  },
  {
    title: 'Deploy',
    href: 'https://vercel.com/new',
    description:
      'Instantly deploy your Turborepo to a shareable URL with Vercel.',
  },
];

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      init
    </main>
  );
}
