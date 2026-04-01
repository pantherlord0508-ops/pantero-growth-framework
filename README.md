# Pantero Waitlist

A full-featured tech startup waitlist web application with referral system, real-time stats, admin dashboard, and email notifications.

## Features

- **Waitlist Signup** — Form with name, email, WhatsApp number, country code selector, referral tracking
- **Referral System** — Unique shareable referral links, position boosts, milestone rewards at 3/5/10/25/50 referrals
- **Live Stats** — Real-time counters, daily signup charts, recent signup ticker
- **Leaderboard** — Public top referrers board with anonymized names
- **Milestones** — Visual progress tracker with animated progress bars
- **Admin Dashboard** — User management, CSV export, bulk email, settings, analytics
- **Email System** — Welcome emails, milestone notifications, bulk campaigns via Resend
- **3D Intro** — Three.js animated intro loader with rolling cubes
- **Dark Theme** — Gold-accented dark UI with glassmorphism and Framer Motion animations

## Tech Stack

- Next.js 14 (App Router), TypeScript, Tailwind CSS
- Supabase (PostgreSQL, Realtime, RLS)
- Resend (Transactional Email)
- Recharts (Charts), Framer Motion (Animations)
- React Hook Form + Zod (Form Validation)
- Three.js / React Three Fiber (3D Intro)

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with signup form, live counter, features |
| `/join` | Dedicated signup page |
| `/community` | Post-signup page with WhatsApp link and referral dashboard |
| `/referral/[code]` | Individual referral landing pages |
| `/leaderboard` | Public top referrers board |
| `/milestones` | Public milestone progress tracker |
| `/status` | Real-time status page with live charts |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/admin/login` | Admin authentication |
| `/admin` | Protected admin dashboard |

## Deployment Guide

### Step 1: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to **SQL Editor** in your Supabase dashboard
3. Copy and paste the entire contents of `supabase-schema.sql` into the editor
4. Click **Run** to create all tables, functions, indexes, and RLS policies
5. Go to **Settings > API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### Step 2: Set Up Resend (Email)

1. Go to [resend.com](https://resend.com) and create an account
2. Create an API key → `RESEND_API_KEY`
3. For production: add and verify your domain in Resend, then update the sender address in `src/lib/email.ts` to use your domain (e.g., `Pantero <noreply@yourdomain.com>`)

### Step 3: Deploy to Vercel

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and import your repository
3. In **Environment Variables**, add all variables from `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel domain, e.g., `https://pantero.vercel.app`)
   - `NEXT_PUBLIC_WHATSAPP_CHANNEL_URL`
4. Click **Deploy**
5. After deployment, update `NEXT_PUBLIC_APP_URL` to your actual production URL

### Step 4: Configure Supabase for Production

1. In Supabase dashboard, go to **Authentication > URL Configuration**
2. Set **Site URL** to your Vercel domain
3. Ensure realtime is enabled for the `waitlist_users` table under **Database > Replication**

## Local Development

```bash
# Install dependencies
npm install --legacy-peer-deps

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your actual values

# Run development server
npm run dev

# Test email system
npm run test-email

# Seed default milestones
npm run seed
```

## Admin Access

- URL: `/admin/login`
- Username: Set via `ADMIN_USERNAME` env var (default: `TESORO-DEV`)
- Password: Set via `ADMIN_PASSWORD` env var

## Project Structure

```
src/
  app/
    api/              # API routes (signup, referral, stats, admin)
    admin/            # Admin dashboard pages
    join/             # Signup page
    community/        # Post-signup page
    referral/[code]/  # Referral landing pages
    leaderboard/      # Top referrers
    milestones/       # Milestone tracker
    status/           # Live status page
    privacy/          # Privacy policy
    terms/            # Terms of service
  components/
    layout/           # Header, Footer, WhatsApp button
    dashboard/        # Live stats, charts
    ui/               # Shadcn UI components
    intro/            # 3D intro loader (Three.js)
  lib/
    supabase.ts       # Supabase client
    email.ts          # Resend email system
    types.ts          # TypeScript types
    utils.ts          # Utility functions
scripts/
    seed-milestones.ts  # Seed default milestones
    test-email.ts       # Test email delivery
```

## License

Private — All rights reserved.
