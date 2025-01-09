import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export async function GET(req: NextRequest) {
   const username = req.nextUrl.searchParams.get("username");

   if (!username) {
     return NextResponse.json(
       { message: 'Username is required' },
       { status: 400 }  
     );
   }
 
   if (!YOUTUBE_API_KEY) {
     return NextResponse.json(
       { message: 'YouTube API key is not configured' },
       { status: 500 }
     );
   }
 
   try {
     const response = await axios.get(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&forHandle=${username}&key=${YOUTUBE_API_KEY}
`)
      const id = response.data.items[0].id;

      const response2 = await axios.get(`https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&channelId=${id}&maxResults=50&key=${YOUTUBE_API_KEY}`)

     if (!response) {
       throw new Error(response.data.error?.message || 'Failed to fetch playlists');
     }
 
     return NextResponse.json({ data: response2.data.items }, { status: 200 });
   } catch (error) {
     return NextResponse.json(
       { error: error instanceof Error ? error.message : 'Unknown error' },
       { status: 500 }
     );
    }
}


