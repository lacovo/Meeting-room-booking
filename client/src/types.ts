export interface IAppState {
  status: IStatus;
  bookings: IBooking[];
  rooms: IRoom[];
  match: IMatch;
}
export enum IStatus {
  INIT,
  LOADING,
  LOADED,
}
export interface IBooking {
  bookid: number;
  roomname: string;
  roomid: string;
  date: string;
  starttime: string;
  finishtime: string;
  host: string;
  guests: string;
}

export interface IRoom {
  roomid: string;
  roomname: string;
  roominfo: string;
  roomimg: string;
  maxpeople: string;
  roomspec: string;
}

export interface IMatch {
  roomId: string;
  roomName: string;
  date: string;
  orderBy: string;
  host: string;
  guest: string;
  is_all: boolean;
}
