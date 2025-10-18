import { NextResponse } from 'next/server';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

async function getAccessToken() {
  if (!refresh_token) {
    throw new Error('Refresh token is not available');
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  });

  return response.json();
}

export async function GET() {
  try {
    if (!refresh_token) {
      console.error('SPOTIFY_REFRESH_TOKEN is not set in environment variables');
      return NextResponse.json({ isPlaying: false }, { status: 500 });
    }

    const { access_token } = await getAccessToken();

    if (!access_token) {
      console.error('Failed to get access token');
      return NextResponse.json({ isPlaying: false }, { status: 500 });
    }

    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (response.status === 204 || response.status > 400) {
      return NextResponse.json({ isPlaying: false });
    }

    const song = await response.json();

    return NextResponse.json({
      isPlaying: song.is_playing,
      id: song.item.id,
      title: song.item.name,
      artist: song.item.artists.map((artist: any) => artist.name).join(', '),
      album: song.item.album.name,
      albumImageUrl: song.item.album.images[0].url,
      songUrl: song.item.external_urls.spotify,
      duration: song.item.duration_ms,
    });
  } catch (error) {
    console.error('Error in currently-playing API:', error);
    return NextResponse.json({ isPlaying: false }, { status: 200 });
  }
}