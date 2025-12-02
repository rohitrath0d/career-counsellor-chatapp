<!-- This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

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

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details. -->


# Career Counsellor Chat App - Comprehensive Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Project Structure](#project-structure)
5. [Database Schema](#database-schema)
6. [Authentication](#authentication)
7. [API Routes & tRPC Procedures](#api-routes--trpc-procedures)
8. [Frontend Components](#frontend-components)
9. [Environment Variables](#environment-variables)
10. [Getting Started](#getting-started)
11. [Features](#features)
12. [Deployment](#deployment)
13. [API Reference](#api-reference)

---

## 🎯 Project Overview

The **Career Counsellor Chat App** is an AI-powered career guidance platform that provides personalized career advice through an intelligent chatbot interface. Users can have meaningful conversations about their career goals, receive tailored recommendations, and track their professional development journey.

### Key Highlights:
- **AI-Powered Conversations**: Leverages Google's Gemini AI (gemini-2.0-flash-001) for intelligent, context-aware career counseling
- **Real-time Chat**: Support for real-time messaging with WebSocket subscriptions
- **Multi-session Support**: Users can maintain multiple chat sessions with different topics
- **Authentication**: Secure authentication via credentials (email/password) and Google OAuth
- **Responsive Design**: Modern, mobile-friendly UI with dark/light theme support

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.5.3 | React framework with Pages Router |
| **React** | 19.1.0 | UI library |
| **TypeScript** | ^5 | Type safety |
| **Tailwind CSS** | ^4 | Styling |
| **Radix UI** | Various | Accessible UI primitives |
| **Lucide React** | ^0.544.0 | Icons |
| **Lottie React** | ^2.4.1 | Animations |
| **React Hook Form** | ^7.62.0 | Form management |
| **next-themes** | ^0.4.6 | Theme management |
| **Sonner** | ^2.0.7 | Toast notifications |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **tRPC** | ^11.5.1 | End-to-end typesafe APIs |
| **Prisma** | ^6.16.2 | ORM & database management |
| **NextAuth.js** | ^4.24.11 | Authentication |
| **Zod** | ^4.1.8 | Schema validation |
| **bcryptjs** | ^3.0.2 | Password hashing |
| **Google Generative AI** | ^0.24.1 | AI responses |

### Database & Infrastructure
| Technology | Purpose |
|------------|---------|
| **PostgreSQL** | Primary database |
| **Redis (ioredis)** | Real-time pub/sub (optional) |
| **WebSockets (ws)** | Real-time communication |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Next.js)                        │
├─────────────────────────────────────────────────────────────────┤
│  Pages                    │  Components                         │
│  ├── index.tsx (Home)     │  ├── chat/                         │
│  ├── auth.tsx (Auth)      │  │   ├── chat-interface.tsx        │
│  └── chat.tsx (Chat)      │  │   ├── chat-sidebar.tsx          │
│                           │  │   ├── chat-message.tsx          │
│                           │  │   └── chat-input.tsx            │
│                           │  ├── ui/ (Radix components)        │
│                           │  ├── theme/                        │
│                           │  └── animations/                   │
├─────────────────────────────────────────────────────────────────┤
│                      tRPC Client (React Query)                  │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                    HTTP / WebSocket
                                │
┌───────────────────────────────┴─────────────────────────────────┐
│                         SERVER (Next.js API)                    │
├─────────────────────────────────────────────────────────────────┤
│  API Routes                                                     │
│  ├── /api/trpc/[trpc].ts (tRPC handler)                        │
│  └── /api/auth/[...nextauth].ts (NextAuth)                     │
├─────────────────────────────────────────────────────────────────┤
│  tRPC Routers                                                   │
│  ├── userRouter (login, signup)                                │
│  └── chatRouter (startChat, getChats, sendMessage, etc.)       │
├─────────────────────────────────────────────────────────────────┤
│  External Services                                              │
│  ├── Google Gemini AI (Career counseling responses)            │
│  └── Google OAuth (Authentication)                              │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                           Prisma ORM
                                │
┌───────────────────────────────┴─────────────────────────────────┐
│                        PostgreSQL Database                      │
│  Tables: User, Account, Session, Chat, Message, VerificationToken│
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
career-counsellor-chatapp/
├── prisma/
│   └── schema.prisma              # Database schema
├── public/
│   └── assets/
│       └── animations/            # Lottie animation JSON files
├── src/
│   ├── components/
│   │   ├── animations/
│   │   │   ├── CounsellingAnimation.tsx
│   │   │   └── LoginAnimation.tsx
│   │   ├── chat/
│   │   │   ├── chat-input.tsx     # Message input component
│   │   │   ├── chat-interface.tsx # Main chat container
│   │   │   ├── chat-message.tsx   # Message display component
│   │   │   └── chat-sidebar.tsx   # Session list sidebar
│   │   ├── theme/
│   │   │   └── theme-toggle.tsx   # Dark/light mode toggle
│   │   └── ui/                    # Radix UI components
│   │       ├── alert-dialog.tsx
│   │       ├── avatar.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── input.tsx
│   │       ├── scroll-area.tsx
│   │       └── textarea.tsx
│   ├── lib/
│   │   ├── storage.ts             # LocalStorage utilities
│   │   └── utils.ts               # Utility functions (cn)
│   ├── pages/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth].ts  # NextAuth configuration
│   │   │   ├── trpc/
│   │   │   │   └── [trpc].ts         # tRPC API handler
│   │   │   └── hello.ts              # Test endpoint
│   │   ├── _app.tsx               # App wrapper with providers
│   │   ├── _document.tsx          # HTML document structure
│   │   ├── auth.tsx               # Authentication page
│   │   ├── chat.tsx               # Chat interface page
│   │   └── index.tsx              # Landing page
│   ├── server/
│   │   ├── context/
│   │   │   ├── context.ts         # tRPC context (session, prisma)
│   │   │   └── wsContext.ts       # WebSocket context (optional)
│   │   ├── prisma/
│   │   │   └── prisma.ts          # Prisma client singleton
│   │   ├── routers/
│   │   │   ├── chat.ts            # Chat-related procedures
│   │   │   ├── index.ts           # Root router (appRouter)
│   │   │   └── user.ts            # User-related procedures
│   │   └── trpc/
│   │       └── trpc.ts            # tRPC initialization
│   ├── types/
│   │   ├── chat.ts                # Chat-related types
│   │   └── next-auth.d.ts         # NextAuth type extensions
│   └── utils/
│       ├── trpc.ts                # tRPC client configuration
│       └── trpcProvider.tsx       # tRPC React provider
├── server/
│   └── websocket/
│       └── wsServer.ts            # WebSocket server (optional)
├── next.config.ts                 # Next.js configuration
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🗄 Database Schema

### Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │       │   Account   │       │   Session   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │←──┐   │ id (PK)     │       │ id (PK)     │
│ email       │   │   │ userId (FK) │───────│ userId (FK) │
│ name        │   │   │ type        │       │ sessionToken│
│ password    │   │   │ provider    │       │ expires     │
│ image       │   │   │ providerAccountId   └─────────────┘
│ emailVerified   │   │ access_token│
│ createdAt   │   │   │ refresh_token
│ updatedAt   │   │   │ ...         │
└──────┬──────┘   │   └─────────────┘
       │          │
       │          └────────────────────────────────────────┐
       ▼                                                   │
┌─────────────┐                                            │
│    Chat     │                                            │
├─────────────┤                                            │
│ id (PK)     │                                            │
│ title       │                                            │
│ userId (FK) │────────────────────────────────────────────┘
│ createdAt   │
│ updatedAt   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Message   │
├─────────────┤
│ id (PK)     │
│ sessionId(FK)│
│ sender      │  // "user" | "ai"
│ content     │
│ createdAt   │
└─────────────┘
```

---

## 🔐 Authentication

The application uses **NextAuth.js** with two authentication providers:

### 1. Google OAuth
- Allows users to sign in with their Google account
- Automatically creates a new user if one doesn't exist
- Links Google account with existing email if already registered

### 2. Credentials Provider
- Email + Password authentication
- Passwords are hashed using **bcryptjs**
- Supports both login and signup in the same flow

### Authentication Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  /auth page │────▶│  NextAuth   │────▶│  Database   │
│             │     │  Handlers   │     │  (Prisma)   │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │
       │                   ▼
       │            ┌─────────────┐
       │            │   JWT/DB    │
       │            │   Session   │
       │            └─────────────┘
       │                   │
       ▼                   ▼
┌─────────────────────────────────┐
│       Protected Routes          │
│  (Redirect to /chat on success) │
└─────────────────────────────────┘
```

### Session Strategy
- Uses **JWT** strategy for sessions
- Custom callbacks extend the session with user ID
- `PrismaAdapter` handles database integration for OAuth accounts

---

## 🔌 API Routes & tRPC Procedures

### tRPC Setup

The application uses **tRPC v11** with React Query integration for type-safe API communication.

### User Router (`src/server/routers/user.ts`)

| Procedure | Type | Input | Description |
|-----------|------|-------|-------------|
| `login` | Mutation | `{ email, password }` | Authenticate user with credentials |
| `signup` | Mutation | `{ email, password, name }` | Create new user account |

### Chat Router (`src/server/routers/chat.ts`)

| Procedure | Type | Input | Description |
|-----------|------|-------|-------------|
| `startChat` | Mutation (Protected) | `{ title? }` | Create a new chat session |
| `getChats` | Query (Protected) | - | Get all chats for logged-in user |
| `getMessages` | Query (Protected) | `{ chatId, skip?, take? }` | Get messages with pagination |
| `deleteChat` | Mutation (Protected) | `{ chatId }` | Delete a chat session |
| `sendMessage` | Mutation (Protected) | `{ chatId, content, role }` | Send message & get AI response |
| `newMessages` | Subscription (Protected) | `{ chatId }` | Real-time message updates |

---

## 🎨 Frontend Components

### Page Components

#### Landing Page (`src/pages/index.tsx`)
- Hero section with animated illustrations
- Feature cards showcasing AI capabilities
- Statistics section
- Call-to-action buttons
- Responsive design with gradient backgrounds

#### Authentication Page (`src/pages/auth.tsx`)
- Toggle between Login/Signup modes
- Google OAuth button
- Email/Password form with validation
- Animated illustration
- Error handling with toast notifications

#### Chat Page (`src/pages/chat.tsx`)
- Protected route (redirects unauthenticated users)
- Loading state while checking authentication
- Full-screen chat interface

### Chat Components

#### `ChatInterface` (`src/components/chat/chat-interface.tsx`)
The main container component that orchestrates the entire chat experience.

**State Management:**
- `sessions`: Array of all user chat sessions
- `currentSession`: Currently selected chat
- `isTyping`: AI typing indicator state
- `sidebarOpen`: Mobile sidebar visibility

**Key Features:**
- Fetches and maps backend chats to frontend sessions
- Handles real-time WebSocket subscriptions
- Manages optimistic UI updates for messages
- Prevents duplicate message rendering

#### `ChatSidebar` (`src/components/chat/chat-sidebar.tsx`)
Displays chat session history and navigation.

**Features:**
- New chat button
- Session list with timestamps
- Delete session functionality
- User profile display
- Logout button

#### `ChatMessages` (`src/components/chat/chat-message.tsx`)
Renders the conversation messages.

**Features:**
- Empty state with welcome message
- Message bubbles with user/AI avatars
- Typing indicator animation
- Auto-scroll to latest message
- Timestamp formatting

#### `ChatInput` (`src/components/chat/chat-input.tsx`)
Message input component.

**Features:**
- Auto-resizing textarea
- Send button with loading state
- Enter to send (Shift+Enter for newline)
- Disabled state during AI response

### UI Components

Built with **Radix UI** primitives for accessibility:
- `Button` - Various styles and sizes
- `Card` - Content containers
- `Avatar` - User/AI profile images
- `ScrollArea` - Scrollable containers
- `DropdownMenu` - Context menus
- `AlertDialog` - Confirmation dialogs
- `Input` / `Textarea` - Form inputs

### Theme System

Uses **next-themes** with Tailwind CSS:
- Automatic system theme detection
- Manual toggle via `ThemeToggle` component
- CSS variables for theming
- Persistent preference in localStorage

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/career_counsellor_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Google Gemini AI
GEMINI_API_KEY="your-gemini-api-key"

# Optional: Redis (for real-time features)
REDIS_URL="redis://localhost:6379"
```

### Variable Descriptions

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXTAUTH_URL` | ✅ | Your app's base URL |
| `NEXTAUTH_SECRET` | ✅ | Secret for JWT encryption |
| `GOOGLE_CLIENT_ID` | ✅ | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | ✅ | Google OAuth client secret |
| `GEMINI_API_KEY` | ✅ | Google Gemini API key |
| `REDIS_URL` | ❌ | Redis URL for pub/sub |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Google Cloud Console account (for OAuth & Gemini API)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/rohitrath0d/career-counsellor-chatapp.git
cd career-counsellor-chatapp
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your values
```

4. **Initialize the database**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run dev:ws` | Start WebSocket server (for real-time features) |

---

## ✨ Features

### Core Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Career Counseling** | Get personalized career advice from Gemini AI |
| 💬 **Multi-Session Chats** | Maintain multiple conversation threads |
| 🔐 **Secure Authentication** | Email/password and Google OAuth |
| 🌓 **Dark/Light Mode** | System-aware theme switching |
| 📱 **Responsive Design** | Works on desktop, tablet, and mobile |
| ⚡ **Real-time Updates** | WebSocket support for live messaging |
| 💾 **Persistent History** | Chat history stored in database |

### User Experience

| Feature | Description |
|---------|-------------|
| 🎨 **Modern UI** | Beautiful gradients and animations |
| 🔔 **Toast Notifications** | Feedback for user actions |
| ⌨️ **Keyboard Shortcuts** | Enter to send, Shift+Enter for newline |
| 📜 **Auto-scroll** | Automatically scrolls to new messages |
| ⏳ **Typing Indicator** | Shows when AI is generating response |
| ✅ **Optimistic Updates** | Instant UI feedback before server response |

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com/new)
3. Configure environment variables
4. Deploy!

### Manual Deployment

1. **Build the application**
```bash
npm run build
```

2. **Start the production server**
```bash
npm run start
```

### Database Migrations (Production)

```bash
npx prisma migrate deploy
```

---

## 📚 API Reference

### REST Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/trpc/*` | POST/GET | tRPC API handler |
| `/api/auth/*` | Various | NextAuth.js endpoints |

---

## 🔗 Reference Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/getting-started/introduction)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Google Generative AI](https://ai.google.dev/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs/primitives)

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👤 Author

**Rohit Rathod**
- GitHub: [@rohitrath0d](https://github.com/rohitrath0d)

---

## 🙏 Acknowledgments

- Google Gemini AI for powering the career counseling
- Vercel for Next.js and hosting
- The open-source community for amazing tools

---

## Docs used for reference
- [Setting up Next.js project](https://nextjs.org/docs/app/getting-started/installation)
- [Typescript docs](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- [tRPC API reference docs](https://trpc.io/docs/client/nextjs/setup)
- [React query beginners guide](https://refine.dev/blog/react-query-guide/#introduction)
- [Tanstack query/React query official docs](https://tanstack.com/query/latest/docs/framework/react/examples/simple)
- [Auth.js prisma setup](https://authjs.dev/getting-started/adapters/prisma)
- [React-hook-form docs](https://react-hook-form.com/get-started)
- [Web sockets docs](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)

- [google-docs-reference](https://docs.google.com/document/d/1qHvs5wUBzPC1WYBQaxlmUiO66J71z-j_p0XrE7mnvIk/edit?tab=t.0)
