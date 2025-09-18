"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Play, X } from "lucide-react";
import T from "@/components/T";
import { mediaUrl } from "@/lib/api";

export const VideosSection = ({ videos }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const videoRef = useRef(null);

  const first = Array.isArray(videos) && videos.length ? videos[0] : null;
  const fileSrc = first?.file ? mediaUrl(first.file) : "";
  const linkSrc = first?.url || "";
  const videoPath = fileSrc || linkSrc;
  const isYouTube = !!linkSrc && /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/i.test(linkSrc);
  const thumbnailPath = first?.thumbnail ? mediaUrl(first.thumbnail) : "";

  const openVideo = (e) => {
    e.preventDefault();
    if (!videoPath && !isYouTube) return;
    setIsVideoOpen(true);
  };

  const closeVideo = () => {
    setIsVideoOpen(false);
    if (videoRef.current) {
      videoRef.current.pause?.();
    }
  };

  useEffect(() => () => {
    if (videoRef.current) videoRef.current.pause?.();
  }, []);

  if (!first) {
    return (
      <div>
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Videos</h2>
        <div className="text-sm text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-xl px-4 py-6 text-center">
          <T>No videos available yet.</T>
        </div>
        <div className="pt-6 text-right">
          <Link
            href="/videos"
            className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
          >
            <T>View all videos</T>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-4xl font-bold text-gray-800 mb-8">Videos</h2>

      <div className="space-y-6">
        {!isVideoOpen ? (
          <button onClick={openVideo} className="block relative group rounded-xl overflow-hidden cursor-pointer w-full">
            {thumbnailPath ? (
              <img src={thumbnailPath} alt={first?.title || "Video Thumbnail"} className="w-full h-auto object-cover" />
            ) : (
              <div className="aspect-video w-full bg-gray-200 flex items-center justify-center text-gray-500">No thumbnail</div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full p-5 bg-white/30 backdrop-blur">
                <Play />
              </div>
            </div>
          </button>
        ) : (
          <div className="relative">
            <button onClick={closeVideo} className="absolute -top-4 -right-4 z-10 bg-black text-white rounded-full p-2">
              <X size={18} />
            </button>

            {isYouTube ? (
              <div className="aspect-video w-full">
                <iframe
                  className="w-full h-full rounded-xl shadow-2xl"
                  src={linkSrc.replace("watch?v=", "embed/")}
                  title={first?.title || "Video"}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : videoPath ? (
              <video
                ref={videoRef}
                className="rounded-xl shadow-2xl w-full h-full"
                controls
                autoPlay
                src={videoPath}
              />
            ) : (
              <div className="text-sm text-gray-500">
                <T>No video source.</T>
              </div>
            )}
          </div>
        )}

        <h3 className="font-semibold text-gray-700 text-lg">
          {first?.title || "Untitled video"}
        </h3>
        {first?.description ? (
          <p className="text-gray-600">{first.description}</p>
        ) : null}
        <div className="pt-4 text-right">
          <Link
            href="/videos"
            className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
          >
            <T>View all videos</T>
          </Link>
        </div>
      </div>
    </div>
  );
};
