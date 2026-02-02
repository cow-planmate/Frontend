import React, { useState } from 'react';
import MainFeed from './components/main-feed';
import CommunityTab from './components/community-tab';
import PostDetail from './components/post-detail';
import CreatePost from './components/create-post';
import MyPage from './components/my-page';
import Navbar from './components/navbar';

import BoardList from './components/board-list';

export default function App() {
  const [currentView, setCurrentView] = useState<'feed' | 'community' | 'detail' | 'create' | 'mypage' | 'board-list'>('feed');
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [selectedCommunityType, setSelectedCommunityType] = useState<string>('free');
  const [boardType, setBoardType] = useState<'free' | 'qna' | 'mate'>('free');

  const handleViewChange = (view: 'feed' | 'community' | 'detail' | 'create' | 'mypage' | 'board-list', data?: any) => {
    setCurrentView(view);
    if (data?.post) setSelectedPost(data.post);
    if (data?.communityType) setSelectedCommunityType(data.communityType);
    if (data?.boardType) setBoardType(data.boardType);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <Navbar 
        currentView={currentView === 'board-list' ? 'community' : currentView} 
        onNavigate={handleViewChange}
      />
      
      <main>
        {currentView === 'feed' && <MainFeed onNavigate={handleViewChange} />}
        {currentView === 'community' && (
          <CommunityTab 
            initialTab={selectedCommunityType}
            onNavigate={handleViewChange} 
          />
        )}
        {currentView === 'board-list' && (
          <BoardList 
            type={boardType}
            onBack={() => handleViewChange('community')}
            onNavigate={handleViewChange}
          />
        )}
        {currentView === 'detail' && selectedPost && (
          <PostDetail 
            post={selectedPost} 
            onBack={() => handleViewChange('feed')} 
          />
        )}
        {currentView === 'create' && (
          <CreatePost 
            onBack={() => handleViewChange('feed')}
            onSubmit={() => handleViewChange('feed')}
          />
        )}
        {currentView === 'mypage' && (
          <MyPage onNavigate={handleViewChange} />
        )}
      </main>
    </div>
  );
}
