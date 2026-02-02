import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Copy, Clock, Award, Star, Search, Filter, SlidersHorizontal, X, MapPin } from 'lucide-react';

interface MainFeedProps {
  onNavigate: (view: any, data?: any) => void;
}

const MOCK_POSTS = [
  {
    id: 1,
    author: '여행러버',
    authorImage: 'https://images.unsplash.com/photo-1640960543409-dbe56ccc30e2?w=100&h=100&fit=crop',
    destination: '서울',
    image: 'https://images.unsplash.com/photo-1638496708881-cf7fb0a27196?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    title: '서울 3박 4일 완벽 여행 코스',
    description: '경복궁, 북촌한옥마을, 명동까지 핫플 다 담았어요!',
    tags: ['#뚜벅이최적화', '#동선낭비없는'],
    likes: 342,
    comments: 28,
    forks: 156,
    duration: '3박 4일',
    createdAt: '2일 전',
  },
  {
    id: 2,
    author: '제주도마스터',
    authorImage: 'https://images.unsplash.com/photo-1640960543409-dbe56ccc30e2?w=100&h=100&fit=crop',
    destination: '제주도',
    image: 'https://images.unsplash.com/photo-1674606042265-c9f03a77e286?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    title: '제주도 힐링 여행 루트',
    description: '카페, 해변, 맛집 위주로 느긋하게 다녀왔어요',
    tags: ['#여유로운P', '#극한의J'],
    likes: 289,
    comments: 34,
    forks: 203,
    duration: '4박 5일',
    createdAt: '5일 전',
  },
  {
    id: 3,
    author: '부산여행가',
    authorImage: 'https://images.unsplash.com/photo-1640960543409-dbe56ccc30e2?w=100&h=100&fit=crop',
    destination: '부산',
    image: 'https://images.unsplash.com/photo-1679054142611-5f0580dab94f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    title: '부산 바다 여행 완전정복',
    description: '해운대, 광안리, 송정해수욕장 완벽 동선',
    tags: ['#뚜벅이최적화', '#극한의J'],
    likes: 421,
    comments: 52,
    forks: 278,
    duration: '2박 3일',
    createdAt: '1주 전',
  },
];

export default function MainFeed({ onNavigate }: MainFeedProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // 필터 상태
  const [selectedRegion, setSelectedRegion] = useState<string>('전체');
  const [selectedDuration, setSelectedDuration] = useState<string>('전체');
  const [sortBy, setSortBy] = useState<string>('최신순');

  const tags = ['#뚜벅이최적화', '#극한의J', '#여유로운P', '#동선낭비없는'];
  const regions = ['전체', '서울', '부산', '제주도', '강릉', '경주', '전주'];
  const durations = ['전체', '1일', '2-3일', '4일 이상'];
  const sortOptions = ['최신순', '인기순', '좋아요순', 'Fork순'];

  // 필터링 로직
  let filteredPosts = MOCK_POSTS;

  // 태그 필터
  if (selectedTag) {
    filteredPosts = filteredPosts.filter(post => post.tags.includes(selectedTag));
  }

  // 지역 필터
  if (selectedRegion !== '전체') {
    filteredPosts = filteredPosts.filter(post => post.destination === selectedRegion);
  }

  // 기간 필터
  if (selectedDuration !== '전체') {
    filteredPosts = filteredPosts.filter(post => {
      if (selectedDuration === '1일') return post.duration.includes('1일');
      if (selectedDuration === '2-3일') return post.duration.includes('2박') || post.duration.includes('3박');
      if (selectedDuration === '4일 이상') return post.duration.includes('4박') || post.duration.includes('5박');
      return true;
    });
  }

  // 검색 필터
  if (searchQuery) {
    filteredPosts = filteredPosts.filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // 정렬
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === '인기순') return b.forks - a.forks;
    if (sortBy === '좋아요순') return b.likes - a.likes;
    if (sortBy === 'Fork순') return b.forks - a.forks;
    return 0; // 최신순은 기본 순서
  });

  const handleLike = (postId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleFork = (post: any, e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`"${post.title}" 여행 일정을 복제했습니다! 나만의 일정으로 수정해보세요.`);
  };

  const clearFilters = () => {
    setSelectedRegion('전체');
    setSelectedDuration('전체');
    setSortBy('최신순');
    setSelectedTag(null);
    setSearchQuery('');
  };

  const activeFilterCount = 
    (selectedRegion !== '전체' ? 1 : 0) +
    (selectedDuration !== '전체' ? 1 : 0) +
    (sortBy !== '최신순' ? 1 : 0) +
    (selectedTag ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 헤더 섹션 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">
          가져가는 여행기
        </h1>
        <p className="text-[#666666]">
          읽는 여행기가 아니라, 가져가는 여행기. 마음에 드는 일정을 Fork하고 나만의 여행으로 만들어보세요.
        </p>
      </div>

      {/* 검색 & 필터 바 */}
      <div className="mb-6">
        <div className="flex gap-3">
          {/* 검색 바 */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#666666]" />
            <input
              type="text"
              placeholder="제목, 지역, 작성자로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-[#e5e7eb] rounded-xl bg-white focus:outline-none focus:border-[#1344FF] transition-colors shadow-sm"
            />
          </div>
          
          {/* 필터 토글 버튼 */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all font-medium ${
              showFilters || activeFilterCount > 0
                ? 'bg-[#1344FF] text-white border-[#1344FF] shadow-md'
                : 'bg-white text-[#666666] border-[#e5e7eb] hover:border-[#1344FF]'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>필터</span>
            {activeFilterCount > 0 && (
              <span className="bg-white text-[#1344FF] px-2 py-0.5 rounded-full text-xs font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 필터 패널 */}
      {showFilters && (
        <div className="mb-6 bg-white rounded-xl shadow-md p-6 border border-[#e5e7eb]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#1a1a1a]">상세 필터</h3>
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-[#666666] hover:text-[#1344FF] transition-colors"
            >
              <X className="w-4 h-4" />
              초기화
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 지역 필터 */}
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-3">지역</label>
              <div className="flex flex-wrap gap-2">
                {regions.map(region => (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(region)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      selectedRegion === region
                        ? 'bg-[#1344FF] text-white shadow-sm'
                        : 'bg-[#f8f9fa] text-[#666666] hover:bg-[#e5e7eb]'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            {/* 기간 필터 */}
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-3">여행 기간</label>
              <div className="flex flex-wrap gap-2">
                {durations.map(duration => (
                  <button
                    key={duration}
                    onClick={() => setSelectedDuration(duration)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      selectedDuration === duration
                        ? 'bg-[#1344FF] text-white shadow-sm'
                        : 'bg-[#f8f9fa] text-[#666666] hover:bg-[#e5e7eb]'
                    }`}
                  >
                    {duration}
                  </button>
                ))}
              </div>
            </div>

            {/* 정렬 필터 */}
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-3">정렬</label>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => setSortBy(option)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      sortBy === option
                        ? 'bg-[#1344FF] text-white shadow-sm'
                        : 'bg-[#f8f9fa] text-[#666666] hover:bg-[#e5e7eb]'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 태그 필터 */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-4 py-2 rounded-full transition-all ${
              selectedTag === null
                ? 'bg-[#1344FF] text-white shadow-md'
                : 'bg-white text-[#666666] border border-[#e5e7eb] hover:border-[#1344FF]'
            }`}
          >
            전체
          </button>
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-full transition-all ${
                selectedTag === tag
                  ? 'bg-[#1344FF] text-white shadow-md'
                  : 'bg-white text-[#666666] border border-[#e5e7eb] hover:border-[#1344FF]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 검색 결과 */}
      {(searchQuery || activeFilterCount > 0) && (
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-[#666666]">
            <span className="font-bold text-[#1344FF]">{sortedPosts.length}개</span>의 여행기를 찾았습니다
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 메인 피드 */}
        <div className="lg:col-span-2 space-y-6">
          {sortedPosts.length > 0 ? (
            sortedPosts.map(post => (
              <div
                key={post.id}
                onClick={() => onNavigate('detail', { post })}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer"
              >
                {/* 이미지 */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-[#1a1a1a] shadow-md">
                    {post.destination}
                  </div>
                </div>

                {/* 콘텐츠 */}
                <div className="p-6">
                  {/* 작성자 정보 */}
                  <div className="flex items-center mb-4">
                    <img
                      src={post.authorImage}
                      alt={post.author}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-medium text-[#1a1a1a]">{post.author}</p>
                      <p className="text-sm text-[#666666]">{post.createdAt}</p>
                    </div>
                  </div>

                  {/* 제목 & 설명 */}
                  <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">
                    {post.title}
                  </h3>
                  <p className="text-[#666666] mb-4">
                    {post.description}
                  </p>

                  {/* 태그 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-[#f8f9fa] text-[#1344FF] text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="px-3 py-1 bg-[#f8f9fa] text-[#666666] text-sm rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.duration}
                    </span>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#e5e7eb]">
                    <div className="flex items-center gap-6">
                      <button
                        onClick={(e) => handleLike(post.id, e)}
                        className={`flex items-center gap-2 transition-colors ${
                          likedPosts.has(post.id)
                            ? 'text-red-500'
                            : 'text-[#666666] hover:text-red-500'
                        }`}
                      >
                        <Heart
                          className={`w-5 h-5 ${likedPosts.has(post.id) ? 'fill-current' : ''}`}
                        />
                        <span>{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                      </button>
                      <button className="flex items-center gap-2 text-[#666666] hover:text-[#1344FF] transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span>{post.comments}</span>
                      </button>
                    </div>
                    <button
                      onClick={(e) => handleFork(post, e)}
                      className="flex items-center gap-2 bg-[#1344FF] text-white px-5 py-2 rounded-lg hover:bg-[#0d34cc] transition-all shadow-sm"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Fork</span>
                      <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">
                        {post.forks}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Search className="w-16 h-16 text-[#e5e7eb] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">검색 결과가 없습니다</h3>
              <p className="text-[#666666] mb-6">다른 검색어나 필터를 시도해보세요</p>
              <button
                onClick={clearFilters}
                className="bg-[#1344FF] text-white px-6 py-2 rounded-lg hover:bg-[#0d34cc] transition-all"
              >
                필터 초기화
              </button>
            </div>
          )}
        </div>

        {/* 사이드바 */}
        <div className="space-y-6">
          {/* 여행지 지도 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-[#1344FF]" />
              <h3 className="text-lg font-bold text-[#1a1a1a]">여행지 지도</h3>
            </div>
            
            {/* 간단한 한국 지도 */}
            <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 mb-4 h-64 overflow-hidden">
              {/* 서울 */}
              <div 
                className="absolute top-[25%] left-[48%] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ zIndex: 10 }}
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-[#1344FF] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg group-hover:scale-110 transition-transform">
                    1
                  </div>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-2 py-1 rounded shadow-md whitespace-nowrap text-xs font-medium">
                    서울 (1개)
                  </div>
                </div>
              </div>

              {/* 부산 */}
              <div 
                className="absolute bottom-[25%] right-[28%] transform translate-x-1/2 translate-y-1/2 cursor-pointer group"
                style={{ zIndex: 10 }}
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-[#1344FF] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg group-hover:scale-110 transition-transform">
                    1
                  </div>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-2 py-1 rounded shadow-md whitespace-nowrap text-xs font-medium">
                    부산 (1개)
                  </div>
                </div>
              </div>

              {/* 제주도 */}
              <div 
                className="absolute bottom-[8%] left-[35%] transform -translate-x-1/2 translate-y-1/2 cursor-pointer group"
                style={{ zIndex: 10 }}
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-[#1344FF] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg group-hover:scale-110 transition-transform">
                    1
                  </div>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-2 py-1 rounded shadow-md whitespace-nowrap text-xs font-medium">
                    제주도 (1개)
                  </div>
                </div>
              </div>

              {/* 한국 지도 실루엣 (간단한 SVG) */}
              <svg viewBox="0 0 200 250" className="w-full h-full opacity-20" style={{ position: 'absolute', top: 0, left: 0 }}>
                <path d="M100,20 L120,30 L130,50 L125,80 L135,100 L130,120 L140,140 L135,160 L125,170 L120,180 L110,185 L100,190 L90,185 L80,180 L75,170 L65,160 L60,140 L70,120 L65,100 L75,80 L70,50 L80,30 Z M70,200 Q80,210 90,205 Q80,215 70,210 Z" fill="currentColor" className="text-gray-300" />
              </svg>
            </div>

            {/* 지역 목록 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-[#f8f9fa] rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#1344FF] rounded-full"></div>
                  <span className="font-medium text-[#1a1a1a]">서울</span>
                </div>
                <span className="text-sm text-[#666666]">1개</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#f8f9fa] rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#1344FF] rounded-full"></div>
                  <span className="font-medium text-[#1a1a1a]">제주도</span>
                </div>
                <span className="text-sm text-[#666666]">1개</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#f8f9fa] rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#1344FF] rounded-full"></div>
                  <span className="font-medium text-[#1a1a1a]">부산</span>
                </div>
                <span className="text-sm text-[#666666]">1개</span>
              </div>
            </div>
          </div>

          {/* 사용자 레벨 시스템 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-[#1344FF]" />
              <h3 className="text-lg font-bold text-[#1a1a1a]">사용자 레벨</h3>
            </div>
            <div className="space-y-4">
              {/* 레벨 설명 */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#1344FF] to-[#7c3aed] rounded-full flex items-center justify-center text-white font-bold">
                    Lv.2
                  </div>
                  <div>
                    <p className="font-bold text-[#1a1a1a]">여행 애호가</p>
                    <p className="text-sm text-[#666666]">50-99 Forks</p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#666666]">진행도</span>
                    <span className="font-medium text-[#1344FF]">78/100 Forks</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-[#1344FF] to-[#7c3aed] h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <p className="text-xs text-[#666666] mt-1">다음 레벨까지 22 Forks 남았어요!</p>
                </div>
              </div>

              {/* 레벨 목록 */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                  <Star className="w-4 h-4 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-400">Lv.1 여행 입문자</p>
                    <p className="text-xs text-gray-400">0-49 Forks</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-50 border-2 border-[#1344FF]">
                  <Star className="w-4 h-4 text-[#1344FF] fill-current" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1344FF]">Lv.2 여행 애호가</p>
                    <p className="text-xs text-[#1344FF]">50-99 Forks</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg">
                  <Star className="w-4 h-4 text-[#666666]" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#666666]">Lv.3 여행 전문가</p>
                    <p className="text-xs text-[#666666]">100-199 Forks</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg">
                  <Star className="w-4 h-4 text-[#666666]" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#666666]">Lv.4 여행 마스터</p>
                    <p className="text-xs text-[#666666]">200-499 Forks</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg">
                  <Star className="w-4 h-4 text-amber-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#666666]">Lv.5 여행 레전드</p>
                    <p className="text-xs text-[#666666]">500+ Forks</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 커뮤니티 바로가기 */}
          <div className="bg-gradient-to-br from-[#1344FF] to-[#0d34cc] rounded-xl shadow-md p-6 text-white">
            <h3 className="text-lg font-bold mb-2">커뮤니티에 참여하세요!</h3>
            <p className="text-sm mb-4 text-white/90">
              자유게시판, Q&A, 메이트 찾기까지
            </p>
            <button
              onClick={() => onNavigate('community')}
              className="w-full bg-white text-[#1344FF] py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              커뮤니티 가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}