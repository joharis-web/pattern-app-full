# Pattern App Full - Ready to Deploy (Vercel)

This repository is a ready-to-deploy template optimized for mobile deployment to Vercel.
It includes:
- API endpoints that aggregate YouTube/Google/TikTok (with dummy fallbacks)
- Weather endpoint (OpenWeatherMap proxy example)
- Data files: shio.json, zodiak.json, erek.json (starter dataset)
- Frontend (frontend.html) that calls API and displays patterned numbers + interpretation

**Deploy steps (quick):**
1. Upload repository to GitHub (extract zip and upload files).
2. Import repository on Vercel and Deploy.
3. Add environment variables in Vercel if you want live data:
   - YT_API_KEY  (YouTube Data API v3 key)
   - GOOGLE_CUSTOM_SEARCH_URL (optional)
   - TIKTOK_CUSTOM_URL (optional)
   - OPENWEATHER_KEY (optional)
4. Visit https://<your-vercel-app>.vercel.app/

Notes:
- TikTok and Google parts use dummy data unless you provide custom endpoints.
- API keys must be set in Vercel's Environment Variables, not in frontend.
