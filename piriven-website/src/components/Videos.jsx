'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, X } from 'lucide-react';
import T from '@/components/T';
import { mediaUrl } from '@/lib/api';

export const VideosSection = ({ videos }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const videoRef = useRef(null);

  const first = Array.isArray(videos) && videos.length ? videos[0] : null;

  // Prefer uploaded file; fall back to external URL
  const fileSrc = first?.file ? mediaUrl(first.file) : "";
  const linkSrc = first?.url || "";
  const videoPath = fileSrc || linkSrc;

  const isYouTube =
    !!linkSrc &&
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/i.test(linkSrc);

  const thumbnailPath = first?.thumbnail ? mediaUrl(first.thumbnail) : "/images/video-thumb.jpg";

  const openVideo = (e) => {
    e.preventDefault();
    setIsVideoOpen(true);
  };

  const closeVideo = () => {
    setIsVideoOpen(false);
    if (videoRef.current) {
      videoRef.current.pause?.();
    }
  };

  useEffect(() => {
    return () => {
      if (videoRef.current) videoRef.current.pause?.();
    };
  }, []);

  return (
    <div>
      <h2 className="text-4xl font-bold text-gray-800 mb-8"><T>Videos</T></h2>

      <div className="space-y-6">
        {!isVideoOpen ? (
          <a onClick={openVideo} className="block relative group rounded-xl overflow-hidden cursor-pointer">
            <img
              src={thumbnailPath}
              alt="Video Thumbnail"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full p-5 bg-white/30 backdrop-blur">
                <Play />
              </div>
            </div>
          </a>
        ) : (
          <div className="relative">
            <button onClick={closeVideo} className="absolute -top-4 -right-4 z-10 bg-black text-white rounded-full p-2">
              <X size={18} />
            </button>

            {/* If external YouTube/Vimeo URL → iframe embed, else use <video src> */}
            {isYouTube ? (
              <div className="aspect-video w-full">
                <iframe
                  className="w-full h-full rounded-xl shadow-2xl"
                  src={linkSrc.replace('watch?v=', 'embed/')}
                  title="Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              videoPath ? (
                <video
                  ref={videoRef}
                  className="rounded-xl shadow-2xl w-full h-full"
                  controls
                  autoPlay
                  src={videoPath}
                />
              ) : (
                <div className="text-sm text-gray-500"><T>No video source.</T></div>
              )
            )}
          </div>
        )}

        <h3 className="font-semibold text-gray-700 text-lg">
          {first?.title || <T>Featured Video</T>}
        </h3>
        {first?.description ? (
          <p className="text-gray-600">{first.description}</p>
        ) : null}
      </div>
    </div>
  );
};
