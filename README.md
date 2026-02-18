# Smart Bookmark App

A real-time, private bookmark manager built with Next.js (App Router), Supabase (Auth + Database + Realtime), and Tailwind CSS.

## Live Features
- Google OAuth login (Supabase Auth)
- Add bookmarks (title + URL)
- Private bookmarks per user (Row Level Security)
- Real-time sync across multiple tabs
- Delete bookmarks
- Deployed on Vercel

---

## Tech Stack
- Next.js (App Router, TypeScript)
- Supabase (Auth, Postgres DB, Realtime)
- Tailwind CSS
- Vercel (Deployment)

---

## Setup
```bash
git clone https://github.com/sam-kash/tf-16.git
cd smart-bookmark-app
npm install
npm run dev
```
## Key Challenges & How I Solved Them

### 1. OAuth Redirect Issues
**Problem:** After setting up Google login, authentication failed due to redirect URI mismatch.  
**Solution:** Added the correct callback URL in Google Cloud Console:  
`https://<project-id>.supabase.co/auth/v1/callback`

---

### 2. Next.js Routing 404 Errors
**Problem:** `/login` route returned 404 even though the page existed.  
**Cause:** I mistakenly placed routes inside `src/app` while the project was using root `/app`.  
**Solution:** Moved all routes to the root `app/` directory and restarted the dev server.

---

### 3. Private Data Security (RLS)
**Problem:** Needed to ensure users can only see their own bookmarks.  
**Solution:** Enabled Row Level Security in Supabase and created policies:

```sql
auth.uid() = user_id
```

Tf -16 , 
learning @ 
x.com/Sankalpa_dev
