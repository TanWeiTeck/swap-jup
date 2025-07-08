# Currency Swap Application

A modern, real-time currency exchange application built with Next.js and Turborepo, featuring live exchange rates, currency conversion, and a beautiful user interface.

## 🚀 Features

- 💱 **Real-time Currency Conversion**: Convert between 11 major currencies with live rates
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- 🔄 **Bidirectional Conversion**: Swap currencies and amounts in both directions
- 📊 **Rate Display**: View current exchange rates and fees
- 🔗 **Shareable Links**: Generate and share conversion links
- 📱 **Mobile Responsive**: Optimized for all device sizes
- ⚡ **Fast Performance**: Built with Next.js 15 and Turbopack
- 🏗️ **Monorepo Architecture**: Organized with Turborepo for scalability

## 🏗️ Project Structure

This is a [Turborepo](https://turbo.build/repo) monorepo containing the following packages and applications:

### Apps

- `web`: The main currency swap application built with Next.js 15

### Packages

- `ui`: A React component library with Tailwind CSS shared across applications
- `eslint-config`: ESLint configurations for consistent code quality
- `typescript-config`: TypeScript configurations used throughout the monorepo
- `tailwind-config`: Shared Tailwind CSS configuration

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4
- **State Management**: Jotai
- **Data Fetching**: TanStack Query
- **Type Safety**: TypeScript
- **Build Tool**: Turbopack
- **Package Manager**: pnpm
- **Monorepo**: Turborepo

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd swap-jup
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev:web
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `pnpm dev` - Start all applications in the monorepo
- `pnpm dev:web` - Start only the web application with UI package
- `pnpm build` - Build all applications
- `pnpm lint` - Run linting across all packages
- `pnpm check-types` - Run TypeScript type checking
- `pnpm format` - Format code with Prettier

## 📦 Package Details

### `apps/web`

The main currency swap application featuring:

- Real-time currency conversion between 11 currencies
- Modern, responsive UI with Tailwind CSS
- API routes for currency data and rate calculations
- State management with Jotai
- Shareable conversion links

### `packages/ui`

A shared React component library with:

- Reusable UI components (Button, Input, Select, etc.)
- TypeScript support
- Consistent design system

### `packages/eslint-config`

ESLint configurations providing:

- Next.js specific rules
- TypeScript support
- Prettier integration
- Consistent code style across the monorepo

### `packages/typescript-config`

TypeScript configurations for:

- Base configuration
- Next.js applications
- React libraries
- Consistent type checking

### `packages/tailwind-config`

Shared Tailwind CSS configuration with:

- Consistent design tokens
- Component library integration
- Responsive utilities

## 🔧 Development

### Building the UI Package

The UI package is set up to produce compiled styles for components. The `.tsx` files are consumed by Next.js apps directly using `transpilePackages` in `next.config.ts`. This approach:

- Shares a single `tailwind.config.ts` across apps and packages
- Simplifies package compilation with Next.js Compiler
- Maintains clear package boundaries

### Alternative: Direct Source Consumption

You can also consume `packages/ui` directly from source without building. Update your app's `tailwind.config.ts`:

```js
content: [
  // app content
  `src/**/*.{js,ts,jsx,tsx}`,
  // include packages if not transpiling
  "../../packages/ui/*.{js,ts,jsx,tsx}",
],
```

## 🌍 Supported Currencies

- 🇺🇸 USD (US Dollar)
- 🇭🇰 HKD (Hong Kong Dollar)
- 🇦🇺 AUD (Australian Dollar)
- 🇲🇾 MYR (Malaysian Ringgit)
- 🇬🇧 GBP (British Pound)
- 🇪🇺 EUR (Euro)
- 🇮🇩 IDR (Indonesian Rupiah)
- 🇳🇿 NZD (New Zealand Dollar)
- 🇨🇳 CNY (Chinese Yuan)
- 🇨🇿 CZK (Czech Koruna)
- 🇦🇪 AED (UAE Dirham)

## 📡 API Endpoints

- `GET /api/currencies` - Get list of supported currencies
- `POST /api/rate` - Calculate exchange rates and conversions

## 📄 License

This project is licensed under the MIT License.

## 🔗 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Jotai Documentation](https://jotai.org/)
