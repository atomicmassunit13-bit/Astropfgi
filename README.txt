WIRED VILLAGE - SETUP

1. GitHub repository: upload index.html to the repository root.
2. Create folder videos and upload your own video as videos/wired.mp4 (case-sensitive).
3. GitHub repository Settings > Pages > Deploy from a branch > main / (root).
4. Telegram: open @BotFather, send /newbot and copy the token. Do not post it publicly.
5. Open your bot in Telegram and send /start. Get your numeric chat ID from a trusted Telegram update method or Telegram getUpdates endpoint (do not publish the token).
6. Cloudflare dashboard > Workers & Pages > Create Worker > edit code. Paste worker.js and deploy.
7. In Worker Settings > Variables and Secrets, add encrypted Secrets BOT_TOKEN and CHAT_ID. Add ALLOWED_ORIGIN as the exact GitHub Pages origin (e.g. https://USERNAME.github.io), without a trailing slash. Note: this is origin only, not full repository URL.
8. In index.html replace YOUR_CLOUDFLARE_WORKER_URL with your Worker public https URL. Commit changes.
9. Test sending a message from your GitHub Pages website.

IMPORTANT SECURITY NOTES:
- Never put BOT_TOKEN in index.html or any GitHub repository file.
- Origin checking and a honeypot are only basic abuse deterrents, not strong anti-spam protection. For a public site, add Cloudflare Turnstile server-side verification and rate limiting before sharing widely.
- GitHub Pages is public: video files are public, and visitors can view or download them.
- GitHub may reject files larger than 100 MiB; use a supported media host for large videos.
- If your site uses a custom domain, update ALLOWED_ORIGIN accordingly.
