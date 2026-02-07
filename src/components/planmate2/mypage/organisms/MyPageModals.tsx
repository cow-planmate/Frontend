import { AlertCircle, Camera, Check, Eye, EyeOff, Settings, TriangleAlert, X } from 'lucide-react';
import React, { useState } from 'react';

interface MyPageModalsProps {
  // Common
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  
  // Profile Modal
  newNickname: string;
  handleNicknameUpdate: () => void;
  setNewNickname: (val: string) => void;
  newAge: number;
  setNewAge: (val: number) => void;
  newGender: number;
  setNewGender: (val: number) => void;
  isNicknameVerified: boolean;
  nicknameMessage: string;
  handleCheckNickname: () => void;
  nicknameValid: boolean | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dummyUser: any;
  onOpenThemeEditor: () => void;
  
  // Level Modal
  userStats: any;
  LEVEL_CONFIG: any;
  
  // Delete Modal
  handleDeleteAccount: () => void;
  
  // Password Modal
  currentPassword?: string;
  setCurrentPassword?: (val: string) => void;
  newPassword?: string;
  setNewPassword?: (val: string) => void;
  confirmPassword?: string;
  setConfirmPassword?: (val: string) => void;
  handlePasswordUpdate?: () => void;
  
  // Calendar Event Modal
  selectedDateEvents: any[];
  onNavigateDetail: (post: any) => void;
}

export const MyPageModals: React.FC<MyPageModalsProps> = ({
  activeModal,
  setActiveModal,
  newNickname,
  handleNicknameUpdate,
  setNewNickname,
  newAge,
  setNewAge,
  newGender,
  setNewGender,
  isNicknameVerified,
  nicknameMessage,
  nicknameValid,
  handleCheckNickname,
  handleImageUpload,
  dummyUser,
  userStats,
  LEVEL_CONFIG,
  onNavigateDetail,
  onOpenThemeEditor,
  handleDeleteAccount,
  currentPassword = '',
  setCurrentPassword = () => {},
  newPassword = '',
  setNewPassword = () => {},
  confirmPassword = '',
  setConfirmPassword = () => {},
  handlePasswordUpdate,
  currentPassword = '',
  setCurrentPassword = () => {},
  selectedDateEvents,
}) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!activeModal) return null;

  // 비밀번호 검증 로직 (회원가입과 동일하게)
  const passwordValidation = {
    hasMinLength: newPassword.length >= 8,
    hasMaxLength: newPassword.length <= 20,
    hasEnglish: /[a-zA-Z]/.test(newPassword),
    hasNumber: /[0-9]/.test(newPassword),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
  };
  
  const hasAllRequired = passwordValidation.hasEnglish && passwordValidation.hasNumber && passwordValidation.hasSpecialChar;
  const isPasswordValid = passwordValidation.hasMinLength && passwordValidation.hasMaxLength && hasAllRequired;

  const ValidationItem = ({ isValid, text }: { isValid: boolean; text: string }) => (
    <div className="flex items-center gap-2 text-[11px]">
      {isValid ? (
        <Check className="w-3.5 h-3.5 text-green-500" />
      ) : (
        <Check className="w-3.5 h-3.5 text-gray-300" />
      )}
      <span className={isValid ? "text-green-600 font-bold" : "text-gray-400 font-medium"}>
        {text}
      </span>
    </div>
  );

  return (
    <>
      {/* Profile Edit Modal */}
      {activeModal === 'profile' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <div className="relative h-32 bg-gradient-to-r from-[#1344FF] to-[#3B82F6]">
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-gray-100 shadow-lg">
                    <img src={dummyUser.profileLogo} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <label className="absolute bottom-0 right-0 p-2 bg-[#1344FF] rounded-full text-white cursor-pointer shadow-md hover:bg-[#0031E5] transition-all">
                    <Camera className="w-4 h-4" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>
            </div>
            
            <div className="pt-16 pb-8 px-8">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-[#1a1a1a]">프로필 수정</h3>
                <p className="text-sm text-gray-500 mt-1">나를 표현하는 정보를 변경해보세요</p>
              </div>

              <div className="max-h-[400px] overflow-y-auto pr-2 space-y-6 custom-scrollbar">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">이메일 계정</label>
                  <div className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-100 text-gray-400 text-sm font-medium">
                    {dummyUser.email}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">닉네임</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none ${
                          nicknameValid === true ? 'border-green-500 bg-green-50/30' : 
                          nicknameValid === false ? 'border-red-500 bg-red-50/30' : 
                          'border-gray-100 focus:border-[#1344FF] bg-gray-50'
                        }`}
                        value={newNickname}
                        onChange={(e) => setNewNickname(e.target.value)}
                        placeholder="새 닉네임을 입력하세요"
                      />
                      {nicknameValid !== null && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {nicknameValid ? <Check className="w-5 h-5 text-green-500" /> : <TriangleAlert className="w-5 h-5 text-red-500" />}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleCheckNickname}
                      className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition-all whitespace-nowrap"
                    >
                      중복 확인
                    </button>
                  </div>
                  {nicknameMessage && (
                    <p className={`text-[11px] mt-2 font-medium ${nicknameValid ? 'text-green-600' : 'text-red-600'}`}>
                      {nicknameMessage}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">나이</label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#1344FF] bg-gray-50 outline-none transition-all"
                      value={newAge}
                      onChange={(e) => setNewAge(parseInt(e.target.value) || 0)}
                      placeholder="나이"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">성별</label>
                    <div className="flex bg-gray-50 rounded-xl p-1 border-2 border-gray-100">
                      <button
                        onClick={() => setNewGender(0)}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${newGender === 0 ? 'bg-white text-[#1344FF] shadow-sm' : 'text-gray-400'}`}
                      >
                        남성
                      </button>
                      <button
                        onClick={() => setNewGender(1)}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${newGender === 1 ? 'bg-white text-[#1344FF] shadow-sm' : 'text-gray-400'}`}
                      >
                        여성
                      </button>
                    </div>
                  </div>
                </div>

                {/* 테마 및 비밀번호 수정 버튼 */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">여행 취향</label>
                    <button
                      onClick={onOpenThemeEditor}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 border-gray-100 hover:border-[#1344FF]/30 bg-gray-50 transition-all group"
                    >
                      <span className="text-xs font-bold text-gray-600">테마 변경</span>
                      <Settings className="w-4 h-4 text-gray-400 group-hover:text-[#1344FF] transition-colors" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">보안 설정</label>
                    <button
                      onClick={() => setActiveModal('changePassword')}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 border-gray-100 hover:border-[#1344FF]/30 bg-gray-50 transition-all group"
                    >
                      <span className="text-xs font-bold text-gray-600">비밀번호 변경</span>
                      <Settings className="w-4 h-4 text-gray-400 group-hover:text-[#1344FF] transition-colors" />
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleNicknameUpdate}
                disabled={newNickname !== dummyUser.nickName && !isNicknameVerified}
                className="w-full py-4 mt-6 bg-[#1344FF] text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-[#0031E5] transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                변경사항 저장하기
              </button>

              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
                <button 
                  onClick={() => setActiveModal('deleteAccount')}
                  className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors flex items-center gap-2"
                >
                  <TriangleAlert className="w-4 h-4" />
                  계정 탈퇴하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 비밀번호 변경 모달 */}
      {activeModal === 'changePassword' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActiveModal(null)} />
          <div className="relative bg-white rounded-3xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 shadow-2xl">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-[#1a1a1a]">비밀번호 변경</h2>
                  <p className="text-gray-400 text-sm font-medium mt-1">보안을 위해 새로운 비밀번호를 입력해주세요.</p>
                </div>
                <button 
                  onClick={() => setActiveModal('profile')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">현재 비밀번호</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#1344FF] bg-gray-50 outline-none transition-all font-medium"
                      placeholder="현재 비밀번호 입력"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                    >
                      {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">새 비밀번호</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none font-medium ${
                        newPassword ? (isPasswordValid ? 'border-green-500 bg-green-50/10' : 'border-blue-500 bg-blue-50/10') : 'border-gray-100 bg-gray-50'
                      }`}
                      placeholder="새로운 비밀번호 입력"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  <div className="mt-2 p-4 bg-[#F8F9FA] rounded-2xl space-y-2.5 border border-[#F1F3F5]">
                    <ValidationItem
                      isValid={passwordValidation.hasMinLength}
                      text="최소 8자"
                    />
                    <ValidationItem
                      isValid={hasAllRequired}
                      text="영문, 숫자, 특수문자 3가지 조합"
                    />
                    {newPassword && !passwordValidation.hasMaxLength && (
                      <p className="text-red-500 text-[10px] font-bold mt-1 pl-6">최대 20자까지 가능합니다.</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">비밀번호 재입력</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none font-medium ${
                        confirmPassword ? (newPassword === confirmPassword ? 'border-green-500 bg-green-50/10' : 'border-red-500 bg-red-50/10') : 'border-gray-100 bg-gray-50'
                      }`}
                      placeholder="비밀번호 다시 입력"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-red-500 text-[10px] font-bold mt-2 ml-1">비밀번호가 일치하지 않습니다.</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-10">
                <button
                  onClick={() => setActiveModal('profile')}
                  className="flex-1 py-4 px-6 rounded-2xl bg-gray-100 text-gray-500 text-sm font-black hover:bg-gray-200 transition-all"
                >
                  취소
                </button>
                <button
                  onClick={handlePasswordUpdate}
                  disabled={!currentPassword || !isPasswordValid || newPassword !== confirmPassword}
                  className="flex-[2] py-4 px-6 rounded-2xl bg-[#1344FF] text-white text-sm font-black hover:bg-[#0d34cc] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
                >
                  비밀번호 변경 완료
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Level Details Modal */}
      {activeModal === 'level' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-bold text-[#1a1a1a] flex items-center gap-2">
                <span className="w-2 h-6 bg-[#1344FF] rounded-full"></span>
                등급 및 혜택 안내
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-white rounded-full transition-all">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {Object.entries(LEVEL_CONFIG).map(([lvl, config]: [string, any]) => (
                <div 
                  key={lvl} 
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    userStats.level === lvl 
                      ? 'border-[#1344FF] bg-blue-50/50 ring-4 ring-blue-50' 
                      : 'border-gray-50 bg-white opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${userStats.level === lvl ? 'bg-[#1344FF] text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {userStats.level === lvl ? <Check className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
                      </div>
                      <div>
                        <span className="text-sm font-bold block">{lvl}</span>
                        <span className="text-[11px] text-gray-400 font-medium tracking-wider uppercase">{config.exp} EXP</span>
                      </div>
                    </div>
                    {userStats.level === lvl && (
                      <span className="bg-[#1344FF] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">Current</span>
                    )}
                  </div>
                  <ul className="space-y-2">
                    {config.perks.map((perk: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className={`w-1 h-1 rounded-full ${userStats.level === lvl ? 'bg-[#1344FF]' : 'bg-gray-300'}`} />
                        {perk}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="p-6 bg-gray-50">
              <button 
                onClick={() => setActiveModal(null)}
                className="w-full py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-sm"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {activeModal === 'deleteAccount' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-center">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-8 animate-in zoom-in duration-200">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-12">
              <TriangleAlert className="w-10 h-10 -rotate-12" />
            </div>
            <h3 className="text-2xl font-bold text-[#1a1a1a] mb-2">정말 떠나시나요?</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              계정을 삭제하면 그동안의 여행 기록과<br />
              커뮤니티 활동 정보가 <strong>즉시 소멸</strong>됩니다.<br />
              이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDeleteAccount}
                className="w-full py-4 bg-red-500 text-white rounded-xl font-bold shadow-lg shadow-red-100 hover:bg-red-600 transition-all"
              >
                계정 영구 삭제
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-4 text-gray-400 font-bold hover:text-gray-600 transition-all"
              >
                조금 더 생각해볼게요
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Event Modal */}
      {activeModal === 'eventDetail' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 flex items-center justify-between border-b border-gray-50 bg-gray-50/50">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#1344FF]" />
                <span className="font-bold text-[#1a1a1a]">이 날의 여행 일정</span>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-white rounded-full transition-all">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {selectedDateEvents.map((event, i) => (
                <div 
                  key={i} 
                  onClick={() => onNavigateDetail(event)}
                  className="group p-4 rounded-2xl border-2 border-gray-50 hover:border-[#1344FF] hover:bg-blue-50/50 transition-all cursor-pointer"
                >
                  <p className="text-xs font-bold text-[#1344FF] mb-1">{event.type === 'travel' ? '여행기' : '계획'}</p>
                  <h4 className="font-bold text-gray-900 group-hover:text-[#1344FF] transition-colors">{event.title}</h4>
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    📍 {event.destination}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
