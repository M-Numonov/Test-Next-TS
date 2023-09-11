import React from 'react';
import BaseIcon from '../BaseIcon';
import { mdiEye, mdiTrashCan, mdiPencilOutline } from '@mdi/js';
import axios from 'axios';
import {
  GridActionsCellItem,
  GridRowParams,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import ImageField from '../ImageField';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import DataGridMultiSelect from '../DataGridMultiSelect';

type Params = (id: string) => void;

export const loadColumns = async (
  onDelete: Params,
  onView: Params,
  onEdit: Params,
) => {
  async function callOptionsApi(entityName: string) {
    const data = await axios(`/${entityName}/autocomplete?limit=100`);
    return data.data;
  }

  return [
    {
      field: 'firstName',
      headerName: 'First Name',
      flex: 1,
      minWidth: 120,
      filterable: false,
      headerClassName: 'datagrid--header',
      cellClassName: 'datagrid--cell',

      editable: true,
    },

    {
      field: 'lastName',
      headerName: 'Last Name',
      flex: 1,
      minWidth: 120,
      filterable: false,
      headerClassName: 'datagrid--header',
      cellClassName: 'datagrid--cell',

      editable: true,
    },

    {
      field: 'phoneNumber',
      headerName: 'Phone Number',
      flex: 1,
      minWidth: 120,
      filterable: false,
      headerClassName: 'datagrid--header',
      cellClassName: 'datagrid--cell',

      editable: true,
    },

    {
      field: 'email',
      headerName: 'E-Mail',
      flex: 1,
      minWidth: 120,
      filterable: false,
      headerClassName: 'datagrid--header',
      cellClassName: 'datagrid--cell',

      editable: true,
    },

    {
      field: 'role',
      headerName: 'Role',
      flex: 1,
      minWidth: 120,
      filterable: false,
      headerClassName: 'datagrid--header',
      cellClassName: 'datagrid--cell',

      editable: true,
      type: 'singleSelect',
      valueOptions: ['admin', 'user'],
    },

    {
      field: 'disabled',
      headerName: 'Disabled',
      flex: 1,
      minWidth: 120,
      filterable: false,
      headerClassName: 'datagrid--header',
      cellClassName: 'datagrid--cell',

      editable: true,
      type: 'boolean',
    },

    {
      field: 'avatar',
      headerName: 'Avatar',
      flex: 1,
      minWidth: 120,
      filterable: false,
      headerClassName: 'datagrid--header',
      cellClassName: 'datagrid--cell',

      editable: false,
      sortable: false,
      renderCell: (params: GridValueGetterParams) => (
        <ImageField
          name={'Avatar'}
          image={params?.row?.avatar}
          className='w-24 h-24 mx-auto lg:w-6 lg:h-6'
        />
      ),
    },

    {
      field: 'actions',
      type: 'actions',
      flex: 1,
      minWidth: 130,
      headerClassName: 'datagrid--header',
      cellClassName: 'datagrid--cell',
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key={1}
          icon={<BaseIcon path={mdiEye} size={24} />}
          onClick={() => onView(params?.row?.id)}
          label='Watch'
        />,
        <GridActionsCellItem
          key={1}
          icon={<BaseIcon path={mdiPencilOutline} size={24} />}
          onClick={() => onEdit(params?.row?.id)}
          label='Edit'
        />,
        <GridActionsCellItem
          key={2}
          icon={<BaseIcon path={mdiTrashCan} size={24} />}
          onClick={() => onDelete(params?.row?.id)}
          label='Delete'
        />,
      ],
    },
  ];
};
