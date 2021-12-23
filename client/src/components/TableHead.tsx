import * as React from 'react';
import {
  Box,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Checkbox,
} from '@material-ui/core';

export default function EnhancedTableHead(props: any) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property: any) => (event: any) => {
    onRequestSort(event, property);
  };
  const headCells = [
    {
      id: 'roomname',
      numeric: false,
      disablePadding: true,
      label: 'Room Name',
    },
    {
      id: 'host',
      numeric: false,
      disablePadding: false,
      label: 'Host',
    },
    {
      id: 'guests',
      numeric: false,
      disablePadding: false,
      label: 'Guests',
    },
    {
      id: 'date',
      numeric: false,
      disablePadding: false,
      label: 'Date',
    },
    {
      id: 'period',
      numeric: false,
      disablePadding: false,
      label: 'Booking Period',
    },
  ];
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? <Box component="span"></Box> : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
