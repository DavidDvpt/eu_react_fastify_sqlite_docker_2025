import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { VerticalNav } from '@/shared/components';
import useNavLinks from '@/shared/hooks/useNavLinks';
import { getManageCreateLabel, isManageTab } from '../manageLeftNav';

function ManageLeftNav() {
  const links = useNavLinks();
  const navigate = useNavigate();
  const location = useLocation();
  const { tab } = useParams();
  const selectedTab = isManageTab(tab) ? tab : 'category';

  return (
    <>
      <VerticalNav
        items={links.map((link) => ({
          ...link,
          key: `manage-left-nav-link-${link.key}`,
          variant: 'navVertical',
        }))}
      />
      <div className="mt-auto m-2">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={() =>
            navigate({
              pathname: `/manage/${selectedTab}/create`,
              search: location.search,
            })
          }
        >
          {getManageCreateLabel(selectedTab)}
        </Button>
      </div>
    </>
  );
}

export default ManageLeftNav;
