import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export async function GET(req: NextRequest) {
    const playlistId = req.nextUrl.searchParams.get("playlistId");

    if (!playlistId) {
        return NextResponse.json(
            { message: "Playlist ID is required" },
            { status: 400 }
        );
    }

    if (!YOUTUBE_API_KEY) {
        return NextResponse.json(
            { message: "YouTube API key is not configured" },
            { status: 500 }
        );
    }

    try {
        const response = await axios.get( `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=25&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}`)

        console.log(response.data)
        if (!response) {
            throw new Error(
                "Failed to fetch videos"
            );
        }

        return NextResponse.json({ data: response.data }, {
            status: 200,
        });
    } catch (error) {
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}