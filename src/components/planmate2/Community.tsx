import {
  Clock,
  MessageCircle,
  MessageSquare,
  Pin,
  Send,
  ThumbsUp,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';
import { useState } from 'react';

type CommunityPost = {
  id: string;
  category: 'free' | 'qna' | 'mate' | 'review';
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  createdAt: string;
  likes: number;
  comments: number;
  isPinned?: boolean;
  isHot?: boolean;
  tags?: string[];
};

type ChatRoom = {
  id: string;
  name: string;
  region: string;
  members: number;
  lastMessage: string;
  lastMessageTime: string;
};

export function Community() {
  const [activeTab, setActiveTab] = useState<'board' | 'chat'>('board');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'free' | 'qna' | 'mate' | 'review'>('all');
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);

  const categories = [
    { id: 'all', label: '전체', icon: '🌍' },
    { id: 'free', label: '자유게시판', icon: '💬' },
    { id: 'qna', label: 'Q&A', icon: '❓' },
    { id: 'mate', label: '메이트 찾기', icon: '👥' },
    { id: 'review', label: '여행 후기', icon: '✈️' },
  ];

  const posts: CommunityPost[] = [
    {
      id: '1',
      category: 'qna',
      title: '부산 여행 3박 4일 vs 2박 3일 어떤게 나을까요?',
      content: '처음 부산 가는데 일정을 못 정하겠어요. 3박 4일이 너무 긴가요?',
      author: '여행초보',
      authorAvatar: '🌱',
      createdAt: '5분 전',
      likes: 12,
      comments: 8,
      isPinned: false,
      isHot: true,
      tags: ['부산', '일정'],
    },
    {
      id: '2',
      category: 'mate',
      title: '[3월 중순] 제주도 2박 3일 같이 가실 분 구해요!',
      content: '20대 여자 2명이서 가는데 한 분 더 구합니다~ 렌트카 비용 나눠요',
      author: '제주가고파',
      authorAvatar: '🏝️',
      createdAt: '1시간 전',
      likes: 24,
      comments: 15,
      isPinned: true,
      tags: ['제주도', '3월', '여성'],
    },
    {
      id: '3',
      category: 'free',
      title: '여행 계획 짜는게 제일 재밌는 사람 손🙋',
      content: '실제로 가는 것보다 계획 짜는게 더 재밌음ㅋㅋㅋ',
      author: '계획왕',
      authorAvatar: '📝',
      createdAt: '3시간 전',
      likes: 89,
      comments: 42,
      isHot: true,
      tags: [],
    },
    {
      id: '4',
      category: 'review',
      title: '강릉 1박 2일 다녀왔는데 대박이었어요',
      content: '여기서 가져간 일정으로 다녀왔는데 진짜 좋았습니다! 감사합니다',
      author: '강릉다녀옴',
      authorAvatar: '🌊',
      createdAt: '5시간 전',
      likes: 45,
      comments: 12,
      tags: ['강릉', '후기'],
    },
    {
      id: '5',
      category: 'qna',
      title: '여행 짐 어떻게 싸세요? 캐리어 vs 백팩',
      content: '2박 3일 기준으로 캐리어가 나을까요 백팩이 나을까요?',
      author: '짐싸기어려워',
      authorAvatar: '🎒',
      createdAt: '6시간 전',
      likes: 18,
      comments: 23,
      tags: ['질문', '짐'],
    },
    {
      id: '6',
      category: 'free',
      title: '가져가기 100회 달성했어요! 🎉',
      content: '제 일정을 100명이나 가져가주셨네요 ㅠㅠ 감동',
      author: '인기플래너',
      authorAvatar: '⭐',
      createdAt: '8시간 전',
      likes: 156,
      comments: 34,
      tags: [],
    },
  ];

  const chatRooms: ChatRoom[] = [
    {
      id: '1',
      name: '부산 여행 정보방',
      region: '부산',
      members: 234,
      lastMessage: '해운대 맛집 추천 좀 해주세요!',
      lastMessageTime: '방금 전',
    },
    {
      id: '2',
      name: '제주도 렌트카 꿀팁',
      region: '제주',
      members: 512,
      lastMessage: '제주 렌트카 업체 추천합니다',
      lastMessageTime: '2분 전',
    },
    {
      id: '3',
      name: '서울 데이트 코스',
      region: '서울',
      members: 421,
      lastMessage: '연남동 새로 생긴 카페 가봤어요',
      lastMessageTime: '5분 전',
    },
    {
      id: '4',
      name: '강릉 여행 준비방',
      region: '강릉',
      members: 189,
      lastMessage: '이번주 날씨 어떤가요?',
      lastMessageTime: '10분 전',
    },
  ];

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  if (selectedPost) {
    return <PostDetailView post={selectedPost} onBack={() => setSelectedPost(null)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">커뮤니티</h1>
          
          {/* Tab Selector */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('board')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'board'
                  ? 'bg-[#1344FF] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <MessageSquare className="w-5 h-5" />
                게시판
              </span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'chat'
                  ? 'bg-[#1344FF] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <Zap className="w-5 h-5" />
                실시간 채팅
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Board View */}
      {activeTab === 'board' && (
        <>
          {/* Category Filters */}
          <div className="bg-white border-b border-gray-200 sticky top-[132px] z-30">
            <div className="max-w-screen-xl mx-auto px-4 py-3">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id as any)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category.id
                        ? 'bg-[#1344FF] text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-1">{category.icon}</span>
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Posts List */}
          <div className="max-w-screen-xl mx-auto px-4 py-4">
            <div className="space-y-3">
              {sortedPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#1344FF] to-blue-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {post.author[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {post.isPinned && (
                          <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-lg text-xs font-semibold">
                            <Pin className="w-3 h-3" />
                            공지
                          </span>
                        )}
                        {post.isHot && (
                          <span className="flex items-center gap-1 bg-red-100 text-red-600 px-2 py-0.5 rounded-lg text-xs font-semibold">
                            <TrendingUp className="w-3 h-3" />
                            HOT
                          </span>
                        )}
                        <span className="bg-[#E8EDFF] text-[#1344FF] px-2 py-0.5 rounded-lg text-xs font-medium">
                          {categories.find(c => c.id === post.category)?.label}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{post.content}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{post.author}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.createdAt}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          {post.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {post.comments}
                        </span>
                      </div>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs text-[#1344FF] bg-[#E8EDFF] px-2 py-0.5 rounded-lg"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Chat View */}
      {activeTab === 'chat' && (
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="bg-gradient-to-r from-[#E8EDFF] to-[#F0F4FF] border border-blue-200 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-[#1344FF]" />
              <h3 className="font-bold text-gray-900">실시간 채팅방</h3>
            </div>
            <p className="text-sm text-gray-700">
              지역별로 실시간으로 대화하고 여행 정보를 공유하세요!
            </p>
          </div>

          <div className="space-y-3">
            {chatRooms.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{room.name}</h3>
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                        LIVE
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {room.members}명 참여중
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                  <p className="text-sm text-gray-700 line-clamp-1">{room.lastMessage}</p>
                  <p className="text-xs text-gray-500 mt-1">{room.lastMessageTime}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Create Chat Room Button */}
          <button className="w-full mt-4 bg-gradient-to-r from-[#1344FF] to-blue-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all active:translate-y-[2px] shadow-sm">
            새 채팅방 만들기
          </button>
        </div>
      )}

      {/* Floating Write Button */}
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-[#1344FF] to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-40 active:translate-y-[2px]">
        <Send className="w-6 h-6" />
      </button>
    </div>
  );
}

function PostDetailView({ post, onBack }: { post: CommunityPost; onBack: () => void }) {
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  const comments = [
    {
      id: '1',
      author: '여행고수',
      content: '3박 4일이 딱 좋아요! 너무 빡빡하지도 않고 여유롭게 다닐 수 있어요.',
      createdAt: '3분 전',
      likes: 5,
    },
    {
      id: '2',
      author: '부산토박이',
      content: '부산은 볼게 많아서 3박 4일 추천합니다. 2박은 좀 아쉬울 수 있어요.',
      createdAt: '1분 전',
      likes: 8,
    },
  ];

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <button
            onClick={onBack}
            className="text-blue-600 font-semibold hover:text-blue-700"
          >
            ← 목록으로
          </button>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Post Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            {post.isPinned && (
              <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-sm font-semibold">
                <Pin className="w-4 h-4" />
                공지
              </span>
            )}
            {post.isHot && (
              <span className="flex items-center gap-1 bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm font-semibold">
                <TrendingUp className="w-4 h-4" />
                HOT
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                {post.author[0]}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{post.author}</p>
                <p className="text-sm text-gray-500">{post.createdAt}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
          <p className="text-gray-800 leading-relaxed">{post.content}</p>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Like Button */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              isLiked
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-white' : ''}`} />
            좋아요 {isLiked ? post.likes + 1 : post.likes}
          </button>
          <div className="flex items-center gap-2 text-gray-600">
            <MessageCircle className="w-5 h-5" />
            <span className="font-semibold">댓글 {comments.length}</span>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            댓글 {comments.length}개
          </h2>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {comment.author[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold text-gray-900">{comment.author}</p>
                      <p className="text-xs text-gray-500">{comment.createdAt}</p>
                    </div>
                    <p className="text-gray-700 mb-2">{comment.content}</p>
                    <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{comment.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comment Input - Fixed at bottom */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="댓글을 입력하세요..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Send className="w-5 h-5" />
              등록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}