import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, Plus, X, MapPin, Calendar, Clock, Image as ImageIcon, Copy, GripVertical, Type, List, Heading1, Heading2, Heading3, CheckSquare, Quote } from 'lucide-react';

interface CreatePostProps {
  onBack: () => void;
  onSubmit: () => void;
}

// --- Block Editor Types & Components ---

type BlockType = 'text' | 'h1' | 'h2' | 'h3' | 'bullet' | 'number' | 'quote' | 'image';

interface Block {
  id: string;
  type: BlockType;
  content: string;
  imageUrl?: string; // For image blocks
}

// Initial Data for testing
const INITIAL_BLOCKS: Block[] = [
  { id: 'b1', type: 'h1', content: '' },
  { id: 'b2', type: 'text', content: '' },
];

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

// Utility to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Auto-resizing Textarea Component
const BlockInput = ({
  block,
  onUpdate,
  onKeyDown,
  onFocus,
  autoFocus
}: {
  block: Block;
  onUpdate: (content: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onFocus: () => void;
  autoFocus?: boolean;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto resize
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [block.content, block.type]);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      // Move cursor to end
      textareaRef.current.focus();
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, [autoFocus]);

  const getPlaceholder = () => {
    switch (block.type) {
      case 'h1': return '제목 1';
      case 'h2': return '제목 2';
      case 'h3': return '제목 3';
      case 'quote': return '인용구 입력...';
      case 'bullet': return '목록 입력...';
      default: return `내용을 입력하세요 ('/'를 눌러 명령어 확인)`;
    }
  };

  const getStyles = () => {
    const base = "w-full bg-transparent resize-none outline-none leading-relaxed overflow-hidden block";
    switch (block.type) {
      case 'h1': return `${base} text-3xl font-bold mb-2 placeholder:text-gray-300`;
      case 'h2': return `${base} text-2xl font-bold mb-2 mt-4 placeholder:text-gray-300`;
      case 'h3': return `${base} text-xl font-bold mb-1 mt-2 placeholder:text-gray-300`;
      case 'quote': return `${base} text-lg text-gray-600 italic border-l-4 border-gray-300 pl-4 py-1 my-2`;
      case 'bullet': return `${base} text-base`; // Bullet logic handled in parent wrapper usually, or here
      default: return `${base} text-base text-[#1a1a1a] min-h-[1.5em]`;
    }
  };

  return (
    <textarea
      ref={textareaRef}
      value={block.content}
      onChange={(e) => onUpdate(e.target.value)}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      placeholder={getPlaceholder()}
      className={getStyles()}
      rows={1}
    />
  );
};

// --- Main Editor Component ---

const NotionEditor = ({ blocks, setBlocks }: { blocks: Block[], setBlocks: React.Dispatch<React.SetStateAction<Block[]>> }) => {
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [menuSearch, setMenuSearch] = useState('');
  
  // Drag and Drop state
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Update a block
  const updateBlock = (id: string, updates: Partial<Block>) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  // Add block
  const addBlock = (afterId: string, type: BlockType = 'text') => {
    const newBlock: Block = { id: generateId(), type, content: '' };
    const idx = blocks.findIndex(b => b.id === afterId);
    if (idx === -1) return;
    
    const newBlocks = [...blocks];
    newBlocks.splice(idx + 1, 0, newBlock);
    setBlocks(newBlocks);
    setFocusedBlockId(newBlock.id);
  };

  // Remove block
  const removeBlock = (id: string) => {
    if (blocks.length <= 1) return; // Don't delete last block
    const idx = blocks.findIndex(b => b.id === id);
    const prevBlock = blocks[idx - 1];
    
    const newBlocks = blocks.filter(b => b.id !== id);
    setBlocks(newBlocks);
    
    if (prevBlock) {
      setFocusedBlockId(prevBlock.id);
    }
  };

  // Key Handlers
  const handleKeyDown = (e: React.KeyboardEvent, block: Block, index: number) => {
    if (menuOpen) {
       // Menu navigation logic could go here
       if (e.key === 'Escape') setMenuOpen(false);
       return;
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (block.type === 'bullet' || block.type === 'number') {
         // Continue list
         addBlock(block.id, block.type);
      } else {
         addBlock(block.id, 'text');
      }
    } else if (e.key === 'Backspace' && block.content === '') {
      e.preventDefault();
      removeBlock(block.id);
    } else if (e.key === '/') {
       // Delay slightly to let the '/' type in, then calculate position?
       // Actually common pattern is to just open menu and NOT type '/' if it's empty
       // But user might want to type '/'. 
       // Simple approach: Let it type, checking value in onChange. 
       // Better: If text is empty or just '/', show menu.
    } else if (e.key === 'ArrowUp') {
       if (index > 0) {
         e.preventDefault();
         setFocusedBlockId(blocks[index - 1].id);
       }
    } else if (e.key === 'ArrowDown') {
       if (index < blocks.length - 1) {
         e.preventDefault();
         setFocusedBlockId(blocks[index + 1].id);
       }
    }
  };

  // Check for slash command
  const handleContentChange = (block: Block, newContent: string) => {
    updateBlock(block.id, { content: newContent });
    
    if (newContent === '/') {
        // Find the element to position menu
        // This is a bit hacky without ref access to exact cursor, but works for "start of line" slash
        const element = document.activeElement as HTMLElement;
        if (element) {
           const rect = element.getBoundingClientRect();
           setMenuPosition({ 
               top: rect.bottom + window.scrollY + 5, 
               left: rect.left + window.scrollX 
           });
           setMenuOpen(true);
           setMenuSearch('');
        }
    } else if (menuOpen && !newContent.startsWith('/')) {
        setMenuOpen(false);
    }
  };

  const selectMenuOption = (type: BlockType) => {
     if (!focusedBlockId) return;
     updateBlock(focusedBlockId, { type, content: '' }); // Clear the '/'
     setMenuOpen(false);
     
     // Special handling for image (might want to auto-open upload)
     if (type === 'image') {
        // Maybe set a placeholder or trigger file input
     }
  };

  // --- Drag and Drop Logic (HTML5 Native) ---
  const onDragStart = (e: React.DragEvent, id: string) => {
    setDraggedBlockId(id);
    e.dataTransfer.effectAllowed = 'move';
    // Transparent drag image hack if needed, but default is usually fine
  };

  const onDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault(); // Necessary for drop
    if (!draggedBlockId || draggedBlockId === targetId) return;
  };

  const onDrop = (e: React.DragEvent, targetId: string) => {
     e.preventDefault();
     if (!draggedBlockId || draggedBlockId === targetId) return;
     
     const fromIndex = blocks.findIndex(b => b.id === draggedBlockId);
     const toIndex = blocks.findIndex(b => b.id === targetId);
     
     const newBlocks = [...blocks];
     const [movedBlock] = newBlocks.splice(fromIndex, 1);
     newBlocks.splice(toIndex, 0, movedBlock);
     
     setBlocks(newBlocks);
     setDraggedBlockId(null);
  };

  const MENU_OPTIONS = [
    { type: 'text', label: '텍스트', icon: <Type className="w-4 h-4" /> },
    { type: 'h1', label: '제목 1', icon: <Heading1 className="w-4 h-4" /> },
    { type: 'h2', label: '제목 2', icon: <Heading2 className="w-4 h-4" /> },
    { type: 'h3', label: '제목 3', icon: <Heading3 className="w-4 h-4" /> },
    { type: 'bullet', label: '글머리 기호', icon: <List className="w-4 h-4" /> },
    { type: 'quote', label: '인용구', icon: <Quote className="w-4 h-4" /> },
    { type: 'image', label: '이미지', icon: <ImageIcon className="w-4 h-4" /> },
  ];

  return (
    <div className="relative min-h-[400px] pb-32">
       {blocks.map((block, index) => (
         <div 
           key={block.id}
           className="group relative flex items-start gap-2 mb-1 px-2"
           onDragOver={(e) => onDragOver(e, block.id)}
           onDrop={(e) => onDrop(e, block.id)}
         >
            {/* Drag Handle & Plus Button */}
            <div 
               className="absolute left-[-2rem] top-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center"
               contentEditable={false}
            >
               <div 
                 className="p-1 cursor-grab active:cursor-grabbing text-gray-400 hover:bg-gray-100 rounded"
                 draggable
                 onDragStart={(e) => onDragStart(e, block.id)}
               >
                 <GripVertical className="w-4 h-4" />
               </div>
               <button 
                 onClick={() => addBlock(block.id)}
                 className="p-1 text-gray-400 hover:bg-gray-100 rounded"
               >
                 <Plus className="w-4 h-4" />
               </button>
            </div>

            {/* Block Content Renderer */}
            <div className="flex-1 min-w-0">
               {block.type === 'bullet' && (
                 <div className="flex items-start gap-2">
                    <span className="text-xl leading-relaxed select-none">•</span>
                    <BlockInput 
                        block={block} 
                        onUpdate={(v) => handleContentChange(block, v)}
                        onKeyDown={(e) => handleKeyDown(e, block, index)}
                        onFocus={() => setFocusedBlockId(block.id)}
                        autoFocus={focusedBlockId === block.id}
                    />
                 </div>
               )}
               
               {block.type === 'image' ? (
                 <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-col items-center justify-center gap-2 group/image">
                    {block.imageUrl ? (
                        <div className="relative w-full">
                           <img src={block.imageUrl} alt="Uploaded" className="w-full rounded-lg" />
                           <button 
                             onClick={() => updateBlock(block.id, { imageUrl: undefined })}
                             className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100"
                           >
                             <X className="w-4 h-4" />
                           </button>
                        </div>
                    ) : (
                        <div className="w-full">
                           <div className="flex items-center gap-2 mb-2 justify-center text-gray-400">
                              <ImageIcon className="w-8 h-8" />
                              <span className="text-sm">이미지 URL을 입력하거나 업로드하세요</span>
                           </div>
                           <input 
                             type="text"
                             placeholder="이미지 URL 입력..."
                             className="w-full px-3 py-2 border rounded text-sm"
                             onKeyDown={(e) => {
                               if (e.key === 'Enter') {
                                 e.preventDefault();
                                 updateBlock(block.id, { imageUrl: (e.target as HTMLInputElement).value });
                               } else if (e.key === 'Backspace' && !(e.target as HTMLInputElement).value) {
                                   removeBlock(block.id);
                               }
                             }}
                             autoFocus
                           />
                           {/* Fallback delete if stuck */}
                           <button 
                             onClick={() => removeBlock(block.id)} 
                             className="text-xs text-red-500 mt-2 hover:underline"
                           >
                             블록 삭제
                           </button>
                        </div>
                    )}
                 </div>
               ) : block.type !== 'bullet' && (
                 <BlockInput 
                    block={block} 
                    onUpdate={(v) => handleContentChange(block, v)}
                    onKeyDown={(e) => handleKeyDown(e, block, index)}
                    onFocus={() => setFocusedBlockId(block.id)}
                    autoFocus={focusedBlockId === block.id}
                 />
               )}
            </div>
         </div>
       ))}

       {/* Floating Slash Menu */}
       {menuOpen && menuPosition && (
         <div 
           ref={menuRef}
           className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 w-64 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
           style={{ top: menuPosition.top, left: menuPosition.left }}
         >
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500">
               기본 블록
            </div>
            <div className="max-h-64 overflow-y-auto py-1">
               {MENU_OPTIONS.map((option) => (
                 <button
                   key={option.type}
                   onClick={() => selectMenuOption(option.type as BlockType)}
                   className="w-full flex items-center gap-3 px-3 py-2 hover:bg-blue-50 text-left transition-colors"
                 >
                    <div className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center bg-white text-gray-600">
                       {option.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{option.label}</span>
                 </button>
               ))}
            </div>
         </div>
       )}
    </div>
  );
};


// --- Page Component ---

export default function CreatePost({ onBack, onSubmit }: CreatePostProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  
  // Custom Editor State
  const [blocks, setBlocks] = useState<Block[]>(INITIAL_BLOCKS);

  // 플랜 선택 모달
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [schedule, setSchedule] = useState<any[]>([]);

  const tags = ['#뚜벅이최적화', '#극한의J', '#여유로운P', '#동선낭비없는'];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan);
    setDestination(plan.destination);
    setDuration(plan.duration);
    setSchedule(plan.schedule);
    setShowPlanModal(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !destination || !duration) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }
    // Serialize blocks to JSON or HTML here if needed for backend
    console.log('Submitted Blocks:', blocks);
    
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
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                  <img src={coverImage} alt="대표 이미지" className="w-full h-64 object-cover rounded-lg" />
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
                  className="border-2 border-dashed border-[#e5e7eb] rounded-lg p-8 text-center hover:border-[#1344FF] transition-colors cursor-pointer"
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
                className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1344FF] transition-colors"
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
                className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1344FF] transition-colors resize-none"
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
                    className="w-full pl-12 pr-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1344FF] transition-colors"
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
                    className="w-full pl-12 pr-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:border-[#1344FF] transition-colors"
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
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <span className="bg-gray-100 px-2 py-1 rounded border border-gray-200 font-mono text-xs">/</span> 를 입력하여 메뉴 열기
              </div>
            </div>
            
            <div className="min-h-[500px] border border-[#e5e7eb] rounded-xl p-8 bg-white focus-within:ring-2 focus-within:ring-[#1344FF]/20 focus-within:border-[#1344FF] transition-all" onClick={() => {
                // Focus last block if clicking empty space at bottom
                if (blocks.length > 0) {
                  // Optional: Focus logic handled by blocks themselves, but this helps UX
                }
            }}>
               <NotionEditor blocks={blocks} setBlocks={setBlocks} />
            </div>
          </div>

          {/* 상세 일정 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1a1a1a]">상세 일정</h2>
              <button
                type="button"
                onClick={() => setShowPlanModal(true)}
                className="flex items-center gap-2 bg-[#1344FF] text-white px-4 py-2 rounded-lg hover:bg-[#0d34cc] transition-all shadow-sm"
              >
                <Copy className="w-5 h-5" />
                내 플랜 가져오기
              </button>
            </div>

            {schedule.length > 0 ? (
              <div className="space-y-6">
                {schedule.map((day) => (
                  <div key={day.day} className="border border-[#e5e7eb] rounded-lg p-4">
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
                        <div key={idx} className="flex gap-3 bg-[#f8f9fa] p-3 rounded-lg">
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
              <div className="text-center py-12 border-2 border-dashed border-[#e5e7eb] rounded-lg">
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
              className="flex-1 py-4 border border-[#e5e7eb] text-[#666666] rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-4 bg-[#1344FF] text-white rounded-lg hover:bg-[#0d34cc] transition-all shadow-md font-medium"
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
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-[#666666]" />
              </button>
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {MY_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => handlePlanSelect(plan)}
                  className="border border-[#e5e7eb] rounded-lg p-4 hover:border-[#1344FF] hover:bg-blue-50 cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-lg font-bold text-[#1a1a1a] mb-1">{plan.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-[#666666]">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {plan.destination}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {plan.duration}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-[#1344FF] font-medium">
                      {plan.startDate} ~ {plan.endDate}
                    </span>
                  </div>
                  <div className="text-sm text-[#666666]">
                    총 {plan.schedule.length}일 일정 · 
                    {plan.schedule.reduce((sum, day) => sum + day.items.length, 0)}개 장소
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
