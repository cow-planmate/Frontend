import React from 'react';
import { MessageCircle, Users, ExternalLink } from 'lucide-react';

interface FriendSectionProps {
  friends: any[];
  onOpenChat: (user: any) => void;
}

export const FriendSection: React.FC<FriendSectionProps> = ({ friends, onOpenChat }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-[500px]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-[#1344FF]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">내 친구</h3>
            <p className="text-xs text-gray-500">전체 {friends.length}명</p>
          </div>
        </div>
        <button className="text-[#1344FF] text-sm font-medium hover:underline flex items-center gap-1">
          전체보기 <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {friends.map((friend) => (
          <div key={friend.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src={friend.profileLogo} 
                  alt={friend.nickName} 
                  className="w-12 h-12 rounded-full object-cover border border-gray-100"
                />
                <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                  friend.status === 'online' ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm group-hover:text-[#1344FF] transition-colors">{friend.nickName}</h4>
                <p className="text-xs text-gray-500">{friend.lastSeen}</p>
              </div>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onOpenChat(friend);
              }}
              className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-[#1344FF] hover:text-white transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
