# FeedForward

FeedForward is a modern web application built with Next.js, featuring authentication, database integration, and a beautiful UI powered by Tailwind CSS and Radix UI components.

## Features

- Next.js 15 with App Router
- Authentication with NextAuth.js
- Database integration with Prisma
- Modern UI with Tailwind CSS and Radix UI
- TypeScript support
- Dark mode support (SOON)

## Prerequisites

- Node.js 20x or later
- npm, yarn, or pnpm
- MySQL Database (or your preferred database supported by Prisma)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/DevShaded/feedforward
cd feedforward
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up your environment variables:
Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL="your-database-url"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `app/` - Next.js app router pages and API routes
- `components/` - Reusable React components
- `lib/` - Utility functions and shared logic
- `prisma/` - Database schema and migrations
- `public/` - Static assets
- `types/` - TypeScript type definitions

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint

## Technologies Used

- Next.js 15
- React 19
- TypeScript
- Prisma
- NextAuth.js
- Tailwind CSS
- Radix UI
- PostgreSQL

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
