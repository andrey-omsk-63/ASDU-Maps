// import * as React from 'react';
// import Backdrop from '@mui/material/Backdrop';
// import CircularProgress from '@mui/material/CircularProgress';
// import Button from '@mui/material/Button';

import { YMaps, Map } from 'react-yandex-maps';

const BindDiagram = () => {
  return (
    <YMaps>
      <div>
        My awesome application with maps!
        <Map defaultState={{ center: [55.75, 37.57], zoom: 50 }} />
      </div>
    </YMaps>
  );







  //   console.log('BindDiagram - props:', props);

  //   const [open, setOpen] = React.useState(false);
  //   const handleClose = () => {
  //     setOpen(false);
  //   };
  //   const handleToggle = () => {
  //     setOpen(!open);
  //   };

  //   return (
  //     <div>
  //       <Button onClick={handleToggle}>Show backdrop</Button>
  //       <Backdrop
  //         sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
  //         open={open}
  //         onClick={handleClose}
  //       >
  //         <CircularProgress color="inherit" />
  //       </Backdrop>
  //     </div>
  //   );
};

export default BindDiagram;
