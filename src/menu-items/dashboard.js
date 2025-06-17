// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { LineChartOutlined, IdcardOutlined, DatabaseOutlined } from '@ant-design/icons';

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
  SUPER_ADMIN: [
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
    }
  ],
  ADMIN: [
    {
      id: 'Welcome',
      title: <FormattedMessage id="Welcome" />,
      type: 'item',
      url: '/dashboard/welcome'
    },
    {
      id: 'Manage Users',
      title: <FormattedMessage id="Manage Users" />,
      type: 'collapse',
      children: [
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
        }
      ]
    },
    {
      id: 'Manage Departments',
      title: <FormattedMessage id="Manage Departments" />,
      type: 'collapse',
      children: [
        {
          id: 'Departments',
          title: <FormattedMessage id="Departments" />,
          type: 'item',
          url: '/dashboard/departments'
        },
        {
          id: 'Department Users',
          title: <FormattedMessage id="Department Users" />,
          type: 'item',
          url: '/dashboard/dept-users'
        }
      ]
    },
    {
      id: 'Docking Places',
      title: <FormattedMessage id="Docking Places" />,
      type: 'item',
      url: '/dashboard/docking-places'
    },
    {
      id: 'Manage Inventory',
      title: <FormattedMessage id="Manage Inventory" />,
      type: 'item',
      url: '/dashboard/inventories'
    },
    {
      id: 'Manage Ships',
      title: <FormattedMessage id="Manage Ships" />,
      type: 'item',
      url: '/dashboard/ships'
    },
    {
      id: 'Manage Dockings',
      title: <FormattedMessage id="Manage Dockings" />,
      type: 'item',
      url: '/dashboard/dockings'
    },
    {
      id: 'Manage Repairs',
      title: <FormattedMessage id="Manage Repairs" />,
      type: 'item',
      url: '/dashboard/repairs'
    },
    {
      id: 'Manage Work Orders',
      title: <FormattedMessage id="Manage Work Orders" />,
      type: 'item',
      url: '/dashboard/work-orders'
    }
  ],
  PROJECT_MANAGER: [
    {
      id: 'Welcome',
      title: <FormattedMessage id="Welcome" />,
      type: 'item',
      url: '/dashboard/welcome'
    },

    {
      id: 'Manage Departments',
      title: <FormattedMessage id="Manage Departments" />,
      type: 'collapse',
      children: [
        {
          id: 'Departments',
          title: <FormattedMessage id="Departments" />,
          type: 'item',
          url: '/dashboard/departments'
        },
        {
          id: 'Department Users',
          title: <FormattedMessage id="Department Users" />,
          type: 'item',
          url: '/dashboard/dept-users'
        }
      ]
    },
    {
      id: 'Manage Ships',
      title: <FormattedMessage id="Manage Ships" />,
      type: 'item',
      url: '/dashboard/ships'
    },
    {
      id: 'Manage Dockings',
      title: <FormattedMessage id="Manage Dockings" />,
      type: 'item',
      url: '/dashboard/dockings'
    },
    {
      id: 'Manage Repairs',
      title: <FormattedMessage id="Manage Repairs" />,
      type: 'item',
      url: '/dashboard/repairs'
    },
    {
      id: 'Manage Work Orders',
      title: <FormattedMessage id="Manage Work Orders" />,
      type: 'item',
      url: '/dashboard/work-orders'
    }
  ],

  CALCULATOR_ENGINEER: [
    {
      id: 'Welcome',
      title: <FormattedMessage id="Welcome" />,
      type: 'item',
      url: '/dashboard/welcome'
    },
    {
      id: 'Manage Users',
      title: <FormattedMessage id="Manage Users" />,
      type: 'collapse',
      children: [
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
        }
      ]
    },
    {
      id: 'Manage Ships',
      title: <FormattedMessage id="Manage Ships" />,
      type: 'item',
      url: '/dashboard/ships'
    },
    {
      id: 'Manage Dockings',
      title: <FormattedMessage id="Manage Dockings" />,
      type: 'item',
      url: '/dashboard/dockings'
    }
  ],
  DOCKING_MASTER: [
    {
      id: 'Welcome',
      title: <FormattedMessage id="Welcome" />,
      type: 'item',
      url: '/dashboard/welcome'
    },
    {
      id: 'Docking Places',
      title: <FormattedMessage id="Docking Places" />,
      type: 'item',
      url: '/dashboard/docking-places'
    },
    {
      id: 'Manage Dockings',
      title: <FormattedMessage id="Manage Dockings" />,
      type: 'item',
      url: '/dashboard/dockings'
    }
  ],
  TECHNICAL_PURCHASER: [
    {
      id: 'Welcome',
      title: <FormattedMessage id="Welcome" />,
      type: 'item',
      url: '/dashboard/welcome'
    },
    {
      id: 'Manage Inventory',
      title: <FormattedMessage id="Manage Inventory" />,
      type: 'item',
      url: '/dashboard/inventories'
    }
  ],
  FOREMAN: [
    {
      id: 'Manage Work Orders',
      title: <FormattedMessage id="Manage Work Orders" />,
      type: 'item',
      url: '/dashboard/work-orders'
    }
  ]
};

export default dashboard;
