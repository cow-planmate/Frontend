import { useState } from 'react';
import { TravelPost } from '../App';
import { Search, Filter, TrendingUp, MapPin, Clock, Copy, Heart, Shield } from 'lucide-react';
import { mockPosts } from '../data/mockData';

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">가져가는 여행기</h1>
              <p className="text-sm text-gray-600">계획은 1초 만에, 여행은 100% 즐겁게</p>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="지역, 테마로 검색해보세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1344FF] focus:border-[#1344FF]"
            />
          </div>
        </div>
      </div>

      {/* Best Planners Section */}
      <div className="bg-gradient-to-r from-[#E8EDFF] to-[#F0F4FF] border-b border-blue-100">
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#1344FF]" />
            <h2 className="font-bold text-gray-900">이번 주 베스트 플래너</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {bestPlanners.map((planner, index) => (
              <div
                key={planner.name}
                className="flex-shrink-0 bg-white rounded-xl p-4 shadow-sm border border-blue-100 min-w-[160px]"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-3xl">{planner.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      {index === 0 && <span className="text-lg">🥇</span>}
                      {index === 1 && <span className="text-lg">🥈</span>}
                      {index === 2 && <span className="text-lg">🥉</span>}
                      <p className="font-semibold text-sm text-gray-900">{planner.name}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[#1344FF]">
                      <Copy className="w-3 h-3" />
                      <p className="text-xs font-bold">{planner.forkCount}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tags Filter */}
      <div className="bg-white border-b border-gray-200 sticky top-[140px] z-30">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => setSelectedTag(tag.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTag === tag.id
                    ? 'bg-[#1344FF] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onViewPost(post)}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden border border-gray-200"
            >
              {/* Cover Image */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                {post.verified && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 shadow-md">
                    <Shield className="w-3 h-3" />
                    검증된 코스
                  </div>
                )}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-lg text-xs font-medium"
                    >
                      {tag === 'walking' && '👟 뚜벅이'}
                      {tag === 'j-type' && '⚡ 극한의J'}
                      {tag === 'p-type' && '☕ 여유로운P'}
                      {tag === 'optimal' && '🎯 최적화'}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{post.location}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#1344FF] to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {post.author[0]}
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{post.author}</span>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Copy className="w-5 h-5 text-[#1344FF]" />
                      <span className="text-lg font-bold text-[#1344FF]">{post.forkCount}</span>
                      <span className="text-xs text-gray-500">가져감</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{post.likeCount}</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-[#1344FF] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm active:translate-y-[2px]">
                    가져가기
                  </button>
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