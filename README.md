# personal-website | [![Athena Award Badge](https://img.shields.io/endpoint?url=https%3A%2F%2Faward.athena.hackclub.com%2Fapi%2Fbadge)](https://award.athena.hackclub.com?utm_source=readme)

a personal website showcasing me as a student!
> built to share my projects, photography, and what i'm currently up to

## features
- homepage with animated photo marquee and social links
- photo gallery (/moments) with upload functionality (if you're the owner)
- currently page showing what i'm working on + spotify integration
- mongodb integration for photo storage
- ip-based authentication for admin features

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

## history
- added photo uploads for myself so i can upload from any device as long as i add my ip
- implemented mongodb for photo storage instead of local files
- added spotify integration to show currently playing music and my fav song
- i struggled a lot with the photo circling thing since i had to figure out how to make it scroll down instead of sideways

### finished product
![](https://hc-cdn.hel1.your-objectstorage.com/s/v3/01c6eb35ea007e86d63139a4e857998edd431dfd_image.png)