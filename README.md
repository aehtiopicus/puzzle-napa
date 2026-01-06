# Next.js Application

A modern Next.js application with TypeScript, Tailwind CSS v4, MongoDB, and shadcn/ui components.

## Tech Stack

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first CSS framework
- **MongoDB + Mongoose** - Database and ODM
- **shadcn/ui** - Reusable component library
- **Zod** - Schema validation
- **React Hook Form** - Form management
- **Jest + React Testing Library** - Testing

## Getting Started

### Prerequisites

- Node.js 20.15 or higher
- npm or yarn
- MongoDB instance (local or cloud)

### Installation

1. Clone the repository or navigate to the project directory

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

4. Edit `.env.local` with your MongoDB credentials:
   ```env
   MONGO_DB_URI=your_mongodb_connection_string
   MONGO_DB_NAME=your_database_name
   NODE_ENV=development
   ```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
new-app/
├── src/
│   ├── api/
│   │   ├── db/
│   │   │   ├── connection.ts    # MongoDB connection
│   │   │   └── models/          # Mongoose models
│   │   ├── services/            # Business logic
│   │   ├── transform/           # Data transformations
│   │   ├── types/               # TypeScript types
│   │   └── utils/               # API utilities
│   ├── app/
│   │   ├── globals.css          # Global styles & color system
│   │   └── layout.tsx           # Root layout
│   ├── components/
│   │   ├── providers/           # Context providers
│   │   └── ui/                  # shadcn/ui components
│   ├── hooks/                   # Custom React hooks
│   ├── utils/
│   │   └── cn.ts                # Tailwind class merging utility
│   ├── constants/               # App constants
│   └── proxy.ts                 # Middleware logic
├── __tests__/                   # Test files
├── middleware.ts                # Next.js middleware
├── components.json              # shadcn/ui configuration
├── jest.config.js               # Jest configuration
└── tsconfig.json                # TypeScript configuration
```

## Color System

The application uses a comprehensive color system with three main brand colors:

- **Primary (Blue)**: Main brand color with hover/active states
- **Secondary (Purple)**: Supporting brand color with hover/active states
- **Tertiary (Green)**: Success/affirmative color with hover/active states

All colors support dark mode and have appropriate hover/active variants for buttons and interactive elements.

## Adding shadcn/ui Components

Install components using the shadcn CLI:

```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
# etc.
```

Components will be installed to `src/components/ui/`.

## MongoDB Connection

The application includes a robust MongoDB connection module with:

- Connection caching for Next.js serverless environment
- Environment variable validation
- Connection pooling
- Error handling and retry logic
- Event listeners for connection lifecycle
- Graceful shutdown handlers

## Middleware

The proxy middleware provides:

- Custom header injection (x-url, x-pathname)
- Development request logging
- Extensible for future authentication

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [MongoDB + Mongoose](https://mongoosejs.com)
- [React Testing Library](https://testing-library.com/react)

## License

MIT
