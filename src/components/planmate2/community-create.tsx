import { CommunityCreatePage } from './community/pages/CommunityCreatePage';

interface CommunityCreateProps {
  type: 'free' | 'qna' | 'mate' | 'recommend';
  onBack: () => void;
  onSubmit: () => void;
}

export default function CommunityCreate(props: CommunityCreateProps) {
  return <CommunityCreatePage {...props} />;
}
