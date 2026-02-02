import {
    ArrowLeft,
    BookmarkPlus,
    Clock,
    Copy,
    Heart,
    MapPin,
    MessageCircle,
    Send,
    Share2,
    Shield,
    ThumbsUp,
    User,
} from 'lucide-react';
import { useState } from 'react';
import { TravelPost } from '../../types/planmate2';

type PostDetailProps = {
  post: TravelPost;
  onBack: () => void;
};

type Comment = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
};

export function PostDetail({ post, onBack }: PostDetailProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showForkModal, setShowForkModal] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: '여행매니아',
      content: '이 일정 너무 좋아보여요! 가져가서 다음 달에 사용할게요 😊',
      createdAt: '2시간 전',
      likes: 12,
    },
    {
      id: '2',
      author: '초보여행자',
      content: '첫날 일정이 너무 빡빡한거 아닌가요? 조금 여유있게 조정해도 될까요?',
      createdAt: '1시간 전',
      likes: 5,
    },
    {
      id: '3',
      author: post.author,
      content: '첫날은 이동 시간이 짧아서 괜찮을 거예요! 물론 본인 체력에 맞게 조정하셔도 됩니다 ㅎㅎ',
      createdAt: '30분 전',
      likes: 8,
    },
  ]);

  const handleFork = () => {
    setShowForkModal(true);
    // Simulate fork action
    setTimeout(() => {
      setShowForkModal(false);
      alert('일정이 내 보관함에 저장되었습니다!');
    }, 1500);
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      const newComment: Comment = {
        id: String(comments.length + 1),
        author: '나',
        content: comment,
        createdAt: '방금 전',
        likes: 0,
      };
      setComments([...comments, newComment]);
      setComment('');
    }
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <BookmarkPlus
                  className={`w-6 h-6 ${isSaved ? 'text-yellow-500 fill-yellow-500' : 'text-gray-700'}`}
                />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <Share2 className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative h-64 md:h-96 bg-gray-200">
        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        {post.verified && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg">
            <Shield className="w-4 h-4" />
            검증된 코스
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="bg-[#E8EDFF] text-[#1344FF] px-3 py-1 rounded-full text-sm font-medium"
            >
              {tag === 'walking' && '👟 뚜벅이최적화'}
              {tag === 'j-type' && '⚡ 극한의J'}
              {tag === 'p-type' && '☕ 여유로운P'}
              {tag === 'optimal' && '🎯 동선낭비없는'}
            </span>
          ))}
        </div>

        {/* Title & Info */}
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{post.title}</h1>
        <div className="flex items-center gap-4 text-gray-600 mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <span>{post.location}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span>{post.duration}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Copy className="w-6 h-6 text-[#1344FF]" />
            <div>
              <p className="text-2xl font-bold text-[#1344FF]">{post.forkCount}</p>
              <p className="text-xs text-gray-500">가져감</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Heart
              className={`w-6 h-6 cursor-pointer ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
              onClick={() => setIsLiked(!isLiked)}
            />
            <div>
              <p className="text-xl font-semibold text-gray-700">
                {isLiked ? post.likeCount + 1 : post.likeCount}
              </p>
              <p className="text-xs text-gray-500">좋아요</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-gray-400" />
            <div>
              <p className="text-xl font-semibold text-gray-700">{comments.length}</p>
              <p className="text-xs text-gray-500">댓글</p>
            </div>
          </div>
        </div>

        {/* Author */}
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
          <div className="w-12 h-12 bg-gradient-to-br from-[#1344FF] to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {post.author[0]}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{post.author}</p>
            <p className="text-sm text-gray-500">{post.createdAt}</p>
          </div>
          {post.originalBy && (
            <div className="ml-auto flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-xl">
              <User className="w-4 h-4 text-gray-600" />
              <p className="text-sm text-gray-600">
                Original by <span className="font-semibold">{post.originalBy}</span>
              </p>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">여행 소개</h2>
          <p className="text-gray-700 leading-relaxed">{post.description}</p>
        </div>

        {/* Schedule */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">상세 일정</h2>
          <div className="space-y-4">
            {post.schedule.map((item, index) => (
              <div key={item.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-[#1344FF] text-white rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  {index < post.schedule.length - 1 && (
                    <div className="w-0.5 flex-1 bg-blue-200 my-2" />
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-sm text-[#1344FF] font-semibold mb-1">{item.time}</p>
                    <h3 className="font-bold text-gray-900 mb-2">{item.location}</h3>
                    <p className="text-gray-700 text-sm mb-2">{item.description}</p>
                    {item.note && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mt-3">
                        <p className="text-sm text-yellow-800">
                          <span className="font-semibold">💡 꿀팁:</span> {item.note}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comments Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            댓글 {comments.length}개
          </h2>
          <div className="space-y-4">
            {comments.map((commentItem) => (
              <div key={commentItem.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {commentItem.author[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold text-gray-900">{commentItem.author}</p>
                      <p className="text-xs text-gray-500">{commentItem.createdAt}</p>
                    </div>
                    <p className="text-gray-700 mb-2">{commentItem.content}</p>
                    <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#1344FF]">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{commentItem.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comment Input - Fixed at bottom above Fork button */}
      <div className="fixed bottom-32 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
              placeholder="댓글을 입력하세요..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1344FF]"
            />
            <button 
              onClick={handleCommentSubmit}
              className="px-6 py-3 bg-[#1344FF] text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 active:translate-y-[2px] shadow-sm"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Fork Button */}
      <div className="fixed bottom-20 left-0 right-0 z-50 px-4">
        <div className="max-w-screen-xl mx-auto">
          <button
            onClick={handleFork}
            className="w-full bg-gradient-to-r from-[#1344FF] to-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:translate-y-[2px]"
          >
            <Copy className="w-6 h-6" />
            이 일정 내 보관함에 가져가기
          </button>
        </div>
      </div>

      {/* Fork Modal */}
      {showForkModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 mx-4 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Copy className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">일정을 가져오는 중...</h3>
            <p className="text-gray-600">잠시만 기다려주세요</p>
          </div>
        </div>
      )}
    </div>
  );
}