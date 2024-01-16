import * as React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

import MapCreatePoint from './MapCreatePoint';
import MapCreateVertex from './MapCreateVertex';

import { KnopProps } from './../MapServiceFunctions';

import { styleModalEnd, styleModalMenu } from './../MainMapStyle';
import { styleTypography } from './../MainMapStyle';

import { AREA } from './../MainMapGl';

const MapCreatePointVertex = (props: {
  setOpen: any;
  coord: any;
  createPoint: any;
}) => {
  const styleSet = {
    outline: 'none',
    position: 'absolute',
    marginTop: '24vh',
    marginLeft: '27vh',
    width: 340,
    bgcolor: 'background.paper',
    border: "1px solid #FFFFFF",
    borderRadius: 1,
    boxShadow: 24,
    p: 1.5,
  };

  const [openSet, setOpenSet] = React.useState(true);
  const [openSetPoint, setOpenSetPoint] = React.useState(false);
  const [openSetVert, setOpenSetVert] = React.useState(false);

  const handleCloseSetEnd = () => {
    props.setOpen(false);
    setOpenSet(false);
  };

  const handleCloseSet = (event: any, reason: string) => {
    if (reason !== 'backdropClick') handleCloseSetEnd();
  };

  const handleClose = (mode: number) => {
    if (typeof mode !== 'number') {
      handleCloseSetEnd();
    } else {
      if (mode === 1) {
        setOpenSetPoint(true);
      } else {
        setOpenSetVert(true);
      }
      setOpenSet(false);
    }
  };

  return (
    <>
      <Modal open={openSet} onClose={handleCloseSet}>
        <Box sx={styleSet}>
          <Button sx={styleModalEnd} onClick={handleCloseSetEnd}>
            <b>&#10006;</b>
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={styleTypography}>
              Что создаём?
            </Typography>
            <br />
            {KnopProps(styleModalMenu, handleClose, 'Точку', 1)}
            &nbsp;
            {KnopProps(styleModalMenu, handleClose, 'Перекрёсток', 2)}
          </Box>
        </Box>
      </Modal>
      {openSetPoint && (
        <MapCreatePoint
          setOpen={props.setOpen}
          coord={props.coord}
          createPoint={props.createPoint}
        />
      )}
      {openSetVert && (
        <MapCreateVertex
          setOpen={props.setOpen}
          area={AREA}
          coord={props.coord}
          createPoint={props.createPoint}
        />
      )}
    </>
  );
};

export default MapCreatePointVertex;
