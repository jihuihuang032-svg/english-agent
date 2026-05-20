'use client';

interface ListeningPracticeProps {
  onBack: () => void;
}

export default function ListeningPractice({ onBack }: ListeningPracticeProps) {
  const bbcResources = [
    {
      id: '6minute',
      title: '6 Minute English',
      description: '6分钟英语，适合初中级学习者，每期一个话题',
      url: 'https://www.bbc.co.uk/learningenglish/english/features/6-minute-english',
      icon: '📻',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'english-at-work',
      title: 'English at Work',
      description: '职场英语，学习工作中的实用表达',
      url: 'https://www.bbc.co.uk/learningenglish/english/features/english-at-work',
      icon: '💼',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'the-english-we-speak',
      title: 'The English We Speak',
      description: '地道英语表达，学习日常口语和俚语',
      url: 'https://www.bbc.co.uk/learningenglish/english/features/the-english-we-speak',
      icon: '🗣️',
      color: 'from-green-500 to-teal-500',
    },
    {
      id: 'pronunciation',
      title: 'Pronunciation',
      description: '发音技巧，改善你的英语发音',
      url: 'https://www.bbc.co.uk/learningenglish/english/features/pronunciation',
      icon: '🎵',
      color: 'from-orange-500 to-red-500',
    },
    {
      id: 'lingohack',
      title: 'Lingohack',
      description: '新闻英语，通过真实新闻学习词汇',
      url: 'https://www.bbc.co.uk/learningenglish/english/features/lingohack',
      icon: '📰',
      color: 'from-indigo-500 to-blue-500',
    },
    {
      id: 'drama',
      title: 'Drama',
      description: '英语广播剧，通过故事学习英语',
      url: 'https://www.bbc.co.uk/learningenglish/english/features/drama',
      icon: '🎬',
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
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🌐</span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">BBC Learning English</h2>
              <p className="text-xs text-gray-500">全球最受欢迎的英语学习资源</p>
            </div>
          </div>
          <button
            onClick={() => handleOpen('https://www.bbc.co.uk/learningenglish')}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all active:scale-[0.98]"
          >
            访问 BBC Learning English 官网
          </button>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 px-1">📚 推荐栏目</h3>
          
          {bbcResources.map((resource) => (
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
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{resource.description}</p>
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
                BBC Learning English 提供音频、视频和文本材料。建议先听一遍，再看文本，最后跟读练习。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
