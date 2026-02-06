import { Clock, Copy, Filter, Eye, MessageCircle, Search, Shield, TrendingUp, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import { mockPosts } from '../../data/mockData';
import { TravelPost } from '../../types/planmate2';

type FeedProps = {
  onViewPost: (post: TravelPost) => void;
};

const tags = [
  { id: 'all', label: '전체', emoji: '🌍' },
  { id: 'walking', label: '뚜벅이최적화', emoji: '👟' },
  { id: 'j-type', label: '극한의J', emoji: '⚡' },
  { id: 'p-type', label: '여유로운P', emoji: '☕' },
  { id: 'optimal', label: '동선낭비없는', emoji: '🎯' },
];

export function Feed({ onViewPost }: FeedProps) {
  const [selectedTag, setSelectedTag] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = mockPosts.filter((post) => {
    const matchesTag = selectedTag === 'all' || post.tags.includes(selectedTag);
    const matchesSearch =
      searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  // Best planners this week
  const bestPlanners = [
    { name: '제주러버', forkCount: 234, avatar: '🏝️' },
    { name: '부산토박이', forkCount: 189, avatar: '🌊' },
    { name: '서울워커', forkCount: 156, avatar: '🏙️' },
  ];

  const hotPosts = [...mockPosts]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">가져가는 여행기</h1>
              <p className="text-xs text-gray-500">계획은 1초 만에, 여행은 100% 즐겁게</p>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Filter className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="지역, 테마로 검색해보세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1344FF] focus:border-[#1344FF]"
            />
          </div>
        </div>
      </div>

      {/* Best Planners Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-[#1344FF]" />
            <h2 className="font-bold text-sm text-gray-900">이번 주 베스트 플래너</h2>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {bestPlanners.map((planner, index) => (
              <div
                key={planner.name}
                className="flex-shrink-0 bg-white rounded-lg p-3 shadow-sm border border-blue-100 min-w-[140px]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="text-2xl">{planner.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <p className="font-bold text-xs text-gray-900">{planner.name}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[#1344FF]">
                      <Copy className="w-3 h-3" />
                      <p className="text-[10px] font-bold">{planner.forkCount}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hot Posts Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-red-500" />
            <h2 className="font-bold text-gray-900">실시간 인기 핫스테이</h2>
            <span className="bg-red-50 text-red-500 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">HOT</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hotPosts.map((post, index) => (
              <div 
                key={post.id}
                onClick={() => onViewPost(post)}
                className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-100 hover:border-red-100 hover:bg-red-50/10 transition-all cursor-pointer group"
              >
                <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden">
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-md text-white w-6 h-6 flex items-center justify-center rounded text-xs font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold text-[#1344FF] bg-blue-50 px-1.5 py-0.5 rounded">{post.location}</span>
                    <span className="text-[10px] text-gray-400 font-medium">{post.duration}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-1 group-hover:text-red-500 transition-colors">{post.title}</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                      <Eye className="w-3.5 h-3.5" />
                      {post.viewCount.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-[#1344FF] font-bold">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      {post.likeCount}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {post.commentCount}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tags Filter */}
      <div className="bg-white border-b border-gray-100 sticky top-[113px] z-30">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => setSelectedTag(tag.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedTag === tag.id
                    ? 'bg-[#1344FF] text-white shadow-sm'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'
                }`}
              >
                <span className="mr-1">{tag.emoji}</span>
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onViewPost(post)}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden border border-gray-100"
            >
              {/* Cover Image */}
              <div className="relative h-40 bg-gray-100">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                {post.verified && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 shadow-sm">
                    <Shield className="w-3 h-3" />
                    인증
                  </div>
                )}
                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="bg-white/90 backdrop-blur-sm text-gray-800 px-1.5 py-0.5 rounded text-[10px] font-bold"
                    >
                      {tag === 'walking' && '👟 뚜벅이'}
                      {tag === 'j-type' && '⚡ 극한J'}
                      {tag === 'p-type' && '☕ 여유P'}
                      {tag === 'optimal' && '🎯 최적화'}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-gray-900 mb-0.5 line-clamp-1">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                      <div className="flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-[#1344FF]" />
                        <span>{post.location}</span>
                      </div>
                      <div className="flex items-center gap-0.5 ml-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-50">
                  <div className="w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center text-[#1344FF] font-bold text-[10px]">
                    {post.author[0]}
                  </div>
                  <span className="text-[11px] text-gray-600 font-bold">{post.author}</span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3 text-[10px] text-gray-400">
                  <span className="flex items-center gap-0.5">
                    <ThumbsUp className="w-3 h-3 text-[#1344FF]" />
                    <span className="text-[#1344FF] font-bold">{post.likeCount}</span>
                  </span>
                  <span className="flex items-center gap-0.5">
                    <MessageCircle className="w-3 h-3" />
                    <span>{post.commentCount}</span>
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Eye className="w-3 h-3" />
                    <span>{post.viewCount}</span>
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Copy className="w-3 h-3" />
                    <span>{post.forkCount}</span>
                  </span>
                  <span className="ml-auto">
                    {post.createdAt}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">해당하는 여행 계획이 없습니다</p>
            <p className="text-gray-400 text-sm mt-2">다른 태그나 검색어를 시도해보세요</p>
          </div>
        )}
      </div>
    </div>
  );
}