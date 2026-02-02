import {
    Award,
    BookmarkCheck,
    Copy,
    FileText,
    Heart,
    TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { mockPosts } from "../../data/mockData";
import { TravelPost } from "../../types/planmate2";

type MyPageProps = {
  onViewPost: (post: TravelPost) => void;
};

export function MyPage({ onViewPost }: MyPageProps) {
  const [activeTab, setActiveTab] = useState<
    "my-posts" | "forked"
  >("my-posts");

  // Mock data - in real app, these would be fetched from backend
  const myPosts = mockPosts.slice(0, 2);
  const forkedPosts = mockPosts.slice(2, 5);

  const totalForkCount = myPosts.reduce(
    (sum, post) => sum + post.forkCount,
    0,
  );
  const totalLikeCount = myPosts.reduce(
    (sum, post) => sum + post.likeCount,
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white/30">
              여
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">
                여행러버
              </h1>
              <p className="text-blue-100">
                내 여행을 공유하고, 다른 사람의 여행을
                가져가세요
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5" />
                <p className="text-sm opacity-90">작성한 글</p>
              </div>
              <p className="text-3xl font-bold">
                {myPosts.length}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Copy className="w-5 h-5" />
                <p className="text-sm opacity-90">
                  가져가기 수
                </p>
              </div>
              <p className="text-3xl font-bold">
                {totalForkCount}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5" />
                <p className="text-sm opacity-90">
                  받은 좋아요
                </p>
              </div>
              <p className="text-3xl font-bold">
                {totalLikeCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Banner */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-200">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-yellow-600" />
            <div>
              <p className="font-semibold text-gray-900">
                플래너 레벨: 실버 ⭐⭐
              </p>
              <p className="text-sm text-gray-600">
                골드 레벨까지 가져가기 {300 - totalForkCount}회
                남음!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("my-posts")}
              className={`flex-1 py-4 font-semibold transition-all relative ${
                activeTab === "my-posts"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" />
                내가 작성한 여행기
              </span>
              {activeTab === "my-posts" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("forked")}
              className={`flex-1 py-4 font-semibold transition-all relative ${
                activeTab === "forked"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <BookmarkCheck className="w-5 h-5" />
                가져간 일정
              </span>
              {activeTab === "forked" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {activeTab === "my-posts" && (
          <>
            {myPosts.length > 0 ? (
              <>
                {/* Top Performing Post */}
                {myPosts[0] && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <h3 className="font-bold text-gray-900">
                        이번 주 베스트 게시글 🎉
                      </h3>
                    </div>
                    <div
                      onClick={() => onViewPost(myPosts[0])}
                      className="bg-white rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {myPosts[0].title}
                      </h4>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-blue-600 font-semibold">
                          <Copy className="w-4 h-4" />
                          {myPosts[0].forkCount} 가져감
                        </span>
                        <span className="flex items-center gap-1 text-gray-600">
                          <Heart className="w-4 h-4" />
                          {myPosts[0].likeCount}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => onViewPost(post)}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden border border-gray-200"
                    >
                      <div className="relative h-40 bg-gray-200">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {post.location} • {post.duration}
                        </p>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1 text-blue-600 font-semibold">
                              <Copy className="w-4 h-4" />
                              {post.forkCount} 가져감
                            </span>
                            <span className="flex items-center gap-1 text-gray-600">
                              <Heart className="w-4 h-4" />
                              {post.likeCount}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {post.createdAt}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">
                  아직 작성한 여행기가 없습니다
                </p>
                <p className="text-gray-400 text-sm">
                  첫 여행 계획을 공유해보세요!
                </p>
              </div>
            )}
          </>
        )}

        {activeTab === "forked" && (
          <>
            {forkedPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {forkedPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => onViewPost(post)}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden border border-gray-200"
                  >
                    <div className="relative h-40 bg-gray-200">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded-xl text-xs font-medium flex items-center gap-1">
                        <BookmarkCheck className="w-3 h-3" />
                        가져감
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {post.location} • {post.duration}
                      </p>
                      <p className="text-xs text-gray-500">
                        작성자: {post.author}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <BookmarkCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">
                  가져간 일정이 없습니다
                </p>
                <p className="text-gray-400 text-sm">
                  마음에 드는 여행 계획을 가져가보세요!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}