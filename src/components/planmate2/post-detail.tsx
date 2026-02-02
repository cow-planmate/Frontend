import { ArrowLeft, Calendar, Camera, Car, ChevronDown, ChevronUp, Clock, Coffee, Copy, CornerDownRight, Heart, Landmark, MapPin, Send, Share2, ShoppingBag, Users, Utensils } from 'lucide-react';
import React, { useState } from 'react';

interface PostDetailProps {
  post: any;
  onBack: () => void;
}

interface Comment {
  id: number;
  author: string;
  authorImage: string;
  content: string;
  createdAt: string;
  likes: number;
  replies: Comment[];
}

const MOCK_SCHEDULE = [
  {
    day: 1,
    date: '2024.03.15',
    startTime: '09:00',
    endTime: '21:00',
    items: [
      { 
        time: '10:00', 
        place: '경복궁', 
        description: '조선시대 궁궐 관람, 수문장 교대식 필수!', 
        duration: 8,
        image: 'https://images.unsplash.com/photo-1693928105595-b323b02791ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
        category: 'sightseeing'
      },
      { 
        time: '12:30', 
        place: '토속촌 삼계탕', 
        description: '점심식사, 인삼 가득한 보양식', 
        duration: 4,
        image: 'https://images.unsplash.com/photo-1714317609749-d8a7927ceda6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
        category: 'food'
      },
      { 
        time: '14:00', 
        place: '북촌한옥마을', 
        description: '전통 한옥 거리 산책 및 사진 촬영', 
        duration: 8,
        image: 'https://images.unsplash.com/photo-1630135199928-55a43e87350d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
        category: 'photo'
      },
      { 
        time: '16:30', 
        place: '인사동', 
        description: '전통 공예품 쇼핑 및 카페', 
        duration: 6,
        image: 'https://images.unsplash.com/photo-1709983075478-4ec7b791329a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
        category: 'shopping'
      },
      { 
        time: '18:30', 
        place: '명동', 
        description: '저녁식사 및 쇼핑', 
        duration: 10,
        image: 'https://images.unsplash.com/photo-1667494398891-dd00bad6e8d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
        category: 'food'
      },
    ],
  },
  {
    day: 2,
    date: '2024.03.16',
    startTime: '10:00',
    endTime: '20:00',
    items: [
      { 
        time: '10:30', 
        place: '코엑스 별마당 도서관', 
        description: '포토존 및 카페', 
        duration: 6,
        image: 'https://images.unsplash.com/photo-1659243013574-3b0ffb781fe4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
        category: 'photo'
      },
      { 
        time: '12:30', 
        place: '강남역 맛집 거리', 
        description: '점심식사', 
        duration: 4,
        image: 'https://images.unsplash.com/photo-1722084426182-b88c8e217f10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
        category: 'food'
      },
      { 
        time: '14:00', 
        place: '가로수길', 
        description: '카페 투어 및 쇼핑', 
        duration: 8,
        image: 'https://images.unsplash.com/photo-1634028281608-d636a88abc09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
        category: 'cafe'
      },
      { 
        time: '17:00', 
        place: '한강공원', 
        description: '자전거 대여 및 피크닉', 
        duration: 12,
        image: 'https://images.unsplash.com/photo-1652172176566-5d69fc9d9961?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
        category: 'activity'
      },
    ],
  },
  {
    day: 3,
    date: '2024.03.17',
    startTime: '11:00',
    endTime: '20:00',
    items: [
      { 
        time: '11:00', 
        place: '홍대 거리', 
        description: '브런치 및 거리 공연 관람', 
        duration: 8,
        image: 'https://images.unsplash.com/photo-1748696009709-ffd507a4ef61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
        category: 'activity'
      },
      { 
        time: '14:00', 
        place: '망원한강공원', 
        description: '한강 카페 거리', 
        duration: 8,
        image: 'https://images.unsplash.com/photo-1652172176566-5d69fc9d9961?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
        category: 'cafe'
      },
      { 
        time: '17:00', 
        place: '이태원', 
        description: '다국적 음식 및 루프탑 바', 
        duration: 12,
        image: 'https://images.unsplash.com/photo-1719661665369-ac1205e478ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
        category: 'food'
      },
    ],
  },
];

const MOCK_COMMENTS: Comment[] = [
  {
    id: 1,
    author: '여행매니아',
    authorImage: 'https://images.unsplash.com/photo-1640960543409-dbe56ccc30e2?w=100&h=100&fit=crop',
    content: '와 일정이 정말 알차네요! 가져가서 제 일정으로 사용하고 싶어요. 혹시 경복궁 입장료는 얼마였나요?',
    createdAt: '2시간 전',
    likes: 5,
    replies: [
      {
        id: 11,
        author: '작성자',
        authorImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        content: '성인은 3000원인데 한복 입고 가면 무료예요! 꼭 한복 대여해서 가보세요 ㅎㅎ',
        createdAt: '1시간 전',
        likes: 2,
        replies: []
      }
    ]
  },
  {
    id: 2,
    author: '서울러버',
    authorImage: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
    content: '북촌한옥마을 정말 좋죠! 저도 다녀왔는데 사진 찍기 좋더라구요. 주말엔 사람이 많으니 평일 추천드려요.',
    createdAt: '5시간 전',
    likes: 3,
    replies: []
  },
  {
    id: 3,
    author: '처음서울',
    authorImage: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
    content: '서울 처음 가는데 이 일정 그대로 따라가면 될까요? 대중교통으로도 이동 가능한가요?',
    createdAt: '1일 전',
    likes: 2,
    replies: []
  },
];

export default function PostDetail({ post, onBack }: PostDetailProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [selectedDay, setSelectedDay] = useState(MOCK_SCHEDULE[0].day);
  const [isScheduleOpen, setIsScheduleOpen] = useState(true);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  // Default values for potentially missing props
  const tags = post.tags || [];
  const author = post.author || '알 수 없음';
  const authorImage = post.authorImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop';
  const description = post.description || '내용이 없습니다.';
  const duration = post.duration || '기간 미정';
  const createdAt = post.createdAt || '최근';

  const handleFork = () => {
    alert(`"${post.title}" 여행 일정을 복제했습니다! 나만의 일정으로 수정해보세요.`);
  };

  const handleShare = () => {
    alert('링크가 클립보드에 복사되었습니다!');
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      const newComment: Comment = {
        id: Date.now(),
        author: '나',
        authorImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        content: comment,
        createdAt: '방금 전',
        likes: 0,
        replies: []
      };
      setComments([newComment, ...comments]);
      setComment('');
    }
  };

  const handleReplySubmit = (e: React.FormEvent, parentId: number) => {
    e.preventDefault();
    if (replyContent.trim()) {
      const newReply: Comment = {
        id: Date.now(),
        author: '나',
        authorImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        content: replyContent,
        createdAt: '방금 전',
        likes: 0,
        replies: []
      };

      setComments(comments.map(c => {
        if (c.id === parentId) {
          return {
            ...c,
            replies: [...c.replies, newReply]
          };
        }
        return c;
      }));
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  const getCurrentSchedule = () => {
    return MOCK_SCHEDULE.find(s => s.day === selectedDay) || MOCK_SCHEDULE[0];
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food': return <Utensils className="w-4 h-4 text-orange-500" />;
      case 'cafe': return <Coffee className="w-4 h-4 text-amber-500" />;
      case 'photo': return <Camera className="w-4 h-4 text-pink-500" />;
      case 'shopping': return <ShoppingBag className="w-4 h-4 text-purple-500" />;
      default: return <Landmark className="w-4 h-4 text-blue-500" />;
    }
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'food': return 'bg-orange-50 border-orange-200 text-orange-700';
      case 'cafe': return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'photo': return 'bg-pink-50 border-pink-200 text-pink-700';
      case 'shopping': return 'bg-purple-50 border-purple-200 text-purple-700';
      default: return 'bg-blue-50 border-blue-200 text-blue-700';
    }
  };

  const getEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration * 30;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  const currentSchedule = getCurrentSchedule();

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-12">
      {/* 헤더 이미지 */}
      <div className="relative h-[500px] overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/80" />
        
        {/* 뒤로가기 버튼 */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all shadow-lg z-20"
        >
          <ArrowLeft className="w-6 h-6 text-[#1a1a1a]" />
        </button>

        {/* 제목 & 기본 정보 */}
        <div className="absolute bottom-0 left-0 right-0 p-8 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#1344FF] text-sm rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">{post.title}</h1>
            <p className="text-white/90 text-lg mb-4 drop-shadow-md">{description}</p>
            
            {/* 작성자 정보 */}
            <div className="flex items-center gap-3">
              <img
                src={authorImage}
                alt={author}
                className="w-12 h-12 rounded-full border-2 border-white"
              />
              <div>
                <p className="text-white font-medium drop-shadow-md">{author}</p>
                <p className="text-white/80 text-sm drop-shadow-md">{createdAt}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 여행 정보 카드 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-[#1a1a1a] mb-4">여행 정보</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-[#1344FF]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#666666]">목적지</p>
                    <p className="font-medium text-[#1a1a1a]">{post.destination}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-[#1344FF]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#666666]">기간</p>
                    <p className="font-medium text-[#1a1a1a]">{duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#1344FF]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#666666]">인원</p>
                    <p className="font-medium text-[#1a1a1a]">2명</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Car className="w-6 h-6 text-[#1344FF]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#666666]">이동수단</p>
                    <p className="font-medium text-[#1a1a1a]">대중교통</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 일정표 (Timeline View) */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div 
                className="p-6 flex items-center justify-between cursor-pointer border-b border-gray-100"
                onClick={() => setIsScheduleOpen(!isScheduleOpen)}
              >
                <div>
                  <h2 className="text-xl font-bold text-[#1a1a1a]">상세 일정</h2>
                  <p className="text-sm text-gray-500 mt-1">총 {MOCK_SCHEDULE.reduce((acc, curr) => acc + curr.items.length, 0)}개의 장소를 방문합니다</p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  {isScheduleOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#666666]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#666666]" />
                  )}
                </button>
              </div>
              
              {isScheduleOpen && (
                <div className="p-6 bg-gray-50/50">
                  {/* 일차 선택 (Sticky Tabs) */}
                  <div className="sticky top-0 z-10 bg-[#f8f9fa]/95 backdrop-blur-sm pb-4 -mx-6 px-6 border-b border-gray-200 mb-6">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide pt-4">
                      {MOCK_SCHEDULE.map((schedule) => (
                        <button
                          key={schedule.day}
                          onClick={() => setSelectedDay(schedule.day)}
                          className={`flex-shrink-0 px-5 py-2.5 rounded-full transition-all font-medium flex items-center gap-2 ${
                            selectedDay === schedule.day
                              ? 'bg-[#1344FF] text-white shadow-lg shadow-blue-200 transform scale-105'
                              : 'bg-white text-[#666666] border border-[#e5e7eb] hover:bg-gray-50 hover:border-gray-300'
                          }`}
                        >
                          <span className="font-bold">Day {schedule.day}</span>
                          <span className={`text-xs ${selectedDay === schedule.day ? 'text-blue-100' : 'text-gray-400'}`}>
                            {schedule.date}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 타임라인 카드 리스트 */}
                  <div className="relative space-y-8">
                    {/* Vertical Line */}
                    <div className="absolute left-[92px] top-4 bottom-4 w-0.5 bg-gray-200" />

                    {currentSchedule.items.map((item, index) => (
                      <div key={index} className="relative flex gap-4 group">
                        {/* Time Marker */}
                        <div className="w-16 text-right pt-2 flex flex-col items-end gap-1 shrink-0">
                          <span className="font-bold text-[#1a1a1a] text-lg leading-none">{item.time}</span>
                          <span className="text-xs text-gray-400 font-medium">~{getEndTime(item.time, item.duration)}</span>
                        </div>

                        <div className="flex flex-col items-center w-6 pt-2 shrink-0 relative">
                          <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm z-10 ${
                             index === 0 ? 'bg-[#1344FF] w-4 h-4 -ml-0.5' : 'bg-gray-300'
                          }`} />
                        </div>

                        {/* Card Content */}
                        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all hover:translate-y-[-2px] group-hover:border-[#1344FF]/30">
                          <div className="flex flex-col sm:flex-row">
                            {/* Image Section */}
                            <div className="sm:w-48 h-48 sm:h-auto relative shrink-0">
                              <img 
                                src={item.image} 
                                alt={item.place}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            </div>

                            {/* Info Section */}
                            <div className="p-5 flex flex-col justify-between flex-1">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`px-2 py-1 rounded-xl text-xs font-medium flex items-center gap-1 ${getCategoryColor(item.category || 'default')}`}>
                                    {getCategoryIcon(item.category || 'default')}
                                    {item.category?.toUpperCase() || 'VISIT'}
                                  </span>
                                  <h3 className="font-bold text-lg text-[#1a1a1a]">{item.place}</h3>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                  {item.description}
                                </p>
                              </div>
                              
                              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {item.duration * 30}분 소요
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    지도보기
                                  </span>
                                </div>
                                <button className="text-[#1344FF] text-sm font-medium hover:underline">
                                  자세히
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* End Marker */}
                    <div className="relative flex gap-4">
                      <div className="w-16 shrink-0" />
                      <div className="flex flex-col items-center w-6 shrink-0 relative">
                        <div className="w-3 h-3 rounded-full bg-[#1a1a1a] border-2 border-white shadow-sm z-10" />
                      </div>
                      <div className="text-sm font-medium text-gray-400 py-1">
                        일정 종료 ({currentSchedule.endTime})
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

             {/* 여행기 본문 (블로그 스타일) */}
             <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-[#1a1a1a] mb-6">여행 후기</h2>
              <div className="prose max-w-none">
                <p className="text-[#1a1a1a] leading-relaxed mb-4">
                  서울 3박 4일 여행을 다녀왔습니다! 뚜벅이로 다니기 좋은 코스를 직접 짜봤는데, 
                  생각보다 훨씬 효율적이었어요. 특히 대중교통을 이용해서 동선을 최적화했더니 
                  시간도 절약되고 피로도도 훨씬 적었습니다.
                </p>
                
                <h3 className="text-lg font-bold text-[#1a1a1a] mt-6 mb-3">첫째 날: 전통과 현대의 조화</h3>
                <p className="text-[#666666] leading-relaxed mb-4">
                  경복궁에서 시작한 첫날은 정말 인상 깊었어요. 수문장 교대식은 꼭 보세요! 
                  10시에 시작하는데, 15분 전에 가서 자리 잡으시면 사진 찍기 좋습니다. 
                  토속촌 삼계탕은 점심시간이라 웨이팅이 조금 있었지만, 맛은 정말 최고였어요.
                </p>
                
                <div className="bg-[#f8f9fa] p-4 rounded-xl my-4">
                  <p className="text-sm text-[#1344FF] font-medium mb-2">💡 여행 팁</p>
                  <p className="text-sm text-[#666666]">
                    경복궁은 한복을 입고 가면 무료 입장이 가능해요! 주변에 한복 대여점도 많으니 
                    미리 예약하고 가시면 좋습니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 댓글 섹션 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-[#1a1a1a] mb-6">
                댓글 <span className="text-[#1344FF]">{comments.length}</span>
              </h2>

              {/* 메인 댓글 작성 */}
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="댓글을 입력하세요..."
                    className="flex-1 px-4 py-3 border border-[#e5e7eb] rounded-xl focus:outline-none focus:border-[#1344FF] transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-[#1344FF] text-white px-6 py-3 rounded-xl hover:bg-[#0d34cc] transition-all shadow-sm flex items-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>

              {/* 댓글 목록 */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="group">
                    {/* 상위 댓글 */}
                    <div className="flex gap-3">
                      <img
                        src={comment.authorImage}
                        alt={comment.author}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="bg-[#f8f9fa] rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-[#1a1a1a]">{comment.author}</span>
                            <span className="text-sm text-[#666666]">{comment.createdAt}</span>
                          </div>
                          <p className="text-[#666666]">{comment.content}</p>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <button className="text-sm text-[#666666] hover:text-[#1344FF] flex items-center gap-1 transition-colors">
                            <Heart className="w-4 h-4" />
                            좋아요 {comment.likes}
                          </button>
                          <button 
                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                            className="text-sm text-[#666666] hover:text-[#1344FF] font-medium transition-colors"
                          >
                            답글 달기
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 대댓글 입력 폼 */}
                    {replyingTo === comment.id && (
                      <div className="ml-12 mt-4 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <CornerDownRight className="w-4 h-4 text-gray-500" />
                        </div>
                        <form onSubmit={(e) => handleReplySubmit(e, comment.id)} className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder={`@${comment.author}님에게 답글 작성...`}
                            className="flex-1 px-4 py-2 text-sm border border-[#e5e7eb] rounded-xl focus:outline-none focus:border-[#1344FF]"
                            autoFocus
                          />
                          <button
                            type="submit"
                            className="bg-[#1344FF] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#0d34cc]"
                          >
                            등록
                          </button>
                        </form>
                      </div>
                    )}

                    {/* 대댓글 목록 */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-12 mt-4 space-y-4 border-l-2 border-gray-100 pl-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-3">
                            <img
                              src={reply.authorImage}
                              alt={reply.author}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="bg-[#f8f9fa] rounded-xl p-3">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-sm text-[#1a1a1a]">{reply.author}</span>
                                  <span className="text-xs text-[#666666]">{reply.createdAt}</span>
                                </div>
                                <p className="text-sm text-[#666666]">{reply.content}</p>
                              </div>
                              <button className="text-xs text-[#666666] hover:text-[#1344FF] mt-1 flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                좋아요 {reply.likes}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 액션 버튼 */}
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <button
                onClick={handleFork}
                className="w-full bg-[#1344FF] text-white py-4 rounded-xl hover:bg-[#0d34cc] transition-all shadow-md font-medium mb-3 flex items-center justify-center gap-2"
              >
                <Copy className="w-5 h-5" />
                이 일정 가져가기
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">
                  {post.forks || 0}
                </span>
              </button>
              
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex-1 py-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                    isLiked
                      ? 'border-red-500 text-red-500 bg-red-50'
                      : 'border-[#e5e7eb] text-[#666666] hover:border-red-500 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  {(post.likes || 0) + (isLiked ? 1 : 0)}
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 py-3 rounded-xl border border-[#e5e7eb] text-[#666666] hover:border-[#1344FF] hover:text-[#1344FF] transition-all flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  공유
                </button>
              </div>

              {/* 통계 */}
              <div className="border-t border-[#e5e7eb] pt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#666666]">조회수</span>
                  <span className="font-medium text-[#1a1a1a]">1,234</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#666666]">가져감</span>
                  <span className="font-medium text-[#1a1a1a]">{post.forks || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#666666]">댓글</span>
                  <span className="font-medium text-[#1a1a1a]">{comments.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
