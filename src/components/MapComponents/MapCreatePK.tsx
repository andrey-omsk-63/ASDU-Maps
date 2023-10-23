import * as React from 'react';
import {
  useSelector,
  //useDispatch
} from 'react-redux';
//import { statsaveCreate } from "../../redux/actions";

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

//import MapPointDataError from "./MapPointDataError";

//import { ComplianceMapMassdk } from "./../MapServiceFunctions";
import { BadExit } from './../MapServiceFunctions';
//import { SaveFormVert } from "./../MapServiceFunctions";

import { AREA } from './../MainMapGl';

import { styleModalEnd, styleFormPK00 } from './../MainMapStyle';
import { styleFormPK01, styleFormPK03 } from './../MainMapStyle';
import { MakeStyleFormPK02 } from './../MainMapStyle';

let massForm: any = null;
let HAVE = 0;

const MapCreatePK = (props: { setOpen: any; idx: number; openErr: boolean }) => {
  //== Piece of Redux =======================================
  // const map = useSelector((state: any) => {
  //   const { mapReducer } = state;
  //   return mapReducer.map;
  // });
  //console.log("map:", map);
  // let massdk = useSelector((state: any) => {
  //   const { massdkReducer } = state;
  //   return massdkReducer.massdk;
  // });

  let massroute = useSelector((state: any) => {
    const { massrouteReducer } = state;
    return massrouteReducer.massroute;
  });
  //console.log('massroute:', massroute);
  // let datestat = useSelector((state: any) => {
  //   const { statsaveReducer } = state;
  //   return statsaveReducer.datestat;
  // });
  //console.log("datestat:", datestat);
  //const dispatch = useDispatch();
  //===========================================================
  // const idxMap = ComplianceMapMassdk(props.idx, massdk, map);
  // const MAP = map.dateMap.tflight[idxMap];

  const [badExit, setBadExit] = React.useState(false);
  //const [openSetErr, setOpenSetErr] = React.useState(props.openErr);
  //const [trigger, setTrigger] = React.useState(false);
  let AreA = AREA === '0' ? 1 : Number(AREA);
  const styleFormPK02 = MakeStyleFormPK02();

  //=== инициализация ======================================
  let massVert: any = [];

  for (let i = 0; i < massroute.vertexes.length; i++) {
    if (massroute.vertexes[i].area === AreA) {
      let maskVert = {
        area: massroute.vertexes[i].area,
        id: massroute.vertexes[i].id,
        name: massroute.vertexes[i].name,
      };
      massVert.push(maskVert);
    }
  }

  massVert.sort(function Func(a: any, b: any) {
    return b.id < a.id ? 1 : b.id > a.id ? -1 : 0;
  });

  console.log('Inic:', AreA, massVert);
  //========================================================
  const CloseEnd = React.useCallback(() => {
    HAVE = 0;
    props.setOpen(false, massForm); // полный выход
  }, [props]);

  const handleCloseBad = React.useCallback(() => {
    HAVE && setBadExit(true);
    !HAVE && CloseEnd(); // выход без сохранения
  }, [CloseEnd]);

  // const handleCloseEnd = (event: any, reason: string) => {
  //   if (reason === "escapeKeyDown") handleCloseBad();
  // };

  const handleCloseBadExit = (mode: boolean) => {
    setBadExit(false);
    mode && CloseEnd(); // выход без сохранения
  };

  //=== Функции - обработчики ==============================
  const SaveForm = (mode: boolean) => {
    if (mode) {
      CloseEnd(); // здесь должно быть сохранение
    } else {
      handleCloseBad();
    }
  };

  //========================================================

  //=== обработка Esc ======================================
  const escFunction = React.useCallback(
    (event) => {
      if (event.keyCode === 27) {
        console.log('ESC!!!', HAVE);
        HAVE = 0;
        props.setOpen(false, null); // полный выход
        event.preventDefault();
      }
    },
    [props],
  );

  React.useEffect(() => {
    document.addEventListener('keydown', escFunction);
    return () => document.removeEventListener('keydown', escFunction);
  }, [escFunction]);
  //========================================================

  const HeaderFormPK = () => {
    return (
      <>
        <Box sx={styleFormPK01}>
          <b>Создание нового плана координации</b>
        </Box>
        <Grid container sx={{ fontSize: 14, border: 0, marginTop: 1 }}>
          <Grid item xs={1.6} sx={{ border: 0, marginTop: 0 }}>
            <b>Номер ПК</b>
          </Grid>
          <Grid item xs={0.7} sx={{ border: 1 }}></Grid>
          <Grid item xs={3.8}></Grid>
          <Grid item xs sx={{ border: 0 }}>
            <b>Район {AreA}</b>
          </Grid>
        </Grid>
        <Grid container sx={{ fontSize: 14, marginTop: 0.5 }}>
          <Grid item xs={1.6} sx={{ border: 0 }}>
            <b>Название ПК</b>
          </Grid>
          <Grid item xs sx={{ border: 1 }}></Grid>
        </Grid>
      </>
    );
  };

  const StrokaFormPkFrom = () => {
    let resStr = [];

    for (let i = 0; i < massVert.length; i++) {
      resStr.push(
        <Grid key={i} container sx={{ fontSize: 12 }}>
          <Grid item xs={1} sx={{ paddingLeft: 0.5 }}>
            {massVert[i].id}
          </Grid>
          <Grid item xs>
            {massVert[i].name}
          </Grid>
        </Grid>,
      );
    }
    return resStr;
  };

  return (
    <>
      {badExit && <>{BadExit(badExit, handleCloseBadExit)}</>}
      <Box sx={styleFormPK00}>
        <Button sx={styleModalEnd} onClick={() => handleCloseBad()}>
          <b>&#10006;</b>
        </Button>

        {HeaderFormPK()}

        <Grid container sx={{ marginTop: 1 }}>
          <Grid item xs={5.9} sx={styleFormPK02}>
            {StrokaFormPkFrom()}
          </Grid>
          <Grid item xs={0.2}></Grid>
          <Grid item xs sx={styleFormPK02}></Grid>
        </Grid>

        <Grid container sx={{ marginTop: 0.8 }}>
          <Grid item xs={5.57} sx={{ textAlign: 'right' }}>
            <Button sx={styleFormPK03} onClick={() => SaveForm(true)}>
              Сохранить изменения
            </Button>
          </Grid>
          <Grid item xs={0.82}></Grid>
          <Grid item xs sx={{ textAlign: 'left' }}>
            <Button sx={styleFormPK03} onClick={() => SaveForm(false)}>
              Выйти без сохранения
            </Button>
          </Grid>
        </Grid>
      </Box>
      {/* {openSetErr && (
        <MapPointDataError
          sErr={soobErr}
          setOpen={setOpenSetErr}
          fromCross={0}
          toCross={0}
          update={0}
          svg={{}}
          setSvg={{}}
        />
      )} */}
    </>
  );
};

export default MapCreatePK;
