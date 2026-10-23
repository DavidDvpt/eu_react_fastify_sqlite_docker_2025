import { useLocation } from 'react-router-dom';
import MiningSessionModal from './components/MiningSessionModal';
import MiningSessionCurrentView from '@/pages/miningPage/MiningSessionCurrentView';
import MiningSessionListView from '@/pages/miningPage/MiningSessionListView';

function MiningPage() {
  const location = useLocation();
  const isCreateRoute = location.pathname === '/mining/create';
  const isCurrentRoute = location.pathname === '/mining/current';
  const isSessionRoute = location.pathname.endsWith('/session');

  if (isCurrentRoute || isSessionRoute) {
    return <MiningSessionCurrentView />;
  }

  return (
    <>
      <MiningSessionListView />
      {isCreateRoute && <MiningSessionModal />}
    </>
  );
}

export default MiningPage;
