import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { massplanCreate } from './../../../redux/actions';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
//import TextField from "@mui/material/TextField";

//import MapPointDataError from "./MapPointDataError";

import { BadExit } from '../../MapServiceFunctions';
//import { PreparCurrenciesPlan, InputNamePK } from "../../MapServiceFunctions";
//import { SaveFormPK } from "../../MapServiceFunctions";

import { AREA } from '../../MainMapGl';

import { styleModalEnd, MakeStyleFormPK00 } from '../../MainMapStyle';
import { styleFormPK01, MakeStylSpisPK01 } from '../../MainMapStyle';
import { MakeStylSpisPK02, styleSpisPK03 } from '../../MainMapStyle';

let HAVE = 0;
//let isOpen = false;
let flagDel = 0;

let massSpis: Array<any> = [];

const MapSpisPK = (props: { setOpen: any; SetMass: Function }) => {
  //== Piece of Redux =======================================
  // const map = useSelector((state: any) => {
  //   const { mapReducer } = state;
  //   return mapReducer.map;
  // });
  // let massroute = useSelector((state: any) => {
  //   const { massrouteReducer } = state;
  //   return massrouteReducer.massroute;
  // });
  let massplan = useSelector((state: any) => {
    const { massplanReducer } = state;
    return massplanReducer.massplan;
  });
  console.log('massplan:', massplan);
  const dispatch = useDispatch();
  //===========================================================
  //const [openSetErr, setOpenSetErr] = React.useState(props.openErr);
  const [trigger, setTrigger] = React.useState(false);
  const [badExit, setBadExit] = React.useState(false);
  // const [currentBoard, setCurrentBoard] = React.useState<any>(null);
  // const [currentItem, setCurrentItem] = React.useState<any>(null);
  // const [currencyPlan, setCurrencyPlan] = React.useState("0");
  let AreA = AREA === '0' ? 1 : Number(AREA);
  //=== инициализация ======================================
  if (massplan.plans.length !== massSpis.length) {
    //isOpen = true;
    flagDel = 0;
    //massSpis = [];
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
          if (massSpis[j].del) flagDel++;
          massSp.push({ ...massSpis[j] });
          have = true;
        }
      }
      !have && massSp.push(mask);
    }
    massSpis = [];
    massSpis = massSp;
    console.log('Inic:', AreA);
  }
  //========================================================
  //const [boards, setBoards] = React.useState(massBoard);
  //const [valuen, setValuen] = React.useState(NewCoordPlan.namePK);

  const CloseEnd = React.useCallback(() => {
    HAVE = 0;
    //isOpen = false;
    props.setOpen(false); // полный выход
  }, [props]);

  const handleCloseBad = React.useCallback(() => {
    HAVE && setBadExit(true);
    !HAVE && CloseEnd(); // выход без сохранения
  }, [CloseEnd]);

  const handleCloseBadExit = (mode: boolean) => {
    setBadExit(false);
    mode && CloseEnd(); // выход без сохранения
  };

  //=== Функции - обработчики ==============================
  // const SaveForm = (mode: boolean) => {
  //   console.log("SaveForm:", boards);
  //   if (mode) {
  //     CloseEnd(); // здесь должно быть сохранение
  //   } else {
  //     handleCloseBad();
  //   }
  // };
  //=== Drag and Drop ======================================

  //=== обработка Esc ======================================
  const escFunction = React.useCallback(
    (event) => {
      if (event.keyCode === 27) {
        console.log('ESC!!!', HAVE);
        HAVE = 0;
        //isOpen = false;
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

  const StrokaSpisPlan = () => {
    let resStr = [];
    for (let i = 0; i < massSpis.length; i++) {
      let titleDel = massSpis[i].del ? 'Восстановить' : 'Удалить';
      let del = massSpis[i].del;
      resStr.push(
        <Grid key={i} container>
          <Grid item xs={9.5} sx={{ border: 0 }}>
            <Button sx={MakeStylSpisPK02(0, del)}>
              {massSpis[i].nom < 10 && <Box>&nbsp;&nbsp;</Box>}
              <Box>{massSpis[i].nom}</Box>
              <Box>&nbsp;</Box>
              <Box>
                <b>{massSpis[i].name.slice(0, 45)}</b>
              </Box>
            </Button>
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
    //let massSp = [];
    let massplanPlans = [];
    for (let i = 0; i < massSpis.length; i++) {
      if (!massSpis[i].del) {
        //massSp.push({ ...massSpis[i]})
        massplanPlans.push({ ...massplan.plans[i] });
      }
    }
    massplan.plans = [];
    massplan.plans = massplanPlans;
    dispatch(massplanCreate(massplan));
    setTrigger(!trigger); // ререндер
  };

  return (
    <>
      {badExit && <>{BadExit(badExit, handleCloseBadExit)}</>}
      <Box sx={MakeStyleFormPK00(505)}>
        <Button sx={styleModalEnd} onClick={() => handleCloseBad()}>
          <b>&#10006;</b>
        </Button>
        <Box sx={styleFormPK01}>
          <b>Выбор плана координации</b>
        </Box>
        <Box sx={MakeStylSpisPK01()}>{StrokaSpisPlan()}</Box>
        {flagDel > 0 && (
          <>
            <Box sx={{ marginTop: 1, textAlign: 'center' }}>
              <Button sx={styleSpisPK03} onClick={() => DelSpis()}>
                Удалить отмеченные
              </Button>
            </Box>
          </>
        )}
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

export default MapSpisPK;
