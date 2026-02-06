import "@blocknote/core/fonts/inter.css";
import { ko } from "@blocknote/core/locales";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { ArrowLeft, MapPin, Send, Star, Users } from 'lucide-react';
import React, { useMemo, useState } from 'react';

interface CommunityCreateProps {
  type: 'free' | 'qna' | 'mate' | 'recommend';
  onBack: () => void;
  onSubmit: () => void;
}

export default function CommunityCreate({ type, onBack, onSubmit }: CommunityCreateProps) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState('5.0');
  const [mateCount, setMateCount] = useState('2');
  
  // BlockNote Editor 초기 설정
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

  const getTitle = () => {
    switch (type) {
      case 'free': return '자유게시판 글쓰기';
      case 'qna': return 'Q&A 질문하기';
      case 'mate': return '메이트 찾기 글쓰기';
      case 'recommend': return '장소 추천 글쓰기';
      default: return '글쓰기';
    }
  };

  const getTips = () => {
    switch (type) {
      case 'mate':
        return [
          "성별, 연령대 등 희망하는 메이트 성향을 적어주세요.",
          "여행 일정과 방문하고 싶은 장소를 공유하면 매칭이 빨라요.",
          "참여 방법(댓글, 오픈채팅 등)을 명확하게 알려주세요."
        ];
      case 'recommend':
        return [
          "직접 촬영한 고화질 사진을 첨부하면 인기가 많아요.",
          "장소의 특징, 분위기, 방문 꿀팁을 자세히 공유해주세요.",
          "정확한 위치와 주차, 영업시간 정보를 함께 적어주세요."
        ];
      case 'qna':
        return [
          "질문 제목에 핵심 키워드를 넣으면 답변을 더 빨리 받을 수 있어요.",
          "현재 상황(누구와, 언제, 예산 등)을 상세히 적어주세요.",
          "도움이 된 답변에는 꼭 감사의 인사를 전해주세요!"
        ];
      default:
        return [
          "'/'를 입력하여 텍스트 스타일, 목록, 이미지 등을 추가할 수 있습니다.",
          "여행과 관련된 즐거운 이야기를 들려주세요.",
          "서로 존중하는 따뜻한 커뮤니티를 만들어가요."
        ];
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || editor.document.length === 0) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }
    
    // 블록 데이터를 JSON으로 변환 (제출 시 필요)
    const blocks = editor.document;
    
    // API 호출 로직이 들어갈 곳
    console.log('Post submitted:', { 
      type, 
      title, 
      blocks, 
      ...(type === 'recommend' && { location, rating }),
      ...(type === 'mate' && { location, mateCount })
    });
    onSubmit();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#1a1a1a]" />
          </button>
          <h1 className="text-xl font-bold text-[#1a1a1a]">{getTitle()}</h1>
        </div>
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-4 py-2 bg-[#1344FF] text-white rounded-lg font-bold hover:bg-[#0d34cc] transition-all shadow-sm text-sm"
        >
          <Send className="w-4 h-4" />
          등록
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Title Input */}
        <div className="border-b border-gray-100">
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-6 py-4 text-lg font-bold focus:outline-none placeholder:text-gray-300"
          />
        </div>

        {/* 장소 추천 전용 입력 필드 */}
        {type === 'recommend' && (
          <div className="flex border-b border-gray-50 bg-emerald-50/20">
            <div className="flex-1 border-r border-gray-100 flex items-center px-6 py-3 gap-2">
              <MapPin className="w-4 h-4 text-emerald-500" />
              <input
                type="text"
                placeholder="위치 (예: 제주도 애월읍)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent text-sm font-medium focus:outline-none w-full"
              />
            </div>
            <div className="flex items-center px-6 py-3 gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <select 
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
              >
                {[5.0, 4.5, 4.0, 3.5, 3.0, 2.5, 2.0].map(r => (
                  <option key={r} value={r.toFixed(1)}>{r.toFixed(1)}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* 메이트 찾기 전용 입력 필드 */}
        {type === 'mate' && (
          <div className="flex border-b border-gray-50 bg-blue-50/20">
            <div className="flex-1 border-r border-gray-100 flex items-center px-6 py-3 gap-2">
              <MapPin className="w-4 h-4 text-[#1344FF]" />
              <input
                type="text"
                placeholder="여행 희망 지역"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent text-sm font-medium focus:outline-none w-full placeholder:text-blue-300"
              />
            </div>
            <div className="flex items-center px-6 py-3 gap-3">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#1344FF]" />
                <span className="text-sm font-bold text-gray-700 whitespace-nowrap">모집 인원</span>
              </div>
              <select 
                value={mateCount}
                onChange={(e) => setMateCount(e.target.value)}
                className="bg-transparent text-sm font-bold text-[#1344FF] focus:outline-none cursor-pointer"
              >
                {[2, 3, 4, 5, 6, 7, 8].map(n => (
                  <option key={n} value={n}>{n}명</option>
                ))}
                <option value="unlimited">인원 제한 없음</option>
              </select>
            </div>
          </div>
        )}

        {/* Content Input - BlockNote Editor */}
        <div className="px-2 py-4 bg-white min-h-[400px]">
          <BlockNoteView 
            editor={editor} 
            theme="light"
            className="min-h-[380px]"
          />
        </div>
      </div>

      {/* Guidelines or Tips */}
      <div className="mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
        <h3 className="text-xs font-bold text-[#1344FF] mb-1.5">💡 {type.toUpperCase()} 작성 팁</h3>
        <ul className="text-sm text-blue-700/80 space-y-1 list-disc list-inside">
          {getTips().map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
