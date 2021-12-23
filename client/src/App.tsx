import React from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import ThisRouter from './router';

const App = () => {
  return (
    <div>
      <Container fixed>
        <Box textAlign="center" marginTop="3em">
          <ThisRouter />
        </Box>
      </Container>
    </div>  
  );
};

export default App;
