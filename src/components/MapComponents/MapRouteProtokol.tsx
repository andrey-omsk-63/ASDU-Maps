import * as React from 'react';
import { useSelector } from 'react-redux';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

import { styleModalEnd } from './../MainMapStyle';

const MapRouteProtokol = (props: { setOpen: any }) => {
  //== Piece of Redux =======================================
  let massroutepro = useSelector((state: any) => {
    const { massrouteproReducer } = state;
    return massrouteproReducer.massroutepro;
  });

  const [openSetPro, setOpenSetPro] = React.useState(true);

  const handleCloseSetEndPro = () => {
    props.setOpen(false);
    setOpenSetPro(false);
  };

  let massPro = massroutepro.ways;
  console.log('!!!', massroutepro.ways, massPro);

  let massProtokol = [];
  let massArea: Array<number> = [];
  for (let i = 0; i < massPro.length; i++) {
    let flagAvail = false;
    for (let j = 0; j < massArea.length; j++) {
      if (massPro[i].sourceArea === massArea[j]) flagAvail = true;
    }
    if (!flagAvail) massArea.push(massPro[i].sourceArea);
  }
  console.log('MassArea', massArea);
  // massArea = massArea.sort(function (a, b) {
  //   return a - b;
  // });
  let massAreaSort = new Float64Array(massArea);
  console.log('MassAreaSort', massAreaSort);

  massAreaSort = massAreaSort.sort(); // отсортированый массив подрайонов
  for (let i = 0; i < massAreaSort.length; i++) {
    let masSpis: any = [];
    masSpis = massPro.filter((mass: { sourceArea: number }) => mass.sourceArea === massAreaSort[i]);
    console.log('1MasSpis', i, masSpis);
    masSpis.sort((x: any, y: any) => x.sourceID - y.sourceID);
    console.log('2MasSpis', i, masSpis);
    massProtokol.push(masSpis);
  }
  console.log('MassProtokol', massProtokol);

  const styleSetInf = {
    position: 'absolute',
    marginTop: '15vh',
    marginLeft: '33vh',
    width: 460,
    bgcolor: 'background.paper',
    opacity: 0.7,
    border: '3px solid #000',
    borderColor: 'primary.main',
    borderRadius: 2,
    boxShadow: 24,
    p: 1.5,
  };

  return (
    <Modal open={openSetPro} onClose={handleCloseSetEndPro} hideBackdrop>
      <Box sx={styleSetInf}>
        <Button sx={styleModalEnd} onClick={handleCloseSetEndPro}>
          <b>&#10006;</b>
        </Button>
        <Box sx={{ textAlign: 'center' }}>
          <b>Протокол созданных связей:</b>
        </Box>
        <Grid container sx={{ backgroundColor: '#D7F1C0' }}>
          <Grid item xs={6} sx={{ border: 0, textAlign: 'center' }}>
            <b>Исходящая часть</b>
          </Grid>
          <Grid item xs={6} sx={{ border: 0, textAlign: 'center' }}>
            <b>Входящая часть</b>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={6}>
            &nbsp;&nbsp;Подрайон: <b>{massroutepro.ways[0].sourceArea}</b> ID:&nbsp;
            <b>{massroutepro.ways[0].sourceID}</b> Напр: <b>{massroutepro.ways[0].lsource}</b>
          </Grid>
          <Grid item xs={6}>
            &nbsp;&nbsp;Подрайон: <b>{massroutepro.ways[0].targetArea}</b> ID:&nbsp;
            <b>{massroutepro.ways[0].targetID}</b> Напр: <b>{massroutepro.ways[0].ltarget}</b>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default MapRouteProtokol;
