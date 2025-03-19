import { useMemo } from 'react';

export const shipyardColumnsWithoutActions = [
  {
    header: '#',
    accessorKey: 'id'
  },
  {
    header: 'Shipyard Name',
    accessorKey: 'name'
  },
  {
    header: 'Address',
    accessorKey: 'address'
  },
  {
    header: 'City',
    accessorKey: 'city'
  },
  {
    header: 'Country',
    accessorKey: 'country'
  },
  {
    header: 'Postal Code',
    accessorKey: 'postal_code'
  },
  {
    header: 'creator',
    accessorKey: 'creator'
  }
];

export const userTableColumns = (role) => {
  const commonColumns = [
    {
      header: '#',
      accessorKey: 'id'
    },
    {
      header: 'First Name',
      accessorKey: 'first_name'
    },
    {
      header: 'Last Name',
      accessorKey: 'last_name'
    },
    {
      header: 'Role',
      accessorKey: 'role.name'
    },
    {
      header: 'Shipyard',
      accessorKey: 'shipyard.name'
    }
  ];
  const columnsMapToRoles = {
    administratorUsers: [...commonColumns],
    clientUsers: [
      ...commonColumns,
      {
        header: 'Client Name',
        accessorKey: 'client.name'
      }
    ],
    deptUsers: [
      ...commonColumns,
      {
        header: 'Department Name',
        accessorKey: 'department.name'
      },
      {
        header: 'Foreman',
        accessorKey: 'foreman.name'
      }
    ]
  };

  return columnsMapToRoles[role] ?? [];
};

export const departmentColumns = [
  {
    header: '#',
    accessorKey: 'idx'
  },
  {
    header: 'Name',
    accessorKey: 'name'
  },
  {
    header: 'creator',
    accessorKey: 'creator'
  },
  {
    header: 'Foreman',
    accessorKey: 'foreman.name'
  }
];

export const placeColumns = [
  {
    header: '#',
    accessorKey: 'idx'
  },
  {
    header: 'Place Name',
    accessorKey: 'place_name'
  },
  {
    header: 'Is Used',
    accessorKey: 'is_used'
  },
  {
    header: 'creator',
    accessorKey: 'creator'
  }
];

export const getFieldsByRole = ({ role, roles = [], shipyard_id, shipyards = [], departments = [] }) => {
  if (!shipyard_id) return [{ key: 'shipyard_id', label: 'Shipyard', type: 'select', options: shipyards, colVal: 6 }];

  const defaultFields = [
    { key: 'shipyard_id', label: 'Shipyard', type: 'select', options: shipyards, colVal: 6 },
    ...(departments.length > 0
      ? [
          {
            key: 'department_id',
            label: 'Select Department',
            type: 'select',
            options: departments,
            colVal: 6,
            placeholder: 'Please select a Department',
            emptyDataMsg: 'Departments do not exist, please create it.'
          }
        ]
      : []),
    ...(shipyard_id ? [{ key: 'role_id', label: 'Role', type: 'select', options: roles, colVal: 6 }] : [])
  ];

  const commonFields = [
    { key: 'first_name', label: 'First Name', type: 'text', colVal: 6 },
    { key: 'last_name', label: 'Last Name', type: 'text', colVal: 6 }
  ];

  const roleSpecificFields = {
    shared: [
      { key: 'email', label: 'Email', type: 'text', colVal: 6 },
      { key: 'password', label: 'Password', type: 'text', colVal: 6 }
    ],
    SUPERINTENDENT: [],
    EMPLOYEE: [],
    CLIENT: []
  };

  return role
    ? [
        ...defaultFields,
        ...commonFields,
        ...(roleSpecificFields[role] ? roleSpecificFields[role] : roleSpecificFields.shared),
        { key: 'phone', label: 'Phone NO:', type: 'text', colVal: 6 }
      ]
    : defaultFields;
};

export const roleBasedUserCreation = (currentUserRole) => {
  return useMemo(() => {
    const roleUserCreationMap = {
      ADMIN: ['CALCULATOR_ENGINEER', 'DOCKING_MASTER', 'PROJECT_MANAGER'],
      ADMIN_CLIENT: ['CLIENT', 'SUPERINTENDENT'],
      CALC_CLINET: ['SUPERINTENDENT'],
      ADMIN_FOREMAN: ['FOREMAN'],
      ADMIN_EMP: ['EMPLOYEE'],
      SUPER_ADMIN: ['ADMIN', 'CALCULATOR_ENGINEER', 'DOCKING_MASTER', 'PROJECT_MANAGER']
    };

    return roleUserCreationMap[currentUserRole] || [];
  }, [currentUserRole]);
};
