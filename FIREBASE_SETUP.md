# Firebase Authentication Setup Guide

Your baby name website now has a complete user profile system! Here's how to set it up:

## 🚀 Features Added:

### ✅ User Authentication

- **Google Sign-In**: Users can sign in with their Google accounts
- **Hamburger Menu**: Three-line menu in top-right corner
- **Profile Management**: View user info and sign out

### ✅ Liked Names System

- **Heart Icons**: Users can like/unlike names on results page
- **Persistent Storage**: Liked names saved to Firebase Firestore
- **Profile Section**: Access liked names from menu

### ✅ Google Ecosystem Integration

- **Firebase Auth**: Seamless with your existing Google Analytics
- **Cloud Firestore**: Scalable database for user data
- **Unified Experience**: Same Google account across services

## 🔧 Setup Instructions:

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Project name: "The Name Nursery"
4. **Important**: Link to your existing Google Analytics property!
5. Enable Google Analytics for this project (select your GA4 property: G-VWLLQ3JF28)

### Step 2: Enable Authentication

1. In Firebase Console → Authentication → Sign-in method
2. Enable "Google" provider
3. Add your domain (your-vercel-domain.vercel.app) to authorized domains

### Step 3: Create Firestore Database

1. In Firebase Console → Firestore Database
2. Click "Create database"
3. Start in **production mode**
4. Choose your region (closest to users)

### Step 4: Set Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own liked names
    match /likedNames/{document} {
      allow read, write: if request.auth != null &&
                         request.auth.uid == resource.data.userId;
      allow create: if request.auth != null &&
                    request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### Step 5: Get Firebase Config

1. In Firebase Console → Project Settings → General
2. Scroll to "Your apps" → Web app
3. If no web app exists, click "Add app" and create one
4. Copy the config values and update your `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-VWLLQ3JF28  # Same as your GA4 ID
```

### Step 6: Deploy to Vercel

1. Add all Firebase environment variables to Vercel
2. Deploy your updated code
3. Test sign-in functionality

## 🎯 User Experience:

### For Guests:

- Use the app normally
- See heart icons but can't interact
- Sign-in prompt when trying to like names

### For Signed-In Users:

- Click hamburger menu (≡) in top-right
- View profile info with Google account details
- Like/unlike names with instant feedback
- Access "Liked Names" section from menu
- Sign out when done

## 📊 Analytics Benefits:

### Enhanced Tracking:

- **User Retention**: Track returning users
- **Engagement**: Measure name liking behavior
- **Popular Names**: See most-liked combinations
- **User Demographics**: Linked to Google accounts

### Ad Revenue Optimization:

- **User Profiles**: Better targeting for ads
- **Behavior Patterns**: Understand user preferences
- **Return Visits**: Encourage users to come back
- **Premium Features**: Foundation for paid features

## 🔒 Privacy & Security:

- Users control their own data
- Firebase handles authentication securely
- GDPR compliant with Google's infrastructure
- Users can delete their account and data

## 🚀 Next Steps:

1. **Test Locally**: Set up Firebase and test sign-in
2. **Deploy**: Add env vars to Vercel and deploy
3. **Monitor**: Watch user engagement in Analytics
4. **Optimize**: See which names get liked most
5. **Monetize**: Use user data for better ad targeting

Your baby name app is now a full-featured platform ready for user growth and ad revenue! 🍼✨
