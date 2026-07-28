# Zero-Waste Platform

Mobile-first, web-deployed platform connecting households with private waste collectors.
Built with Expo (React Native + React Native Web), Supabase (Auth/DB/Realtime), deployed on Vercel.

## Quick Start (Day 1)
1. `npm install`
2. Create a Supabase project → copy URL + anon key into `.env`
3. Run the SQL in `docs/schema.sql` in the Supabase SQL editor
4. `npm run web` to develop locally
5. `vercel` to deploy (vercel.json already configured for Expo web export)

## Roles
- **Household**: request pickup, track, rate collector
- **Collector**: view/accept nearby requests, update job status
- **Admin**: dashboard, user management, analytics

## Day-by-day plan (2 days)
- Day 1: Supabase schema + auth + household request flow + collector accept flow
- Day 2: Real-time status updates + admin dashboard charts + polish + deploy + demo script
