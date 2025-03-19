// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { LineChartOutlined, IdcardOutlined, DatabaseOutlined, RobotOutlined, SettingOutlined, CalculatorOutlined } from '@ant-design/icons';

// icons
const icons = {
  LineChartOutlined,
  IdcardOutlined,
  DatabaseOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: <FormattedMessage id="Super Admin" />,
  icon: icons.IdcardOutlined,
  type: 'group',
  children: [
    {
      id: 'Welcome',
      title: <FormattedMessage id="Welcome" />,
      type: 'item',
      url: '/dashboard/welcome'
    },
    {
      id: 'Shipyards',
      title: <FormattedMessage id="Shipyard" />,
      type: 'item',
      url: '/dashboard/shipyard'
    },
    {
      id: 'Manage Users',
      title: <FormattedMessage id="Manage Users" />,
      type: 'item',
      url: '/dashboard/users'
    },
    {
      id: 'Administrator Users',
      title: <FormattedMessage id="Administrator Users" />,
      type: 'item',
      url: '/dashboard/administrator-users'
    },
    {
      id: 'Client Users',
      title: <FormattedMessage id="Client Users" />,
      type: 'item',
      url: '/dashboard/client-users'
    },
    {
      id: 'Manage Departments',
      title: <FormattedMessage id="Departments" />,
      type: 'item',
      url: '/dashboard/departments'
    },
    {
      id: 'Department Users',
      title: <FormattedMessage id="Department Users" />,
      type: 'item',
      url: '/dashboard/dept-users'
    },
    {
      id: 'Docking Places',
      title: <FormattedMessage id="Docking Places" />,
      type: 'item',
      url: '/dashboard/docking-places'
    }
  ]
};

export default dashboard;
