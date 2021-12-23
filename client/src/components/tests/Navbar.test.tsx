import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Navbar from '../Navbar';
import toJson from "enzyme-to-json";

configure({ adapter: new Adapter() });

describe('<Navbar />', () => {
  it('Expect to not log errors in console', () => {
    const spy = jest.spyOn(global.console, 'error');
    const wrapper = shallow(<Navbar />);
    expect(wrapper).not.toBeNull();
    expect(spy).not.toHaveBeenCalled();
  });
  it('Should render and match the snapshot', () => {
    const wrapper = shallow(<Navbar />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
