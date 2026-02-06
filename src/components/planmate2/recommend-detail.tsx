import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  ThumbsUp, 
  MessageCircle, 
  Eye, 
  Share2, 
  Bookmark,
  Calendar,
  Clock,
  Camera,
  Heart
} from 'lucide-react';
import React from 'react';

interface RecommendDetailProps {
  post: any;
  onBack: () => void;
}

export default function RecommendDetail({ post: initialPost, onBack }: RecommendDetailProps) {
  // post가 없을 경우를 대비한 모크 데이터
  const post = initialPost || {
    id: 1,
    title: '[제주] 분위기 좋은 애월 카페 추천합니다!',
    author: '추천왕1',
    content: '여기는 정말 제가 아껴둔 곳인데 공유합니다. 노을이 보일 때 가면 정말 환상적이에요. 커피 맛도 일품이고 사장님이 친절하셔서 더 기분이 좋아지는 곳입니다. 애월 해안도로 따라 쭉 가다 보면 있어요!',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop',
    location: '제주도 애월읍',
    rating: '4.8',
    likes: 245,
    views: 1240,
    comments: 32,
    createdAt: '3시간 전'
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 뒤로가기 버튼 */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-[#1344FF] transition-colors mb-6 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold">목록으로 돌아가기</span>
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* 메인 이미지 섹션 */}
        <div className="relative h-[450px] w-full bg-gray-100">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute bottom-8 left-8 right-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {post.location}
              </span>
              <span className="bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                {post.rating}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
              {post.title}
            </h1>
          </div>
        </div>

        {/* 정보 헤더 */}
        <div className="p-8 border-b border-gray-50">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1344FF] text-xl font-bold">
                {post.author[0]}
              </div>
              <div>
                <p className="font-bold text-gray-900">{post.author}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>{post.createdAt}</span>
                  <span>•</span>
                  <span>조회 {post.views}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-gray-600 font-bold text-sm hover:bg-gray-100 transition-colors">
                <Share2 className="w-4 h-4" />
                공유하기
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-gray-600 font-bold text-sm hover:bg-gray-100 transition-colors">
                <Bookmark className="w-4 h-4" />
                저장하기
              </button>
            </div>
          </div>
        </div>

        {/* 본문 섹션 */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-500" />
                장소 소개
              </h2>
              <div className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap mb-8">
                {post.content}
              </div>

              {/* 추가 이미지 (모크) */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="aspect-video bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                  <img src="https://images.unsplash.com/photo-1544644113-9c6955c77a45?w=500&auto=format&fit=crop" className="w-full h-full object-cover" alt="" />
                </div>
                <div className="aspect-video bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                  <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format&fit=crop" className="w-full h-full object-cover" alt="" />
                </div>
              </div>
            </div>

            {/* 사이드바 정보 */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 sticky top-24">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  위치 정보
                </h3>
                <div className="bg-white rounded-xl h-40 border border-gray-200 mb-4 flex items-center justify-center text-gray-400 text-xs text-center p-4">
                  지도 API 호출 영역<br/>(장소의 정확한 위치 표시)
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>영업시간: 10:00 ~ 21:00</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Heart className="w-4 h-4 text-gray-400" />
                    <span>추천인: {post.author}</span>
                  </div>
                </div>
                
                <button className="w-full mt-6 py-3 bg-[#1344FF] text-white rounded-xl font-bold hover:bg-[#0d34cc] transition-all flex items-center justify-center gap-2 shadow-sm">
                  <ThumbsUp className="w-4 h-4" />
                  추천해요 ({post.likes})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 댓글 요약 바 */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-500">
              <MessageCircle className="w-5 h-5" />
              <span className="font-bold">{post.comments}개의 댓글</span>
            </div>
            <div className="flex items-center gap-2 text-[#1344FF]">
              <ThumbsUp className="w-5 h-5" />
              <span className="font-bold">{post.likes}명의 추천</span>
            </div>
          </div>
          <button className="text-[#1344FF] font-bold hover:underline">
            댓글 더보기
          </button>
        </div>
      </div>
    </div>
  );
}
