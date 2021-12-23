import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IAppState, IStatus, IMatch } from '../types';
import { setStatus, loadBookings, loadRooms } from '../redux';
import Navbar from '../components/Navbar';
import EnhancedTable from '../components/BookingTable';

function BookingPage() {
  const match: IMatch = useSelector((state: IAppState) => {
    return state.match;
  });

  const dispatch = useDispatch();
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

  async function fetchData() {
    dispatch(setStatus(IStatus.LOADING));
    const res = await fetch('/bookings?' + query);
    const roomRes = await fetch('/bookings/room?roomid=');
    const resJson = await res.json();
    const roomJson = await roomRes.json();
    dispatch(loadBookings(resJson as any));
    dispatch(loadRooms(roomJson as any));
    dispatch(setStatus(IStatus.LOADED));
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match]);

  return (
    <>
      <Navbar title="Booking Table" />
      <div>
        <EnhancedTable />
      </div>
    </>
  );
}

export default BookingPage;
