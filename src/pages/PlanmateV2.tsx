import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BoardList from '../components/planmate2/board-list';
import CommunityTab from '../components/planmate2/community-tab';
import CreatePost from '../components/planmate2/create-post';
import MainFeed from '../components/planmate2/main-feed';
import MyPage from '../components/planmate2/my-page';
import Navbar from '../components/planmate2/navbar';
import PostDetail from '../components/planmate2/post-detail';
import Home from './Home';

export default function PlanmateV2() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'feed' | 'community' | 'detail' | 'create' | 'mypage' | 'board-list' | 'plan-maker'>('feed');
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [selectedCommunityType, setSelectedCommunityType] = useState<string>('free');
  const [boardType, setBoardType] = useState<'free' | 'qna' | 'mate'>('free');

  useEffect(() => {
    if (location.pathname === '/mypage') {
      setCurrentView('mypage');
    } else if (location.pathname === '/community') {
      setCurrentView('community');
    } else if (location.pathname === '/') {
      setCurrentView('feed');
    }
  }, [location.pathname]);

  const handleViewChange = (view: 'feed' | 'community' | 'detail' | 'create' | 'mypage' | 'board-list' | 'plan-maker', data?: any) => {
    setCurrentView(view);
    
    // URL 업데이트
    if (view === 'mypage') navigate('/mypage');
    else if (view === 'community') navigate('/community');
    else if (view === 'feed') navigate('/');
    
    if (data?.post) setSelectedPost(data.post);
    if (data?.communityType) setSelectedCommunityType(data.communityType);
    if (data?.boardType) setBoardType(data.boardType);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <Navbar 
        currentView={currentView === 'board-list' ? 'community' : (currentView === 'plan-maker' ? 'plan-maker' : currentView)} 
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
        {currentView === 'plan-maker' && (
          <div className="max-w-7xl mx-auto">
            <Home hideNavbar={true} />
          </div>
        )}
      </main>
    </div>
  );
}
