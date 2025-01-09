"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Image from "next/image";

interface VideoSnippet {
  publishedAt: string;
  title: string;
  description: string;
  thumbnails: {
    [key: string]: {
      url: string;
      width: number;
      height: number;
    };
  };
  position: number;
  resourceId: {
    videoId: string;
  };
}

interface PlaylistVideo {
  id: string;
  snippet: VideoSnippet;
}

const PlaylistVideos = () => {
  const router = useRouter();
  const {playlistId} = useParams();  
  console.log(playlistId)
  const [videos, setVideos] = useState<PlaylistVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (playlistId) {
      fetchPlaylistVideos();
    }
  }, [playlistId]);

  const fetchPlaylistVideos = async () => {
    try {
      const response = await fetch(`/api/playlist-videos?playlistId=${playlistId}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch videos');
      }
      
      setVideos(data.data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  const playVideo = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="text-xl">Loading videos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
          </h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              onClick={() => playVideo(video.snippet.resourceId.videoId)}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            >
              <Image
                height={200}
                width={200}
                src={video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url}
                alt={video.snippet.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 text-black line-clamp-2">
                  {video.snippet.title}
                </h3>
                <p className="text-zinc-700 text-sm mb-2 line-clamp-2">
                  {video.snippet.description}
                </p>
                <div className="text-sm text-zinc-700">
                  {new Date(video.snippet.publishedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && videos.length === 0 && !error && (
          <div className="text-center text-gray-500 mt-8">
            No videos found in this playlist.
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistVideos;
