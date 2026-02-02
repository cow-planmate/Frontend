import React, { useState } from 'react';
import { MessageSquare, HelpCircle, Users, MessageCircle, Clock, Search, ChevronRight, Flame, Eye, ThumbsUp } from 'lucide-react';

interface CommunityTabProps {
  initialTab?: string;
  onNavigate: (view: any, data?: any) => void;
}

const COMMUNITY_POSTS = {
  free: [
    { id: 1, title: '제주도 숨은 맛집 공유합니다!', author: '맛집탐험가', level: 3, likes: 45, comments: 12, views: 320, createdAt: '2시간 전' },
    { id: 2, title: '다음달 강릉 여행 가는데 추천 부탁드려요', author: '여행초보', level: 1, likes: 23, comments: 18, views: 156, createdAt: '5시간 전' },
    { id: 3, title: '국내 여행 베스트 시즌 정리', author: '여행플래너', level: 4, likes: 89, comments: 24, views: 542, createdAt: '1일 전' },
  ],
  qna: [
    { id: 4, title: '부산에서 서울까지 KTX vs 비행기 뭐가 나을까요?', author: '교통고민', level: 2, likes: 34, comments: 27, views: 289, createdAt: '3시간 전', isAnswered: true },
    { id: 5, title: '렌터카 보험 꼭 들어야 하나요?', author: '렌터카초보', level: 1, likes: 56, comments: 41, views: 412, createdAt: '7시간 전', isAnswered: true },
    { id: 6, title: '혼자 여행 처음인데 안전한 지역 추천해주세요', author: '솔로트래블러', level: 2, likes: 67, comments: 35, views: 378, createdAt: '1일 전', isAnswered: false },
  ],
  mate: [
    { id: 7, title: '[3월 중순] 제주도 3박4일 같이 가실 분!', author: '제주러버', level: 3, likes: 12, comments: 8, views: 145, createdAt: '1시간 전', participants: 2, maxParticipants: 4 },
    { id: 8, title: '[4월 초] 경주 역사 탐방 메이트 구합니다', author: '역사매니아', level: 4, likes: 18, comments: 14, views: 198, createdAt: '4시간 전', participants: 1, maxParticipants: 3 },
    { id: 9, title: '[이번 주말] 속초 맛집 투어 같이 가요!', author: '먹방러버', level: 2, likes: 29, comments: 22, views: 267, createdAt: '6시간 전', participants: 3, maxParticipants: 4 },
  ],
};

export default function CommunityTab({ initialTab = 'free', onNavigate }: CommunityTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingPeriod, setTrendingPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

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
      <span className={`px-2 py-0.5 rounded text-xs font-bold ${levelInfo.color}`}>
        {levelInfo.label}
      </span>
    );
  };

  const TRENDING_POSTS = {
    daily: [
      { id: 1, title: '제주도 숨은 맛집 공유합니다!', author: '맛집탐험가', level: 3, likes: 245, comments: 67, views: 1520, createdAt: '2시간 전' },
      { id: 2, title: '부산 3박 4일 완벽 코스 정리', author: '부산러버', level: 4, likes: 198, comments: 52, views: 1340, createdAt: '3시간 전' },
      { id: 3, title: '강릉 카페 투어 추천', author: '카페매니아', level: 2, likes: 167, comments: 43, views: 1120, createdAt: '5시간 전' },
      { id: 4, title: '서울 핫플 총정리', author: '서울탐방', level: 3, likes: 142, comments: 38, views: 980, createdAt: '7시간 전' },
      { id: 5, title: '전주 한옥마을 여행 팁', author: '전주여행가', level: 2, likes: 128, comments: 31, views: 856, createdAt: '9시간 전' },
    ],
    weekly: [
      { id: 6, title: '국내 여행 베스트 시즌 정리', author: '여행플래너', level: 4, likes: 892, comments: 156, views: 5420, createdAt: '1일 전' },
      { id: 7, title: '혼자 여행하기 좋은 곳 TOP 10', author: '솔로트래블러', level: 3, likes: 756, comments: 134, views: 4780, createdAt: '2일 전' },
      { id: 8, title: '렌터카 vs 대중교통 비용 비교', author: '여행경제', level: 4, likes: 623, comments: 112, views: 3890, createdAt: '3일 전' },
      { id: 9, title: '제주도 숙소 추천 완전정복', author: '제주마스터', level: 5, likes: 589, comments: 98, views: 3560, createdAt: '4일 전' },
      { id: 10, title: '부산 야경 맛집 베스트', author: '야경러버', level: 3, likes: 534, comments: 87, views: 3120, createdAt: '5일 전' },
    ],
    monthly: [
      { id: 11, title: '2024년 가볼만한 국내 여행지', author: '여행전문가', level: 5, likes: 2340, comments: 421, views: 15680, createdAt: '1주 전' },
      { id: 12, title: '여행 경비 절약 꿀팁 모음', author: '알뜰여행', level: 4, likes: 1987, comments: 356, views: 13420, createdAt: '1주 전' },
      { id: 13, title: '사진 맛집 여행지 총정리', author: '사진작가', level: 5, likes: 1756, comments: 298, views: 11230, createdAt: '2주 전' },
      { id: 14, title: '국내 여행 필수 앱 추천', author: 'IT여행러', level: 4, likes: 1623, comments: 267, views: 10540, createdAt: '2주 전' },
      { id: 15, title: '봄 여행 추천 코스 완벽 가이드', author: '봄여행', level: 4, likes: 1489, comments: 234, views: 9870, createdAt: '3주 전' },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">커뮤니티</h1>
        <p className="text-[#666666]">여행 정보를 나누고, 질문하고, 함께 여행할 메이트를 찾아보세요.</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#666666]" />
          <input
            type="text"
            placeholder="게시글 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1344FF] transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl shadow-md p-6 border-2 border-orange-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1a1a1a]">화제성 글 TOP 5</h2>
                  <p className="text-sm text-[#666666]">가장 인기있는 게시글을 확인하세요</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setTrendingPeriod('daily')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${trendingPeriod === 'daily' ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-md' : 'bg-white text-[#666666] hover:bg-orange-100'}`}>일일</button>
                <button onClick={() => setTrendingPeriod('weekly')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${trendingPeriod === 'weekly' ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-md' : 'bg-white text-[#666666] hover:bg-orange-100'}`}>주간</button>
                <button onClick={() => setTrendingPeriod('monthly')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${trendingPeriod === 'monthly' ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-md' : 'bg-white text-[#666666] hover:bg-orange-100'}`}>월간</button>
              </div>
            </div>
            
            <div className="space-y-3">
              {TRENDING_POSTS[trendingPeriod].map((post, index) => (
                <div key={post.id} className="bg-white p-4 rounded-lg hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex gap-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-lg font-bold text-lg flex-shrink-0 ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-md' : index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white shadow-md' : index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-md' : 'bg-[#f8f9fa] text-[#666666]'}`}>{index + 1}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#1a1a1a] group-hover:text-[#1344FF] transition-colors mb-2">{post.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-[#666666]">
                        <span className="font-medium">{post.author}</span>
                        {getLevelBadge(post.level)}
                        <span className="flex items-center gap-1"><ThumbsUp className="w-4 h-4 text-[#1344FF]" /><span className="font-medium text-[#1344FF]">{post.likes.toLocaleString()}</span></span>
                        <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" />{post.comments}</span>
                        <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{post.views.toLocaleString()}</span>
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{post.createdAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 자유게시판 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center"><MessageSquare className="w-6 h-6 text-[#1344FF]" /></div>
                <div><h2 className="text-xl font-bold text-[#1a1a1a]">자유게시판</h2><p className="text-sm text-[#666666]">자유롭게 여행 이야기를 나눠요</p></div>
              </div>
              <button 
                onClick={() => onNavigate('board-list', { boardType: 'free' })}
                className="text-[#1344FF] hover:text-[#0d34cc] font-medium flex items-center gap-1"
              >
                더보기 <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {COMMUNITY_POSTS.free.map(post => (
                <div key={post.id} className="flex items-center justify-between p-4 hover:bg-[#f8f9fa] rounded-lg transition-colors cursor-pointer">
                  <div className="flex-1">
                    <h3 className="font-medium text-[#1a1a1a] mb-1">{post.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-[#666666]">
                      <span className="font-medium">{post.author}</span>
                      {getLevelBadge(post.level)}
                      <span className="flex items-center gap-1"><ThumbsUp className="w-4 h-4 text-[#1344FF]" /><span className="font-medium text-[#1344FF]">{post.likes.toLocaleString()}</span></span>
                      <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" />{post.comments}</span>
                      <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{post.views.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{post.createdAt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 메이트 찾기 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center"><Users className="w-6 h-6 text-purple-500" /></div>
                <div><h2 className="text-xl font-bold text-[#1a1a1a]">메이트 찾기</h2><p className="text-sm text-[#666666]">함께 여행할 동료를 찾아요</p></div>
              </div>
              <button 
                onClick={() => onNavigate('board-list', { boardType: 'mate' })}
                className="text-[#1344FF] hover:text-[#0d34cc] font-medium flex items-center gap-1"
              >
                더보기 <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {COMMUNITY_POSTS.mate.map(post => (
                <div key={post.id} className="flex items-center justify-between p-4 hover:bg-[#f8f9fa] rounded-lg transition-colors cursor-pointer">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-[#1a1a1a]">{post.title}</h3>
                      <div className="flex items-center gap-1 text-[#1344FF] bg-blue-50 px-2 py-0.5 rounded-full text-xs font-medium"><Users className="w-3 h-3" />{post.participants}/{post.maxParticipants}</div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[#666666]">
                      <div className="flex items-center gap-2"><span>{post.author}</span>{getLevelBadge(post.level)}</div>
                      <span className="flex items-center gap-1"><ThumbsUp className="w-4 h-4 text-[#1344FF]" />{post.likes}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" />{post.comments}</span>
                      <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{post.views.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{post.createdAt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Q&A */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center"><HelpCircle className="w-6 h-6 text-orange-500" /></div>
                <div><h2 className="text-xl font-bold text-[#1a1a1a]">Q&A</h2><p className="text-sm text-[#666666]">궁금한 점을 물어보세요</p></div>
              </div>
              <button 
                onClick={() => onNavigate('board-list', { boardType: 'qna' })}
                className="text-[#1344FF] hover:text-[#0d34cc] font-medium flex items-center gap-1"
              >
                더보기 <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {COMMUNITY_POSTS.qna.map(post => (
                <div key={post.id} className="flex items-center justify-between p-4 hover:bg-[#f8f9fa] rounded-lg transition-colors cursor-pointer">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-[#1a1a1a]">{post.title}</h3>
                      {post.isAnswered && (<span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">답변완료</span>)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[#666666]">
                      <div className="flex items-center gap-2"><span>{post.author}</span>{getLevelBadge(post.level)}</div>
                      <span className="flex items-center gap-1"><ThumbsUp className="w-4 h-4 text-[#1344FF]" />{post.likes}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" />{post.comments}</span>
                      <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{post.views}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{post.createdAt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full bg-[#1344FF] text-white py-4 rounded-xl hover:bg-[#0d34cc] transition-all shadow-md font-medium">+ 새 글 작성하기</button>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">커뮤니티 가이드</h3>
            <ul className="space-y-3 text-sm text-[#666666]">
              <li className="flex items-start gap-2"><span className="text-[#1344FF]">•</span><span>서로 존중하는 댓글 문화를 만들어요</span></li>
              <li className="flex items-start gap-2"><span className="text-[#1344FF]">•</span><span>여행 정보는 구체적으로 공유해주세요</span></li>
              <li className="flex items-start gap-2"><span className="text-[#1344FF]">•</span><span>메이트 찾기는 안전을 최우선으로!</span></li>
              <li className="flex items-start gap-2"><span className="text-[#1344FF]">•</span><span>광고성 게시글은 삭제될 수 있어요</span></li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">인기 태그</h3>
            <div className="flex flex-wrap gap-2">
              {['제주도', '부산', '강릉', '경주', '전주', '속초', '여수', '춘천'].map(tag => (
                <button key={tag} className="px-3 py-1 bg-[#f8f9fa] text-[#666666] rounded-full text-sm hover:bg-[#1344FF] hover:text-white transition-all">#{tag}</button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1344FF] to-[#0d34cc] rounded-xl shadow-md p-6 text-white">
            <h3 className="text-lg font-bold mb-4">커뮤니티 현황</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center"><span className="text-white/90">전체 게시글</span><span className="text-2xl font-bold">1,234</span></div>
              <div className="flex justify-between items-center"><span className="text-white/90">활동 회원</span><span className="text-2xl font-bold">567</span></div>
              <div className="flex justify-between items-center"><span className="text-white/90">오늘 작성된 글</span><span className="text-2xl font-bold">28</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}