import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Filter from '../Filter';
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

describe('<Filter />', () => {
  it('Should render and match the snapshot', () => {
    const wrapper = shallow(<Filter />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
