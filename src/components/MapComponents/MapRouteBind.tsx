import * as React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

import { styleModalEnd, styleSetInf } from './../MainMapStyle';

const MapRouteBind = (props: { setOpen: any }) => {
  const [openSetBind, setOpenSetBind] = React.useState(true);

  const styleSetImg = {
    // position: "absolute",
    // marginTop: "15vh",
    // marginLeft: "24vh",
    // width: 340,
    bgcolor: 'background.paper',
    border: '3px solid #000',
    borderColor: 'primary.main',
    borderRadius: 2,
    boxShadow: 24,
    p: 1.5,
  };

  const handleCloseSetEndBind = () => {
    props.setOpen(false);
    setOpenSetBind(false);
  };

  let widthGl = window.innerWidth;
  let heightImg = widthGl / 3.333;

  function AppIconAsdu() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={heightImg}
        height={heightImg}
        version="1"
        viewBox="0 0 91 54">
        <path
          d="M425 513C81 440-106 190 91 68 266-41 640 15 819 176c154 139 110 292-98 341-73 17-208 15-296-4zm270-14c208-38 257-178 108-308C676 79 413 8 240 40 29 78-30 199 100 329c131 131 396 207 595 170z"
          transform="matrix(.1 0 0 -.1 0 54)"></path>
        <path
          d="M425 451c-11-18-5-20 74-30 108-14 157-56 154-133-2-52-41-120-73-129-44-12-110-10-110 4 1 6 7 62 14 122 7 61 12 113 10 117-4 6-150 1-191-8-45-9-61-40-74-150-10-90-14-104-30-104-12 0-19-7-19-20 0-11 7-20 15-20s15-7 15-15c0-11 11-15 35-15 22 0 38 6 41 15 4 9 19 15 35 15 22 0 29 5 29 20s-7 20-25 20c-29 0-31 10-14 127 12 82 31 113 71 113 18 0 20-5 15-42-4-24-9-74-12-113-3-38-8-87-11-107l-6-38h46c34 0 46 4 46 15s12 15 48 15c97 0 195 47 227 110 59 115-44 225-223 237-56 4-81 2-87-6z"
          transform="matrix(.1 0 0 -.1 0 54)"></path>
      </svg>
    );
  }

  return (
    <Modal open={openSetBind} onClose={handleCloseSetEndBind} disableEnforceFocus hideBackdrop>
      <>
        <Box sx={styleSetInf}>
          <Button sx={styleModalEnd} onClick={handleCloseSetEndBind}>
            <b>&#10006;</b>
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <br />
            <br />
            <b>Здесь будет привязка направления</b>
            <br /> <br />
            <br />
          </Box>

          {/* <Box
          sx={{
            position: "absolute",
            marginTop: "14vh",
            marginLeft: "-24vh",
            width: 340,
            height: 340,
            bgcolor: "background.paper",
            border: "3px solid #000",
            borderColor: "primary.main",
            borderRadius: 2,
            boxShadow: 24,
            p: 1.5,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              marginTop: "14vh",
              marginLeft: "84vh",
              width: 340,
              height: 340,
              bgcolor: "background.paper",
              border: "3px solid #000",
              borderColor: "primary.main",
              borderRadius: 2,
              boxShadow: 24,
              p: 1.5,
            }}
          ></Box>
        </Box> */}
        </Box>
        <Grid container sx={{ marginTop: '38vh', height: heightImg }}>
          <Grid item xs={0.25} sx={{ border: 0 }}></Grid>
          <Grid item xs={4} sx={styleSetImg}>
            {AppIconAsdu()}
          </Grid>
          <Grid item xs={3.5} sx={{ border: 0 }}></Grid>
          <Grid item xs={4} sx={styleSetImg}>
            {AppIconAsdu()}
          </Grid>
          <Grid item xs={0.25} sx={{ border: 0 }}></Grid>
        </Grid>
      </>
    </Modal>
  );
};

export default MapRouteBind;
