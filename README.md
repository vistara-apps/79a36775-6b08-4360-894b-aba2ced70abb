# GigFlow - Your Curated Path to Online Earning

GigFlow is a Base MiniApp that curates legitimate online earning opportunities and provides micro-skill guides for individuals seeking to earn money online.

## 🚀 Features

### Core Features
- **Curated Gigs Feed**: Daily/weekly digest of vetted, legitimate online jobs and freelance gigs
- **Micro-Skill Guides**: Short, actionable guides on how to start earning with specific skills
- **Profile Optimizer**: AI-powered tool to create compelling profiles and pitches for freelance platforms

### Technical Features
- **Farcaster Authentication**: Seamless login with Farcaster ID
- **Dual Payment System**: Support for both crypto (USDC on Base) and fiat payments
- **AI-Powered Content**: OpenAI integration for pitch generation and content recommendations
- **Semantic Search**: Vector-based search using OpenAI embeddings
- **Real-time Notifications**: In-app notifications for new gigs and achievements

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase (PostgreSQL + Auth)
- **Blockchain**: Base (Coinbase), OnchainKit, Wagmi, Viem
- **AI**: OpenAI GPT-4 & Embeddings API
- **Payments**: Privy (crypto), Stripe (fiat)
- **Authentication**: Farcaster (via Neynar API)
- **Caching**: Upstash Redis
- **State Management**: TanStack Query (React Query)

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js 18+ installed
- A Supabase project set up
- OpenAI API key
- Neynar API key (for Farcaster integration)
- OnchainKit API key
- Privy account (for crypto payments)
- Stripe account (for fiat payments)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd gigflow
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env.local
```

Required environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OnchainKit Configuration
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key

# Farcaster/Neynar Configuration
NEYNAR_API_KEY=your_neynar_api_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Privy Configuration
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### 4. Set up the database

Run the database migration to create the required tables:

```bash
# If using Supabase CLI
supabase db push

# Or manually run the SQL in supabase/migrations/001_initial_schema.sql
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── gigs/          # Gigs CRUD operations
│   │   ├── guides/        # Skill guides CRUD operations
│   │   ├── users/         # User management
│   │   ├── payments/      # Payment processing
│   │   ├── ai/            # AI-powered features
│   │   └── webhooks/      # Payment webhooks
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── providers.tsx      # App providers
├── components/            # React components
│   ├── AppShell.tsx       # Main app layout
│   ├── GigCard.tsx        # Gig display component
│   ├── SkillCard.tsx      # Skill guide component
│   ├── PitchGenerator.tsx # AI pitch generator
│   ├── FilterBar.tsx      # Search filters
│   └── Paywall.tsx        # Payment modal
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts         # Authentication hook
│   ├── useGigs.ts         # Gigs data fetching
│   └── useGuides.ts       # Guides data fetching
├── lib/                   # Utility libraries
│   ├── supabase.ts        # Supabase client
│   ├── auth.ts            # Authentication utilities
│   ├── payments.ts        # Payment processing
│   ├── openai.ts          # OpenAI integration
│   ├── api-client.ts      # Frontend API client
│   ├── api-utils.ts       # Backend API utilities
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # General utilities
├── supabase/              # Database migrations
│   └── migrations/        # SQL migration files
└── public/                # Static assets
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/farcaster` - Authenticate with Farcaster
- `GET /api/auth/farcaster?action=nonce` - Get authentication nonce

### Gigs
- `GET /api/gigs` - List gigs with filtering and pagination
- `POST /api/gigs` - Create a new gig (admin only)

### Skill Guides
- `GET /api/guides` - List skill guides with filtering
- `POST /api/guides` - Create a new guide (admin only)

### Users
- `GET /api/users` - Get current user profile
- `POST /api/users` - Create user account
- `PUT /api/users` - Update user profile

### AI Features
- `POST /api/ai/generate-pitch` - Generate personalized pitch
- `GET /api/ai/generate-pitch?templateId=X` - Get pitch template

### Payments
- `GET /api/payments/privy?guideId=X` - Create crypto payment request
- `POST /api/payments/privy` - Confirm crypto payment
- `POST /api/payments/stripe` - Create fiat payment
- `POST /api/webhooks/stripe` - Stripe webhook handler

## 🎨 Design System

The app uses a custom design system built with Tailwind CSS:

### Colors
- **Background**: `hsl(210 40% 96%)`
- **Accent**: `hsl(176 87% 42%)`
- **Primary**: `hsl(240 96% 47%)`
- **Surface**: `hsl(0 0% 100%)`

### Typography
- **Body**: `text-sm leading-relaxed`
- **Display**: `text-xl font-semibold`

### Components
- **Glass Card Effect**: Semi-transparent cards with backdrop blur
- **Gradient Buttons**: Colorful gradient backgrounds for CTAs
- **Responsive Grid**: 12-column fluid grid with 16px gutters

## 🔐 Security Features

- **Row Level Security (RLS)**: Database-level access control
- **JWT Authentication**: Secure session management
- **Input Validation**: Server-side validation for all endpoints
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Protection**: Proper CORS configuration
- **Environment Variables**: Sensitive data stored securely

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📊 Database Schema

The application uses PostgreSQL with the following main tables:

- **users**: User profiles and authentication data
- **gigs**: Curated job listings and opportunities
- **skill_guides**: Educational content and tutorials
- **pitch_templates**: Template pitches for different skills
- **saved_gigs**: User's saved job listings
- **purchased_content**: Payment records for premium content
- **completed_modules**: User progress tracking
- **notifications**: In-app notification system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in this repository
- Contact the development team
- Check the documentation in the `/docs` folder

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Core gig curation and display
- ✅ Micro-skill guides with premium content
- ✅ AI-powered pitch generation
- ✅ Farcaster authentication
- ✅ Dual payment system (crypto + fiat)

### Phase 2 (Upcoming)
- 🔄 Advanced semantic search with embeddings
- 🔄 Real-time notifications system
- 🔄 User achievement and gamification
- 🔄 Community features and reviews
- 🔄 Mobile app development

### Phase 3 (Future)
- 📋 Marketplace for custom gig requests
- 📋 Mentorship and coaching features
- 📋 Integration with major freelance platforms
- 📋 Advanced analytics and insights
- 📋 Multi-language support

---

Built with ❤️ for the freelance community
