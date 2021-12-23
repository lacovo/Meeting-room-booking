import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import BookingPage from './feature/bookingPage';
import RoomDetail from './feature/roomDetail';
import NotFound from './components/NotFound';

const ThisRouter = () => {
  return (
    <Router basename={`${process.env.PUBLIC_URL}/`}>
      <Switch>
        <Route exact path="/" component={BookingPage} />
        <Route exact path="/roomdetail/:bookId">
          <RoomDetail />
        </Route>
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
};

export default ThisRouter;
