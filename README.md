# GigFlow - Base MiniApp

**Your curated path to online earning.**

GigFlow is a Base MiniApp that curates legitimate online earning opportunities and provides micro-skill guides for individuals seeking to earn money online. Built with Next.js, Supabase, and integrated with Farcaster for seamless social authentication.

## 🚀 Features

### Core Features
- **Curated Gigs Feed**: Daily/weekly digest of vetted, legitimate online jobs and freelance gigs
- **Micro-Skill Guides**: Short, actionable guides on in-demand skills with premium content
- **Profile Optimizer**: AI-powered tool to create compelling freelance profiles and pitches
- **Payment Integration**: Support for both crypto (USDC on Base) and fiat payments
- **Farcaster Integration**: Seamless authentication and social features

### Technical Features
- **Next.js 15**: Modern React framework with App Router
- **Supabase**: PostgreSQL database with real-time subscriptions
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **TypeScript**: Full type safety throughout the application
- **OnchainKit**: Coinbase's toolkit for Base integration
- **Privy**: Wallet management and crypto payments
- **Stripe**: Fiat payment processing

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Lucide React Icons
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Farcaster (via Neynar API)
- **Payments**: Privy (crypto), Stripe (fiat)
- **AI**: OpenAI API for pitch generation
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- A Supabase project
- Neynar API key for Farcaster integration
- OpenAI API key
- Privy account for crypto payments
- Stripe account for fiat payments

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/gigflow-base-miniapp.git
cd gigflow-base-miniapp
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the example environment file and fill in your values:
```bash
cp .env.example .env.local
```

Required environment variables:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Farcaster/Neynar
NEYNAR_API_KEY=your_neynar_api_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Privy (Crypto Payments)
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret

# Stripe (Fiat Payments)
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Base Network
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_USDC_CONTRACT_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
```

### 4. Database Setup
Run the database schema in your Supabase project:
```bash
# Copy the contents of database/schema.sql and run it in your Supabase SQL editor
```

### 5. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see your app running!

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── gigs/         # Gigs management
│   │   ├── guides/       # Skill guides
│   │   ├── users/        # User management
│   │   ├── payments/     # Payment processing
│   │   └── pitch/        # AI pitch generation
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── providers.tsx     # Context providers
├── components/            # React components
│   ├── AppShell.tsx      # Main app layout
│   ├── GigCard.tsx       # Gig display component
│   ├── SkillCard.tsx     # Skill guide component
│   ├── PitchGenerator.tsx # AI pitch generator
│   ├── FilterBar.tsx     # Filtering interface
│   └── Paywall.tsx       # Payment modal
├── lib/                   # Utilities and types
│   ├── types.ts          # TypeScript definitions
│   ├── constants.ts      # App constants
│   ├── utils.ts          # Utility functions
│   └── mockData.ts       # Development data
├── database/             # Database schema
│   └── schema.sql        # Supabase schema
├── docs/                 # Documentation
│   └── API.md           # API documentation
└── public/              # Static assets
```

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run the SQL schema from `database/schema.sql`
3. Configure Row Level Security (RLS) policies
4. Add your Supabase URL and service role key to `.env.local`

### Farcaster Integration
1. Get a Neynar API key from [neynar.com](https://neynar.com)
2. Add the API key to your environment variables
3. Configure Farcaster authentication in your app

### Payment Setup

#### Crypto Payments (Privy)
1. Create a Privy account at [privy.io](https://privy.io)
2. Configure your app for Base network
3. Add Privy credentials to environment variables

#### Fiat Payments (Stripe)
1. Create a Stripe account
2. Get your publishable and secret keys
3. Configure webhooks for payment confirmations
4. Add Stripe credentials to environment variables

## 🎨 Design System

GigFlow uses a custom design system built on Tailwind CSS:

### Colors
- **Background**: `hsl(210 40% 96%)`
- **Accent**: `hsl(176 87% 42%)`
- **Primary**: `hsl(240 96% 47%)`
- **Surface**: `hsl(0 0% 100%)`

### Components
- **AppShell**: Main application layout with navigation
- **GigCard**: Displays gig information with save functionality
- **SkillCard**: Shows skill guides with premium indicators
- **PitchGenerator**: AI-powered pitch creation tool
- **Paywall**: Payment modal for premium content

## 📊 Business Model

GigFlow operates on a freemium model:
- **Free**: Access to curated gigs and basic skill guides
- **Premium**: Advanced guides ($0.50-$2 each) and premium features ($5/month)
- **Payment Methods**: USDC on Base or traditional fiat payments

## 🔒 Security

- **Row Level Security**: Supabase RLS policies protect user data
- **API Validation**: All endpoints validate input and authenticate users
- **Payment Security**: PCI-compliant payment processing via Stripe
- **Wallet Security**: Non-custodial wallet management via Privy

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy with automatic CI/CD

### Manual Deployment
```bash
npm run build
npm start
```

## 📖 API Documentation

Comprehensive API documentation is available in [`docs/API.md`](docs/API.md).

### Key Endpoints
- `GET /api/gigs` - Fetch curated gigs
- `GET /api/guides` - Get skill guides
- `POST /api/payments` - Process payments
- `POST /api/pitch/generate` - Generate AI pitches

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `docs/` folder
- **Issues**: Open an issue on GitHub
- **Community**: Join our Discord server

## 🗺 Roadmap

### Phase 1 (Current)
- ✅ Core gig curation system
- ✅ Micro-skill guides
- ✅ AI pitch generation
- ✅ Payment integration

### Phase 2 (Next)
- 🔄 Advanced filtering and search
- 🔄 User profiles and portfolios
- 🔄 Community features
- 🔄 Mobile app

### Phase 3 (Future)
- 📋 Marketplace for services
- 📋 Skill assessments
- 📋 Mentorship matching
- 📋 Analytics dashboard

## 🙏 Acknowledgments

- [Base](https://base.org) for the blockchain infrastructure
- [Farcaster](https://farcaster.xyz) for social authentication
- [Supabase](https://supabase.com) for the backend infrastructure
- [Vercel](https://vercel.com) for deployment platform
- [OpenAI](https://openai.com) for AI capabilities

---

Built with ❤️ for the Base ecosystem
