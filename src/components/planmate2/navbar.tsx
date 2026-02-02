import { LogOut, MapPin, Menu, User, X } from 'lucide-react';
import { useState } from 'react';
import { useApiClient } from '../../hooks/useApiClient';
import useNicknameStore from '../../store/Nickname';
// @ts-ignore
import Login from '../auth/Login';
// @ts-ignore
import Signup from '../auth/Signup';
// @ts-ignore
import PasswordFind from '../auth/PasswordFind';
// @ts-ignore
import Theme from '../auth/Theme';
// @ts-ignore
import Themestart from '../auth/Themestart';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: 'feed' | 'community' | 'create' | 'mypage' | 'plan-maker') => void;
}

export default function Navbar({ currentView, onNavigate }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  // 인증 관련 상태
  const { isAuthenticated, logout } = useApiClient();
  const { gravatar } = useNicknameStore();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isPasswordFindOpen, setIsPasswordFindOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isThemestartOpen, setIsThemestartOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
    window.location.reload();
  };

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
              className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
                currentView === 'feed'
                  ? 'bg-[#1344FF] text-white shadow-md'
                  : 'text-[#666666] hover:bg-[#f0f4ff] hover:text-[#1344FF]'
              }`}
            >
              여행기 피드
            </button>
            <button
              onClick={() => onNavigate('community')}
              className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
                currentView === 'community'
                  ? 'bg-[#1344FF] text-white shadow-md'
                  : 'text-[#666666] hover:bg-[#f0f4ff] hover:text-[#1344FF]'
              }`}
            >
              커뮤니티
            </button>
            <button
              onClick={() => onNavigate('plan-maker')}
              className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
                currentView === 'plan-maker'
                  ? 'bg-[#1344FF] text-white shadow-md'
                  : 'text-[#666666] hover:bg-[#f0f4ff] hover:text-[#1344FF]'
              }`}
            >
              여행 일정 생성
            </button>

            {isAuthenticated() ? (
              <div className="flex items-center gap-2 ml-2 relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className={`p-1 rounded-xl transition-all ${
                    currentView === 'mypage' || isProfileMenuOpen
                      ? 'ring-2 ring-[#1344FF] ring-offset-2'
                      : 'hover:bg-[#f0f4ff]'
                  }`}
                >
                  {gravatar ? (
                    <img src={gravatar} alt="Profile" className="w-10 h-10 rounded-xl" />
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6 text-[#666666]" />
                    </div>
                  )}
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsProfileMenuOpen(false)}
                    ></div>
                    <div className="absolute top-14 right-0 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2">
                      <button
                        onClick={() => {
                          onNavigate('mypage');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-[#1344FF] transition-colors"
                      >
                        <User className="w-4 h-4" />
                        마이페이지
                      </button>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        로그아웃
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="px-6 py-2.5 rounded-xl font-bold bg-[#f0f4ff] text-[#1344FF] hover:bg-[#e0e7ff] transition-all ml-2"
              >
                로그인
              </button>
            )}
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
              className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
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
              className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
                currentView === 'community'
                  ? 'bg-[#1344FF] text-white'
                  : 'text-[#666666] hover:bg-[#f0f4ff] hover:text-[#1344FF]'
              }`}
            >
              커뮤니티
            </button>
            <button
              onClick={() => {
                onNavigate('plan-maker');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
                currentView === 'plan-maker'
                  ? 'bg-[#1344FF] text-white'
                  : 'text-[#666666] hover:bg-[#f0f4ff] hover:text-[#1344FF]'
              }`}
            >
              여행 일정 생성
            </button>
            
            {isAuthenticated() ? (
              <>
                <button
                  onClick={() => {
                    onNavigate('mypage');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${
                    currentView === 'mypage'
                      ? 'bg-[#1344FF] text-white'
                      : 'text-[#666666] hover:bg-[#f0f4ff] hover:text-[#1344FF]'
                  }`}
                >
                  {gravatar ? (
                    <img src={gravatar} alt="Profile" className="w-8 h-8 rounded-lg" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                  마이페이지
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsLoginOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-center px-4 py-3 rounded-xl font-bold bg-[#f0f4ff] text-[#1344FF] hover:bg-[#e0e7ff] transition-all"
              >
                로그인
              </button>
            )}
          </div>
        )}
      </div>

      {/* 인증 모달들 */}
      <Login
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onPasswordFindOpen={() => {
          setIsLoginOpen(false);
          setIsPasswordFindOpen(true);
        }}
        onSignupOpen={() => {
          setIsLoginOpen(false);
          setIsSignupOpen(true);
        }}
        onLoginSuccess={handleLoginSuccess}
      />
      <Signup
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onLoginOpen={() => {
          setIsSignupOpen(false);
          setIsLoginOpen(true);
        }}
        onThemeOpen={() => {
          setIsSignupOpen(false);
          setIsThemeOpen(true);
        }}
      />
      <PasswordFind
        isOpen={isPasswordFindOpen}
        onClose={() => setIsPasswordFindOpen(false)}
      />
      <Theme
        isOpen={isThemeOpen}
        onClose={() => setIsThemeOpen(false)}
        onThemestartOpen={() => {
          setIsThemeOpen(false);
          setIsThemestartOpen(true);
        }}
      />
      <Themestart
        isOpen={isThemestartOpen}
        onClose={() => setIsThemestartOpen(false)}
      />
    </nav>
  );
}
