import { Award, BookOpen, CalendarDays, Calendar as CalendarIcon, Camera, Check, CheckSquare, ChevronDown, ChevronLeft, ChevronRight, Copy, Eye, Heart, LogOut, MapPin, MessageCircle, PenTool, Plus, Settings, Square, Star, ThumbsUp, Trash2, TrendingUp, User, Users, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { CustomOverlayMap, Map } from 'react-kakao-maps-sdk';
import { useNavigate } from 'react-router-dom';
import { useApiClient } from '../../hooks/useApiClient';
import useNicknameStore from '../../store/Nickname';
// @ts-ignore
import gravatarUrl from "../../utils/gravatarUrl";
// @ts-ignore
import ThemeStart from "../Mypage/changeThemeStart";
// @ts-ignore
import Theme from "../Mypage/changeTheme";

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

const SCHEDULED_TRIPS: any[] = [];
const PAST_TRIPS: any[] = [];

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

const REGION_COORDINATES: Record<string, { lat: number; lng: number }> = {
  '서울': { lat: 37.5665, lng: 126.9780 },
  '경기도': { lat: 37.4138, lng: 127.5183 },
  '인천': { lat: 37.4563, lng: 126.7052 },
  '강원도': { lat: 37.8228, lng: 128.1555 },
  '충청북도': { lat: 36.6357, lng: 127.4913 },
  '충청남도': { lat: 36.5184, lng: 126.8000 },
  '대전': { lat: 36.3504, lng: 127.3845 },
  '세종': { lat: 36.4800, lng: 127.2890 },
  '전북': { lat: 35.7175, lng: 127.1530 },
  '전라북도': { lat: 35.7175, lng: 127.1530 },
  '전남': { lat: 34.8679, lng: 126.9910 },
  '전라남도': { lat: 34.8679, lng: 126.9910 },
  '광주': { lat: 35.1595, lng: 126.8526 },
  '경북': { lat: 36.4919, lng: 128.8889 },
  '경상북도': { lat: 36.4919, lng: 128.8889 },
  '경남': { lat: 35.4606, lng: 128.2132 },
  '경상남도': { lat: 35.4606, lng: 128.2132 },
  '부산': { lat: 35.1796, lng: 129.0756 },
  '대구': { lat: 35.8714, lng: 128.6014 },
  '울산': { lat: 35.5384, lng: 129.3114 },
  '제주': { lat: 33.4996, lng: 126.5312 },
  '제주도': { lat: 33.4996, lng: 126.5312 },
};

export default function MyPage({ onNavigate }: MyPageProps) {
  const navigate = useNavigate();
  // Tabs State
  const [travelTab, setTravelTab] = useState<'created' | 'forked' | 'liked'>('created');
  const [communityTab, setCommunityTab] = useState<'my_posts' | 'liked_posts'>('my_posts');
  
  const [date, setDate] = useState<Date>(new Date());
  
  // API 관련 상태
  const { get, patch, del, isAuthenticated, logout } = useApiClient();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [myPlans, setMyPlans] = useState<any[]>([]);
  const [editablePlans, setEditablePlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 체크리스트 관리 상태
  const [planChecklists, setPlanChecklists] = useState<Record<number, any[]>>({});

  // 모달 상태
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const [newAge, setNewAge] = useState<number>(0);
  const [newGender, setNewGender] = useState<number>(0);
  
  // 테마 관리 상태
  const [isThemeStartOpen, setIsThemeStartOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [selectedThemeKeywords, setSelectedThemeKeywords] = useState<any>({
    0: [],
    1: [],
    2: [],
  });

  // 다중 삭제 관리 상태
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedPlanIds, setSelectedPlanIds] = useState<number[]>([]);

  // 캘린더 이벤트 팝업 상태
  const [selectedCalendarEvent, setSelectedCalendarEvent] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_URL;
  const setStoreNickname = useNicknameStore((state: any) => (state as any).setNickname);

  // User Level & EXP Logic
  const stats = {
    forks: 10,       // 가져간 일정
    feedPosts: 2,    // 피드 게시글
    community: 3,    // 커뮤니티 글
    comments: 12,    // 댓글 수
    attendance: 18   // 출석 점수
  };

  // EXP 계산: 가져가기(5) + 피드(10) + 커뮤니티(5) + 댓글(2) + 출석(1)
  const exp = (stats.forks * 5) + (stats.feedPosts * 10) + (stats.community * 5) + (stats.comments * 2) + stats.attendance; 
  
  const LEVEL_CONFIG = [
    { lv: 1, name: '여행 입문자', range: '0-49 EXP', min: 0, max: 49 },
    { lv: 2, name: '여행 애호가', range: '50-99 EXP', min: 50, max: 99 },
    { lv: 3, name: '여행 전문가', range: '100-199 EXP', min: 100, max: 199 },
    { lv: 4, name: '여행 마스터', range: '200-499 EXP', min: 200, max: 499 },
    { lv: 5, name: '여행 레전드', range: '500 EXP 이상', min: 500, max: 9999 },
  ];

  const currentLevelInfo = LEVEL_CONFIG.find(l => exp >= l.min && exp <= l.max) || LEVEL_CONFIG[0];
  const userLevel = currentLevelInfo.lv;
  const levelName = currentLevelInfo.name;
  
  const nextLevelInfo = LEVEL_CONFIG[userLevel] || null;
  const displayMax = nextLevelInfo ? nextLevelInfo.min + (nextLevelInfo.max - nextLevelInfo.min + 1) : 100;
  // Let's keep displayMax consistent with the range for the current level's bar
  const currentLevelMax = currentLevelInfo.max + 1; 
  const remainingCount = currentLevelMax - exp;

  const handleLogout = () => {
    logout();
    setStoreNickname('');
    navigate('/');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        alert("프로필 이미지가 변경되었습니다. (데모)");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async () => {
    try {
      // 닉네임 변경
      if (newNickname !== userProfile?.nickname) {
        await patch(`${BASE_URL}/api/user/nickname`, { nickname: newNickname });
        setStoreNickname(newNickname);
      }
      
      // 나이 변경
      if (newAge !== userProfile?.age) {
        await patch(`${BASE_URL}/api/user/age`, { age: newAge });
      }
      
      // 성별 변경
      if (newGender !== userProfile?.gender) {
        await patch(`${BASE_URL}/api/user/gender`, { gender: newGender });
      }

      alert("프로필 정보가 성공적으로 업데이트되었습니다.");
      
      // 프로필 정보 다시 가져오기
      const profileData = await get(`${BASE_URL}/api/user/profile`);
      setUserProfile(profileData);
      setIsProfileModalOpen(false);
    } catch (err) {
      console.error("프로필 업데이트 실패:", err);
      alert("프로필 변경에 실패했습니다.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await del(`${BASE_URL}/api/user/account`);
      alert("회원 탈퇴가 완료되었습니다.");
      handleLogout();
    } catch (err) {
      console.error("회원 탈퇴 실패:", err);
      alert("회원 탈퇴 중 오류가 발생했습니다.");
    }
  };

  const handleDeletePlan = async (planId: number, isOwner: boolean) => {
    if (!confirm(isOwner ? "여행 일정을 완전히 삭제하시겠습니까?" : "공유된 일정에서 나가시겠습니까?")) return;

    try {
      if (isOwner) {
        await del(`${BASE_URL}/api/plan/${planId}`);
      } else {
        await del(`${BASE_URL}/api/plan/${planId}/editor/me`);
      }
      
      // 로컬 상태 업데이트
      if (isOwner) {
        setMyPlans(prev => prev.filter((p: any) => p.planId !== planId));
      } else {
        setEditablePlans(prev => prev.filter((p: any) => p.planId !== planId));
      }
      
      alert(isOwner ? "일정이 삭제되었습니다." : "일정에서 나갔습니다.");
    } catch (err) {
      console.error("일정 삭제 실패:", err);
      alert("일정 삭제에 실패했습니다.");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPlanIds.length === 0) {
      alert("삭제할 일정을 선택해주세요.");
      return;
    }
    
    const count = selectedPlanIds.length;
    if (!confirm(`선택한 ${count}개의 일정을 삭제하시겠습니까?\n(본인 일정은 삭제되고, 초대된 일정은 나가기 처리됩니다)`)) return;

    try {
      const ownedToDelete = allPlans.filter(p => selectedPlanIds.includes(p.id) && p.isOwner).map(p => p.id);
      const sharedToLeave = allPlans.filter(p => selectedPlanIds.includes(p.id) && !p.isOwner).map(p => p.id);

      // 1. 소유한 일정 벌크 삭제
      if (ownedToDelete.length > 0) {
        // useApiClient의 del은 두번째 인자가 config/body일 수 있음. 
        // fetch option에 body를 실어보내야 함.
        // @ts-ignore
        await del(`${BASE_URL}/api/plan`, { planIds: ownedToDelete });
        setMyPlans(prev => prev.filter((p: any) => !ownedToDelete.includes(p.planId)));
      }

      // 2. 공유받은 일정 개별 나가기 (백엔드 벌크가 없으므로 루프)
      if (sharedToLeave.length > 0) {
        await Promise.all(sharedToLeave.map(id => del(`${BASE_URL}/api/plan/${id}/editor/me`)));
        setEditablePlans(prev => prev.filter((p: any) => !sharedToLeave.includes(p.planId)));
      }

      alert("선택한 일정이 처리되었습니다.");
      setIsDeleteMode(false);
      setSelectedPlanIds([]);
    } catch (err) {
      console.error("일괄 삭제 실패:", err);
      alert("일정 처리 중 오류가 발생했습니다.");
    }
  };

  const toggleSelectAll = () => {
    if (selectedPlanIds.length === allPlans.length) {
      setSelectedPlanIds([]);
    } else {
      setSelectedPlanIds(allPlans.map(p => p.id));
    }
  };

  const togglePlanSelection = (id: number) => {
    setSelectedPlanIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated()) {
        try {
          setLoading(true);
          const profileData = await get(`${BASE_URL}/api/user/profile`);
          setUserProfile(profileData);
          setMyPlans(profileData.myPlanVOs || []);
          setEditablePlans(profileData.editablePlanVOs || []);

          // 테마 데이터도 상태에 미리 담아둡니다
          if (profileData.preferredThemes && Array.isArray(profileData.preferredThemes)) {
            const categorized: any = { 0: [], 1: [], 2: [] };
            profileData.preferredThemes.forEach((theme: any) => {
              const catId = theme.preferredThemeCategoryId;
              if (categorized[catId] !== undefined) {
                categorized[catId].push(theme);
              }
            });
            setSelectedThemeKeywords(categorized);
          }
        } catch (err) {
          console.error("프로필 정보를 가져오는데 실패했습니다:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [isAuthenticated, get]);

  // userProfile이 변경될 때마다 테마 선택 상태 동기화
  useEffect(() => {
    if (userProfile?.preferredThemes) {
      const categorized: any = { 0: [], 1: [], 2: [] };
      const themes = Array.isArray(userProfile.preferredThemes)
        ? userProfile.preferredThemes
        : typeof userProfile.preferredThemes === 'string'
          ? userProfile.preferredThemes.split(',').filter(Boolean)
          : [];
      
      themes.forEach((theme: any) => {
        if (typeof theme === 'object' && theme !== null) {
          const catId = theme.preferredThemeCategoryId;
          if (categorized[catId] !== undefined) {
            categorized[catId].push(theme);
          } else {
            categorized[0].push(theme);
          }
        } else if (typeof theme === 'string') {
          categorized[0].push({
            preferredThemeCategoryId: 0,
            preferredThemeName: theme.trim(),
            preferredThemeId: -1
          });
        }
      });
      setSelectedThemeKeywords(categorized);
    }
  }, [userProfile]);

  // 체크리스트 초기화 및 핸들러
  useEffect(() => {
    const newChecklists: Record<number, any[]> = { ...planChecklists };
    let changed = false;

    [...myPlans, ...editablePlans].forEach(plan => {
      if (!newChecklists[plan.planId]) {
        newChecklists[plan.planId] = [
          { id: Date.now() + Math.random(), text: '숙소 예약 확인', done: true },
          { id: Date.now() + Math.random(), text: '짐 싸기 완료', done: false },
          { id: Date.now() + Math.random(), text: '맛집 리스트 체크', done: false },
        ];
        changed = true;
      }
    });

    if (changed) {
      setPlanChecklists(newChecklists);
    }
  }, [myPlans, editablePlans]);

  const handleToggleChecklist = (planId: number, itemId: number) => {
    setPlanChecklists(prev => ({
      ...prev,
      [planId]: prev[planId].map(item => 
        item.id === itemId ? { ...item, done: !item.done } : item
      )
    }));
  };

  const handleUpdateChecklistText = (planId: number, itemId: number, newText: string) => {
    setPlanChecklists(prev => ({
      ...prev,
      [planId]: prev[planId].map(item => 
        item.id === itemId ? { ...item, text: newText } : item
      )
    }));
  };

  const handleAddChecklistItem = (planId: number) => {
    const newItem = { id: Date.now(), text: '할 일 입력', done: false };
    setPlanChecklists(prev => ({
      ...prev,
      [planId]: [...(prev[planId] || []), newItem]
    }));
  };

  const handleDeleteChecklistItem = (planId: number, itemId: number) => {
    setPlanChecklists(prev => ({
      ...prev,
      [planId]: prev[planId].filter(item => item.id !== itemId)
    }));
  };

  // 플랜 데이터를 V2 UI 형식으로 변환
  const allPlans = [
    ...myPlans.map(p => ({ ...p, isOwner: true })), 
    ...editablePlans.map(p => ({ ...p, isOwner: false }))
  ].map(plan => {
    const hasDates = plan.startDate && plan.endDate;
    
    // 타임존 영향을 받지 않도록 날짜 객체 생성 및 시간 초기화
    const startDate = hasDates ? new Date(plan.startDate) : null;
    if (startDate) startDate.setHours(0, 0, 0, 0);
    
    const endDate = hasDates ? new Date(plan.endDate) : null;
    if (endDate) endDate.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let dDayStr = 'D-Day';
    if (startDate) {
      const diffTime = startDate.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      dDayStr = diffDays === 0 ? 'D-Day' : diffDays > 0 ? `D-${diffDays}` : `D+${Math.abs(diffDays)}`;
    }

    const isPast = hasDates && endDate && endDate < today;
    const isOngoing = hasDates && !isPast && (startDate && startDate <= today);

    return {
      id: plan.planId,
      title: plan.planName,
      startDate: startDate || new Date(),
      endDate: endDate || new Date(),
      dateStr: hasDates ? `${plan.startDate} - ${plan.endDate}` : '날짜 확인 필요',
      duration: plan.duration,
      dDay: dDayStr,
      status: isPast ? '완료' : (isOngoing ? '진행 중' : '예정됨'),
      hasDates: hasDates,
      theme: plan.isOwner ? 'blue' : 'orange',
      isOwner: plan.isOwner,
      progress: Math.floor(Math.random() * 100), 
      checklist: planChecklists[plan.planId] || []
    };
  });

  // 캘린더 일정이 일직선으로 이어지도록 레인(Lane) 계산
  const eventsWithLanes = (() => {
    const sorted = [...allPlans].sort((a, b) => {
      const startA = a.startDate.getTime();
      const startB = b.startDate.getTime();
      if (startA !== startB) return startA - startB;
      return (b.endDate.getTime() - b.startDate.getTime()) - (a.endDate.getTime() - a.startDate.getTime());
    });

    const lanes: number[] = [];
    return sorted.map(plan => {
      const start = plan.startDate.getTime();
      const end = plan.endDate.getTime();
      
      let laneIndex = lanes.findIndex(laneEnd => laneEnd < start);
      if (laneIndex === -1) {
        laneIndex = lanes.length;
        lanes.push(end);
      } else {
        lanes[laneIndex] = end;
      }
      return { ...plan, lane: laneIndex };
    });
  })();

  const ongoingPlans = allPlans.filter(plan => plan.status === '진행 중');
  const upcomingPlans = allPlans.filter(plan => plan.status === '예정됨');
  const pastPlans = allPlans.filter(plan => plan.status === '완료');

  const SCHEDULED_TRIPS = [...ongoingPlans, ...upcomingPlans];
  const PAST_TRIPS = pastPlans;

  // Mock data for things not yet in API
  const MY_TRAVEL_POSTS: any[] = [];
  const FORKED_TRAVEL_POSTS: any[] = [];
  const LIKED_TRAVEL_POSTS: any[] = [];
  const MY_COMMUNITY_POSTS: any[] = [];
  const LIKED_COMMUNITY_POSTS: any[] = [];

  const totalLikes = 0;

  // 지도용 데이터 가공 (지역별 그룹화)
  const groupedPlansByRegion = [...myPlans, ...editablePlans].reduce((acc: any, plan: any) => {
    const region = plan.region || '서울';
    if (!acc[region]) {
      acc[region] = {
        name: region,
        count: 0,
        plans: [],
        coords: REGION_COORDINATES[region] || REGION_COORDINATES['서울']
      };
    }
    acc[region].count += 1;
    acc[region].plans.push(plan);
    return acc;
  }, {});

  // --- Full Screen Calendar Logic ---
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();

  const handlePrevMonth = () => {
    setDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setDate(new Date(currentYear, currentMonth + 1, 1));
  };
  
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
    return eventsWithLanes.filter(trip => {
      if (!trip.hasDates) return false;
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1344FF]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 프로필 헤더 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* 프로필 이미지 */}
            <div className="relative group">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                className="hidden" 
                accept="image/*"
              />
              <div className="relative">
                {userProfile ? (
                  <img
                    src={profileImage || gravatarUrl(userProfile.email)}
                    alt="프로필"
                    className="w-32 h-32 rounded-full border-4 border-[#1344FF] object-cover transition-all group-hover:brightness-90"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-gray-200 bg-gray-100 flex items-center justify-center transition-all group-hover:brightness-90">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <Camera className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
              </div>
              <button 
                onClick={() => {
                  setNewNickname(userProfile?.nickname || '');
                  setNewAge(userProfile?.age || 0);
                  setNewGender(userProfile?.gender || 0);
                  setIsProfileModalOpen(true);
                }}
                className="absolute bottom-0 right-0 bg-[#1344FF] text-white p-2.5 rounded-full hover:bg-[#0d34cc] transition-all shadow-lg hover:scale-110"
                title="프로필 수정"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {/* 프로필 정보 */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-black text-[#1a1a1a] tracking-tight">{userProfile?.nickname || '사용자'}</h1>
                  <button 
                    onClick={() => setIsLevelModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#1344FF] to-[#4B70FF] text-white rounded-full shadow-sm hover:shadow-md transition-all hover:scale-105 active:scale-95"
                  >
                    <Award className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase tracking-wider">LV.{userLevel}</span>
                    <span className="w-1 h-1 bg-white/50 rounded-full" />
                    <span className="text-xs font-bold">{levelName}</span>
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <p className="text-[#666666] font-medium">{userProfile?.email || '로그인이 필요합니다'}</p>
                <span className="text-gray-300">|</span>
                <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-xs font-semibold rounded border border-gray-100">
                  {userProfile?.gender === 0 ? '남성' : userProfile?.gender === 1 ? '여성' : '성별미설정'} · {userProfile?.age || '연령미설정'}세
                </span>
              </div>
              
              {/* 레벨 진행바 (추가) */}
              <div className="max-w-xs mx-auto md:mx-0 mb-6">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#1344FF] font-bold text-xs uppercase tracking-tighter">현재 경험치</span>
                  <span className="text-gray-400 font-medium">{exp} / {displayMax} EXP</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#1344FF] to-[#4B70FF] transition-all duration-1000"
                    style={{ width: `${Math.min(100, (exp / displayMax) * 100)}%` }}
                  />
                </div>
              </div>

              {/* 취향 태그 */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {(typeof userProfile?.preferredThemes === 'string' 
                  ? userProfile.preferredThemes.split(',') 
                  : Array.isArray(userProfile?.preferredThemes)
                    ? userProfile.preferredThemes
                    : ['선호 테마가 없습니다']
                ).map((tag: any, idx: number) => {
                  const tagLabel = tag?.preferredThemeName || (typeof tag === 'string' ? tag.trim() : '');
                  if (!tagLabel || tagLabel === '선호 테마가 없습니다') return null;
                  return (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-lg">
                      #{tagLabel}
                    </span>
                  );
                })}
              </div>
              
              {/* 통계 */}
              <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#1344FF]">{myPlans.length}</p>
                  <p className="text-sm text-[#666666]">나의 일정</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#1344FF]">{editablePlans.length}</p>
                  <p className="text-sm text-[#666666]">초대된 일정</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#1344FF]">0</p>
                  <p className="text-sm text-[#666666]">좋아요</p>
                </div>
              </div>

              {/* 내 업적 섹션 추가 */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#1344FF]" />
                    <h3 className="text-lg font-bold text-[#1a1a1a]">내 업적</h3>
                  </div>
                  <span className="text-xs font-bold text-[#1344FF] bg-blue-50 px-2 py-1 rounded-full">3 / 5 달성</span>
                </div>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {[
                    { title: "첫 걸음", unlocked: true, color: "bg-amber-100 text-amber-600 border-amber-200" },
                    { title: "계획의 달인", unlocked: true, color: "bg-blue-100 text-blue-600 border-blue-200" },
                    { title: "열혈 리뷰어", unlocked: true, color: "bg-pink-100 text-pink-600 border-pink-200" },
                    { title: "베스트 파트너", unlocked: false, color: "bg-gray-100 text-gray-400 border-gray-200" },
                    { title: "전국 제패", unlocked: false, color: "bg-gray-100 text-gray-400 border-gray-200" },
                  ].map((achievement, idx) => (
                    <div 
                      key={idx} 
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all hover:scale-105 cursor-default ${achievement.color}`}
                      title={achievement.unlocked ? "달성 완료" : "미달성"}
                    >
                      {achievement.unlocked ? "🏆 " : "🔒 "}
                      {achievement.title}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Calendar Section */}
          <div className="bg-white rounded-xl shadow-md p-6 h-[500px] flex flex-col">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-6 h-6 text-[#1344FF]" />
                <h3 className="text-xl font-bold text-[#1a1a1a]">나의 캘린더</h3>
              </div>

              <div className="flex items-center gap-2">
                {/* Previous Month Button */}
                <button 
                  onClick={handlePrevMonth}
                  className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-[#1344FF] transition-colors"
                  title="이전 달"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Year Wheel Picker Style */}
                <div className="relative group">
                  <select
                    value={currentYear}
                    onChange={(e) => setDate(new Date(parseInt(e.target.value), currentMonth, 1))}
                    className="appearance-none bg-white border-2 border-gray-100 text-[#1a1a1a] text-sm font-bold py-1.5 pl-3 pr-8 rounded-xl cursor-pointer hover:border-[#1344FF] focus:outline-none focus:border-[#1344FF] transition-all"
                  >
                    {[2023, 2024, 2025, 2026].map(year => (
                      <option key={year} value={year}>{year}년</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 group-hover:text-[#1344FF]">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>

                {/* Month Wheel Picker Style */}
                <div className="relative group">
                  <select
                    value={currentMonth}
                    onChange={(e) => setDate(new Date(currentYear, parseInt(e.target.value), 1))}
                    className="appearance-none bg-white border-2 border-gray-100 text-[#1a1a1a] text-sm font-bold py-1.5 pl-3 pr-8 rounded-xl cursor-pointer hover:border-[#1344FF] focus:outline-none focus:border-[#1344FF] transition-all"
                  >
                    {Array.from({ length: 12 }, (_, i) => i).map(month => (
                      <option key={month} value={month}>{month + 1}월</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 group-hover:text-[#1344FF]">
                      <ChevronDown className="w-4 h-4" />
                  </div>
                </div>

                {/* Next Month Button */}
                <button 
                  onClick={handleNextMonth}
                  className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-[#1344FF] transition-colors"
                  title="다음 달"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                
                <button 
                  onClick={() => setDate(new Date())}
                  className="ml-1 px-3 py-1.5 bg-[#1344FF] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#0d34cc] transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
                >
                  오늘
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 flex flex-col border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, idx) => (
                  <div key={day} className={`text-center py-2 text-[10px] font-bold ${idx === 0 ? 'text-red-500' : 'text-gray-500'}`}>
                    {day[0]}
                  </div>
                ))}
              </div>

              {/* Days */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-7 min-h-full">
                  {gridCells.map((cell, idx) => {
                    const events = getEventsForDate(cell.date);
                    
                    return (
                      <div 
                        key={idx} 
                        className={`
                          border-r border-b border-gray-100 p-1 relative transition-colors flex flex-col min-h-[60px] h-full
                          ${!cell.isCurrentMonth ? 'bg-gray-50/50 text-gray-400' : 'bg-white text-gray-900'}
                          ${cell.day === new Date().getDate() && cell.isCurrentMonth && currentMonth === new Date().getMonth() ? 'bg-blue-50/30' : ''}
                        `}
                      >
                      <span className={`text-[10px] font-medium w-5 h-5 flex items-center justify-center rounded-full mb-0.5 ${
                        cell.day === new Date().getDate() && cell.isCurrentMonth && currentMonth === new Date().getMonth()
                          ? 'bg-[#1344FF] text-white' 
                          : ''
                      }`}>
                        {cell.day}
                      </span>
                      
                      {/* Event Bars */}
                      <div className="flex-1 flex flex-col gap-0.5 mt-0.5 -mx-1.5 pb-1">
                        {(() => {
                          const maxLane = events.length > 0 ? Math.max(...events.map(e => e.lane || 0)) : -1;
                          return Array.from({ length: maxLane + 1 }).map((_, laneIdx) => {
                            const event = events.find(e => e.lane === laneIdx);
                            if (!event) return <div key={laneIdx} className="h-4" />;
                            
                            const isStart = new Date(event.startDate).toDateString() === cell.date.toDateString();
                            const isEnd = new Date(event.endDate).toDateString() === cell.date.toDateString();
                            const isRowStart = idx % 7 === 0;
                            const showTitle = isStart || isRowStart;
                            
                            const roundedLeft = isStart ? 'rounded-l-[4px] ml-1.5' : ''; 
                            const roundedRight = isEnd ? 'rounded-r-[4px] mr-1.5' : ''; 

                            return (
                              <div 
                                key={`${event.id}-${laneIdx}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCalendarEvent(event);
                                }}
                                className={`
                                  text-[8px] h-4 flex items-center px-1 truncate relative z-10 cursor-pointer
                                  transition-colors
                                  ${event.status === '완료' 
                                    ? 'bg-gray-200 text-gray-700 font-bold' 
                                    : (event.theme === 'blue' ? 'bg-[#1344FF] text-white' : 'bg-orange-400 text-white')
                                  }
                                  ${roundedLeft} ${roundedRight}
                                `}
                                title={event.title}
                              >
                                {showTitle && <span className="truncate font-bold pl-1">{event.title}</span>}
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  );
                })}
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="bg-white rounded-xl shadow-md p-6 h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-6 h-6 text-[#1344FF]" />
                <h3 className="text-xl font-bold text-[#1a1a1a]">나의 여행 발자취</h3>
              </div>
              <div className="bg-blue-50 px-3 py-1 rounded-full">
                <span className="text-sm font-bold text-[#1344FF]">총 {allPlans.length}곳 방문</span>
              </div>
            </div>
            
            <div className="flex-1 rounded-xl overflow-hidden border border-gray-200 relative">
              <Map
                center={{ lat: 36.5, lng: 127.8 }}
                style={{ width: "100%", height: "100%" }}
                level={13}
                draggable={true}
                zoomable={true}
              >
                {Object.values(groupedPlansByRegion).map((region: any) => (
                  <CustomOverlayMap
                    key={region.name}
                    position={region.coords}
                  >
                    <div className="relative group">
                      <div className="bg-white rounded-2xl shadow-xl border-2 border-[#1344FF] px-3 py-1.5 flex items-center gap-2 hover:scale-110 transition-transform cursor-pointer">
                        <div className="w-6 h-6 bg-[#1344FF] text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {region.count}
                        </div>
                        <span className="text-sm font-bold text-gray-800">{region.name}</span>
                      </div>
                      
                      {/* Hover Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 bg-white rounded-xl shadow-2xl p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-gray-100">
                        <p className="text-xs font-bold text-gray-400 mb-2 border-b pb-1">{region.name} 여행 목록</p>
                        <div className="space-y-1.5">
                          {region.plans.slice(0, 3).map((plan: any, i: number) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${plan.isOwner ? 'bg-blue-500' : 'bg-orange-500'}`} />
                              <p className="text-[11px] text-gray-700 truncate font-medium">{plan.planName}</p>
                            </div>
                          ))}
                          {region.plans.length > 3 && (
                            <p className="text-[10px] text-gray-400 mt-1 pl-3.5">외 {region.count - 3}개의 일정...</p>
                          )}
                        </div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white" />
                      </div>
                    </div>
                  </CustomOverlayMap>
                ))}
              </Map>
            </div>
          </div>
        </div>

         {/* 여행 일정 섹션 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-[#1344FF]" />
              <h3 className="text-xl font-bold text-[#1a1a1a]">여행 상세 일정</h3>
            </div>
            
            <div className="flex items-center gap-2">
              {isDeleteMode ? (
                <>
                  <button 
                    onClick={toggleSelectAll}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    {selectedPlanIds.length === allPlans.length ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                    전체 선택
                  </button>
                  <button 
                    onClick={handleBulkDelete}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    선택 삭제 ({selectedPlanIds.length})
                  </button>
                  <button 
                    onClick={() => {
                      setIsDeleteMode(false);
                      setSelectedPlanIds([]);
                    }}
                    className="px-3 py-1.5 text-gray-500 text-sm font-medium hover:underline"
                  >
                    취소
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsDeleteMode(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <Settings className="w-4 h-4" />
                  일정 관리
                </button>
              )}
            </div>
          </div>

            {/* 여행 목록 */}
            <div className="space-y-8">
              {/* 진행 중인 여행 목록 */}
              {ongoingPlans.length > 0 && (
                <div className="space-y-4 pb-2">
                  <h4 className="text-lg font-bold text-[#1344FF] flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 animate-pulse" />
                    진행 중인 여행
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {ongoingPlans.map((trip) => (
                      <div 
                        key={trip.id} 
                        onClick={() => !isDeleteMode && navigate(`/complete?id=${trip.id}`)}
                        className={`bg-white rounded-xl p-5 border-2 border-[#1344FF]/20 relative overflow-hidden group transition-all shadow-sm ${isDeleteMode ? 'cursor-default ring-2 ring-offset-2 ' + (selectedPlanIds.includes(trip.id) ? 'ring-white' : 'ring-transparent') : 'cursor-pointer hover:shadow-md hover:-translate-y-1'}`}
                      >
                        {/* 체크박스 (관리 모드) */}
                        {isDeleteMode && (
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePlanSelection(trip.id);
                            }}
                            className="absolute top-3 left-3 z-20 cursor-pointer"
                          >
                            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${selectedPlanIds.includes(trip.id) ? 'bg-[#1344FF] border-[#1344FF] text-white' : 'bg-transparent border-gray-300'}`}>
                              {selectedPlanIds.includes(trip.id) && <Check className="w-4 h-4" />}
                            </div>
                          </div>
                        )}

                        <div className="relative z-10 flex flex-col gap-6">
                          {/* 왼쪽: 기본 정보 */}
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-[#1344FF] text-xs font-black tracking-widest">
                                  ON AIR
                                </span>
                              </div>
                              {!isDeleteMode && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeletePlan(trip.id, trip.isOwner);
                                  }}
                                  className="p-1.5 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-lg transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            
                            <div className="text-left">
                              <h4 className="text-xl font-black text-[#1a1a1a] mb-1 tracking-tight truncate">{trip.title}</h4>
                              <div className="flex items-center gap-2 text-gray-400">
                                <CalendarIcon className="w-4 h-4 flex-shrink-0" />
                                <p className="text-sm font-bold">{trip.dateStr}</p>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2 mt-auto">
                              <div className="flex justify-between items-end text-xs font-black">
                                <span className="text-gray-400 uppercase tracking-widest">Travel Progress</span>
                                <span className="text-[#1344FF] text-lg">{trip.progress}%</span>
                              </div>
                              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-100">
                                <div className="h-full bg-gradient-to-r from-[#1344FF] to-[#4B70FF] transition-all duration-1000 shadow-[0_0_10px_rgba(19,68,255,0.3)]" style={{ width: `${trip.progress}%` }} />
                              </div>
                            </div>
                          </div>

                          {/* 오른쪽: 체크리스트 */}
                          <div className="bg-gray-50/50 rounded-2xl p-4 border border-blue-100/30 flex flex-col">
                            <div className="flex items-center justify-between mb-3 px-1">
                              <span className="text-[10px] font-black text-[#1344FF] uppercase tracking-widest opacity-60">Check List</span>
                              <span className="text-[10px] font-bold text-gray-400">
                                {trip.checklist.filter((i: any) => i.done).length}/{trip.checklist.length}
                              </span>
                            </div>
                            <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1 custom-scrollbar">
                              {trip.checklist.map((item: any) => (
                                <div key={item.id} className="flex items-center gap-2.5 group/checkItem">
                                  <div 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleChecklist(trip.id, item.id);
                                    }}
                                    className={`w-4 h-4 rounded-md flex-shrink-0 border-2 transition-all flex items-center justify-center cursor-pointer ${item.done ? 'bg-[#1344FF] border-[#1344FF]' : 'border-gray-200 bg-white hover:border-[#1344FF]/30'}`}
                                  >
                                    {item.done && <Check className="w-3 h-3 text-white" />}
                                  </div>
                                  <input 
                                    type="text"
                                    value={item.text}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => handleUpdateChecklistText(trip.id, item.id, e.target.value)}
                                    className={`flex-1 bg-transparent text-xs font-bold outline-none border-b border-transparent focus:border-[#1344FF]/20 transition-all py-0.5 ${item.done ? 'text-gray-300 line-through' : 'text-gray-600'}`}
                                  />
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteChecklistItem(trip.id, item.id);
                                    }}
                                    className="opacity-0 group-hover/checkItem:opacity-100 p-1 text-gray-300 hover:text-red-500 transition-all"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                            
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddChecklistItem(trip.id);
                              }}
                              className="w-full flex items-center justify-center gap-1.5 py-2 mt-4 border border-dashed border-gray-200 rounded-xl text-[11px] font-bold text-gray-400 hover:text-[#1344FF] hover:border-[#1344FF]/30 hover:bg-white transition-all shadow-sm"
                            >
                              <Plus className="w-3 h-3" />
                              할 일 추가
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 예정된 여행 목록 */}
              {upcomingPlans.length > 0 && (
                <div className="space-y-4">
                  {(ongoingPlans.length > 0) && (
                    <h4 className="text-lg font-bold text-[#1a1a1a] flex items-center gap-2">
                      <CalendarDays className="w-5 h-5 text-gray-400" />
                      예정된 여행
                    </h4>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {upcomingPlans.map((trip) => (
                      <div 
                        key={trip.id} 
                        onClick={() => !isDeleteMode && navigate(`/complete?id=${trip.id}`)}
                        className={`bg-white rounded-xl p-5 border-2 relative overflow-hidden group transition-all shadow-sm ${trip.theme === 'blue' ? 'border-blue-50 hover:border-blue-200' : 'border-orange-50 hover:border-orange-200'} ${isDeleteMode ? 'cursor-default ring-2 ring-offset-2 ' + (selectedPlanIds.includes(trip.id) ? 'ring-[#1344FF]' : 'ring-transparent') : 'cursor-pointer hover:shadow-md hover:-translate-y-1'}`}
                      >
                        {/* 파티원 공유 뱃지 */}
                        {!trip.isOwner && (
                          <div className="absolute top-0 right-0 bg-orange-500 text-white px-3 py-1 rounded-bl-xl text-[10px] font-bold flex items-center gap-1.5 shadow-sm z-10">
                            <Users className="w-3.5 h-3.5" />
                            SHARED
                          </div>
                        )}

                        {/* 체크박스 (관리 모드) */}
                        {isDeleteMode && (
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePlanSelection(trip.id);
                            }}
                            className="absolute top-3 left-3 z-20 cursor-pointer"
                          >
                            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${selectedPlanIds.includes(trip.id) ? 'bg-[#1344FF] border-[#1344FF] text-white' : 'bg-white border-gray-300'}`}>
                              {selectedPlanIds.includes(trip.id) && <Check className="w-4 h-4" />}
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col gap-6 relative z-10">
                          {/* 왼쪽: 기본 정보 */}
                          <div className="flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 ${trip.theme === 'blue' ? 'bg-[#1344FF]' : 'bg-orange-500'} text-white text-[10px] font-black rounded shadow-sm`}>
                                  {trip.dDay}
                                </span>
                                <span className="text-gray-400 text-[10px] font-black uppercase tracking-wider">
                                  {trip.status}
                                </span>
                              </div>
                              {!isDeleteMode && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeletePlan(trip.id, trip.isOwner);
                                  }}
                                  className="p-1 px-1.5 text-gray-200 hover:text-red-500 hover:bg-gray-50 rounded-lg transition-all"
                                  title={trip.isOwner ? "삭제" : "나가기"}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>

                            <div className="text-left mt-1">
                              <h4 className="text-xl font-black text-[#1a1a1a] mb-1.5 truncate leading-tight">{trip.title}</h4>
                              <div className="flex items-center gap-2 text-[#666666]">
                                <CalendarIcon className="w-4 h-4 opacity-40" />
                                <p className="text-sm font-bold">{trip.dateStr}</p>
                              </div>
                            </div>

                            <div className="mt-auto pt-4 flex gap-2">
                              <div className={`h-1 flex-1 rounded-full ${trip.theme === 'blue' ? 'bg-blue-100' : 'bg-orange-100'}`} />
                              <div className={`h-1 flex-1 rounded-full opacity-30 ${trip.theme === 'blue' ? 'bg-blue-100' : 'bg-orange-100'}`} />
                              <div className={`h-1 flex-1 rounded-full opacity-10 ${trip.theme === 'blue' ? 'bg-blue-100' : 'bg-orange-100'}`} />
                            </div>
                          </div>

                          {/* 오른쪽: 체크리스트 */}
                          <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100/50 flex flex-col">
                            <div className="flex items-center justify-between mb-3 px-1">
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Check List</span>
                              <span className="text-[10px] font-bold text-gray-400">
                                {trip.checklist.filter((i: any) => i.done).length}/{trip.checklist.length}
                              </span>
                            </div>
                            <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1 custom-scrollbar">
                              {trip.checklist.map((item: any) => (
                                <div key={item.id} className="flex items-center gap-2.5 group/prepItem">
                                  <div 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleChecklist(trip.id, item.id);
                                    }}
                                    className={`w-4 h-4 rounded-md flex-shrink-0 border-2 transition-all flex items-center justify-center cursor-pointer ${item.done ? (trip.theme === 'blue' ? 'bg-[#1344FF] border-[#1344FF]' : 'bg-orange-500 border-orange-500') : 'bg-white border-gray-200 hover:border-gray-300'}`}
                                  >
                                    {item.done && <Check className="w-3 h-3 text-white" />}
                                  </div>
                                  <input 
                                    type="text"
                                    value={item.text}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => handleUpdateChecklistText(trip.id, item.id, e.target.value)}
                                    className={`flex-1 bg-transparent text-xs font-bold outline-none border-b border-transparent focus:border-gray-200 transition-all py-0.5 ${item.done ? 'text-gray-300 line-through' : 'text-gray-600'}`}
                                  />
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteChecklistItem(trip.id, item.id);
                                    }}
                                    className="opacity-0 group-hover/prepItem:opacity-100 p-1 text-gray-200 hover:text-red-500 transition-all font-bold"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                            
                            <button 
                              onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddChecklistItem(trip.id);
                                }}
                              className="w-full flex items-center justify-center gap-1.5 py-2 mt-4 border border-dashed border-gray-200 rounded-xl text-[11px] font-bold text-gray-400 hover:text-gray-600 hover:bg-white transition-all shadow-sm"
                            >
                              <Plus className="w-3 h-3" />
                              할 일 추가
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 진행 중인 여행과 예정된 여행이 모두 없을 때만 표시 */}
              {ongoingPlans.length === 0 && upcomingPlans.length === 0 && (
                <div className="py-12 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">진행 중이거나 예정된 여행 일정이 없습니다.</p>
                  <button 
                    onClick={() => onNavigate('plan-maker')}
                    className="mt-4 text-[#1344FF] font-bold hover:underline"
                  >
                    새로운 여행 계획하기
                  </button>
                </div>
              )}

              {/* 지난 여행 목록 (간소화) */}
              <div className="bg-[#f8f9fa] rounded-xl p-6">
                <h4 className="text-lg font-bold text-[#1a1a1a] mb-4">지난 여행 기록</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {pastPlans.length > 0 ? (
                    pastPlans.map((trip) => (
                      <div 
                        key={trip.id} 
                        onClick={() => {
                          if (isDeleteMode) {
                            togglePlanSelection(trip.id);
                          } else {
                            navigate(`/complete?id=${trip.id}`);
                          }
                        }}
                        className={`bg-white rounded-xl p-4 hover:shadow-md transition-all border border-gray-100 relative group ${isDeleteMode ? 'cursor-default ring-1 ' + (selectedPlanIds.includes(trip.id) ? 'ring-[#1344FF] bg-blue-50/30' : 'ring-transparent') : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {isDeleteMode ? (
                              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${selectedPlanIds.includes(trip.id) ? 'bg-[#1344FF] border-[#1344FF] text-white' : 'bg-white border-gray-300'}`}>
                                {selectedPlanIds.includes(trip.id) && <Check className="w-3 h-3" />}
                              </div>
                            ) : (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">완료</span>
                            )}
                            {!trip.isOwner && (
                              <span className="flex items-center gap-1 text-[10px] text-orange-500 font-bold">
                                <Users className="w-3 h-3" />
                                공유됨
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {!isDeleteMode && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeletePlan(trip.id, trip.isOwner);
                                }}
                                className="p-1 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-all opacity-0 group-hover:opacity-100 shadow-sm border border-gray-50"
                                title={trip.isOwner ? "삭제" : "나가기"}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                        <h5 className="font-bold text-[#1a1a1a] mb-1 truncate text-left">{trip.title}</h5>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-[#666666]">{trip.dateStr}</p>
                          {trip.duration && (
                            <span className="text-[10px] font-bold text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 whitespace-nowrap">
                              {trip.duration}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="col-span-full text-center text-gray-400 py-4 text-sm">지난 여행 기록이 없습니다.</p>
                  )}
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
              <span className="font-medium">가져온 여행</span>
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
                  <span className="flex items-center gap-1 text-[#1344FF] font-medium text-sm" title="가져간 횟수">
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
                   가져옴
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

      {/* 프로필 수정 모달 */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold mb-6 text-[#1a1a1a]">프로필 수정</h3>
            <div className="space-y-6">
              {/* 이미지 수정 섹션 추가 */}
              <div className="flex flex-col items-center gap-4 py-4 border-b border-gray-100">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                   <img
                    src={profileImage || (userProfile ? gravatarUrl(userProfile.email) : '')}
                    alt="프로필 미리보기"
                    className="w-24 h-24 rounded-full border-4 border-[#f0f4ff] group-hover:border-[#1344FF] transition-all object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm font-bold text-[#1344FF] hover:underline"
                >
                  프로필 사진 변경하기
                </button>
              </div>

              {/* 닉네임 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-bold">닉네임</label>
                <input
                  type="text"
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1344FF] focus:border-transparent outline-none transition-all"
                  placeholder="닉네임을 입력하세요"
                />
              </div>

              {/* 나이 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-bold">나이</label>
                <input
                  type="number"
                  value={newAge}
                  onChange={(e) => setNewAge(parseInt(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1344FF] focus:border-transparent outline-none transition-all"
                  placeholder="나이를 입력하세요"
                />
              </div>

              {/* 성별 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-bold">성별</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setNewGender(0)}
                    className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                      newGender === 0
                        ? "bg-[#1344FF] border-[#1344FF] text-white shadow-md"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    남성
                  </button>
                  <button
                    onClick={() => setNewGender(1)}
                    className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                      newGender === 1
                        ? "bg-[#1344FF] border-[#1344FF] text-white shadow-md"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    여성
                  </button>
                </div>
              </div>

              {/* 선호 테마 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 font-bold">선호 테마</label>
                  <button
                    onClick={() => setIsThemeStartOpen(true)}
                    className="text-xs text-[#1344FF] font-bold hover:underline flex items-center gap-1"
                  >
                    <PenTool className="w-3 h-3" />
                    수정하기
                  </button>
                </div>
                
                <div className="min-h-[70px] p-4 rounded-xl border-2 border-gray-50 bg-gray-50/50 flex flex-wrap gap-2 items-center">
                  {(() => {
                    const themes = typeof userProfile?.preferredThemes === 'string' 
                      ? userProfile.preferredThemes.split(',') 
                      : Array.isArray(userProfile?.preferredThemes)
                        ? userProfile.preferredThemes
                        : [];
                    
                    const validThemes = themes.map((tag: any) => {
                      const tagLabel = tag?.preferredThemeName || (typeof tag === 'string' ? tag.trim() : '');
                      return tagLabel && tagLabel !== '선호 테마가 없습니다' ? tagLabel : null;
                    }).filter(Boolean);

                    if (validThemes.length === 0) {
                      return (
                        <button 
                          onClick={() => setIsThemeStartOpen(true)}
                          className="w-full text-center text-gray-400 text-xs hover:text-[#1344FF] transition-colors py-2"
                        >
                          아직 설정된 테마가 없습니다. 클릭하여 추가해보세요!
                        </button>
                      );
                    }

                    return validThemes.map((label: string, idx: number) => (
                      <span key={idx} className="px-3 py-1.5 bg-white text-[#1344FF] text-xs font-bold rounded-lg border border-blue-100 shadow-sm">
                        #{label}
                      </span>
                    ));
                  })()}
                </div>
              </div>

              {/* 계정 관리 */}
              <div className="pt-4 border-t border-gray-100 pb-2">
                <label className="block text-sm font-medium text-gray-700 mb-3 font-bold">계정 관리</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setIsProfileModalOpen(false);
                      setIsDeleteModalOpen(true);
                    }}
                    className="text-sm text-red-300 hover:text-red-500 font-medium transition-colors flex items-center gap-1.5"
                  >
                    <LogOut className="w-4 h-4" />
                    회원 탈퇴
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setIsProfileModalOpen(false);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-all font-pretendard"
                >
                  취소
                </button>
                <button
                  onClick={handleProfileSubmit}
                  className="flex-1 px-4 py-3 rounded-xl bg-[#1344FF] text-white font-medium hover:bg-[#0d34cc] transition-all shadow-lg font-pretendard"
                >
                  저장하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 사용자 레벨 상세 모달 (요청 이미지와 동일하게 구현) */}
      {isLevelModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[120] p-4 animate-in fade-in duration-200" onClick={() => setIsLevelModalOpen(false)}>
          <div 
            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 상단 타이틀 */}
            <div className="flex items-center gap-2 mb-8">
              <div className="p-2 rounded-xl text-[#1344FF]">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-[#1a1a1a]">사용자 레벨</h3>
            </div>

            {/* 현재 레벨 요약 카드 */}
            <div className="bg-[#f5f7ff] rounded-3xl p-6 mb-8 border border-blue-50/50 relative overflow-hidden">
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1344FF] to-[#7C3AED] rounded-full flex items-center justify-center shadow-lg shadow-blue-200">
                  <span className="text-white text-xl font-black">Lv.{userLevel}</span>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-[#1a1a1a] mb-0.5">{levelName}</h4>
                  <p className="text-sm text-[#666666] font-medium">{currentLevelInfo.range}</p>
                </div>
              </div>

              {/* 진행도 섹션 */}
              <div className="space-y-3 relative z-10">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-[#666666]">현재 경험치</span>
                  <div className="text-right">
                    <span className="text-[#1344FF] font-black text-lg">{exp}</span>
                    <span className="text-[#666666] font-bold text-sm"> / {displayMax} EXP</span>
                  </div>
                </div>
                
                <div className="h-2.5 w-full bg-gray-200/50 rounded-full overflow-hidden p-0.5 border border-white/50">
                  <div 
                    className="h-full bg-gradient-to-r from-[#1344FF] via-[#7C3AED] to-[#1344FF] rounded-full transition-all duration-1000 bg-[length:200%_100%] animate-gradient-x"
                    style={{ width: `${Math.min(100, (exp/displayMax) * 100)}%` }}
                  />
                </div>
                
                <p className="text-xs font-bold text-[#666666]">
                  다음 레벨까지 <span className="text-[#1344FF]">{remainingCount} EXP</span> 남았어요!
                </p>
              </div>

              {/* 데코레이션 배경 */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#1344FF] opacity-[0.03] rounded-full -mr-16 -mt-16" />
            </div>

            {/* EXP 획득 내역 Breakdown */}
            <div className="grid grid-cols-2 gap-2 mb-8">
              <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">일정 가져오기</p>
                <p className="text-sm font-black text-[#1a1a1a]">{stats.forks}회 <span className="text-[10px] text-[#1344FF] font-medium">+{stats.forks * 5}</span></p>
              </div>
              <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">활동 (글/댓글)</p>
                <p className="text-sm font-black text-[#1a1a1a]">{stats.feedPosts + stats.community + stats.comments}회 <span className="text-[10px] text-[#1344FF] font-medium">+{(stats.feedPosts * 10) + (stats.community * 5) + (stats.comments * 2)}</span></p>
              </div>
              <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100 col-span-2 flex justify-between items-center px-4">
                <span className="text-[10px] text-gray-400 font-bold uppercase">출석 포인트</span>
                <span className="text-sm font-black text-[#1a1a1a]">{stats.attendance} pts <span className="text-[10px] text-[#1344FF] font-medium">+{stats.attendance}</span></span>
              </div>
            </div>

            {/* 레벨 목록 */}
            <div className="space-y-3">
              {LEVEL_CONFIG.map((level) => {
                const isActive = level.lv === userLevel;
                const isLegend = level.lv === 5;
                return (
                  <div 
                    key={level.lv}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all border-2 ${
                      isActive 
                        ? 'bg-white border-[#1344FF] shadow-md shadow-blue-50' 
                        : 'bg-[#f8f9fa] border-transparent opacity-60'
                    }`}
                  >
                    <div className={`p-1 rounded-lg ${isActive ? 'text-[#1344FF]' : isLegend ? 'text-orange-400' : 'text-gray-400'}`}>
                      {isActive ? (
                        <Star className="w-5 h-5 fill-current" />
                      ) : isLegend ? (
                        <Star className="w-5 h-5 text-orange-400" />
                      ) : (
                        <Star className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-black ${isActive ? 'text-[#1344FF]' : 'text-[#666666]'}`}>
                          Lv.{level.lv} {level.name}
                        </span>
                      </div>
                      <p className={`text-xs ${isActive ? 'text-blue-400 font-medium' : 'text-gray-400'}`}>
                        {level.range}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={() => setIsLevelModalOpen(false)}
              className="w-full mt-8 py-4 bg-[#f8f9fa] text-gray-500 font-bold rounded-2xl hover:bg-gray-100 transition-all active:scale-95"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 테마 수정 모달들 */}
      {isThemeStartOpen && (
        <ThemeStart
          isOpen={isThemeStartOpen}
          onClose={async () => {
            setIsThemeStartOpen(false);
            // 테마 변경 후 프로필 갱신
            try {
              const profileData = await get(`${BASE_URL}/api/user/profile`);
              setUserProfile(profileData);
            } catch (err) {
              console.error("테마 변경 후 프로필 갱신 실패:", err);
            }
          }}
          onThemeOpen={() => setIsThemeOpen(true)}
          selectedThemeKeywords={selectedThemeKeywords}
          onComplete={(selectedThemes: any) => {
            setIsThemeStartOpen(false);
          }}
        />
      )}

      {isThemeOpen && (
        <Theme
          isOpen={isThemeOpen}
          onClose={() => setIsThemeOpen(false)}
          initialKeywords={selectedThemeKeywords}
          onComplete={(keywords: any) => {
            setSelectedThemeKeywords(keywords);
            setIsThemeOpen(false);
          }}
        />
      )}

      {/* 회원 탈퇴 모달 */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <LogOut className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-center text-gray-900">정말 떠나시나요?</h3>
            <p className="text-gray-500 text-center mb-8">
              탈퇴 시 작성하신 모든 일정과 계정 정보가<br />
              영구적으로 삭제되며 복구할 수 없습니다.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDeleteAccount}
                className="w-full px-4 py-4 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all shadow-md font-pretendard"
              >
                계정 영구 삭제
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-full px-4 py-4 rounded-xl text-gray-500 font-medium hover:bg-gray-50 transition-all font-pretendard"
              >
                다시 생각하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 캘린더 일정 클릭 팝업 */}
      {selectedCalendarEvent && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[110] p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedCalendarEvent(null)}
        >
          <div 
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${selectedCalendarEvent.theme === 'blue' ? 'bg-blue-100 text-[#1344FF]' : 'bg-orange-100 text-orange-500'}`}>
              <CalendarIcon className="w-6 h-6" />
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${selectedCalendarEvent.theme === 'blue' ? 'bg-[#1344FF]' : 'bg-orange-500'}`}>
                {selectedCalendarEvent.dDay}
              </span>
              {!selectedCalendarEvent.isOwner && (
                <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full text-[10px] font-bold flex items-center gap-1">
                  <Users className="w-2.5 h-2.5" /> 공유됨
                </span>
              )}
            </div>

            <h3 className="text-xl font-bold text-[#1a1a1a] mb-1">{selectedCalendarEvent.title}</h3>
            <p className="text-sm text-gray-500 mb-6">{selectedCalendarEvent.dateStr}</p>
            
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate(`/complete?id=${selectedCalendarEvent.id}`)}
                className={`w-full py-3 rounded-xl text-white font-bold transition-all shadow-md ${selectedCalendarEvent.theme === 'blue' ? 'bg-[#1344FF] hover:bg-[#0d34cc]' : 'bg-orange-500 hover:bg-orange-600'}`}
              >
                일정 상세보기
              </button>
              <button
                onClick={() => setSelectedCalendarEvent(null)}
                className="w-full py-3 rounded-xl bg-gray-50 text-gray-500 font-medium hover:bg-gray-100 transition-all"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
