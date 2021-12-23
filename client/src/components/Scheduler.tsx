import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import { AppointmentModel, ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { IAppState, IBooking } from '../types';
import { blue } from '@material-ui/core/colors';
import moment from 'moment';

const theme = createTheme({ palette: { type: 'light', primary: blue } });

export default function RoomScheduler(props: any) {
  const bookings: IBooking[] = useSelector((state: IAppState) => {
    return state.bookings;
  });
  const [appointments, setAppointment] = useState<AppointmentModel[]>([]);
  const { currentDate, room } = props;
  const dateFrom = moment(currentDate).subtract(7, 'd').format('YYYY-MM-DD');
  const dateTo = moment(currentDate).add(7, 'd').format('YYYY-MM-DD');

  useEffect(() => {
    let allBookings = bookings.filter((r) => {
      let thisDate = moment(r.date, 'YYYY-MM-DD');
      return (
        thisDate.isBetween(dateFrom, dateTo) ||
        r.date === dateFrom ||
        r.date === dateTo
      );
    });
    if (room) {
      allBookings = allBookings.filter((r) => {
        return r.roomname === room;
      });
    }
    let temp: AppointmentModel[] = [];
    allBookings.map((row: any) => {
      const appointment = {
        title: 'Booked by' + row.host,
        startDate: new Date(row.date + ' ' + row.starttime),
        endDate: new Date(row.date + ' ' + row.finishtime),
        id: row.bookid,
        location: row.roomname,
      };
      temp.push(appointment);
      return true;
    });
    setAppointment(temp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room, currentDate]);

  return (
    <MuiThemeProvider theme={theme}>
      <Paper>
        <Scheduler data={appointments}>
          <ViewState defaultCurrentDate={currentDate} currentDate={currentDate} />
          <WeekView startDayHour={8} endDayHour={17} />
          <Appointments />
        </Scheduler>
      </Paper>
    </MuiThemeProvider>
  );
}
