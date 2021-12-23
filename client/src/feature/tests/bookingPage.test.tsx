import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import BookingPage from '../bookingPage';
import toJson from "enzyme-to-json";

configure({ adapter: new Adapter() });

jest.mock('react-redux', () => ({
  useDispatch: () => {},
  useSelector: () => {
    return [{   status: 0,
      match: {roomId: "", roomName: "", date:"", host: "", guest: "", orderBy: "default", is_all: false},
      bookings: [],
      rooms: [], }];
  },
}));

describe('<BookingPage />', () => {
  it('Expect to not log errors in console', () => {
    const spy = jest.spyOn(global.console, 'error');
    const wrapper = shallow(<BookingPage />);
    expect(wrapper).not.toBeNull();
    expect(spy).not.toHaveBeenCalled();
  });
  it('Should render and match the snapshot', () => {
    const wrapper = shallow(<BookingPage />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
