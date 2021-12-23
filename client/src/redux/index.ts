import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAppState, IBooking, IStatus, IMatch, IRoom } from '../types';

const defaultState: IAppState = {
  status: IStatus.INIT,
  match: {roomId: "", roomName: "", date:"", host: "", guest: "", orderBy: "default", is_all: false},
  bookings: [],
  rooms: [],
};

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('bookingState');
    if (!serializedState) return defaultState;
    else return JSON.parse(serializedState);
  } catch (err) {
    return defaultState;
  }
};

const saveState = (state: IAppState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('bookingState', serializedState);
  } catch (err) {
    console.log(err);
  }
};

const initialState: IAppState = loadState();

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setStatus(state, action: PayloadAction<IStatus>) {
      state.status = action.payload;
    },
    setMatch(state, action: PayloadAction<IMatch>) {
      state.match = action.payload;
    },
    loadBookings(state, action: PayloadAction<IBooking[]>) {
      state.bookings = action.payload;
    },
    loadRooms(state, action: PayloadAction<IRoom[]>) {
      state.rooms = action.payload;
    },
    addBooking(
      state,
      action: PayloadAction<{ question: string; answer: boolean }>
    ) {
 
    },
  },
});

export const store = configureStore({ reducer: bookingSlice.reducer });
store.subscribe(() => {
  saveState(store.getState());
});

export const { setStatus, loadBookings, addBooking, setMatch, loadRooms } = bookingSlice.actions;
export default bookingSlice.reducer;
