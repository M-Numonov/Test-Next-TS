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
      field: 'stringfield',
      headerName: 'String field',
      flex: 1,
      minWidth: 120,
      filterable: false,
      headerClassName: 'datagrid--header',
      cellClassName: 'datagrid--cell',

      editable: true,
    },

    {
      field: 'boolfield',
      headerName: 'Bool field',
      flex: 1,
      minWidth: 120,
      filterable: false,
      headerClassName: 'datagrid--header',
      cellClassName: 'datagrid--cell',

      editable: true,
      type: 'boolean',
    },

    {
      field: 'datetime',
      headerName: 'Datetime',
      flex: 1,
      minWidth: 120,
      filterable: false,
      headerClassName: 'datagrid--header',
      cellClassName: 'datagrid--cell',

      editable: true,
      type: 'dateTime',
      valueGetter: (params: GridValueGetterParams) =>
        new Date(params.row.datetime),
    },

    {
      field: 'demical',
      headerName: 'Demical',
      flex: 1,
      minWidth: 120,
      filterable: false,
      headerClassName: 'datagrid--header',
      cellClassName: 'datagrid--cell',

      editable: true,
      type: 'number',
    },

    {
      field: 'intfield',
      headerName: 'Int field',
      flex: 1,
      minWidth: 120,
      filterable: false,
      headerClassName: 'datagrid--header',
      cellClassName: 'datagrid--cell',

      editable: true,
      type: 'number',
    },

    {
      field: 'enumfield',
      headerName: 'Enum field',
      flex: 1,
      minWidth: 120,
      filterable: false,
      headerClassName: 'datagrid--header',
      cellClassName: 'datagrid--cell',

      editable: true,
      type: 'singleSelect',
      valueOptions: ['1', '2'],
    },

    {
      field: 'enumfieldselect',
      headerName: 'Enum field select',
      flex: 1,
      minWidth: 120,
      filterable: false,
      headerClassName: 'datagrid--header',
      cellClassName: 'datagrid--cell',

      editable: true,
    },

    {
      field: 'datefield',
      headerName: 'Date field',
      flex: 1,
      minWidth: 120,
      filterable: false,
      headerClassName: 'datagrid--header',
      cellClassName: 'datagrid--cell',

      editable: true,
      type: 'date',
      valueGetter: (params: GridValueGetterParams) =>
        new Date(params.row.datefield),
    },

    {
      field: 'imagesfield',
      headerName: 'Images field',
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
          image={params?.row?.imagesfield}
          className='w-24 h-24 mx-auto lg:w-6 lg:h-6'
        />
      ),
    },

    {
      field: 'filedfield',
      headerName: 'Filed field',
      flex: 1,
      minWidth: 120,
      filterable: false,
      headerClassName: 'datagrid--header',
      cellClassName: 'datagrid--cell',

      editable: false,
      sortable: false,
      renderCell: (params: GridValueGetterParams) => (
        <>
          {dataFormatter.filesFormatter(params.row.filedfield).map((link) => (
            <button
              key={link.publicUrl}
              onClick={(e) => saveFile(e, link.publicUrl, link.name)}
            >
              {link.name}
            </button>
          ))}
        </>
      ),
    },

    {
      field: 'relationonefield',
      headerName: 'Relation one field',
      flex: 1,
      minWidth: 120,
      filterable: false,
      headerClassName: 'datagrid--header',
      cellClassName: 'datagrid--cell',

      editable: true,
      type: 'singleSelect',
      getOptionValue: (value: any) => value?.id,
      getOptionLabel: (value: any) => value?.label,
      valueOptions: await callOptionsApi('users'),
      valueGetter: (params: GridValueGetterParams) =>
        params?.value?.id ?? params?.value,
    },

    {
      field: 'relationmanyfield',
      headerName: 'Relation many field',
      flex: 1,
      minWidth: 120,
      filterable: false,
      headerClassName: 'datagrid--header',
      cellClassName: 'datagrid--cell',

      editable: false,
      type: 'singleSelect',
      valueFormatter: ({ value }) =>
        dataFormatter.usersManyListFormatter(value).join(', '),
      renderEditCell: (params) => (
        <DataGridMultiSelect {...params} entityName={'users'} />
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
