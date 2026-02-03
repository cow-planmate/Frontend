import "@blocknote/core/fonts/inter.css";
import { ko } from "@blocknote/core/locales";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { ArrowLeft, Calendar, Clock, Copy, Image as ImageIcon, MapPin, Search, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useApiClient } from '../../hooks/useApiClient';

interface CreatePostProps {
  onBack: () => void;
  onSubmit: () => void;
}

// --- Mock Data ---
const MY_PLANS = [
    {
      id: 1,
      title: '서울 3박 4일 여행',
      destination: '서울',
      duration: '3박 4일',
      startDate: '2024.03.15',
      endDate: '2024.03.18',
      schedule: [
        {
          day: 1,
          date: '2024.03.15',
          items: [
            { time: '10:00', place: '경복궁', description: '조선시대 궁궐 관람' },
            { time: '12:30', place: '토속촌 삼계탕', description: '점심식사' },
            { time: '14:00', place: '북촌한옥마을', description: '전통 한옥 거리 산책' },
          ],
        },
        {
          day: 2,
          date: '2024.03.16',
          items: [
            { time: '10:30', place: '코엑스 별마당 도서관', description: '포토존 및 카페' },
            { time: '14:00', place: '가로수길', description: '카페 투어' },
          ],
        },
      ],
    },
    {
      id: 2,
      title: '제주도 힐링 여행',
      destination: '제주도',
      duration: '4박 5일',
      startDate: '2024.04.01',
      endDate: '2024.04.05',
      schedule: [
        {
          day: 1,
          date: '2024.04.01',
          items: [
            { time: '11:00', place: '성산일출봉', description: '일출 명소' },
            { time: '14:00', place: '섭지코지', description: '해안 산책로' },
          ],
        },
      ],
    },
    {
      id: 3,
      title: '부산 바다 여행',
      destination: '부산',
      duration: '2박 3일',
      startDate: '2024.05.10',
      endDate: '2024.05.12',
      schedule: [
        {
          day: 1,
          date: '2024.05.10',
          items: [
            { time: '10:00', place: '해운대 해수욕장', description: '해변 산책' },
            { time: '15:00', place: '광안리', description: '광안대교 야경' },
          ],
        },
      ],
    },
  ];

// --- Page Component ---

export default function CreatePost({ onBack, onSubmit }: CreatePostProps) {
  const { apiRequest } = useApiClient();
  const BASE_URL = import.meta.env.VITE_API_URL;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  
  // BlockNote Editor 초기 설정 고정
  const initialContent = useMemo(() => [
    {
      type: "paragraph",
      content: [],
    },
  ], []);

  const editor = useCreateBlockNote({
    dictionary: ko,
    initialContent,
  });

  // 플랜 선택 모달
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planSearch, setPlanSearch] = useState('');
  const [plans, setPlans] = useState<any[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [schedule, setSchedule] = useState<any[]>([]);

  const tags = ['#뚜벅이최적화', '#극한의J', '#여유로운P', '#동선낭비없는'];

  // 모달 열릴 때 플랜 목록 가져오기
  useEffect(() => {
    if (showPlanModal) {
      fetchMyPlans();
    }
  }, [showPlanModal]);

  const fetchMyPlans = async () => {
    setLoadingPlans(true);
    try {
      const data = await apiRequest(`${BASE_URL}/api/plan/my`);
      const allPlans = [...(data.myPlans || []), ...(data.editablePlans || [])];
      
      if (allPlans.length === 0) {
        setPlans(MY_PLANS); // 데이터 없으면 Mock 데이터 사용
      } else {
        setPlans(allPlans);
      }
    } catch (err) {
      console.error('플랜 로드 실패:', err);
      setPlans(MY_PLANS); // 에러 시 Mock 데이터로 폴백
    } finally {
      setLoadingPlans(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handlePlanSelect = async (plan: any) => {
    // 만약 planId가 있으면 API 호출, 없으면 Mock 데이터 직접 사용
    if (plan.planId) {
      try {
        const details = await apiRequest(`${BASE_URL}/api/plan/${plan.planId}/complete`);
        const { planFrame, timetables, placeBlocks } = details;
        
        setTitle(planFrame.planName || '');
        setDestination(planFrame.travelName || '');
        
        // 기간 계산 (timetables 이용)
        if (timetables && timetables.length > 0) {
          const days = timetables.length;
          setDuration(`${days - 1}박 ${days}일`);
        }
        
        // 스케줄 데이터 변환
        const scheduleData = timetables.map((tt: any, idx: number) => ({
          day: idx + 1,
          date: tt.date,
          items: placeBlocks
            .filter((pb: any) => pb.timeTableId === tt.timetableId)
            .sort((a: any, b: any) => (a.startTime || '').localeCompare(b.startTime || ''))
            .map((pb: any) => ({
              time: pb.startTime ? pb.startTime.substring(0, 5) : '00:00',
              place: pb.placeName,
              description: pb.placeAddress
            }))
        }));
        setSchedule(scheduleData);
      } catch (err) {
        console.error('플랜 상세 정보 로드 실패:', err);
      }
    } else {
      // Mock 데이터용 처리
      setDestination(plan.destination);
      setDuration(plan.duration);
      setSchedule(plan.schedule);
    }
    setShowPlanModal(false);
  };

  const filteredPlans = plans.filter(plan => 
    (plan.planName || plan.title || '').toLowerCase().includes(planSearch.toLowerCase()) ||
    (plan.destination || '').toLowerCase().includes(planSearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !destination || !duration) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }
    // Serialize blocks to JSON or HTML here if needed for backend
    console.log('Submitted Blocks:', editor.document);
    
    alert('여행기가 성공적으로 작성되었습니다!');
    onSubmit();
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-12">
      {/* 헤더 */}
      <div className="bg-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-[#1a1a1a]" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#1a1a1a]">여행기 작성</h1>
              <p className="text-sm text-[#666666]">당신의 여행을 다른 사람들과 공유해보세요</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-6">기본 정보</h2>
            
            {/* 대표 이미지 업로드 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#666666] mb-2">
                대표 이미지
              </label>
              {coverImage ? (
                <div className="relative">
                  <img src={coverImage} alt="대표 이미지" className="w-full h-64 object-cover rounded-xl" />
                  <button
                    type="button"
                    onClick={() => setCoverImage(null)}
                    className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => setCoverImage('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=600&fit=crop')}
                  className="border-2 border-dashed border-[#e5e7eb] rounded-xl p-8 text-center hover:border-[#1344FF] transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-12 h-12 text-[#666666] mx-auto mb-3" />
                  <p className="text-[#666666] mb-1">클릭하여 이미지 업로드</p>
                  <p className="text-sm text-[#999999]">권장 크기: 1200x600px</p>
                </div>
              )}
            </div>

            {/* 제목 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#666666] mb-2">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 서울 3박 4일 완벽 여행 코스"
                className="w-full px-4 py-3 border border-[#e5e7eb] rounded-xl focus:outline-none focus:border-[#1344FF] transition-colors"
                required
              />
            </div>

            {/* 설명 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#666666] mb-2">
                간단 설명
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="여행의 하이라이트를 간단히 소개해주세요"
                rows={3}
                className="w-full px-4 py-3 border border-[#e5e7eb] rounded-xl focus:outline-none focus:border-[#1344FF] transition-colors resize-none"
              />
            </div>

            {/* 목적지 & 기간 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#666666] mb-2">
                  목적지 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#666666]" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="서울"
                    className="w-full pl-12 pr-4 py-3 border border-[#e5e7eb] rounded-xl focus:outline-none focus:border-[#1344FF] transition-colors"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#666666] mb-2">
                  여행 기간 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#666666]" />
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="3박 4일"
                    className="w-full pl-12 pr-4 py-3 border border-[#e5e7eb] rounded-xl focus:outline-none focus:border-[#1344FF] transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 태그 선택 */}
            <div>
              <label className="block text-sm font-medium text-[#666666] mb-2">
                여행 스타일 태그
              </label>
              <div className="flex flex-wrap gap-3">
                {tags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-full transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-[#1344FF] text-white shadow-md'
                        : 'bg-[#f8f9fa] text-[#666666] hover:bg-[#e5e7eb]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 여행 후기 본문 - Custom Notion Style Editor */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#1a1a1a]">여행 후기 <span className="text-red-500">*</span></h2>
              <div className="text-xs text-gray-500">
                <span className="bg-gray-100 px-2 py-1 rounded-lg border border-gray-200 font-mono text-xs">/</span> 를 입력하여 메뉴 열기
              </div>
            </div>
            
            <div className="min-h-[500px] border border-[#e5e7eb] rounded-xl bg-white focus-within:ring-2 focus-within:ring-[#1344FF]/20 focus-within:border-[#1344FF] transition-all overflow-hidden">
               <BlockNoteView editor={editor} theme="light" />
            </div>
          </div>

          {/* 상세 일정 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1a1a1a]">상세 일정</h2>
              <button
                type="button"
                onClick={() => setShowPlanModal(true)}
                className="flex items-center gap-2 bg-[#1344FF] text-white px-4 py-2 rounded-xl hover:bg-[#0d34cc] transition-all shadow-sm"
              >
                <Copy className="w-5 h-5" />
                내 플랜 가져오기
              </button>
            </div>

            {schedule.length > 0 ? (
              <div className="space-y-6">
                {schedule.map((day) => (
                  <div key={day.day} className="border border-[#e5e7eb] rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-[#1344FF] text-white rounded-full flex items-center justify-center font-bold">
                        D{day.day}
                      </div>
                      <div>
                        <p className="font-bold text-[#1a1a1a]">{day.day}일차</p>
                        <p className="text-sm text-[#666666]">{day.date}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {day.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex gap-3 bg-[#f8f9fa] p-3 rounded-xl">
                          <div className="text-[#1344FF] font-medium min-w-[60px]">{item.time}</div>
                          <div className="flex-1">
                            <p className="font-medium text-[#1a1a1a]">{item.place}</p>
                            <p className="text-sm text-[#666666]">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-[#e5e7eb] rounded-xl">
                <Clock className="w-12 h-12 text-[#666666] mx-auto mb-3" />
                <p className="text-[#666666] mb-2">아직 일정이 없습니다</p>
                <p className="text-sm text-[#999999]">위의 "내 플랜 가져오기" 버튼을 눌러 일정을 추가하세요</p>
              </div>
            )}
          </div>

          {/* 제출 버튼 */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-4 border border-[#e5e7eb] text-[#666666] rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-4 bg-[#1344FF] text-white rounded-xl hover:bg-[#0d34cc] transition-all shadow-md font-medium"
            >
              여행기 등록하기
            </button>
          </div>
        </form>
      </div>

      {/* 플랜 선택 모달 */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#1a1a1a]">내 플랜 선택</h3>
              <button
                type="button"
                onClick={() => setShowPlanModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-[#666666]" />
              </button>
            </div>

            {/* 검색바 */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={planSearch}
                onChange={(e) => setPlanSearch(e.target.value)}
                placeholder="플랜 이름 또는 목적지 검색..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1344FF] transition-all"
              />
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {loadingPlans ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1344FF] mx-auto mb-4"></div>
                  <p className="text-gray-500">내 플랜을 불러오는 중...</p>
                </div>
              ) : filteredPlans.length > 0 ? (
                filteredPlans.map((plan) => (
                  <div
                    key={plan.planId || plan.id}
                    onClick={() => handlePlanSelect(plan)}
                    className="border border-[#e5e7eb] rounded-xl p-4 hover:border-[#1344FF] hover:bg-blue-50 cursor-pointer transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-[#1a1a1a] mb-1">
                          {plan.planName || plan.title}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-[#666666]">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {plan.destination || '여행지'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {plan.duration || `${plan.startDate} ~ ${plan.endDate}`}
                          </span>
                        </div>
                      </div>
                      {plan.startDate && (
                        <span className="text-sm text-[#1344FF] font-medium">
                          {plan.startDate} ~ {plan.endDate}
                        </span>
                      )}
                    </div>
                    {(plan.schedule || plan.planId) && (
                      <div className="text-sm text-[#666666]">
                        {plan.schedule 
                          ? `총 ${plan.schedule.length}일 일정 · ${plan.schedule.reduce((sum: number, day: any) => sum + day.items.length, 0)}개 장소`
                          : "플랜 상세 정보 포함"}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  검색 결과가 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
