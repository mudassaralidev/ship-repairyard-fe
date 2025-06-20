import { useMemo } from 'react';
import dayjs from 'dayjs';
import { Tooltip, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

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
      header: 'No',
      id: 'rowIndex',
      cell: ({ row }) => row.index + 1
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
    }
    // {
    //   header: 'Shipyard',
    //   accessorKey: 'shipyard.name'
    // }
  ];
  const columnsMapToRoles = {
    administratorUsers: [
      ...commonColumns,
      {
        header: 'Email',
        accessorKey: 'email'
      }
    ],
    clientUsers: [
      ...commonColumns,
      {
        header: 'Email',
        accessorKey: 'email'
      },
      {
        header: 'Contact No',
        accessorKey: 'phone'
      },
      {
        header: 'Company Name',
        accessorKey: 'client.name'
      }
    ],
    deptUsers: [
      ...commonColumns,
      {
        header: 'Email',
        accessorKey: 'email'
      },
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
    header: 'No',
    id: 'rowIndex',
    cell: ({ row }) => row.index + 1
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
    header: 'No',
    id: 'rowIndex',
    cell: ({ row }) => row.index + 1
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

export const shipColumns = [
  {
    header: 'No',
    id: 'rowIndex',
    cell: ({ row }) => <Link to={`/dashboard/ships/${row.original.id}`}>{row.index + 1}</Link>
  },
  {
    header: 'Ship Name',
    accessorKey: 'name'
  },
  {
    header: 'Type',
    accessorKey: 'type'
  },
  {
    header: 'Length',
    accessorKey: 'length'
  },
  {
    header: 'Beam',
    accessorKey: 'beam'
  },
  {
    header: 'Draft',
    accessorKey: 'draft'
  },
  {
    header: 'Gross Tonnage',
    accessorKey: 'gross_tonnage'
  },
  {
    header: 'Net Tonnage',
    accessorKey: 'net_tonnage'
  },
  {
    header: 'Year Built',
    accessorKey: 'year_built'
  },
  {
    header: 'Classification',
    accessorKey: 'classification'
  },
  {
    header: 'Flag',
    accessorKey: 'flag'
  },
  {
    header: 'Company Name',
    accessorKey: 'client.name'
  }
];

export const dockingColumns = [
  {
    header: 'No',
    id: 'rowIndex',
    cell: ({ row }) => row.index + 1
  },
  {
    header: 'Name',
    accessorKey: 'name'
  },
  {
    header: 'Ship Name',
    accessorKey: 'ship.name'
  },
  {
    header: 'Docked Place',
    accessorKey: 'docking_place.place_name'
  },
  {
    header: 'Estimated Cost',
    accessorKey: 'estimated_cost'
  },

  {
    header: 'Total Cost',
    accessorKey: 'total_cost'
  },

  {
    header: 'Start Date',
    accessorKey: 'start_date',
    cell: ({ row }) => dayjs(row.original.start_date).format('DD-MM-YYYY')
  },
  {
    header: 'End Date',
    accessorKey: 'end_date',
    cell: ({ row }) => (row.original.end_date ? dayjs(row.original.end_date).format('DD-MM-YYYY') : '-')
  }
];

export const repairColumns = [
  {
    header: 'No',
    id: 'rowIndex',
    cell: ({ row }) => row.index + 1
  },
  {
    header: 'Description',
    cell: ({ row }) => (
      <Tooltip
        title={<Typography sx={{ fontSize: 14, p: 1, maxWidth: 300, whiteSpace: 'normal' }}>{row.original.description}</Typography>}
        arrow
        placement="top"
        componentsProps={{
          tooltip: {
            sx: {
              backgroundColor: '#333',
              color: '#fff',
              borderRadius: 1,
              boxShadow: 3,
              fontWeight: 400
            }
          }
        }}
      >
        <Typography
          noWrap
          sx={{
            maxWidth: '120px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'inline-block'
          }}
        >
          {row.original.description}
        </Typography>
      </Tooltip>
    )
  },
  {
    header: 'Docking',
    accessorKey: 'docking.name'
  },
  {
    header: 'Start Date',
    accessorKey: 'start_date',
    cell: ({ row }) => (row.original.start_date ? dayjs(row.original.start_date).format('DD-MM-YYYY') : '-')
  },
  {
    header: 'End Date',
    accessorKey: 'end_date',
    cell: ({ row }) => (row.original.end_date ? dayjs(row.original.end_date).format('DD-MM-YYYY') : '-')
  },
  {
    header: 'Estimated Cost',
    accessorKey: 'estimated_cost',
    cell: ({ row }) => `$${parseFloat(row.original.estimated_cost).toFixed(2)}`
  },
  {
    header: 'Total Cost',
    accessorKey: 'total_cost',
    cell: ({ row }) => (row.original.total_cost ? `$${parseFloat(row.original.total_cost).toFixed(2)}` : '-')
  }
];

export const inventoryColumns = [
  {
    header: 'No',
    id: 'rowIndex',
    cell: ({ row }) => row.index + 1
  },
  {
    header: 'Name',
    accessorKey: 'name'
  },
  {
    header: 'Total Quantity',
    accessorKey: 'total_quantity'
  },
  {
    header: 'Remaining Quantity',
    accessorKey: 'remaining_quantity'
  },
  {
    header: 'Creator',
    accessorKey: 'creator'
  }
];

export const workOrderColumns = [
  {
    header: 'No',
    id: 'rowIndex',
    cell: ({ row }) => row.index + 1
  },
  {
    header: 'Description',
    cell: ({ row }) => (
      <Tooltip
        title={<Typography sx={{ fontSize: 14, p: 1, maxWidth: 300, whiteSpace: 'normal' }}>{row.original.description}</Typography>}
        arrow
        placement="top"
        componentsProps={{
          tooltip: {
            sx: {
              backgroundColor: '#333',
              color: '#fff',
              borderRadius: 1,
              boxShadow: 3,
              fontWeight: 400
            }
          }
        }}
      >
        <Typography
          noWrap
          sx={{
            maxWidth: '120px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'inline-block'
          }}
        >
          {row.original.description}
        </Typography>
      </Tooltip>
    )
  },
  {
    header: 'Per Hour Cost',
    accessorKey: 'per_hour_cost'
  },
  {
    header: 'Total Hours',
    accessorKey: 'total_hours'
  },
  {
    header: 'Total Cost',
    accessorKey: 'total_cost'
  },
  {
    header: 'Foreman',
    accessorKey: 'foreman.name'
  },
  {
    header: 'Department',
    accessorKey: 'foreman.department.name'
  },
  {
    header: 'Start Date',
    accessorKey: 'start_date',
    cell: ({ row }) => (row.original.start_date ? dayjs(row.original.start_date).format('DD-MM-YYYY') : '-')
  },
  {
    header: 'End Date',
    accessorKey: 'end_date',
    cell: ({ row }) => (row.original.end_date ? dayjs(row.original.end_date).format('DD-MM-YYYY') : '-')
  }
];

export const inventoryOrderColumns = [
  {
    header: 'No',
    id: 'rowIndex',
    cell: ({ row }) => row.index + 1
  },
  {
    header: 'Inventory Used',
    accessorKey: 'inventory.name'
  },
  {
    header: 'Quantity',
    accessorKey: 'quantity'
  },
  {
    header: 'Cost Per Qty',
    accessorKey: 'cost',
    cell: ({ row }) => `$${parseFloat(row.original.cost).toFixed(2)}`
  },
  {
    header: 'Total Cost',
    cell: ({ row }) => `$${parseFloat(row.original.cost * row.original.quantity).toFixed(2)}`
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
    SUPERINTENDENT: [
      { key: 'email', label: 'Email', type: 'text', colVal: 6 },
      { key: 'address', label: 'Address', type: 'text', colVal: 6 }
    ],
    EMPLOYEE: [],
    CLIENT: [
      { key: 'email', label: 'Email', type: 'text', colVal: 6 },
      { key: 'address', label: 'Address', type: 'text', colVal: 6 }
    ]
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
      ADMIN: ['CALCULATOR_ENGINEER', 'DOCKING_MASTER', 'PROJECT_MANAGER', 'TECHNICAL_PURCHASER'],
      ADMIN_CLIENT: ['CLIENT', 'SUPERINTENDENT'],
      CALC_CLINET: ['CLIENT'],
      ADMIN_FOREMAN: ['FOREMAN'],
      ADMIN_EMP: ['EMPLOYEE'],
      SUPER_ADMIN: ['ADMIN', 'CALCULATOR_ENGINEER', 'DOCKING_MASTER', 'PROJECT_MANAGER']
    };

    return roleUserCreationMap[currentUserRole] || [];
  }, [currentUserRole]);
};
