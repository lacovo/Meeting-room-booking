import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import TableToolbar from '../TableToolbar';
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

describe('<TableToolbar />', () => {
  it('Should render and match the snapshot', () => {
    const wrapper = shallow(<TableToolbar selected={[]} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

