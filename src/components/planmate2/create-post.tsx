import "@blocknote/core/fonts/inter.css";
import { ko } from "@blocknote/core/locales";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { ArrowLeft, Calendar, ChevronRight, Clock, Copy, Image as ImageIcon, MapPin, Search, X } from 'lucide-react';
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
      destination: '서울특별시 종로구',
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
      destination: '제주특별자치도 제주시',
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
      destination: '부산광역시 해운대구',
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
  const [nights, setNights] = useState(0);
  const [days, setDays] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [availableTravels, setAvailableTravels] = useState<any[]>([]);
  const [travelCategories, setTravelCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('서울특별시');
  const [showDestinationSelector, setShowDestinationSelector] = useState(false);

  // 여행지 목록 및 카테고리 로드
  useEffect(() => {
    const fetchTravels = async () => {
      try {
        const res = await apiRequest(`${BASE_URL}/api/travel`);
        if (res && res.travels) {
          setAvailableTravels(res.travels);
          const categories = Array.from(new Set(res.travels.map((t: any) => t.travelCategoryName))) as string[];
          setTravelCategories(categories);
          if (categories.length > 0) setSelectedCategory(categories[0]);
        }
      } catch (err) {
        console.error('Failed to fetch travels:', err);
      }
    };
    fetchTravels();
  }, []);
  
  // duration 문자열이 변경될 때 박/일 숫자 업데이트
  useEffect(() => {
    if (duration) {
      const match = duration.match(/(\d+)박\s*(\d+)일/);
      if (match) {
        setNights(parseInt(match[1]));
        setDays(parseInt(match[2]));
      }
    }
  }, [duration]);
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
        
        // 제목은 자동으로 입력되지 않도록 수정 (사용자 요청)
        // setTitle(planFrame.planName || ''); 
        
        const fullDestination = planFrame.travelCategoryName && planFrame.travelName 
          ? (planFrame.travelName.includes(planFrame.travelCategoryName) ? planFrame.travelName : `${planFrame.travelCategoryName} ${planFrame.travelName}`)
          : (planFrame.travelName || '');
        setDestination(fullDestination);
        
        // 기간 계산 (timetables 이용)
        if (timetables && timetables.length > 0) {
          const d = timetables.length;
          const n = Math.max(0, d - 1);
          setDays(d);
          setNights(n);
          setDuration(`${n}박 ${d}일`);
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
      
      // duration 파싱하여 days, nights 업데이트
      const match = plan.duration.match(/(\d+)박\s*(\d+)일/);
      if (match) {
        setNights(parseInt(match[1]));
        setDays(parseInt(match[2]));
      }
      
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
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-xl font-black text-[#1a1a1a] mb-8">기본 정보</h2>
            
            {/* 대표 이미지 업로드 */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-[#444444] mb-3">
                대표 이미지
              </label>
              {coverImage ? (
                <div className="relative">
                  <img src={coverImage} alt="대표 이미지" className="w-full h-72 object-cover rounded-2xl shadow-inner" />
                  <button
                    type="button"
                    onClick={() => setCoverImage(null)}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[#1a1a1a] p-2.5 rounded-full hover:bg-white shadow-xl transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => setCoverImage('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=600&fit=crop')}
                  className="border-2 border-dashed border-[#e5e7eb] rounded-2xl p-12 text-center hover:border-[#1344FF] hover:bg-blue-50/30 transition-all cursor-pointer"
                >
                  <ImageIcon className="w-14 h-14 text-[#cccccc] mx-auto mb-4" />
                  <p className="text-[#666666] font-bold mb-1">클릭하여 대표 이미지를 업로드하세요</p>
                  <p className="text-xs text-[#999999]">권장 사이즈: 1200 x 600px (JPG, PNG)</p>
                </div>
              )}
            </div>

            {/* 제목 */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-[#444444] mb-3">
                제목 <span className="text-red-500">*</span>
              </label>
              <div className="border-b-2 border-[#e5e7eb] focus-within:border-[#1344FF] transition-colors pb-3">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 서울 3박 4일 완벽 여행 코스"
                  className="w-full bg-transparent text-lg font-medium placeholder-[#cccccc] focus:outline-none text-[#1a1a1a]"
                  required
                />
              </div>
            </div>

            {/* 설명 */}
            <div className="mb-10">
              <label className="block text-sm font-bold text-[#444444] mb-3">
                간단 설명
              </label>
              <div className="border-b-2 border-[#e5e7eb] focus-within:border-[#1344FF] transition-colors pb-3">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="여행의 하이라이트를 한 문장으로 소개해주세요"
                  rows={1}
                  className="w-full bg-transparent text-lg font-medium placeholder-[#cccccc] focus:outline-none resize-none text-[#1a1a1a]"
                />
              </div>
            </div>

            {/* 여행지 & 기간 */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mb-10 items-start">
              <div className="lg:col-span-3">
                <label className="block text-sm font-bold text-[#444444] mb-3 flex items-center gap-2 h-5">
                  <MapPin className="w-4 h-4 text-[#1344FF]" />
                  여행지 선택 <span className="text-red-500">*</span>
                </label>
                
                <div className="relative">
                  {/* 입력창 - 클릭 시 선택창 노출 */}
                  <div 
                    className={`relative border-b-2 transition-all pb-2 flex items-center h-[46px] ${
                      showDestinationSelector ? 'border-[#1344FF]' : 'border-[#e5e7eb]'
                    }`}
                  >
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      onFocus={() => setShowDestinationSelector(true)}
                      placeholder="어디로 여행을 다녀오셨나요?"
                      className="w-full bg-transparent text-lg font-medium placeholder-[#cccccc] focus:outline-none text-[#1a1a1a]"
                    />
                    <Search className={`shrink-0 w-6 h-6 transition-colors ${
                      showDestinationSelector ? 'text-[#1344FF]' : 'text-[#999999]'
                    }`} />
                  </div>

                  {/* 드롭다운 스타일의 선택창 */}
                  {showDestinationSelector && (
                    <>
                      <div 
                        className="fixed inset-0 z-20" 
                        onClick={() => setShowDestinationSelector(false)} 
                      />
                      <div className="absolute top-full left-0 right-0 mt-3 z-30 bg-white rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-[#efefef] animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex justify-between items-center mb-6">
                          <span className="text-xs font-black text-[#1344FF] uppercase tracking-widest">어디로 떠나시나요?</span>
                          <button 
                            type="button"
                            onClick={() => setShowDestinationSelector(false)}
                            className="bg-gray-100 p-2 rounded-full text-[#999999] hover:text-[#1a1a1a] transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                      {/* 상위 지역 카테고리 (시/도) */}
                      <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-gray-100">
                        {travelCategories.slice(0, 10).map(cat => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-200 ${
                              selectedCategory === cat 
                              ? 'bg-[#1344FF] text-white shadow-lg shadow-blue-100' 
                              : 'bg-white text-[#666666] border border-[#e5e7eb] hover:border-[#1344FF] hover:text-[#1344FF]'
                            }`}
                          >
                            {cat.replace('특별시', '').replace('광역시', '').replace('특별자치도', '').replace('특별자치시', '')}
                          </button>
                        ))}
                      </div>

                      {/* 하위 지역 (시/군/구) */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                          <button
                            type="button"
                            onClick={() => {
                              setDestination(selectedCategory);
                              setShowDestinationSelector(false);
                            }}
                            className={`px-3 py-3 rounded-2xl text-[13px] font-bold transition-all border ${
                              destination === selectedCategory
                              ? 'bg-[#1344FF] border-[#1344FF] text-white shadow-md'
                              : 'bg-white border-[#f3f4f6] text-[#444444] hover:bg-blue-50 hover:border-blue-100 hover:text-[#1344FF]'
                            }`}
                          >
                            {selectedCategory.replace('특별시', '').replace('광역시', '')} 전체
                          </button>
                          {availableTravels
                            .filter(t => t.travelCategoryName === selectedCategory)
                            .map(t => {
                              const fullDest = `${selectedCategory} ${t.travelName}`;
                              const isSelected = destination === fullDest;
                              return (
                                <button
                                  key={t.travelId}
                                  type="button"
                                  onClick={() => {
                                    setDestination(fullDest);
                                    setShowDestinationSelector(false);
                                  }}
                                  className={`px-3 py-3 rounded-2xl text-[13px] font-bold transition-all border ${
                                    isSelected
                                    ? 'bg-[#1344FF] border-[#1344FF] text-white shadow-md'
                                    : 'bg-white border-[#f3f4f6] text-[#444444] hover:bg-blue-50 hover:border-blue-100 hover:text-[#1344FF]'
                                  }`}
                                >
                                  {t.travelName}
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                </div> {/* relative end */}
              </div> {/* col-span-3 end */}

              <div className="lg:col-span-2">
                <label className="block text-sm font-bold text-[#444444] mb-3 flex items-center gap-2 h-5">
                  <Calendar className="w-4 h-4 text-[#1344FF]" />
                  여행 기간 <span className="text-red-500">*</span>
                </label>

                <div className="flex items-center gap-4 h-[46px]">
                  <div className="relative flex-[1.2] border-b-2 border-[#e5e7eb] focus-within:border-[#1344FF] transition-colors pb-2 flex items-center h-full">
                    <input
                      type="number"
                      min="1"
                      value={days}
                      onChange={(e) => {
                        const d = parseInt(e.target.value) || 1;
                        const n = Math.max(0, d - 1);
                        setDays(d);
                        setNights(n);
                        setDuration(`${n}박 ${d}일`);
                      }}
                      className="w-full bg-transparent text-lg font-medium focus:outline-none pr-8 text-[#1a1a1a]"
                      required
                    />
                    <span className="absolute right-0 bottom-2.5 text-base font-bold text-[#999999]">일</span>
                  </div>
                  
                  <ChevronRight className="w-5 h-5 text-gray-300 shrink-0" />
                  
                  <div className="flex-1 bg-[#1344FF] rounded-2xl h-full shadow-lg shadow-blue-100 flex items-center justify-center whitespace-nowrap transform hover:rotate-1 transition-transform cursor-default px-4">
                    <div className="text-white text-lg font-medium tracking-tight">
                      {nights}박 {days}일
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-[11px] text-[#999999] font-medium">* 일자만 입력하면 숙박 일수가 자동으로 계산됩니다.</p>
              </div> {/* col-span-2 end */}
            </div> {/* grid end */}

            {/* 태그 선택 */}
            <div className="mb-2">
              <label className="block text-sm font-bold text-[#444444] mb-3">
                이 여행을 설명하는 키워드
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 border ${
                        isSelected
                          ? 'bg-[#1344FF] border-[#1344FF] text-white shadow-lg shadow-blue-100 scale-105'
                          : 'bg-white border-[#e5e7eb] text-[#666666] hover:border-[#1344FF] hover:text-[#1344FF]'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 여행 후기 본문 - Custom Notion Style Editor */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-[#1a1a1a]">여행 후기 <span className="text-red-500">*</span></h2>
              <div className="text-xs font-bold text-[#999999] bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 flex items-center gap-2">
                <span>메뉴 열기</span>
                <span className="bg-white px-1.5 py-0.5 rounded border border-gray-200 font-mono text-[10px] text-[#1344FF]">/</span>
              </div>
            </div>
            
            <div className="min-h-[500px] border border-[#e5e7eb] rounded-2xl bg-white focus-within:ring-4 focus-within:ring-[#1344FF]/5 focus-within:border-[#1344FF] transition-all overflow-hidden">
               <BlockNoteView editor={editor} theme="light" />
            </div>
          </div>

          {/* 상세 일정 */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-[#1a1a1a]">상세 일정</h2>
              <button
                type="button"
                onClick={() => setShowPlanModal(true)}
                className="flex items-center gap-2 bg-[#1344FF] text-white px-5 py-2.5 rounded-xl hover:bg-[#0d34cc] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-100 font-bold text-sm"
              >
                <Copy className="w-4 h-4" />
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
                    <div className="space-y-4 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100 italic">
                      {day.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex gap-4 relative">
                          <div className="w-9 h-9 rounded-full bg-white border-2 border-[#1344FF] flex items-center justify-center text-[10px] font-black text-[#1344FF] z-10 shrink-0 shadow-sm">
                            {idx + 1}
                          </div>
                          <div className="flex-1 bg-[#f8f9fa] hover:bg-white hover:shadow-md transition-all p-4 rounded-2xl border border-transparent hover:border-[#efefef]">
                            <div className="flex justify-between items-start mb-1">
                              <p className="font-bold text-[#1a1a1a]">{item.place}</p>
                              <span className="text-[11px] font-bold text-[#1344FF] bg-blue-50 px-2 py-0.5 rounded-md">{item.time}</span>
                            </div>
                            <p className="text-sm text-[#666666] line-clamp-1">{item.description}</p>
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
              className="flex-1 py-5 border border-[#e5e7eb] text-[#666666] rounded-2xl hover:bg-gray-50 transition-all font-bold text-lg"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-[2] py-5 bg-[#1344FF] text-white rounded-2xl hover:bg-[#0d34cc] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-100 font-black text-lg"
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
