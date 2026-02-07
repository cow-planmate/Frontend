import { CommunityPage } from './community/pages/CommunityPage';

interface BoardListProps {
  type: 'free' | 'qna' | 'mate' | 'recommend';
  onBack: () => void;
  onNavigate: (view: any, data?: any) => void;
}

export default function BoardList(props: BoardListProps) {
  return <CommunityPage {...props} />;
}
