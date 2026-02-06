import { ArrowLeft, Eye, HelpCircle, MapPin, MessageCircle, MessageSquare, PenTool, Search, Star, ThumbsDown, ThumbsUp, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';

interface BoardListProps {
  type: 'free' | 'qna' | 'mate' | 'recommend';
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
    dislikes: Math.floor(Math.random() * 20),
    comments: Math.floor(Math.random() * 50),
    views: Math.floor(Math.random() * 1000),
    createdAt: `${Math.floor(Math.random() * 24) + 1}시간 전`,
    image: `https://images.unsplash.com/photo-${[
      '1506744038136-46273834b3fb',
      '1501785888041-af3ef285b470',
      '1472396961695-1ad22395ea92',
      '1532708059644-5590ed51ce4c',
      '1516483638261-f4dbaf036963',
      '1523906834658-6e24ef23a6f8'
    ][Math.floor(Math.random() * 6)]}?w=400&auto=format&fit=crop`,
    content: '여행에 대한 자유로운 이야기를 나누는 공간입니다. 서로의 경험을 공유해보세요!'
  })),
  qna: Array.from({ length: 15 }).map((_, i) => ({
    id: i + 1,
    title: `질문있습니다 ${i + 1}`,
    author: `질문자${i + 1}`,
    level: Math.floor(Math.random() * 3) + 1,
    likes: Math.floor(Math.random() * 50),
    dislikes: Math.floor(Math.random() * 10),
    comments: Math.floor(Math.random() * 20),
    views: Math.floor(Math.random() * 500),
    createdAt: `${Math.floor(Math.random() * 24) + 1}시간 전`,
    isAnswered: Math.random() > 0.5,
    image: `https://images.unsplash.com/photo-${[
      '1519451241324-207a7ae3992c',
      '1512403754473-27835f7b9984',
      '1504150558240-0b4fd8946625',
      '1494232410401-ad00d5433cfa'
    ][Math.floor(Math.random() * 4)]}?w=400&auto=format&fit=crop`,
    content: '궁금한 점이 있어서 질문드립니다. 답변 부탁드려요!'
  })),
  mate: Array.from({ length: 15 }).map((_, i) => ({
    id: i + 1,
    title: `동행 구합니다 ${i + 1}`,
    author: `동행자${i + 1}`,
    level: Math.floor(Math.random() * 5) + 1,
    likes: Math.floor(Math.random() * 30),
    dislikes: Math.floor(Math.random() * 5),
    comments: Math.floor(Math.random() * 10),
    views: Math.floor(Math.random() * 20),
    createdAt: `${Math.floor(Math.random() * 24) + 1}시간 전`,
    participants: Math.floor(Math.random() * 3) + 1,
    maxParticipants: 4,
    status: Math.random() > 0.3 ? 'recruiting' : 'closed',
    image: `https://images.unsplash.com/photo-${[
      '1527631746610-bca00a040d60',
      '1530789253388-582c481c54b0',
      '1523906834658-6e24ef23a6f8',
      '1501785888041-af3ef285b470'
    ][Math.floor(Math.random() * 4)]}?w=400&auto=format&fit=crop`,
    content: '함께 여행하실 분을 찾습니다. 일정 조율 가능합니다.'
  })),
  recommend: Array.from({ length: 15 }).map((_, i) => ({
    id: i + 1,
    title: `[${['제주', '서울', '부산', '강릉'][Math.floor(Math.random() * 4)]}] ${['진짜 맛있는 횟집', '분위기 좋은 카페', '노을 명소', '숨겨진 야경포인트'][Math.floor(Math.random() * 4)]} 추천합니다!`,
    author: `추천왕${i + 1}`,
    level: Math.floor(Math.random() * 5) + 1,
    likes: Math.floor(Math.random() * 200),
    dislikes: Math.floor(Math.random() * 5),
    comments: Math.floor(Math.random() * 30),
    views: Math.floor(Math.random() * 2000),
    createdAt: `${Math.floor(Math.random() * 24) + 1}시간 전`,
    image: `https://images.unsplash.com/photo-${[
      '1506744038136-46273834b3fb',
      '1501785888041-af3ef285b470',
      '1472396961695-1ad22395ea92',
      '1532708059644-5590ed51ce4c'
    ][Math.floor(Math.random() * 4)]}?w=400&auto=format&fit=crop`,
    location: ['제주도', '서울특별시', '부산광역시', '강원도'][Math.floor(Math.random() * 4)],
    rating: (Math.random() * 1.5 + 3.5).toFixed(1),
    content: '여기는 정말 제가 아껴둔 곳인데 공유합니다. 꼭 가보세요!'
  }))
};

export default function BoardList({ type, onBack, onNavigate }: BoardListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const getTitle = () => {
    switch (type) {
      case 'free': return '자유게시판';
      case 'qna': return 'Q&A';
      case 'mate': return '메이트 찾기';
      case 'recommend': return '장소 추천';
      default: return '게시판';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'free': return '자유롭게 여행 이야기를 나눠요';
      case 'qna': return '궁금한 점을 물어보세요';
      case 'mate': return '함께 여행할 동료를 찾아요';
      case 'recommend': return '나만 알고 싶은 숨은 명소를 공유해요';
      default: return '';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'free': return <MessageSquare className="w-6 h-6 text-[#1344FF]" />;
      case 'qna': return <HelpCircle className="w-6 h-6 text-orange-500" />;
      case 'mate': return <Users className="w-6 h-6 text-purple-500" />;
      case 'recommend': return <MapPin className="w-6 h-6 text-emerald-500" />;
      default: return null;
    }
  };

  const getIconBg = () => {
    switch (type) {
      case 'free': return 'bg-blue-50';
      case 'qna': return 'bg-orange-50';
      case 'mate': return 'bg-purple-50';
      case 'recommend': return 'bg-emerald-50';
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
  const hotPosts = [...posts].sort((a, b) => b.likes - a.likes).slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button 
          onClick={onBack}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#1a1a1a]" />
        </button>
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 ${getIconBg()} rounded-lg flex items-center justify-center`}>
            {getIcon()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1a1a1a]">{getTitle()}</h1>
            <p className="text-xs text-[#666666]">{getDescription()}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
        {[
          { id: 'free', label: '자유게시판', icon: MessageSquare },
          { id: 'qna', label: 'Q&A', icon: HelpCircle },
          { id: 'mate', label: '메이트 찾기', icon: Users },
          { id: 'recommend', label: '장소 추천', icon: MapPin },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = type === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate('board-list', { boardType: tab.id })}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'border-[#1344FF] text-[#1344FF]'
                  : 'border-transparent text-[#666666] hover:text-[#1a1a1a] hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#666666]" />
          <input
            type="text"
            placeholder={`${getTitle()} 내 검색...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1344FF] transition-colors bg-white text-sm shadow-sm"
          />
        </div>
        <button 
          onClick={() => onNavigate('community-create')}
          className="px-5 py-2 bg-[#1344FF] text-white rounded-lg hover:bg-[#0d34cc] transition-all shadow-sm font-medium text-sm flex items-center justify-center gap-2"
        >
          <PenTool className="w-4 h-4" />
          글쓰기
        </button>
      </div>

      {/* Hot Posts Summary */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <h2 className="font-bold text-[#1a1a1a]">지금 뜨는 핫글</h2>
              <p className="text-[10px] text-gray-400 font-medium">실시간 가장 반응이 뜨거운 게시글입니다</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-gray-400 hover:text-red-500 cursor-pointer transition-colors">전체보기</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hotPosts.map((post, index) => (
            <div 
              key={post.id}
              onClick={() => onNavigate(type === 'recommend' ? 'recommend-detail' : 'detail', { post: { ...post, category: type } })}
              className="group relative bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-100 hover:-translate-y-1 overflow-hidden"
            >
              {/* Background Accent */}
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 scale-150 blur-2xl" />
              
              <div className="relative z-10 flex justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-black italic ${
                        index === 0 ? 'text-red-500' : index === 1 ? 'text-orange-500' : 'text-amber-500'
                      }`}>
                        {index + 1}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="bg-red-50 text-red-600 text-[9px] font-black px-1.5 py-0.5 rounded-md tracking-tighter uppercase">HOT</span>
                        {type === 'qna' && (
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${(post as any).isAnswered ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                            {(post as any).isAnswered ? '답변완료' : '답변대기'}
                          </span>
                        )}
                        {type === 'mate' && (
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                            (post as any).status === 'closed' ? 'bg-gray-100 text-gray-500' : 'bg-purple-50 text-purple-600'
                          }`}>
                            {(post as any).status === 'closed' ? '모집완료' : `모집중 ${(post as any).participants}/${(post as any).maxParticipants}`}
                          </span>
                        )}
                        {type === 'recommend' && (
                          <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                            <Star className="w-2 h-2 fill-current" />
                            {(post as any).rating}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-300">
                      <Eye className="w-3 h-3" />
                      {post.views}
                    </div>
                  </div>

                  <h3 className="font-bold text-[13px] text-[#1a1a1a] mb-2 line-clamp-2 leading-snug group-hover:text-red-500 transition-colors h-9">
                    {post.title}
                  </h3>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-500">
                        {post.author[0]}
                      </div>
                      <span className="text-[11px] font-bold text-gray-600">{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5 text-red-500 font-black text-[11px]">
                        <ThumbsUp className="w-3 h-3 fill-current opacity-20" />
                        {post.likes}
                      </div>
                    </div>
                  </div>
                </div>
                {(post as any).image && (
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-gray-100 self-center">
                    <img src={(post as any).image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    {/* List */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="divide-y divide-gray-100">
        {posts.map((post) => (
          <div 
            key={post.id} 
            className="p-4 hover:bg-[#f8f9fa] transition-colors cursor-pointer flex justify-between gap-4"
            onClick={() => onNavigate(type === 'recommend' ? 'recommend-detail' : 'detail', { post: { ...post, category: type } })}
          >
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {type === 'qna' && post.isAnswered && (
                        <span className="px-1.5 py-0.5 bg-green-50 text-green-700 text-[10px] rounded font-medium">답변완료</span>
                      )}
                      {type === 'qna' && !post.isAnswered && (
                        <span className="px-1.5 py-0.5 bg-gray-50 text-gray-600 text-[10px] rounded font-medium">답변대기</span>
                      )}
                      {type === 'mate' && (
                        <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          post.status === 'closed' ? 'bg-gray-100 text-gray-500' : 'bg-blue-50 text-[#1344FF]'
                        }`}>
                          <Users className="w-2.5 h-2.5" />
                          {post.status === 'closed' ? '모집완료' : `${post.participants}/${post.maxParticipants}`}
                        </span>
                      )}
                      {type === 'recommend' && (
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] rounded font-medium flex items-center gap-0.5">
                            <MapPin className="w-2.5 h-2.5" />
                            {post.location}
                          </span>
                          <span className="px-1.5 py-0.5 bg-yellow-50 text-yellow-700 text-[10px] rounded font-medium flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-current" />
                            {post.rating}
                          </span>
                        </div>
                      )}
                      <h3 className="text-[15px] font-bold text-[#1a1a1a] hover:text-[#1344FF] transition-colors line-clamp-1">
                        {post.title}
                      </h3>
                    </div>
                    <p className="text-[#666666] text-xs line-clamp-1 mb-2">
                      {post.content}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-[11px] text-[#666666]">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#1a1a1a]">{post.author}</span>
                    {getLevelBadge(post.level)}
                    <span className="text-gray-200">|</span>
                    <span>{post.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3 text-[#1344FF]" />{post.likes}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3 text-[#666666]" />{post.comments}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-[#666666]" />{post.views}</span>
                  </div>
                </div>
              </div>
              {post.image && (
                <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 self-center">
                  <img src={post.image} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Pagination Mock */}
        <div className="p-4 border-t border-gray-100 flex justify-center gap-1">
          <button className="w-7 h-7 rounded-lg bg-[#1344FF] text-white flex items-center justify-center text-xs font-bold shadow-sm">1</button>
          <button className="w-7 h-7 rounded-lg hover:bg-gray-100 text-[#666666] flex items-center justify-center text-xs font-medium transition-colors">2</button>
          <button className="w-7 h-7 rounded-lg hover:bg-gray-100 text-[#666666] flex items-center justify-center text-xs font-medium transition-colors">3</button>
          <span className="text-gray-400 flex items-center px-1 text-xs">...</span>
        </div>
      </div>
    </div>
  );
}
