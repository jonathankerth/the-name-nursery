# Google Analytics Setup Instructions

## Step 1: Get Your Google Analytics Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click "Start measuring" or "Create Account"
4. Set up your property:
   - Account name: "The Name Nursery"
   - Property name: "The Name Nursery"
   - Country and currency: Your location/currency
5. Choose "Web" platform
6. Enter your website URL
7. Copy your Measurement ID (format: G-XXXXXXXXXX)

## Step 2: Update Environment Variables

### Local Development:

1. Replace `G-XXXXXXXXXX` in `.env.local` with your actual Measurement ID

### Production (Vercel):

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add a new variable:
   - Name: `NEXT_PUBLIC_GA_ID`
   - Value: Your GA4 Measurement ID (G-XXXXXXXXXX)
   - Environment: Production, Preview, Development

## Step 3: Deploy and Verify

1. Deploy your changes to Vercel
2. Visit your live site
3. Check Google Analytics Real-Time reports (may take 24-48 hours for full data)

## What's Being Tracked:

### Automatic Tracking:

- Page views
- Session duration
- User location and device info
- Traffic sources

### Custom Events:

- Step progression (gender → letter → results)
- Name searches (gender + letter combinations)
- Results views (AI-generated vs fallback)

## Key Metrics for Ad Revenue:

1. **Page Views**: Total pages viewed
2. **Session Duration**: How long users stay
3. **Bounce Rate**: Users who leave immediately
4. **Popular Searches**: Most requested name combinations
5. **User Demographics**: Age, location, interests
6. **Traffic Sources**: Where users come from (crucial for SEO)

## Next Steps for Ad Revenue:

1. **Get 100+ daily users** before applying to ad networks
2. **Apply for Google AdSense** (requires GA4 data)
3. **Monitor user engagement** metrics
4. **Optimize for popular name searches**
5. **Track conversion events** (if you add premium features)

Your analytics are now set up! The data will help you understand your users and qualify for advertising programs.
