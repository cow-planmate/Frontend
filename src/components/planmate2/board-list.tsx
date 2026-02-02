import { ArrowLeft, Eye, HelpCircle, MessageCircle, MessageSquare, PenTool, Search, ThumbsUp, Users } from 'lucide-react';
import { useState } from 'react';

interface BoardListProps {
  type: 'free' | 'qna' | 'mate';
  onBack: () => void;
  onNavigate: (view: any, data?: any) => void;
}

const MOCK_POSTS = {
  free: Array.from({ length: 15 }).map((_, i) => ({
    id: i + 1,
    title: `자유게시판 게시글 ${i + 1}`,
    author: `사용자${i + 1}`,
    level: Math.floor(Math.random() * 5) + 1,
    likes: Math.floor(Math.random() * 100),
    comments: Math.floor(Math.random() * 50),
    views: Math.floor(Math.random() * 1000),
    createdAt: `${Math.floor(Math.random() * 24) + 1}시간 전`,
    content: '여행에 대한 자유로운 이야기를 나누는 공간입니다. 서로의 경험을 공유해보세요!'
  })),
  qna: Array.from({ length: 15 }).map((_, i) => ({
    id: i + 1,
    title: `질문있습니다 ${i + 1}`,
    author: `질문자${i + 1}`,
    level: Math.floor(Math.random() * 3) + 1,
    likes: Math.floor(Math.random() * 50),
    comments: Math.floor(Math.random() * 20),
    views: Math.floor(Math.random() * 500),
    createdAt: `${Math.floor(Math.random() * 24) + 1}시간 전`,
    isAnswered: Math.random() > 0.5,
    content: '궁금한 점이 있어서 질문드립니다. 답변 부탁드려요!'
  })),
  mate: Array.from({ length: 15 }).map((_, i) => ({
    id: i + 1,
    title: `동행 구합니다 ${i + 1}`,
    author: `동행자${i + 1}`,
    level: Math.floor(Math.random() * 5) + 1,
    likes: Math.floor(Math.random() * 30),
    comments: Math.floor(Math.random() * 10),
    views: Math.floor(Math.random() * 200),
    createdAt: `${Math.floor(Math.random() * 24) + 1}시간 전`,
    participants: Math.floor(Math.random() * 3) + 1,
    maxParticipants: 4,
    content: '함께 여행하실 분을 찾습니다. 일정 조율 가능합니다.'
  }))
};

export default function BoardList({ type, onBack, onNavigate }: BoardListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const getTitle = () => {
    switch (type) {
      case 'free': return '자유게시판';
      case 'qna': return 'Q&A';
      case 'mate': return '메이트 찾기';
      default: return '게시판';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'free': return '자유롭게 여행 이야기를 나눠요';
      case 'qna': return '궁금한 점을 물어보세요';
      case 'mate': return '함께 여행할 동료를 찾아요';
      default: return '';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'free': return <MessageSquare className="w-6 h-6 text-[#1344FF]" />;
      case 'qna': return <HelpCircle className="w-6 h-6 text-orange-500" />;
      case 'mate': return <Users className="w-6 h-6 text-purple-500" />;
      default: return null;
    }
  };

  const getIconBg = () => {
    switch (type) {
      case 'free': return 'bg-blue-50';
      case 'qna': return 'bg-orange-50';
      case 'mate': return 'bg-purple-50';
      default: return 'bg-gray-50';
    }
  };

  const getLevelBadge = (level: number) => {
    const levels = [
      { level: 1, label: 'Lv.1', color: 'bg-gray-100 text-gray-600' },
      { level: 2, label: 'Lv.2', color: 'bg-blue-100 text-blue-600' },
      { level: 3, label: 'Lv.3', color: 'bg-purple-100 text-purple-600' },
      { level: 4, label: 'Lv.4', color: 'bg-orange-100 text-orange-600' },
      { level: 5, label: 'Lv.5', color: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' },
    ];
    const levelInfo = levels.find(l => l.level === level) || levels[0];
    return (
      <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${levelInfo.color}`}>
        {levelInfo.label}
      </span>
    );
  };

  const posts = MOCK_POSTS[type] || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-[#1a1a1a]" />
        </button>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${getIconBg()} rounded-xl flex items-center justify-center`}>
            {getIcon()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a1a]">{getTitle()}</h1>
            <p className="text-sm text-[#666666]">{getDescription()}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
        {[
          { id: 'free', label: '자유게시판', icon: MessageSquare },
          { id: 'qna', label: 'Q&A', icon: HelpCircle },
          { id: 'mate', label: '메이트 찾기', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = type === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate('board-list', { boardType: tab.id })}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'border-[#1344FF] text-[#1344FF]'
                  : 'border-transparent text-[#666666] hover:text-[#1a1a1a] hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#666666]" />
          <input
            type="text"
            placeholder={`${getTitle()} 내 검색...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-[#e5e7eb] rounded-xl focus:outline-none focus:border-[#1344FF] transition-colors bg-white shadow-sm"
          />
        </div>
        <button className="px-6 py-3 bg-[#1344FF] text-white rounded-xl hover:bg-[#0d34cc] transition-all shadow-md font-medium flex items-center justify-center gap-2">
          <PenTool className="w-5 h-5" />
          글쓰기
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="divide-y divide-gray-100">
          {posts.map((post) => (
            <div 
              key={post.id} 
              className="p-6 hover:bg-[#f8f9fa] transition-colors cursor-pointer"
              onClick={() => onNavigate('detail', { post: { ...post, image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&auto=format&fit=crop' } })} // Mock navigation to detail
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {type === 'qna' && post.isAnswered && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-lg font-medium">답변완료</span>
                    )}
                    {type === 'qna' && !post.isAnswered && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-lg font-medium">답변대기</span>
                    )}
                    {type === 'mate' && (
                      <span className="flex items-center gap-1 text-[#1344FF] bg-blue-50 px-2 py-0.5 rounded-lg text-xs font-medium">
                        <Users className="w-3 h-3" />
                        {post.participants}/{post.maxParticipants}
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-[#1a1a1a] hover:text-[#1344FF] transition-colors">
                      {post.title}
                    </h3>
                  </div>
                  <p className="text-[#666666] text-sm line-clamp-2 mb-3">
                    {post.content}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-[#666666]">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-[#1a1a1a]">{post.author}</span>
                  {getLevelBadge(post.level)}
                  <span className="text-gray-300">|</span>
                  <span>{post.createdAt}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1"><ThumbsUp className="w-4 h-4 text-[#1344FF]" />{post.likes}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" />{post.comments}</span>
                  <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{post.views}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination Mock */}
        <div className="p-6 border-t border-gray-100 flex justify-center gap-2">
          <button className="w-8 h-8 rounded-xl bg-[#1344FF] text-white flex items-center justify-center font-bold">1</button>
          <button className="w-8 h-8 rounded-xl hover:bg-gray-100 text-[#666666] flex items-center justify-center font-medium">2</button>
          <button className="w-8 h-8 rounded-xl hover:bg-gray-100 text-[#666666] flex items-center justify-center font-medium">3</button>
          <button className="w-8 h-8 rounded-xl hover:bg-gray-100 text-[#666666] flex items-center justify-center font-medium">...</button>
        </div>
      </div>
    </div>
  );
}
