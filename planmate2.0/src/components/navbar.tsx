import React, { useState } from 'react';
import { Menu, X, MapPin, User, PlusCircle } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: 'feed' | 'community' | 'create' | 'mypage') => void;
}

export default function Navbar({ currentView, onNavigate }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-[#e5e7eb] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* 로고 */}
          <div className="flex items-center cursor-pointer group" onClick={() => onNavigate('feed')}>
            <div className="w-10 h-10 bg-[#1344FF] rounded-xl flex items-center justify-center group-hover:bg-[#0d34cc] transition-all">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <span className="ml-3 text-xl font-bold text-[#1a1a1a] group-hover:text-[#1344FF] transition-colors">가져가는 여행기</span>
          </div>

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => onNavigate('feed')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                currentView === 'feed'
                  ? 'bg-[#1344FF] text-white shadow-md'
                  : 'text-[#666666] hover:bg-[#f0f4ff] hover:text-[#1344FF]'
              }`}
            >
              여행기 피드
            </button>
            <button
              onClick={() => onNavigate('community')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                currentView === 'community'
                  ? 'bg-[#1344FF] text-white shadow-md'
                  : 'text-[#666666] hover:bg-[#f0f4ff] hover:text-[#1344FF]'
              }`}
            >
              커뮤니티
            </button>
            <button
              onClick={() => onNavigate('create')}
              className="flex items-center gap-2 bg-[#1344FF] text-white px-6 py-2.5 rounded-lg hover:bg-[#0d34cc] transition-all shadow-md font-medium ml-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span>여행기 작성</span>
            </button>
            <button
              onClick={() => onNavigate('mypage')}
              className={`p-2.5 rounded-lg transition-all ml-2 ${
                currentView === 'mypage'
                  ? 'bg-[#1344FF] text-white shadow-md'
                  : 'text-[#666666] hover:bg-[#f0f4ff] hover:text-[#1344FF]'
              }`}
            >
              <User className="w-6 h-6" />
            </button>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#666666] hover:text-[#1344FF] p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-[#e5e7eb]">
            <button
              onClick={() => {
                onNavigate('feed');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                currentView === 'feed'
                  ? 'bg-[#1344FF] text-white'
                  : 'text-[#666666] hover:bg-[#f0f4ff] hover:text-[#1344FF]'
              }`}
            >
              여행기 피드
            </button>
            <button
              onClick={() => {
                onNavigate('community');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                currentView === 'community'
                  ? 'bg-[#1344FF] text-white'
                  : 'text-[#666666] hover:bg-[#f0f4ff] hover:text-[#1344FF]'
              }`}
            >
              커뮤니티
            </button>
            <button
              onClick={() => {
                onNavigate('create');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 justify-center bg-[#1344FF] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#0d34cc] transition-all"
            >
              <PlusCircle className="w-5 h-5" />
              <span>여행기 작성</span>
            </button>
            <button
              onClick={() => {
                onNavigate('mypage');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                currentView === 'mypage'
                  ? 'bg-[#1344FF] text-white'
                  : 'text-[#666666] hover:bg-[#f0f4ff] hover:text-[#1344FF]'
              }`}
            >
              마이페이지
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
