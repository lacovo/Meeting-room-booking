import * as React from 'react';
import { AppBar, Toolbar, Box, Button, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

export default function Navbar(props: any) {
  const history = useHistory();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            {props.title}
          </Typography>
          {props.title === 'Booking Table' ? (
            <Button
              className="header-button"
              color="inherit"
              onClick={() => history.push('/roomdetail/0')}
            >
              Create New Booking
            </Button>
          ) : (
            <Button
              className="header-button"
              color="inherit"
              onClick={() => history.push('/')}
            >
              return
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
