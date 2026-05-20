'use client';

import { useState, useEffect } from 'react';
import { ListeningVideo } from '@/data/listening';
import { listeningVideos, getRandomVideo, getCategories } from '@/data/listening';

interface ListeningPracticeProps {
  onBack: () => void;
}

export default function ListeningPractice({ onBack }: ListeningPracticeProps) {
  const [currentVideo, setCurrentVideo] = useState<ListeningVideo | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    handleRandomVideo();
  }, []);

  const handleRandomVideo = () => {
    const video = getRandomVideo('easy');
    setCurrentVideo(video);
    setShowVideo(true);
  };

  const categories = getCategories();
  
  const filteredVideos = selectedCategory === 'all' 
    ? listeningVideos 
    : listeningVideos.filter(v => v.category === selectedCategory);

  return (
    <div className="flex flex-col h-full">
      <header className="flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 safe-area-top">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">返回</span>
          </button>
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🎧 听力练习
          </h1>
          <div className="w-16" />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-semibold text-gray-800">随机推荐</h2>
              <p className="text-xs text-gray-500">BBC Learning English 入门难度</p>
            </div>
            <button
              onClick={handleRandomVideo}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all active:scale-95"
            >
              🎲 随机一个
            </button>
          </div>
        </div>

        {showVideo && currentVideo && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="aspect-video bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${currentVideo.youtubeId}?rel=0`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{currentVideo.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{currentVideo.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full">{currentVideo.category}</span>
                    <span>⏱️ {currentVideo.duration}</span>
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full">{currentVideo.level}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h3 className="font-semibold text-gray-800 mb-3">📚 视频库</h3>
          
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              全部
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredVideos.map((video) => (
              <button
                key={video.id}
                onClick={() => {
                  setCurrentVideo(video);
                  setShowVideo(true);
                }}
                className="w-full text-left p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-24 h-14 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                    <img 
                      src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-800 text-sm truncate">{video.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{video.description}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <span>{video.duration}</span>
                      <span>•</span>
                      <span>{video.category}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
