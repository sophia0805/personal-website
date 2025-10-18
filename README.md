# personal-website | [![Athena Award Badge](https://img.shields.io/endpoint?url=https%3A%2F%2Faward.athena.hackclub.com%2Fapi%2Fbadge)](https://award.athena.hackclub.com?utm_source=readme)

a personal website showcasing me as a student!
> built to share my projects, photography, and what i'm currently up to

## features
- homepage with animated photo marquee and social links
- photo gallery (/moments) with drag-and-drop upload functionality (owner-only)
- currently page showing what i'm working on + spotify integration
- responsive design with dark mode support
- mongodb integration for photo storage
- ip-based authentication for admin features
- spotify api integration for currently playing music

## pages
- `/` - main homepage with intro and photo carousel
- `/currently` - what i'm up to right now + spotify integration
- `/moments` - photo gallery with upload capabilities
- `/api/photos` - photo management api
- `/api/currently-playing` - spotify integration api

## installation
1. clone the repository
   ```bash
   git clone https://github.com/sophia0805/personal-website
   cd personal-website
   ```

2. install dependencies
   ```bash
   npm install
   ```

3. create a .env.local
    ```.env
    MONGODB_URI="your_mongodb_connection_string"
    IP="your_ip_address_for_admin_access"
    SPOTIFY_CLIENT_ID="your_spotify_client_id"
    SPOTIFY_CLIENT_SECRET="your_spotify_client_secret"
    SPOTIFY_REFRESH_TOKEN="your_spotify_refresh_token"
    ```

4. run the development server
   ```bash
   npm run dev
   ```

5. open your browser
   navigate to [http://localhost:3000](http://localhost:3000)

## tech stack
- next.js 15 with app router
- react 19 with typescript
- tailwind css for styling
- mongodb with mongoose for photo storage
- spotify web api for music integration
- vercel for deployment

## development journey
- started with a simple static site, then added dynamic photo uploads
- implemented mongodb for persistent photo storage instead of local files
- added spotify integration to show currently playing music
- created ip-based authentication system for admin photo uploads
- built responsive design with smooth animations and hover effects
- added caching for better performance and reduced api calls
- integrated drag-and-drop file uploads for better ux

### live site:
![](https://hc-cdn.hel1.your-objectstorage.com/s/v3/327dd817897d301a541fce4386a6839b010f5b69_image.png)