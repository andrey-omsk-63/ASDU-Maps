import * as React from 'react';
import { useSelector } from 'react-redux';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { ComplianceMapMassdk, WaysInput, BadExit } from './../MapServiceFunctions';

import { styleModalEnd, styleFormInf, styleFormName } from './../MainMapStyle';
import { styleFT02, styleFT03, styleFT033 } from './../MainMapStyle';
import { styleFormTabl, styleFormMenu } from './../MainMapStyle';

let oldIdx = -1;
let massForm: any = null;
let idx = 0;
let HAVE = 0;

const MapVertexForma = (props: { setOpen: any; idx: number }) => {
  //== Piece of Redux =======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map;
  });
  //console.log("map:", map);
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  //===========================================================
  const [badExit, setBadExit] = React.useState(false);
  const idxMap = ComplianceMapMassdk(props.idx, massdk, map);
  const MAP = map.dateMap.tflight[idxMap];
  //=== инициализация ======================================
  console.log('MapVertexForma', oldIdx, props.idx);
  if (oldIdx !== props.idx) {
    oldIdx = props.idx;
    HAVE = 0;
    let maskForm: any = {
      kolFaz: idxMap >= 0 ? MAP.phases.length : 0,
      offset: 0,
      phases: [],
    };

    let maskFaz: any = {
      MinDuration: 0,
      StartDuration: 0,
      PhaseOrder: 0,
    };

    massForm = maskForm;
    let lng = idxMap >= 0 ? MAP.phases.length : 0;
    for (let i = 0; i < lng; i++) {
      massForm.phases.push(maskFaz);
    }
  }

  const CloseEnd = React.useCallback(() => {
    console.log('CloseEnd:', HAVE);
    oldIdx = -1;
    props.setOpen(false);
  }, [props]);

  const handleCloseBad = React.useCallback(() => {
    console.log('handleCloseBad:', HAVE);
    HAVE && setBadExit(true);
    !HAVE && CloseEnd(); // выход без сохранения
  }, [CloseEnd]);

  // const handleCloseEnd = (event: any, reason: string) => {
  //   if (reason === "escapeKeyDown") handleCloseBad();
  // };

  const handleCloseBadExit = (mode: boolean) => {
    console.log('handleCloseBadExit:', mode);
    setBadExit(false);
    mode && CloseEnd(); // выход без сохранения
  };

  //=== Функции - обработчики ==============================
  const SaveForm = (mode: boolean) => {
    console.log('SaveForm:', typeof mode);
    if (mode) {
      CloseEnd(); // здесь должно быть сохранение
    } else {
      handleCloseBad();
    }
  };

  const SetOffset = (valueInp: number) => {
    massForm.offset = valueInp;
    HAVE++;
  };

  const SetMinDuration = (valueInp: number) => {
    massForm.phases[idx].MinDuration = valueInp;
    HAVE++;
  };
  const SetStDuration = (valueInp: number) => {
    massForm.phases[idx].StartDuration = valueInp;
    HAVE++;
  };
  const SetPhaseOrder = (valueInp: number) => {
    massForm.phases[idx].PhaseOrder = valueInp;
    HAVE++;
  };
  //========================================================
  const HeaderTablFaz = () => {
    return (
      <Grid container>
        <Grid item xs={1} sx={styleFT02}>
          №
        </Grid>
        <Grid item xs={3.5} sx={styleFT02}>
          Мин.длит.фаз(с)
        </Grid>
        <Grid item xs={3.5} sx={styleFT02}>
          Нач.длит.фаз(с)
        </Grid>
        <Grid item xs={4} sx={styleFT02}>
          Порядок фаз
        </Grid>
      </Grid>
    );
  };

  const StrokaMainTabl = () => {
    let resStr = [];
    let lng = idxMap >= 0 ? MAP.phases.length : 0;
    //lng = 8; // для отладки, потом убрать !!!
    for (let i = 0; i < lng; i++) {
      idx = i;
      resStr.push(
        <Grid key={i} container item xs={12} sx={{ fontSize: 14 }}>
          <Grid xs={1} item sx={styleFT03}>
            <Box sx={{ p: 0.2 }}>{i + 1}</Box>
          </Grid>
          <Grid xs={3.5} item sx={styleFT03}>
            <Box sx={{ display: 'grid', justifyContent: 'center' }}>
              {WaysInput(massForm.phases[i].MinDuration, SetMinDuration, 20)}
            </Box>
          </Grid>
          <Grid xs={3.5} item sx={styleFT03}>
            <Box sx={{ display: 'grid', justifyContent: 'center' }}>
              {WaysInput(massForm.phases[i].StartDuration, SetStDuration, 20)}
            </Box>
          </Grid>
          <Grid xs={4} item sx={styleFT033}>
            <Box sx={{ display: 'grid', justifyContent: 'center' }}>
              {WaysInput(massForm.phases[i].PhaseOrder, SetPhaseOrder, 20)}
            </Box>
          </Grid>
        </Grid>,
      );
    }
    return resStr;
  };

  const StrokaTabl = (recLeft: string, recRight: any) => {
    return (
      <>
        <Grid container sx={{ marginTop: 1 }}>
          <Grid item xs={0.25}></Grid>
          <Grid item xs={6}>
            <b>{recLeft}</b>
          </Grid>
          {typeof recRight === 'object' ? (
            <Grid item xs>
              {recRight}
            </Grid>
          ) : (
            <Grid item xs sx={{ color: '#5B1080' }}>
              <b>{recRight}</b>
            </Grid>
          )}
        </Grid>
      </>
    );
  };

  //=== обработка Esc ======================================
  const escFunction = React.useCallback(
    (event) => {
      if (event.keyCode === 27) {
        console.log('ESC!!!', HAVE);
        handleCloseBad();
      }
    },
    [handleCloseBad],
  );

  React.useEffect(() => {
    document.addEventListener('keydown', escFunction);
    return () => document.removeEventListener('keydown', escFunction);
  }, [escFunction]);
  //========================================================

  let aa = idxMap >= 0 ? MAP.area.nameArea : '';
  let bb = massdk.length > props.idx ? massdk[props.idx].area : '';
  let soob1 = bb + ' ' + aa;
  let soob2 = idxMap >= 0 ? MAP.phases.length : 'нет информации';

  return (
    <>
      <Box sx={styleFormInf}>
        <Button sx={styleModalEnd} onClick={() => handleCloseBad()}>
          <b>&#10006;</b>
        </Button>
        {badExit && <>{BadExit(badExit, handleCloseBadExit)}</>}
        {massdk.length > props.idx && (
          <>
            <Box sx={styleFormName}>
              <b>
                <em>{massdk[props.idx].nameCoordinates}</em>
              </b>
            </Box>
            <Box sx={{ fontSize: 12, marginTop: 0.5 }}>Общие</Box>
            {StrokaTabl('Район', soob1)}
            {StrokaTabl('Номер перекрёстка', massdk[props.idx].ID)}
            {StrokaTabl('Время цикла cек.', '80 сек.')}
            <Box sx={{ fontSize: 12, marginTop: 2.5 }}>Свойства фаз</Box>
            {StrokaTabl('Количество фаз', soob2)}
            {StrokaTabl('Начальное смещение сек.', WaysInput(massForm.offset, SetOffset, 100))}
            <Box sx={{ fontSize: 12, marginTop: 2.5 }}>Таблица параметров фаз</Box>
            <Box sx={styleFormTabl}>
              {HeaderTablFaz()}
              {StrokaMainTabl()}
            </Box>
            <Grid container>
              <Grid item xs={6} sx={{ marginTop: 1, textAlign: 'center' }}>
                <Button sx={styleFormMenu} onClick={() => SaveForm(true)}>
                  Сохранить изменения
                </Button>
              </Grid>
              <Grid item xs={6} sx={{ marginTop: 1, textAlign: 'center' }}>
                <Button sx={styleFormMenu} onClick={() => SaveForm(false)}>
                  Выйти без сохранения
                </Button>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </>
  );
};

export default MapVertexForma;
