# The Name Nursery

An interactive baby name exploration app built with Next.js. Features an elegant wheel-based interface for selecting baby name categories and starting letters.

## Features

- **Interactive Gender Selection**: Choose between Baby, Girl, or Boy names with a scrollable wheel interface
- **Letter Selection**: Pick a starting letter using an intuitive alphabet wheel
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Keyboard Navigation**: Full keyboard support with arrow keys and Enter
- **Touch & Mouse Support**: Works with touch gestures, mouse wheel, and traditional clicks

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **CSS Modules** - Scoped styling for components
- **ESLint** - Code linting and formatting

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main application logic
│   ├── layout.tsx        # Root layout with fonts and metadata
│   ├── globals.css       # Global styles
│   └── page.module.css   # Component-specific styles
└── components/
    ├── Header.tsx        # App header component
    ├── FloatingRestart.tsx # Restart button component
    └── *.module.css      # Component styles
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
