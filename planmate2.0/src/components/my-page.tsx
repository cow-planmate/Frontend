import React, { useState } from 'react';
import { Settings, LogOut, Award, Star, Calendar as CalendarIcon, CalendarDays, MapPin, Heart, MessageCircle, Copy, ChevronDown, BookOpen, MessageSquare, HelpCircle, Users, ThumbsUp, Eye, PenTool } from 'lucide-react';

interface MyPageProps {
  onNavigate: (view: any, data?: any) => void;
}

// Helper to generate dates between start and end
const getDatesInRange = (startDate: Date, endDate: Date) => {
  const date = new Date(startDate.getTime());
  const dates = [];
  while (date <= endDate) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return dates;
};

const SCHEDULED_TRIPS = [
  {
    id: 1,
    title: '제주도 힐링 여행',
    startDate: new Date(2024, 4, 10), // 2024-05-10
    endDate: new Date(2024, 4, 12),
    dateStr: '2024년 5월 10일 - 12일',
    dDay: 'D-15',
    progress: 75,
    status: '예정됨',
    statusColor: 'bg-green-100 text-green-700',
    theme: 'blue',
    checklist: [
      { text: '항공권 예약', done: true },
      { text: '숙소 예약', done: true },
      { text: '렌터카 예약', done: false, urgent: true },
    ]
  },
  {
    id: 2,
    title: '서울 3박 4일 완벽 코스',
    startDate: new Date(2024, 5, 21), // 2024-06-21
    endDate: new Date(2024, 5, 24),
    dateStr: '2024년 6월 21일 - 24일',
    dDay: 'D-47',
    progress: 30,
    status: '계획 중',
    statusColor: 'bg-blue-100 text-blue-700',
    theme: 'orange',
    checklist: [
      { text: '일정 Fork 완료', done: true },
      { text: '숙소 검색 중', done: false, urgent: false },
      { text: '교통편 미정', done: false, urgent: false },
    ]
  }
];

const PAST_TRIPS = [
  {
    id: 3,
    title: '부산 바다 여행',
    startDate: new Date(2024, 3, 1), // 2024-04-01
    endDate: new Date(2024, 3, 3),
    dateStr: '2024년 4월 1일 - 3일',
  },
  {
    id: 4,
    title: '경주 역사 탐방',
    startDate: new Date(2024, 2, 15), // 2024-03-15
    endDate: new Date(2024, 2, 17),
    dateStr: '2024년 3월 15일 - 17일',
  },
  {
    id: 5,
    title: '강릉 카페 투어',
    startDate: new Date(2024, 1, 20), // 2024-02-20
    endDate: new Date(2024, 1, 21),
    dateStr: '2024년 2월 20일 - 21일',
  }
];

// --- Travel Logs Data ---

const MY_TRAVEL_POSTS = [
  {
    id: 1,
    title: '서울 3박 4일 완벽 여행 코스',
    destination: '서울',
    image: 'https://images.unsplash.com/photo-1638496708881-cf7fb0a27196?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    likes: 342,
    comments: 28,
    forks: 156,
    createdAt: '2일 전',
    tags: ['#뚜벅이최적화', '#동선낭비없는'],
    description: '경복궁, 북촌한옥마을, 명동까지 핫플 다 담았어요!',
    author: '여행러버',
    authorImage: 'https://images.unsplash.com/photo-1640960543409-dbe56ccc30e2?w=150&h=150&fit=crop',
    duration: '3박 4일',
  },
  {
    id: 2,
    title: '부산 바다 여행 완전정복',
    destination: '부산',
    image: 'https://images.unsplash.com/photo-1679054142611-5f0580dab94f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    likes: 421,
    comments: 52,
    forks: 278,
    createdAt: '1주 전',
    tags: ['#뚜벅이최적화', '#극한의J'],
    description: '해운대, 광안리, 송정해수욕장 완벽 동선',
    author: '여행러버',
    authorImage: 'https://images.unsplash.com/photo-1640960543409-dbe56ccc30e2?w=150&h=150&fit=crop',
    duration: '2박 3일',
  },
];

const FORKED_TRAVEL_POSTS = [
  {
    id: 3,
    title: '제주도 힐링 여행 루트',
    destination: '제주도',
    image: 'https://images.unsplash.com/photo-1674606042265-c9f03a77e286?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    originalAuthor: '제주도마스터',
    forkedAt: '3일 전',
    likes: 289,
    comments: 34,
    forks: 203,
    tags: ['#여유로운P', '#극한의J'],
    description: '카페, 해변, 맛집 위주로 느긋하게 다녀왔어요',
    author: '제주도마스터',
    authorImage: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
    duration: '4박 5일',
    createdAt: '5일 전',
  },
];

const LIKED_TRAVEL_POSTS = [
  {
    id: 4,
    title: '강릉 카페 투어 여행',
    destination: '강릉',
    image: 'https://images.unsplash.com/photo-1768555520607-cb29f2bc6394?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    author: '카페러버',
    likedAt: '1일 전',
    likes: 156,
    comments: 12,
    forks: 45,
    tags: ['#카페투어', '#감성여행'],
    description: '강릉의 힙한 카페들을 모두 모았습니다.',
    authorImage: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
    duration: '1박 2일',
    createdAt: '1일 전',
  },
];

// --- Community Data ---

const MY_COMMUNITY_POSTS = [
  {
    id: 1,
    type: 'free',
    title: '여행 짐싸기 꿀팁 공유합니다',
    content: '다이소 압축팩 사용하면 옷 부피를 절반으로 줄일 수 있어요! 그리고 멀티탭은 필수입니다.',
    createdAt: '1일 전',
    likes: 45,
    comments: 18,
    views: 340,
  },
  {
    id: 101,
    type: 'qna',
    title: '교토 버스 패스 질문입니다',
    content: '하루에 3군데 정도 돌아다닐 예정인데 버스 패스 사는게 이득일까요? 아니면 그냥 이코카 카드 찍는게 나을까요?',
    createdAt: '1일 전',
    likes: 3,
    comments: 2,
    views: 45,
    isAnswered: true
  }
];

const LIKED_COMMUNITY_POSTS = [
  {
    id: 2,
    type: 'free',
    title: '제주도 맛집 추천 좀 부탁드려요!',
    content: '이번에 가족들과 제주도 여행을 가는데 부모님 모시고 갈만한 정갈한 한식집 있을까요? 가격대는 인당 5만원 내외면 좋겠습니다.',
    createdAt: '2시간 전',
    likes: 12,
    comments: 5,
    views: 120,
    author: '제주조아'
  },
  {
    id: 201,
    type: 'mate',
    title: '7월 몽골 동행 구합니다',
    content: '7월 15일부터 4박 5일 일정으로 고비사막 투어 같이 하실 분 구해요. 현재 2명 있고 2명 더 모십니다. 성별 무관합니다.',
    createdAt: '3일 전',
    likes: 8,
    comments: 12,
    views: 300,
    participants: 2,
    maxParticipants: 4,
    author: '몽골러'
  }
];

export default function MyPage({ onNavigate }: MyPageProps) {
  // Tabs State
  const [travelTab, setTravelTab] = useState<'created' | 'forked' | 'liked'>('created');
  const [communityTab, setCommunityTab] = useState<'my_posts' | 'liked_posts'>('my_posts');
  
  const [date, setDate] = useState<Date>(new Date(2024, 4, 10)); // Default to May 2024

  const totalForks = MY_TRAVEL_POSTS.reduce((sum, post) => sum + post.forks, 0);
  const totalLikes = MY_TRAVEL_POSTS.reduce((sum, post) => sum + post.likes, 0);

  // --- Full Screen Calendar Logic ---
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
  
  // Generate calendar grid cells (42 cells for 6 weeks standard)
  const gridCells = [];
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
  
  // Previous month filler
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    gridCells.push({
      day: prevMonthDays - i,
      isCurrentMonth: false,
      date: new Date(currentYear, currentMonth - 1, prevMonthDays - i)
    });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    gridCells.push({
      day: i,
      isCurrentMonth: true,
      date: new Date(currentYear, currentMonth, i)
    });
  }
  
  // Next month filler
  const remainingCells = 42 - gridCells.length;
  for (let i = 1; i <= remainingCells; i++) {
    gridCells.push({
      day: i,
      isCurrentMonth: false,
      date: new Date(currentYear, currentMonth + 1, i)
    });
  }

  // Get events for a specific date
  const getEventsForDate = (cellDate: Date) => {
    const allTrips = [...SCHEDULED_TRIPS, ...PAST_TRIPS];
    return allTrips.filter(trip => {
      const start = new Date(trip.startDate);
      start.setHours(0,0,0,0);
      const end = new Date(trip.endDate);
      end.setHours(23,59,59,999);
      const current = new Date(cellDate);
      current.setHours(12,0,0,0);
      return current >= start && current <= end;
    });
  };

  const getCommunityBadge = (type: string) => {
    switch(type) {
      case 'free': return <span className="bg-blue-100 text-[#1344FF] text-xs px-2 py-0.5 rounded-full font-bold">자유</span>;
      case 'qna': return <span className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full font-bold">Q&A</span>;
      case 'mate': return <span className="bg-purple-100 text-purple-600 text-xs px-2 py-0.5 rounded-full font-bold">메이트</span>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 프로필 헤더 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* 프로필 이미지 */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1640960543409-dbe56ccc30e2?w=150&h=150&fit=crop"
                alt="프로필"
                className="w-32 h-32 rounded-full border-4 border-[#1344FF]"
              />
              <button className="absolute bottom-0 right-0 bg-[#1344FF] text-white p-2 rounded-full hover:bg-[#0d34cc] transition-all shadow-lg">
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {/* 프로필 정보 */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">여행러버</h1>
              <p className="text-[#666666] mb-4">여행을 사랑하는 플래너입니다 ✈️</p>
              
              {/* 통계 */}
              <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#1344FF]">{MY_TRAVEL_POSTS.length}</p>
                  <p className="text-sm text-[#666666]">여행기</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#1344FF]">{totalForks}</p>
                  <p className="text-sm text-[#666666]">총 Forks</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#1344FF]">{totalLikes}</p>
                  <p className="text-sm text-[#666666]">총 좋아요</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#1344FF]">{MY_COMMUNITY_POSTS.length}</p>
                  <p className="text-sm text-[#666666]">커뮤니티 글</p>
                </div>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-[#1344FF] text-white rounded-lg hover:bg-[#0d34cc] transition-all shadow-md font-medium">
                프로필 수정
              </button>
              <button className="p-3 border border-[#e5e7eb] text-[#666666] rounded-lg hover:bg-gray-50 transition-colors">
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Full-screen Calendar Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 h-[800px] flex flex-col">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-[#1344FF]" />
              <h3 className="text-xl font-bold text-[#1a1a1a]">나의 캘린더 일정</h3>
            </div>

            <div className="flex items-center gap-3">
              {/* Year Wheel Picker Style */}
              <div className="relative group">
                <select
                  value={currentYear}
                  onChange={(e) => setDate(new Date(parseInt(e.target.value), currentMonth, 1))}
                  className="appearance-none bg-white border-2 border-gray-100 text-[#1a1a1a] text-lg font-bold py-2 pl-4 pr-10 rounded-xl cursor-pointer hover:border-[#1344FF] focus:outline-none focus:border-[#1344FF] transition-all"
                >
                  {[2023, 2024, 2025, 2026].map(year => (
                    <option key={year} value={year}>{year}년</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 group-hover:text-[#1344FF]">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              {/* Month Wheel Picker Style */}
              <div className="relative group">
                <select
                  value={currentMonth}
                  onChange={(e) => setDate(new Date(currentYear, parseInt(e.target.value), 1))}
                  className="appearance-none bg-white border-2 border-gray-100 text-[#1a1a1a] text-lg font-bold py-2 pl-4 pr-10 rounded-xl cursor-pointer hover:border-[#1344FF] focus:outline-none focus:border-[#1344FF] transition-all"
                >
                  {Array.from({ length: 12 }, (_, i) => i).map(month => (
                    <option key={month} value={month}>{month + 1}월</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 group-hover:text-[#1344FF]">
                    <ChevronDown className="w-4 h-4" />
                </div>
              </div>
              
              <button 
                onClick={() => setDate(new Date())}
                className="ml-2 text-sm text-[#1344FF] font-medium hover:underline"
              >
                오늘
              </button>
            </div>
          </div>

          {/* Full Screen Grid */}
          <div className="flex-1 flex flex-col border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, idx) => (
                <div key={day} className={`text-center py-3 text-xs font-bold ${idx === 0 ? 'text-red-500' : 'text-gray-500'}`}>
                  {day}
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="flex-1 grid grid-cols-7 grid-rows-6">
              {gridCells.map((cell, idx) => {
                const events = getEventsForDate(cell.date);
                
                return (
                  <div 
                    key={idx} 
                    className={`
                      border-r border-b border-gray-100 p-2 relative transition-colors flex flex-col
                      ${!cell.isCurrentMonth ? 'bg-gray-50/50 text-gray-300' : 'bg-white text-gray-900'}
                      ${cell.day === new Date().getDate() && cell.isCurrentMonth && currentMonth === new Date().getMonth() ? 'bg-blue-50/30' : ''}
                    `}
                  >
                    <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1 ${
                      cell.day === new Date().getDate() && cell.isCurrentMonth && currentMonth === new Date().getMonth()
                        ? 'bg-[#1344FF] text-white' 
                        : ''
                    }`}>
                      {cell.day}
                    </span>
                    
                    {/* Event Bars */}
                    <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                      {events.map((event, eventIdx) => {
                        // Check if this cell is the start date of the event OR if it's the first cell in the row (Sunday)
                        const isStart = new Date(event.startDate).toDateString() === cell.date.toDateString();
                        const isRowStart = idx % 7 === 0;
                        const showTitle = isStart || isRowStart;
                        
                        // Check if event continues to next day
                        const isEnd = new Date(event.endDate).toDateString() === cell.date.toDateString();
                        const roundedLeft = isStart ? 'rounded-l-md' : '';
                        const roundedRight = isEnd ? 'rounded-r-md' : '';

                        return (
                          <div 
                            key={`${event.id}-${eventIdx}`}
                            className={`
                              text-[10px] h-5 flex items-center px-1 truncate relative z-10
                              ${event.id < 3 ? 'bg-[#1344FF] text-white' : 'bg-gray-200 text-gray-700'}
                              ${roundedLeft} ${roundedRight}
                            `}
                            title={event.title}
                          >
                            {showTitle && <span className="truncate">{event.title}</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        
         {/* 여행 일정 섹션 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <CalendarDays className="w-6 h-6 text-[#1344FF]" />
            <h3 className="text-xl font-bold text-[#1a1a1a]">여행 상세 일정</h3>
          </div>

            {/* 여행 목록 */}
            <div className="space-y-6">
              {/* 예정된 여행 목록 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {SCHEDULED_TRIPS.map((trip) => (
                  <div key={trip.id} className={`bg-gradient-to-br ${trip.theme === 'blue' ? 'from-blue-50 to-purple-50 border-[#1344FF]' : 'from-orange-50 to-pink-50 border-orange-200'} rounded-xl p-6 border-2`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-3 py-1 ${trip.theme === 'blue' ? 'bg-[#1344FF]' : 'bg-orange-500'} text-white text-xs font-bold rounded-full`}>
                            {trip.dDay}
                          </span>
                          <span className={`px-3 py-1 ${trip.statusColor} text-xs font-bold rounded-full`}>
                            {trip.status}
                          </span>
                        </div>
                        <h4 className="text-xl font-bold text-[#1a1a1a] mb-1">{trip.title}</h4>
                        <p className="text-sm text-[#666666]">{trip.dateStr}</p>
                      </div>
                      <CalendarIcon className={`w-8 h-8 ${trip.theme === 'blue' ? 'text-[#1344FF]' : 'text-orange-500'}`} />
                    </div>

                    <div className="bg-white rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[#1a1a1a]">준비 진행률</span>
                        <span className={`text-sm font-bold ${trip.theme === 'blue' ? 'text-[#1344FF]' : 'text-orange-500'}`}>
                          {trip.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-gradient-to-r ${trip.theme === 'blue' ? 'from-[#1344FF] to-[#7c3aed]' : 'from-orange-400 to-pink-500'}`}
                          style={{ width: `${trip.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {trip.checklist.map((item, idx) => (
                        <div key={idx} className={`flex items-center justify-between p-2 rounded-lg ${item.urgent ? 'bg-blue-100 border border-[#1344FF]' : 'bg-white'}`}>
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              item.done 
                                ? 'bg-green-100' 
                                : item.urgent 
                                  ? 'bg-[#1344FF]' 
                                  : 'bg-gray-200'
                            }`}>
                              <span className={`font-bold text-xs ${
                                item.done 
                                  ? 'text-green-600' 
                                  : item.urgent 
                                    ? 'text-white' 
                                    : 'text-gray-400'
                              }`}>
                                {item.done ? '✓' : item.urgent ? '!' : '○'}
                              </span>
                            </div>
                            <span className={`text-sm ${item.urgent ? 'font-medium' : ''} ${item.done ? 'text-[#1a1a1a]' : 'text-[#666666]'}`}>
                              {item.text}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button className={`w-full mt-4 text-white py-3 rounded-lg transition-all font-medium shadow-md ${
                      trip.theme === 'blue' 
                        ? 'bg-[#1344FF] hover:bg-[#0d34cc]' 
                        : 'bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600'
                    }`}>
                      일정 보기
                    </button>
                  </div>
                ))}
              </div>

              {/* 지난 여행 목록 (간소화) */}
              <div className="bg-[#f8f9fa] rounded-xl p-6">
                <h4 className="text-lg font-bold text-[#1a1a1a] mb-4">지난 여행 기록</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {PAST_TRIPS.map((trip) => (
                    <div key={trip.id} className="bg-white rounded-lg p-4 hover:shadow-md transition-all cursor-pointer border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">완료</span>
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                      </div>
                      <h5 className="font-bold text-[#1a1a1a] mb-1 truncate">{trip.title}</h5>
                      <p className="text-xs text-[#666666]">{trip.dateStr}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        {/* 나의 여행기 구분선 및 헤더 */}
        <div className="my-10 border-t border-gray-200"></div>
        
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="w-6 h-6 text-[#1344FF]" />
          <h3 className="text-xl font-bold text-[#1a1a1a]">나의 여행기</h3>
          <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">{MY_TRAVEL_POSTS.length}</span>
        </div>

        {/* 여행기 탭 */}
        <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
          <div className="flex border-b border-[#e5e7eb]">
            <button
              onClick={() => setTravelTab('created')}
              className={`flex-1 py-4 transition-all flex items-center justify-center gap-2 ${
                travelTab === 'created'
                  ? 'text-[#1344FF] border-b-2 border-[#1344FF] bg-blue-50/50'
                  : 'text-[#666666] hover:text-[#1344FF] hover:bg-gray-50'
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span className="font-medium">작성한 여행기</span>
            </button>
            <button
              onClick={() => setTravelTab('forked')}
              className={`flex-1 py-4 transition-all flex items-center justify-center gap-2 ${
                travelTab === 'forked'
                  ? 'text-[#1344FF] border-b-2 border-[#1344FF] bg-blue-50/50'
                  : 'text-[#666666] hover:text-[#1344FF] hover:bg-gray-50'
              }`}
            >
              <Copy className="w-4 h-4" />
              <span className="font-medium">Fork한 여행</span>
            </button>
            <button
              onClick={() => setTravelTab('liked')}
              className={`flex-1 py-4 transition-all flex items-center justify-center gap-2 ${
                travelTab === 'liked'
                  ? 'text-[#1344FF] border-b-2 border-[#1344FF] bg-blue-50/50'
                  : 'text-[#666666] hover:text-[#1344FF] hover:bg-gray-50'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span className="font-medium">좋아요한 여행</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {travelTab === 'created' && MY_TRAVEL_POSTS.map(post => (
            <div
              key={post.id}
              onClick={() => onNavigate('detail', { post })}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                  {post.destination}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 line-clamp-2 leading-tight">
                  {post.title}
                </h3>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-sm text-[#666666]">
                    <span className="flex items-center gap-1" title="좋아요">
                      <Heart className="w-4 h-4 text-gray-400" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1" title="댓글">
                      <MessageCircle className="w-4 h-4 text-gray-400" />
                      {post.comments}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-[#1344FF] font-medium text-sm" title="Fork 수">
                    <Copy className="w-4 h-4" />
                    {post.forks}
                  </span>
                </div>
                <p className="text-xs text-[#999999] mt-3">{post.createdAt}</p>
              </div>
            </div>
          ))}

          {travelTab === 'forked' && FORKED_TRAVEL_POSTS.map(post => (
             <div
               key={post.id}
               onClick={() => onNavigate('detail', { post })}
               className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
             >
               <div className="relative h-48 overflow-hidden">
                 <img
                   src={post.image}
                   alt={post.title}
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                 />
                 <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                   {post.destination}
                 </div>
                 <div className="absolute top-3 left-3 bg-[#1344FF] text-white px-3 py-1 rounded-full text-sm font-medium shadow-md flex items-center gap-1">
                   <Copy className="w-3 h-3" />
                   Forked
                 </div>
               </div>
               <div className="p-5">
                 <h3 className="text-lg font-bold text-[#1a1a1a] mb-2 line-clamp-2 leading-tight">
                   {post.title}
                 </h3>
                 <p className="text-sm text-[#666666] mb-4">
                   원작자: <span className="font-medium text-[#1a1a1a]">{post.originalAuthor}</span>
                 </p>
                 
                 <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                   <div className="flex items-center gap-4 text-sm text-[#666666]">
                     <span className="flex items-center gap-1" title="좋아요">
                       <Heart className="w-4 h-4 text-gray-400" />
                       {post.likes}
                     </span>
                   </div>
                   <span className="text-xs text-[#999999]">{post.forkedAt}</span>
                 </div>
               </div>
             </div>
          ))}

          {travelTab === 'liked' && LIKED_TRAVEL_POSTS.map(post => (
            <div
              key={post.id}
              onClick={() => onNavigate('detail', { post })}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                  {post.destination}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-[#1a1a1a] mb-2 line-clamp-2 leading-tight">
                  {post.title}
                </h3>
                <p className="text-sm text-[#666666] mb-4">
                  작성자: <span className="font-medium text-[#1a1a1a]">{post.author}</span>
                </p>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-sm text-[#666666]">
                    <span className="flex items-center gap-1 text-red-500" title="좋아요">
                      <Heart className="w-4 h-4 fill-current" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1" title="댓글">
                      <MessageCircle className="w-4 h-4 text-gray-400" />
                      {post.comments}
                    </span>
                  </div>
                  <span className="text-xs text-[#999999]">{post.likedAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 커뮤니티 활동 구분선 및 헤더 */}
        <div className="my-10 border-t border-gray-200"></div>
        
        <div className="flex items-center gap-2 mb-6">
          <MessageCircle className="w-6 h-6 text-[#1344FF]" />
          <h3 className="text-xl font-bold text-[#1a1a1a]">커뮤니티 활동</h3>
        </div>

        {/* 커뮤니티 탭 메뉴 */}
        <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
          <div className="flex border-b border-[#e5e7eb]">
            <button
              onClick={() => setCommunityTab('my_posts')}
              className={`flex-1 py-4 transition-all flex items-center justify-center gap-2 ${
                communityTab === 'my_posts'
                  ? 'text-[#1344FF] border-b-2 border-[#1344FF] bg-blue-50/50'
                  : 'text-[#666666] hover:text-[#1344FF] hover:bg-gray-50'
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span className="font-medium">작성한 글</span>
              <span className="text-xs">({MY_COMMUNITY_POSTS.length})</span>
            </button>
            <button
              onClick={() => setCommunityTab('liked_posts')}
              className={`flex-1 py-4 transition-all flex items-center justify-center gap-2 ${
                communityTab === 'liked_posts'
                  ? 'text-[#1344FF] border-b-2 border-[#1344FF] bg-blue-50/50'
                  : 'text-[#666666] hover:text-[#1344FF] hover:bg-gray-50'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span className="font-medium">좋아요한 글</span>
              <span className="text-xs">({LIKED_COMMUNITY_POSTS.length})</span>
            </button>
          </div>
        </div>

        {/* 커뮤니티 콘텐츠 */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="divide-y divide-gray-100">
            {(communityTab === 'my_posts' ? MY_COMMUNITY_POSTS : LIKED_COMMUNITY_POSTS).map((post) => (
              <div 
                key={post.id} 
                className="p-6 hover:bg-[#f8f9fa] transition-colors cursor-pointer"
                onClick={() => onNavigate('detail', { post })} 
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getCommunityBadge(post.type)}
                      {post.type === 'qna' && post.isAnswered !== undefined && (
                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${post.isAnswered ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {post.isAnswered ? '답변완료' : '답변대기'}
                        </span>
                      )}
                      {post.type === 'mate' && post.participants !== undefined && (
                        <span className="flex items-center gap-1 text-[#1344FF] bg-blue-50 px-2 py-0.5 rounded-full text-xs font-medium">
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
                    <span className="text-gray-400">{post.createdAt}</span>
                    {communityTab === 'liked_posts' && post.author && (
                      <>
                        <span className="text-gray-300">|</span>
                        <span>{post.author}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1"><ThumbsUp className="w-4 h-4" />{post.likes}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" />{post.comments}</span>
                    <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{post.views}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* 더보기 버튼 (Mock) */}
          <div className="p-4 text-center border-t border-gray-100">
            <button className="text-[#666666] text-sm hover:text-[#1344FF] font-medium transition-colors">
              더 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
