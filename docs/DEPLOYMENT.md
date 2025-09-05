# GigFlow Deployment Guide

This guide covers deploying GigFlow to production environments.

## 🚀 Vercel Deployment (Recommended)

Vercel provides the best experience for Next.js applications with automatic deployments and edge functions.

### Prerequisites
- GitHub repository with your GigFlow code
- Vercel account
- All required API keys and credentials

### Step 1: Connect Repository
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository containing GigFlow

### Step 2: Configure Environment Variables
Add all required environment variables in the Vercel dashboard:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Farcaster/Neynar API
NEYNAR_API_KEY=your_neynar_api_key

# OpenAI API
OPENAI_API_KEY=your_openai_api_key

# Privy Configuration
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Base Network Configuration
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_USDC_CONTRACT_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913

# Redis Configuration
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# Application Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NODE_ENV=production

# MiniKit Configuration
NEXT_PUBLIC_MINIKIT_PROJECT_ID=your_minikit_project_id
```

### Step 3: Deploy
1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be available at `https://your-project.vercel.app`

### Step 4: Configure Custom Domain (Optional)
1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Configure DNS records as instructed

## 🐳 Docker Deployment

For containerized deployments, use the provided Dockerfile.

### Create Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Build and Run
```bash
# Build the Docker image
docker build -t gigflow .

# Run the container
docker run -p 3000:3000 --env-file .env.production gigflow
```

## ☁️ AWS Deployment

### Using AWS Amplify
1. Connect your GitHub repository to AWS Amplify
2. Configure build settings:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### Using AWS ECS with Fargate
1. Build and push Docker image to ECR
2. Create ECS task definition
3. Configure service with load balancer
4. Set up environment variables in task definition

## 🌐 Netlify Deployment

1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Add environment variables in Netlify dashboard
4. Deploy

## 📊 Database Setup

### Supabase Production Setup
1. Create a production Supabase project
2. Run the database schema:
```sql
-- Copy and paste contents from database/schema.sql
```
3. Configure Row Level Security policies
4. Set up database backups
5. Configure connection pooling if needed

### Environment-Specific Configurations
- **Development**: Use Supabase local development
- **Staging**: Separate Supabase project for testing
- **Production**: Production Supabase project with backups

## 🔐 Security Checklist

### Environment Variables
- [ ] All sensitive keys are stored securely
- [ ] No hardcoded secrets in code
- [ ] Different keys for different environments

### Database Security
- [ ] Row Level Security (RLS) enabled
- [ ] Proper authentication policies
- [ ] Regular security updates

### API Security
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] CORS properly configured
- [ ] HTTPS enforced

### Payment Security
- [ ] Stripe webhooks verified
- [ ] Privy integration secured
- [ ] PCI compliance maintained

## 📈 Monitoring and Analytics

### Error Tracking
Set up error tracking with Sentry:
```bash
npm install @sentry/nextjs
```

### Performance Monitoring
- Use Vercel Analytics for performance insights
- Set up custom metrics for business KPIs
- Monitor API response times

### Logging
- Configure structured logging
- Set up log aggregation (e.g., LogRocket, DataDog)
- Monitor error rates and patterns

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
- Check environment variables are set correctly
- Verify all dependencies are installed
- Check for TypeScript errors

#### Database Connection Issues
- Verify Supabase URL and keys
- Check network connectivity
- Ensure RLS policies allow access

#### Payment Integration Issues
- Verify Stripe/Privy credentials
- Check webhook endpoints are accessible
- Ensure proper CORS configuration

### Debug Commands
```bash
# Check build locally
npm run build

# Verify environment variables
npm run env:check

# Test database connection
npm run db:test

# Run health checks
npm run health:check
```

## 📋 Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] No console.log statements in production code
- [ ] TypeScript errors resolved

### Configuration
- [ ] Environment variables configured
- [ ] Database schema deployed
- [ ] API keys validated
- [ ] CORS settings configured

### Security
- [ ] Security headers configured
- [ ] HTTPS enforced
- [ ] Rate limiting enabled
- [ ] Input validation implemented

### Performance
- [ ] Images optimized
- [ ] Bundle size analyzed
- [ ] Caching strategies implemented
- [ ] CDN configured

### Monitoring
- [ ] Error tracking set up
- [ ] Performance monitoring enabled
- [ ] Health checks configured
- [ ] Alerting rules defined

## 🔧 Post-Deployment

### Verification Steps
1. Test all core functionality
2. Verify payment processing
3. Check API endpoints
4. Test mobile responsiveness
5. Validate SEO meta tags

### Monitoring Setup
1. Set up uptime monitoring
2. Configure error alerts
3. Monitor performance metrics
4. Track business KPIs

### Backup Strategy
1. Database backups scheduled
2. Code repository backed up
3. Environment configurations documented
4. Recovery procedures tested

## 📞 Support

If you encounter issues during deployment:
1. Check the troubleshooting section
2. Review logs for error messages
3. Consult the API documentation
4. Open an issue on GitHub

---

For additional help, refer to the main [README.md](../README.md) or open an issue in the repository.
