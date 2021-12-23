import React, { useState } from 'react';
import {
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import { Delete, FilterList, Edit } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setMatch } from '../redux';
import { IAppState, IMatch } from '../types';
import Filter from './Filter';

export default function EnhancedTableToolbar(props: any) {
  const { selected, deleteData } = props;
  const numSelected = selected.length;
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const match: IMatch = useSelector((state: IAppState) => {
    return state.match;
  });

  const handleChangeAll = (eventprops: any) => {
    const thismatch = { ...match, is_all: !eventprops.target.checked };
    dispatch(setMatch(thismatch));
  };
  const handleOpenFilter = () => {
    setOpen(!open);
  };

  const handleCloseFilter = () => {
    setOpen(false);
  };
  const handleDelete = () => {
    deleteData();
  };

  return (
    <Toolbar>
      {numSelected > 0 ? (
        <Typography color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography variant="h6" id="tableTitle" component="div">
          Bookings
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={handleDelete}>
            <Delete />
          </IconButton>
        </Tooltip>
      ) : (
        <>
          <Tooltip title="Filter list">
            <IconButton onClick={handleOpenFilter}>
              <FilterList />
            </IconButton>
          </Tooltip>
          <Filter open={open} handleClose={handleCloseFilter} />
        </>
      )}
      {numSelected === 1 && (
        <Tooltip title="Edit">
          <IconButton
            onClick={() => history.push(`/roomdetail/${selected[0]}`)}
          >
            <Edit />
          </IconButton>
        </Tooltip>
      )}
      <FormControlLabel
        className="switch-all"
        control={<Switch defaultChecked onChange={handleChangeAll} />}
        label="Display valid booking"
      />
    </Toolbar>
  );
}
