import { current } from '@reduxjs/toolkit';
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
    accessorKey: 'location.address'
  },
  {
    header: 'City',
    accessorKey: 'location.city'
  },
  {
    header: 'Country',
    accessorKey: 'location.country'
  },
  {
    header: 'Postal Code',
    accessorKey: 'location.postal_code'
  },
  {
    header: 'creator',
    accessorKey: 'creator.name'
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
      accessorKey: 'Role.name'
    },
    {
      header: 'Shipyard',
      accessorKey: 'Shipyard.name'
    }
  ];
  const columnsMapToRoles = {
    administratorUsers: [...commonColumns],
    clientUsers: [
      ...commonColumns,
      {
        header: 'Client Name',
        accessorKey: 'Client.name'
      }
    ]
  };

  return columnsMapToRoles[role] ?? [];
};

export const getFieldsByRole = ({ role, roles = [], shipyard_id, shipyards = [], dept_id, dropdownDependentData = {} }) => {
  if (!shipyard_id) return [{ key: 'shipyard_id', label: 'Shipyard', type: 'select', options: shipyards, colVal: 6 }];

  const dependentData = dropdownDependentData[shipyard_id] ?? {};

  const defaultFields = [
    { key: 'shipyard_id', label: 'Shipyard', type: 'select', options: shipyards, colVal: 6 },
    ...(shipyard_id ? [{ key: 'role_id', label: 'Role', type: 'select', options: roles, colVal: 6 }] : [])
  ];

  const commonFields = [
    { key: 'first_name', label: 'First Name', type: 'text', colVal: 6 },
    { key: 'last_name', label: 'Last Name', type: 'text', colVal: 6 }
  ];

  // const formatDepartments = (data) =>
  //   data.map(({ department_name, department_id }) => ({
  //     label: department_name,
  //     value: department_id
  //   }));

  // const formatForeman = (data) =>
  //   data
  //     .filter(({ department_id }) => department_id === dept_id)
  //     .map(({ foreman_name, foreman_id }) => ({
  //       label: foreman_name,
  //       value: foreman_id
  //     }));

  // const formatClients = (data) =>
  //   data.map(({ name, id }) => ({
  //     label: name,
  //     value: id
  //   }));

  const roleSpecificFields = {
    shared: [
      { key: 'email', label: 'Email', type: 'text', colVal: 6 },
      { key: 'password', label: 'Password', type: 'text', colVal: 6 }
    ],

    SUPERINTENDENT: [
      // {
      //   key: 'client_user_id',
      //   label: 'Select Client User',
      //   type: 'autocomplete',
      //   options: formatClients(dependentData.CLIENT || []),
      //   colVal: 6,
      //   placeholder: 'Please select a Client User',
      //   emptyDataMsg: 'Client User does not exist, please create it.'
      // }
    ],
    FOREMAN: [
      { key: 'email', label: 'Email', type: 'text', colVal: 6 },
      { key: 'password', label: 'Password', type: 'text', colVal: 6 }
      // {
      //   key: 'department_id',
      //   label: 'Select Department',
      //   type: 'autocomplete',
      //   options: formatDepartments(dependentData.FOREMAN || []),
      //   colVal: 6,
      //   placeholder: 'Please select a Department',
      //   emptyDataMsg: 'Departments do not exist, please create it.'
      // }
    ],
    EMPLOYEE: [
      { key: 'email', label: 'Email', type: 'text', colVal: 6 },
      { key: 'password', label: 'Password', type: 'text', colVal: 6 }
      // {
      //   key: 'department_id',
      //   label: 'Select Department',
      //   type: 'autocomplete',
      //   options: formatDepartments(dependentData.FOREMAN || []),
      //   colVal: 6,
      //   placeholder: 'Please select a Department',
      //   emptyDataMsg: 'Departments do not exist, please create it.'
      // },
      // {
      //   key: 'foreman_id',
      //   label: 'Select Foreman',
      //   type: 'autocomplete',
      //   options: formatForeman(dependentData.FOREMAN || []),
      //   colVal: 6,
      //   placeholder: 'Please select a Foreman',
      //   emptyDataMsg: 'Select/Create Department'
      // }
    ],
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
      SUPER_ADMIN: ['ADMIN', 'CALCULATOR_ENGINEER', 'DOCKING_MASTER', 'PROJECT_MANAGER'],
      FOREMAN: ['ADMIN', 'SUPER_ADMIN', 'CALCULATOR_ENGINEER', 'DOCKING_MASTER', 'PROJECT_MANAGER', 'SUPERINTENDENT', 'FOREMAN'],
      CALCULATOR_ENGINEER: ['ADMIN', 'SUPER_ADMIN', 'CALCULATOR_ENGINEER', 'DOCKING_MASTER', 'PROJECT_MANAGER', 'SUPERINTENDENT'],
      PROJECT_MANAGER: ['ADMIN', 'SUPER_ADMIN', 'CALCULATOR_ENGINEER', 'DOCKING_MASTER', 'PROJECT_MANAGER', 'SUPERINTENDENT']
    };

    return roleUserCreationMap[currentUserRole] || [];
  }, [currentUserRole]);
};
