"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Thumbnail {
    url: string;
    width: number;
    height: number;
}

interface PlaylistSnippet {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
        [key: string]: Thumbnail;
    };
    channelTitle: string;
}

interface PlaylistContentDetails {
    itemCount: number;
}

interface PlaylistItem {
    kind: string;
    etag: string;
    id: string;
    snippet: PlaylistSnippet;
    contentDetails: PlaylistContentDetails;
}

const YouTubePlaylists = () => {
    const [channelId, setChannelId] = useState("");
    const [playlists, setPlaylists] = useState<PlaylistItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const fetchPlaylists = async () => {
        if (!channelId) return;

        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `/api/playlists?username=${channelId}`
            );
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch playlists");
            }
            console.log(data.data);
            setPlaylists(data.data);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to fetch playlists"
            );
            setPlaylists([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchPlaylists();
    };

    const openPlaylist = (playlistId: string, playlistTitle: string) => {
      router.push(`/playlist/${playlistId}`);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">
                    YouTube Channel Playlists
                </h1>

                <form onSubmit={handleSubmit} className="mb-8">
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={channelId}
                                onChange={(e) => setChannelId(e.target.value)}
                                placeholder="Enter YouTube Channel ID"
                                className="w-full px-4 py-2 rounded-lg border text-black border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                            <Search
                                className="absolute right-3 top-2.5 text-gray-400"
                                size={20}
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Search"}
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {playlists.map((playlist) => {
                        if (playlist.contentDetails.itemCount > 0) {
                            return (
                                <div
                                    key={playlist.id}
                                    onClick={() =>
                                        openPlaylist(
                                            playlist.id,
                                            playlist.snippet.title
                                        )
                                    }
                                    className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                                >
                                    <Image
                                        height={200}
                                        width={200}
                                        src={
                                            playlist.snippet.thumbnails.medium
                                                ?.url ||
                                            playlist.snippet.thumbnails.default
                                                ?.url
                                        }
                                        alt={playlist.snippet.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="font-semibold text-black text-lg mb-2 line-clamp-2">
                                            {playlist.snippet.title}
                                        </h3>
                                        <p className="text-black mb-2 line-clamp-2">
                                            {playlist.snippet.description}
                                        </p>
                                        <div className="flex justify-between text-sm text-gray-500">
                                            <span>
                                                {
                                                    playlist.contentDetails
                                                        .itemCount
                                                }{" "}
                                                videos
                                            </span>
                                            <span>
                                                {new Date(
                                                    playlist.snippet.publishedAt
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    })}
                </div>

                {!loading && playlists.length === 0 && !error && (
                    <div className="text-center text-gray-500 mt-8">
                        No playlists found. Enter a Handle to search.
                    </div>
                )}
            </div>
        </div>
    );
};

export default YouTubePlaylists;
