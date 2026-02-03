import "@blocknote/core/fonts/inter.css";
import { ko } from "@blocknote/core/locales";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { ArrowLeft, Send } from 'lucide-react';
import React, { useMemo, useState } from 'react';

interface CommunityCreateProps {
  type: 'free' | 'qna' | 'mate';
  onBack: () => void;
  onSubmit: () => void;
}

export default function CommunityCreate({ type, onBack, onSubmit }: CommunityCreateProps) {
  const [title, setTitle] = useState('');
  
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
      default: return '글쓰기';
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
    console.log('Post submitted:', { type, title, blocks });
    onSubmit();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[#1a1a1a]" />
          </button>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">{getTitle()}</h1>
        </div>
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#1344FF] text-white rounded-xl font-bold hover:bg-[#0d34cc] transition-all shadow-md"
        >
          <Send className="w-4 h-4" />
          등록하기
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Title Input */}
        <div className="border-b border-gray-100">
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-8 py-6 text-xl font-bold focus:outline-none placeholder:text-gray-300"
          />
        </div>

        {/* Content Input - BlockNote Editor */}
        <div className="p-4 bg-white min-h-[500px]">
          <BlockNoteView 
            editor={editor} 
            theme="light"
            className="min-h-[480px]"
          />
        </div>
      </div>

      {/* Guidelines or Tips */}
      <div className="mt-6 p-6 bg-blue-50 rounded-2xl">
        <h3 className="text-sm font-bold text-[#1344FF] mb-2">💡 게시글 작성 팁</h3>
        <ul className="text-sm text-blue-700/80 space-y-1 list-disc list-inside">
          <li>'/'를 입력하여 텍스트 스타일, 목록, 이미지 등을 추가할 수 있습니다.</li>
          <li>여행지에 대한 구체적인 질문은 답변을 받기 더 쉬워요.</li>
          <li>사진을 함께 첨부하면 더 많은 관심을 받을 수 있어요.</li>
          <li>도움이 된 답변에는 추천을 눌러주세요.</li>
        </ul>
      </div>
    </div>
  );
}
