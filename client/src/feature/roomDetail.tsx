import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  Box,
  Grid,
  styled,
  Paper,
  TextField,
  ButtonBase,
  Typography,
  Button,
  Collapse,
  IconButton,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { IAppState, IStatus, IRoom, IBooking, IMatch } from '../types';
import { setStatus, loadBookings } from '../redux';
import {
  CellWifi,
  LocalPrintshop,
  Dashboard,
  LiveTv,
  SquareFoot,
  Close,
} from '@material-ui/icons';
import Navbar from '../components/Navbar';
import RoomScheduler from '../components/Scheduler';
import DateFnsUtils from '@date-io/date-fns';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import moment from 'moment';
import Alert from '@material-ui/lab/Alert';

interface RouteParams {
  bookId: string;
}

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

let times = [
  '08:00:00',
  '08:30:00',
  '09:00:00',
  '09:30:00',
  '10:00:00',
  '10:30:00',
  '11:00:00',
  '11:30:00',
  '12:00:00',
  '12:30:00',
  '13:00:00',
  '13:30:00',
  '14:00:00',
  '14:30:00',
  '15:00:00',
  '15:30:00',
  '16:00:00',
  '16:30:00',
];

function RoomDetail() {
  const { bookId } = useParams<RouteParams>();
  const [alert, setAlert] = useState(['', 'success']);
  const [open, setOpen] = useState(false);
  const rooms: IRoom[] = useSelector((state: IAppState) => {
    return state.rooms;
  });
  const bookings: IBooking[] = useSelector((state: IAppState) => {
    return state.bookings;
  });
  const match: IMatch = useSelector((state: IAppState) => {
    return state.match;
  });
  const [todayBooking, setTodayBooking] = useState([]);
  const [start, setStart] = useState(times);
  const [end, setEnd] = useState<any>([]);
  const [bookInfo, setBookInfo] = useState<IBooking>({
    bookid: 0,
    roomname: '',
    roomid: '',
    date: moment(new Date()).format('YYYY-MM-DD'),
    starttime: '',
    finishtime: '',
    host: '',
    guests: '',
  });
  let book =
    bookId !== '0'
      ? bookings.filter((r) => {
          return r.bookid.toString() === bookId;
        })
      : [];

  const [room, setRoom] = useState(
    book.length > 0
      ? rooms.filter((r) => {
          return r.roomname.toString() === book[0].roomname;
        })
      : []
  );
  const dispatch = useDispatch();
  let query =
    room.length > 0
      ? '/bookings/room?roomid=' + room[0].roomname
      : '/bookings/room?roomid=';

  async function fetchData() {
    dispatch(setStatus(IStatus.LOADING));
    const roomRes = await fetch(query);
    const roomJson = await roomRes.json();
    let tBooking = roomJson.filter((r: any) => {
      return r.date === bookInfo.date && r.bookid !== bookInfo.bookid;
    });
    if (book.length > 0) {
      tBooking = roomJson.filter((r: any) => {
        return r.date === book[0].date && r.bookid !== book[0].bookid;
      });
    }
    filterTime(tBooking);
    setTodayBooking(tBooking);
    dispatch(setStatus(IStatus.LOADED));
  }
  useEffect(() => {
    if(book.length > 0) {
      setBookInfo(book[0]);
      setEnd([book[0].finishtime]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (room.length > 0) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);
  const handleSelect = (eventprops: any) => {
    setRoom(
      rooms.filter((r) => {
        return r.roomname === eventprops.target.value;
      })
    );
    setBookInfo({ ...bookInfo, roomname: eventprops.target.value });
  };
  const handleSelectStart = (eventprops: any) => {
    const index = times.indexOf(eventprops.target.value);
    let ends = [];
    if (index === 17) {
      ends.push('17:00:00');
    } else if (index === 16) {
      ends.push('16:30:00');
      ends.push('17:00:00');
    } else {
      ends.push(times[index + 1]);
      ends.push(times[index + 2]);
    }
    const format = 'hh:mm:ss';
    const filteredTime = ends.filter((r) => {
      let shouldFilter = false;
      const time = moment(r, format);
      todayBooking.map((row: any) => {
        const beforeTime = moment(row.starttime, format);
        const afterTime = moment(row.finishtime, format);
        if (time.isBetween(beforeTime, afterTime) || r === row.finishtime) {
          shouldFilter = true;
        }
        return true;
      });
      return !shouldFilter;
    });
    setEnd(filteredTime);
    setBookInfo({ ...bookInfo, starttime: eventprops.target.value });
  };
  const handleSelectEnd = (eventprops: any) => {
    setBookInfo({ ...bookInfo, finishtime: eventprops.target.value });
  };
  const handleBook = (date: any) => {
    filterTime(todayBooking);
    setBookInfo({ ...bookInfo, date: moment(date).format('YYYY-MM-DD') });
  };
  const filterTime = (book: any) => {
    const format = 'hh:mm:ss';
    const filteredTime = start.filter((r) => {
      let shouldFilter = false;
      const time = moment(r, format);
      book.map((row: any) => {
        const beforeTime = moment(row.starttime, format);
        const afterTime = moment(row.finishtime, format);
        if (time.isBetween(beforeTime, afterTime) || r === row.starttime) {
          shouldFilter = true;
        }
        return true;
      });
      return !shouldFilter;
    });
    setStart(filteredTime);
  };
  const handleSave = (eventprops: any) => {
    if (bookInfo.roomname === '') {
      setAlert(["Room name can't be empty", 'error']);
      setOpen(true);
    } else if (bookInfo.date === '') {
      setAlert(["Date can't be empty", 'error']);
      setOpen(true);
    } else if (bookInfo.host === '') {
      setAlert(["Host name can't be empty", 'error']);
      setOpen(true);
    } else if (bookInfo.guests === '') {
      setAlert(["Guest name can't be empty", 'error']);
      setOpen(true);
    } else if (bookInfo.starttime === '') {
      setAlert(["Start time can't be empty", 'error']);
      setOpen(true);
    } else if (bookInfo.finishtime === '') {
      setAlert(["Finish time can't be empty", 'error']);
      setOpen(true);
    } else {
      saveData();
    }
  };

  async function saveData() {
    const delRes = await fetch('/bookings/save', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookInfo), // body data type must match "Content-Type" header
    });
    const delJson = await delRes.json();
    if (book.length === 0) {
      let query =
      'id=' +
      match.roomId +
      '&name=' +
      match.roomName +
      '&date=' +
      match.date +
      '&host=' +
      match.host +
      '&guest=' +
      match.guest +
      '&isall=' +
      match.is_all +
      '&orderby=' +
      match.orderBy;
      const res = await fetch('/bookings?' + query);    
      const resJson = await res.json();
      dispatch(loadBookings(resJson as any));
    } else {
      let newRows = bookings.filter((r) => {
        return r.bookid.toString() !== bookId;
      });
      newRows.push(bookInfo);
      dispatch(loadBookings(newRows as any));
    }
    setAlert([delJson.info, 'success']);
    setOpen(true);
  }
  return (
    <>
      <Navbar title="Room Scheduler" />
      <br />
      <div>
        <Box sx={{ flexGrow: 1 }}>
          <Grid item container spacing={1} justifyContent="center">
            <Grid item xs={12} sm={6} md={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Room Name</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Age"
                  value={room.length > 0 ? room[0].roomname : ''}
                  onChange={handleSelect}
                >
                  {rooms.map((row: any) => {
                    return (
                      <MenuItem key={row.roomname} value={row.roomname}>{row.roomname}</MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  autoOk
                  variant="inline"
                  inputVariant="outlined"
                  label="Select Date"
                  format="MM/dd/yyyy"
                  value={bookInfo.date}
                  InputAdornmentProps={{ position: 'start' }}
                  onChange={handleBook}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                label="Host Name"
                variant="outlined"
                fullWidth
                defaultValue={book.length > 0 ? book[0].host : ''}
                onBlur={(e) =>
                  setBookInfo({ ...bookInfo, host: e.target.value })
                }
                name="host"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                label="Guest Name"
                variant="outlined"
                fullWidth
                onBlur={(e) =>
                  setBookInfo({ ...bookInfo, guests: e.target.value })
                }
                defaultValue={book.length > 0 ? book[0].guests : ''}
                name="guests"
              />
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Start Time
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Start Time"
                  value={bookInfo.starttime}
                  onChange={handleSelectStart}
                >
                  {start.map((row: any) => {
                    return <MenuItem key={row} value={row}>{row}</MenuItem>;
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">End Time</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="End Time"
                  value={bookInfo.finishtime}
                  onChange={handleSelectEnd}
                >
                  {end.map((row: any) => {
                    return <MenuItem key={row} value={row}>{row}</MenuItem>;
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <Button variant="contained" onClick={handleSave}>
                Save Booking
              </Button>
            </Grid>
          </Grid>
          <Collapse in={open}>
            <Alert
              severity={alert[1] === 'success' ? 'success' : 'error'}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <Close fontSize="inherit" />
                </IconButton>
              }
            >
              {alert[0]}
            </Alert>
          </Collapse>
        </Box>
        {room.length > 0 && (
          <Paper style={{ margin: 'auto', width: '100%', flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item>
                <ButtonBase style={{ width: 285, height: 245 }}>
                  <Img
                    alt="complex"
                    src={require('../imgs/' + room[0].roomimg)}
                  />
                </ButtonBase>
              </Grid>
              <Grid item md={8} sm container>
                <Grid item xs container direction="column" spacing={2}>
                  <Grid item xs>
                    <Typography
                      key={"room"}
                      gutterBottom
                      variant="subtitle1"
                      style={{ marginTop: 20 }}
                      component="h2"
                    >
                      Room: {room[0].roomname}
                    </Typography>
                    <Typography key={"people"} variant="subtitle1" component="h3">
                      Max People: {room[0].maxpeople}
                    </Typography>
                    <Typography key={"info"} variant="subtitle1" component="h3">
                      Room Information: {room[0].roominfo}
                    </Typography>
                    <Typography key={"spec"} variant="subtitle1">
                      {Object.keys(JSON.parse(room[0].roomspec)).map((key) => {
                        switch (key) {
                          case 'Size':
                            return (
                              <>
                                <SquareFoot key={key} />
                                {'  ' +
                                  JSON.parse(room[0].roomspec)[key] +
                                  '  '}
                              </>
                            );
                          case 'Wifi':
                            return (
                              <>
                                <CellWifi key={key} />
                                {'   Wifi   '}
                              </>
                            );
                          case 'Printer':
                            return (
                              <>
                                <LocalPrintshop key={key} />
                                {'   Printer   '}
                              </>
                            );
                          case 'Whiteboards':
                            return (
                              <>
                                <Dashboard key={key} />
                                {'   Whiteboards   '}
                              </>
                            );
                          case 'TV':
                            return (
                              <>
                                <LiveTv key={key} />
                                {'   Tv   '}
                              </>
                            );
                          default:
                            return '';
                        }
                      })}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        )}
      </div>
      <div>
        <RoomScheduler room={bookInfo.roomname} currentDate={bookInfo.date} />
      </div>
    </>
  );
}

export default RoomDetail;
