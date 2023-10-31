import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { massplanCreate, statsaveCreate } from './../../../redux/actions';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import MapPointDataError from './../MapPointDataError';
import MapViewPK from './MapViewPK';

//import { BadExit } from "../../MapServiceFunctions";

//import { AREA } from "../../MainMapGl";

import { styleModalEnd, MakeStyleFormPK00 } from '../../MainMapStyle';
import { styleFormPK01, MakeStylSpisPK01 } from '../../MainMapStyle';
import { MakeStylSpisPK02, styleSpisPK03 } from '../../MainMapStyle';
//import { styleSpisPK04 } from "../../MainMapStyle";

//let HAVE = 0;
let flagDel = 0;
let soobErr = '';
let IDX = -1;

let massSpis: Array<any> = [];

const MapSpisPK = (props: {
  setOpen: any;
  setMode: Function; // запуск редактирования ПК
}) => {
  //== Piece of Redux =======================================
  let massplan = useSelector((state: any) => {
    const { massplanReducer } = state;
    return massplanReducer.massplan;
  });
  //console.log('###massplan:', massplan);
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  //console.log('massplan:', massplan, massSpis);
  const dispatch = useDispatch();
  //===========================================================
  const [openSetErr, setOpenSetErr] = React.useState(false);
  const [trigger, setTrigger] = React.useState(false);
  //const [badExit, setBadExit] = React.useState(false);
  const [view, setView] = React.useState(false);

  //let AreA = AREA === "0" ? 1 : Number(AREA);
  //=== инициализация ======================================
  if (massplan.plans.length !== massSpis.length || datestat.needMakeSpisPK) {
    flagDel = 0;
    let massSp = [];
    for (let i = 0; i < massplan.plans.length; i++) {
      let mask = {
        nom: massplan.plans[i].nomPK,
        name: massplan.plans[i].namePK,
        del: false,
      };
      let have = false;
      for (let j = 0; j < massSpis.length; j++) {
        if (massSpis[j].nom === massplan.plans[i].nomPK) {
          massSpis[j].name = massplan.plans[i].namePK;
          if (massSpis[j].del) flagDel++;
          massSp.push({ ...massSpis[j] });
          have = true;
        }
      }
      !have && massSp.push(mask);
    }
    massSpis = [];
    massSpis = massSp;
    if (datestat.needMakeSpisPK) {
      datestat.needMakeSpisPK = false;
      dispatch(statsaveCreate(datestat));
    }
  }
  //========================================================
  // const CloseEnd = React.useCallback(() => {
  //   props.setOpen(false); // полный выход
  // }, [props]);

  const CloseEnd = () => {
    props.setOpen(false); // полный выход
  };

  // const handleCloseBad = React.useCallback(() => {
  //   CloseEnd(); // выход без сохранения
  // }, [CloseEnd]);

  // const handleCloseBadExit = (mode: boolean) => {
  //   //setBadExit(false);
  //   mode && CloseEnd(); // выход без сохранения
  // };
  //=== обработка Esc ======================================
  const escFunction = React.useCallback(
    (event) => {
      if (event.keyCode === 27) {
        props.setOpen(false); // полный выход
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
  const MarkSpis = (idx: number) => {
    massSpis[idx].del = !massSpis[idx].del;
    if (massSpis[idx].del) {
      flagDel++;
    } else flagDel--;
    setTrigger(!trigger); // ререндер
  };

  const EditPlan = (idx: number) => {
    props.setMode(idx); // запуск редактирования ПК
  };

  const ViewPlan = (idx: number) => {
    if (massSpis[idx].del) {
      soobErr = 'План координации №' + massSpis[idx].nom + ' помечен на удаление';
      setOpenSetErr(true);
    } else {
      IDX = idx;
      setView(true);
    }
  };

  const StrokaSpisPlan = () => {
    let resStr = [];
    for (let i = 0; i < massSpis.length; i++) {
      let del = massSpis[i].del;
      let titleDel = del ? 'Восстановить' : 'Удалить';
      resStr.push(
        <Grid key={i} container>
          <Grid item xs={8} sx={{ border: 0 }}>
            <Button sx={MakeStylSpisPK02(0, del)} onClick={() => ViewPlan(i)}>
              {massSpis[i].nom < 10 && <Box>&nbsp;&nbsp;</Box>}
              <Box sx={{ color: '#5B1080' }}>{massSpis[i].nom}.</Box>
              <Box>&nbsp;</Box>
              <Box>
                <b>{massSpis[i].name.slice(0, 45)}</b>
              </Box>
            </Button>
          </Grid>
          <Grid item xs={1.7} sx={{ border: 0 }}>
            {!del && (
              <Button sx={MakeStylSpisPK02(0, del)} onClick={() => EditPlan(i)}>
                Изменить
              </Button>
            )}
          </Grid>
          <Grid item xs sx={{ border: 0 }}>
            <Button sx={MakeStylSpisPK02(1, del)} onClick={() => MarkSpis(i)}>
              {titleDel}
            </Button>
          </Grid>
        </Grid>,
      );
    }
    return resStr;
  };

  const DelSpis = () => {
    let massplanPlans = [];
    for (let i = 0; i < massSpis.length; i++) {
      if (!massSpis[i].del) massplanPlans.push({ ...massplan.plans[i] });
    }
    massplan.plans = [];
    massplan.plans = massplanPlans;
    dispatch(massplanCreate(massplan));
    setTrigger(!trigger); // ререндер
  };

  return (
    <>
      <Box sx={MakeStyleFormPK00(590)}>
        <Button sx={styleModalEnd} onClick={() => CloseEnd()}>
          <b>&#10006;</b>
        </Button>
        <Box sx={styleFormPK01}>
          <b>Выбор плана координации</b>
        </Box>
        <Box sx={MakeStylSpisPK01()}>{StrokaSpisPlan()}</Box>
        {flagDel > 0 && (
          <Box sx={{ marginTop: 1, textAlign: 'center' }}>
            <Button sx={styleSpisPK03} onClick={() => DelSpis()}>
              Удалить отмеченные
            </Button>
          </Box>
        )}
      </Box>
      {view && <MapViewPK view={view} idx={IDX} handleClose={setView} />}
      {openSetErr && (
        <MapPointDataError
          sErr={soobErr}
          setOpen={setOpenSetErr}
          fromCross={0}
          toCross={0}
          update={0}
          svg={{}}
          setSvg={{}}
        />
      )}
    </>
  );
};

export default MapSpisPK;
