import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  changeMateStatus,
  createComment,
  createPost,
  deleteComment,
  deletePost,
  fetchComments,
  fetchHotPosts,
  fetchLikedPosts,
  fetchMyComments,
  fetchMyPosts,
  fetchMyStats,
  fetchPost,
  fetchPosts,
  joinMate,
  leaveMate,
  reactToPost,
  updateAnswered,
  updatePost,
  type CreatePostPayload,
} from '../api/communityApi';

const KEYS = {
  posts: (category: string, page: number, sort: string, q: string) => ['community', 'posts', category, page, sort, q] as const,
  hot: (category: string) => ['community', 'hot', category] as const,
  post: (postId: number | string) => ['community', 'post', String(postId)] as const,
  comments: (postId: number | string) => ['community', 'comments', String(postId)] as const,
  me: (tab: string, page: number) => ['community', 'me', tab, page] as const,
};

// ── 조회 ─────────────────────────────────────────────────────────────────
export const usePosts = (category: string, page: number, sort = 'latest', q = '') =>
  useQuery({
    queryKey: KEYS.posts(category, page, sort, q),
    queryFn: () => fetchPosts(category, page, 20, sort, q),
    staleTime: 30_000,
  });

export const useHotPosts = (category: string) =>
  useQuery({
    queryKey: KEYS.hot(category),
    queryFn: () => fetchHotPosts(category),
    staleTime: 60_000,
  });

export const usePost = (postId: number | string | undefined) =>
  useQuery({
    queryKey: KEYS.post(postId ?? ''),
    queryFn: () => fetchPost(postId!),
    enabled: postId !== undefined && postId !== null && postId !== '',
  });

export const useComments = (postId: number | string | undefined, page = 0) =>
  useQuery({
    queryKey: [...KEYS.comments(postId ?? ''), page],
    queryFn: () => fetchComments(postId!, page),
    enabled: postId !== undefined && postId !== null && postId !== '',
  });

export const useMyActivity = (tab: 'posts' | 'liked' | 'comments', page = 0) =>
  useQuery({
    queryKey: KEYS.me(tab, page),
    queryFn: () => {
      if (tab === 'posts') return fetchMyPosts(page);
      if (tab === 'liked') return fetchLikedPosts(page);
      return fetchMyComments(page);
    },
  });

export const useMyStats = () =>
  useQuery({ queryKey: ['community', 'me', 'stats'], queryFn: fetchMyStats });

// ── 변경 (공통 무효화 규칙 포함) ─────────────────────────────────────────
const useInvalidate = () => {
  const queryClient = useQueryClient();
  return {
    lists: () => queryClient.invalidateQueries({ queryKey: ['community', 'posts'] })
        .then(() => queryClient.invalidateQueries({ queryKey: ['community', 'hot'] })),
    post: (postId: number | string) => queryClient.invalidateQueries({ queryKey: KEYS.post(postId) }),
    comments: (postId: number | string) => queryClient.invalidateQueries({ queryKey: KEYS.comments(postId) }),
    me: () => queryClient.invalidateQueries({ queryKey: ['community', 'me'] }),
  };
};

export const useCreatePost = () => {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (payload: CreatePostPayload) => createPost(payload),
    onSuccess: () => { invalidate.lists(); invalidate.me(); },
  });
};

export const useUpdatePost = (postId: number) => {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (payload: Partial<CreatePostPayload>) => updatePost(postId, payload),
    onSuccess: () => { invalidate.post(postId); invalidate.lists(); },
  });
};

export const useDeletePost = () => {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onSuccess: () => { invalidate.lists(); invalidate.me(); },
  });
};

export const useReactToPost = (postId: number | string) => {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (type: 'like' | 'dislike') => reactToPost(Number(postId), type),
    onSuccess: () => { invalidate.post(postId); invalidate.lists(); },
  });
};

export const useCreateComment = (postId: number | string) => {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (content: string) => createComment(Number(postId), content),
    onSuccess: () => { invalidate.comments(postId); invalidate.post(postId); invalidate.lists(); },
  });
};

export const useDeleteComment = (postId: number | string) => {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onSuccess: () => { invalidate.comments(postId); invalidate.post(postId); invalidate.lists(); },
  });
};

export const useJoinMate = (postId: number | string) => {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: () => joinMate(Number(postId)),
    onSuccess: () => { invalidate.post(postId); invalidate.lists(); },
  });
};

export const useLeaveMate = (postId: number | string) => {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: () => leaveMate(Number(postId)),
    onSuccess: () => { invalidate.post(postId); invalidate.lists(); },
  });
};

export const useChangeMateStatus = (postId: number | string) => {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (status: 'recruiting' | 'closed') => changeMateStatus(Number(postId), status),
    onSuccess: () => { invalidate.post(postId); invalidate.lists(); },
  });
};

export const useUpdateAnswered = (postId: number | string) => {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (isAnswered: boolean) => updateAnswered(Number(postId), isAnswered),
    onSuccess: () => { invalidate.post(postId); invalidate.lists(); },
  });
};
