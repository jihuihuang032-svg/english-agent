'use client';

interface ListeningPracticeProps {
  onBack: () => void;
}

export default function ListeningPractice({ onBack }: ListeningPracticeProps) {
  const bilibiliResources = [
    {
      id: '6minute',
      title: 'BBC 6分钟英语',
      description: '每期6分钟，适合初中级学习者',
      url: 'https://search.bilibili.com/all?keyword=BBC+6%E5%88%86%E9%92%9F%E8%8B%B1%E8%AF%AD',
      icon: '📻',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'pronunciation',
      title: '英语发音技巧',
      description: '改善发音，说得更地道',
      url: 'https://search.bilibili.com/all?keyword=%E8%8B%B1%E8%AF%AD%E5%8F%91%E9%9F%B3%E6%8A%80%E5%B7%A7',
      icon: '🎵',
      color: 'from-orange-500 to-red-500',
    },
    {
      id: 'daily',
      title: '日常英语对话',
      description: '生活场景实用表达',
      url: 'https://search.bilibili.com/all?keyword=%E6%97%A5%E5%B8%B8%E8%8B%B1%E8%AF%AD%E5%AF%B9%E8%AF%9D',
      icon: '🗣️',
      color: 'from-green-500 to-teal-500',
    },
    {
      id: 'business',
      title: '商务英语',
      description: '职场沟通必备技能',
      url: 'https://search.bilibili.com/all?keyword=%E5%95%86%E5%8A%A1%E8%8B%B1%E8%AF%AD',
      icon: '💼',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'travel',
      title: '旅游英语',
      description: '出国旅行实用表达',
      url: 'https://search.bilibili.com/all?keyword=%E6%97%85%E6%B8%B8%E8%8B%B1%E8%AF%AD',
      icon: '✈️',
      color: 'from-indigo-500 to-blue-500',
    },
    {
      id: 'listening',
      title: '英语听力训练',
      description: '提升听力理解能力',
      url: 'https://search.bilibili.com/all?keyword=%E8%8B%B1%E8%AF%AD%E5%90%AC%E5%8A%9B%E8%AE%AD%E7%BB%83',
      icon: '🎧',
      color: 'from-rose-500 to-orange-500',
    },
  ];

  const handleOpen = (url: string) => {
    window.open(url, '_blank');
  };

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
        <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-2xl p-4 border border-pink-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📺</span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">B站英语学习资源</h2>
              <p className="text-xs text-gray-500">国内可直接访问，海量学习视频</p>
            </div>
          </div>
          <button
            onClick={() => handleOpen('https://www.bilibili.com')}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl font-medium hover:shadow-lg transition-all active:scale-[0.98]"
          >
            打开 B站 首页
          </button>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 px-1">📚 推荐搜索</h3>
          
          {bilibiliResources.map((resource) => (
            <button
              key={resource.id}
              onClick={() => handleOpen(resource.url)}
              className="w-full text-left bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-gradient-to-r ${resource.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <span className="text-xl">{resource.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800">{resource.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{resource.description}</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-100">
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <h4 className="font-medium text-yellow-800 text-sm">使用提示</h4>
              <p className="text-xs text-yellow-700 mt-1">
                点击卡片会跳转到 B站 搜索对应内容。建议选择播放量高、有字幕的视频学习。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
