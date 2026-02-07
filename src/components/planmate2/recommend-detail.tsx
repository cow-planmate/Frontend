import { RecommendDetailPage } from './community/pages/RecommendDetailPage';

interface RecommendDetailProps {
  post: any;
  onBack: () => void;
}

export default function RecommendDetail(props: RecommendDetailProps) {
  return <RecommendDetailPage {...props} />;
}
