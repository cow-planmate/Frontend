import { MessageCircle, Send, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { LevelBadge } from '../atoms/LevelBadge';
import { useComments, useCreateComment, useDeleteComment } from '../hooks/queries';

interface CommentSectionProps {
  postId: number | string;
}

export const CommentSection = ({ postId }: CommentSectionProps) => {
  const [content, setContent] = useState('');
  const [page, setPage] = useState(0);

  const { data: commentsPage, isLoading } = useComments(postId, page);
  const createComment = useCreateComment(postId);
  const deleteComment = useDeleteComment(postId);

  const myUserId = localStorage.getItem('userId');
  const isLoggedIn = !!localStorage.getItem('accessToken');
  const comments = commentsPage?.items ?? [];

  const handleSubmit = async () => {
    if (!content.trim()) return;
    try {
      await createComment.mutateAsync(content.trim());
      setContent('');
    } catch (error) {
      alert(`댓글 등록에 실패했습니다: ${(error as Error).message}`);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm('댓글을 삭제할까요?')) return;
    try {
      await deleteComment.mutateAsync(commentId);
    } catch (error) {
      alert(`댓글 삭제에 실패했습니다: ${(error as Error).message}`);
    }
  };

  return (
    <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
      <div className="flex items-center gap-2 mb-4 text-gray-700">
        <MessageCircle className="w-5 h-5" />
        <span className="font-bold">댓글 {commentsPage?.totalElements ?? 0}</span>
      </div>

      {/* 댓글 작성 */}
      {isLoggedIn ? (
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSubmit(); }}
            placeholder="댓글을 입력하세요"
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#1344FF]"
          />
          <button
            onClick={handleSubmit}
            disabled={createComment.isPending || !content.trim()}
            className="px-4 py-2.5 rounded-xl bg-[#1344FF] text-white font-bold text-sm flex items-center gap-1.5 disabled:opacity-40 hover:bg-blue-700 transition-colors"
          >
            <Send className="w-4 h-4" />
            등록
          </button>
        </div>
      ) : (
        <div className="mb-6 p-4 rounded-xl bg-white border border-gray-100 text-sm text-gray-400 text-center">
          댓글을 작성하려면 로그인하세요.
        </div>
      )}

      {/* 댓글 목록 */}
      {isLoading ? (
        <div className="text-center text-gray-400 text-sm py-4">댓글을 불러오는 중...</div>
      ) : comments.length === 0 ? (
        <div className="text-center text-gray-400 text-sm py-4">첫 댓글을 남겨보세요!</div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-gray-800">{comment.author}</span>
                  <LevelBadge level={comment.level} />
                  <span className="text-xs text-gray-400">{comment.createdAt}</span>
                </div>
                {myUserId === comment.userId && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors"
                    aria-label="댓글 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* 댓글 페이지네이션 */}
      {(commentsPage?.totalPages ?? 0) > 1 && (
        <div className="flex justify-center gap-1 mt-4">
          {Array.from({ length: commentsPage!.totalPages }, (_, p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={
                p === page
                  ? 'w-7 h-7 rounded-lg bg-[#1344FF] text-white text-xs font-bold'
                  : 'w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-500 text-xs'
              }
            >
              {p + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
