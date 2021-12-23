import React, { useState } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  DialogTitle,
  Select,
  MenuItem,
  InputAdornment,
} from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { IAppState, IMatch, IRoom } from '../types';
import { setMatch } from '../redux';
import DateFnsUtils from '@date-io/date-fns';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import moment from 'moment';

export default function Filter(props: any) {
  const { open, handleClose } = props;
  const dispatch = useDispatch();
  const rooms: IRoom[] = useSelector((state: IAppState) => {
    return state.rooms;
  });
  const match: IMatch = useSelector((state: IAppState) => {
    return state.match;
  });
  const thisDate =
    match.date === '' ? null : moment(match.date, 'YYYY-MM-DD').toDate();
  const [filter, setFilter] = useState({
    roomName: match.roomName,
    date: thisDate,
    host: match.host,
    guest: match.guest,
  });
  const handleSubmitFilter = () => {
    const matchDate =
      filter.date === null ? '' : moment(filter.date).format('YYYY-MM-DD');
    const thismatch = {
      ...match,
      roomName: filter.roomName,
      date: matchDate,
      host: filter.host,
      guest: filter.guest,
    };
    dispatch(setMatch(thismatch));
    handleClose();
  };
  const handleSelect = (eventprops: any) => {
    setFilter({ ...filter, roomName: eventprops.target.value });
  };
  const handleReset = () => {
    const thismatch = { ...match, roomName: '', date: '', host: '', guest: '' };
    setFilter({ roomName: '', date: null, host: '', guest: '' });
    dispatch(setMatch(thismatch));
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Filter</DialogTitle>
      <DialogContent>
        <div>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Room Name</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Room"
              value={filter.roomName}
              onChange={handleSelect}
            >
              <MenuItem key={-1} value={''}>All</MenuItem>
              {rooms.map((row: any, index: any) => {
                return <MenuItem key={index} value={row.roomname}>{row.roomname}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </div>
        <div className="filter-div">
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              autoOk
              variant="inline"
              inputVariant="outlined"
              label="Select Date"
              format="MM/dd/yyyy"
              value={filter.date}
              InputAdornmentProps={{ position: 'start' }}
              onChange={(date) => setFilter({ ...filter, date: date })}
            />
          </MuiPickersUtilsProvider>
        </div>
        <div className="filter-div">
          <TextField
            id="host"
            label="Host"
            onBlur={(e) => setFilter({ ...filter, host: e.target.value })}
            defaultValue={filter.host}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
            variant="standard"
          />
        </div>
        <div className="filter-div">
          <TextField
            id="guest"
            label="Guest"
            onBlur={(e) => setFilter({ ...filter, guest: e.target.value })}
            defaultValue={filter.guest}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
            variant="standard"
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReset}>Reset</Button>
        <Button onClick={handleSubmitFilter}>Apply</Button>
      </DialogActions>
    </Dialog>
  );
}
