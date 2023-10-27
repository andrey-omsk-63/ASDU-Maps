import * as React from "react";
import {
  useSelector,
  //useDispatch
} from "react-redux";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
//import TextField from "@mui/material/TextField";

//import MapPointDataError from "./MapPointDataError";

import { BadExit, UniqueName, InputFromList } from "../../MapServiceFunctions";
//import { PreparCurrenciesPlan, InputNamePK } from "../../MapServiceFunctions";
//import { SaveFormPK } from "../../MapServiceFunctions";

import { AREA } from "../../MainMapGl";

import { styleModalEnd, MakeStyleFormPK00 } from "../../MainMapStyle";
import { styleFormPK01 } from "../../MainMapStyle";
//import { MakeStyleFormPK022, styleFormPK05 } from "../../MainMapStyle";

let HAVE = 0;
let isOpen = false;

let massSpis: Array<string>;

let massBoard = [
  {
    ID: 0,
    title: "Откуда",
    items: [],
  },
  {
    ID: 1,
    title: "Куда",
    items: [],
  },
];

const MapSpisPK = (props: { setOpen: any; SetMass: Function }) => {
  //== Piece of Redux =======================================
  // const map = useSelector((state: any) => {
  //   const { mapReducer } = state;
  //   return mapReducer.map;
  // });
  let massroute = useSelector((state: any) => {
    const { massrouteReducer } = state;
    return massrouteReducer.massroute;
  });
  let massplan = useSelector((state: any) => {
    const { massplanReducer } = state;
    return massplanReducer.massplan;
  });
  console.log("massplan:", massplan);
  //const dispatch = useDispatch();
  //===========================================================
  //const [openSetErr, setOpenSetErr] = React.useState(props.openErr);
  //const [trigger, setTrigger] = React.useState(false);
  const [badExit, setBadExit] = React.useState(false);
  // const [currentBoard, setCurrentBoard] = React.useState<any>(null);
  // const [currentItem, setCurrentItem] = React.useState<any>(null);
  // const [currencyPlan, setCurrencyPlan] = React.useState("0");
  let AreA = AREA === "0" ? 1 : Number(AREA);
  //=== инициализация ======================================
  if (!isOpen) {
    isOpen = true;
    massSpis = [];
    for (let i = 0; i < massplan.plans.length; i++) {
      let nom = massplan.plans[i].nomPK < 10 ? ".." : "";
      let str = nom + massplan.plans[i].nomPK + " " + massplan.plans[i].namePK;
      massSpis.push(str)
    }
    console.log("Inic:", AreA, massBoard);
  }
  //========================================================
  const [boards, setBoards] = React.useState(massBoard);
  //const [valuen, setValuen] = React.useState(NewCoordPlan.namePK);

  const CloseEnd = React.useCallback(() => {
    HAVE = 0;
    isOpen = false;
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
        console.log("ESC!!!", HAVE);
        HAVE = 0;
        isOpen = false;
        props.setOpen(false); // полный выход
        event.preventDefault();
      }
    },
    [props]
  );

  React.useEffect(() => {
    document.addEventListener("keydown", escFunction);
    return () => document.removeEventListener("keydown", escFunction);
  }, [escFunction]);
  //========================================================
  const MakeStylSpisPK01 = () => {
    let ratio = window.innerHeight < 800 ? 0.793 : 0.83;
    const styleSpisPK01 = {
      width: "98.5%",
      height: window.innerHeight * ratio,
      bgcolor: "#F0F0F0",
      border: "1px solid #1976D2", // "primary.main"
      borderRadius: 1,
      marginTop: 1,
      alignItems: "center",
      //overflowX: "auto",
      boxShadow: 6,
      padding: "5px 5px 0px 5px",
    };
    return styleSpisPK01;
  };

  const MakeStylSpisPK02 = (mode: number) => {
    const styleSpisPK02 = {
      maxHeight: "24px",
      minHeight: "24px",
      width: "99%",
      marginBottom: 0.7,
      backgroundColor: "#E6F5D6", // светло салатовый
      border: "1px solid #000",
      borderRadius: 1,
      borderColor: "#d4d4d4", // серый
      textTransform: "unset !important",
      color: "black",
      padding: "0px 5px 0px 5px",
      justifyContent: mode ? "center" : "flex-start",
      boxShadow: 6,
    };
    return styleSpisPK02;
  };

  const StrokaSpisPlan = () => {
    let resStr = [];

    for (let i = 0; i < massSpis.length; i++) {
      resStr.push(
        <Grid key={i} container sx={{ fontSize: 10 }}>
          <Grid item xs={9.5} sx={{ border: 0 }}>
            <Button sx={MakeStylSpisPK02(0)}>
              <b>{massSpis[i]}</b>
            </Button>
          </Grid>
          <Grid item xs sx={{ border: 0 }}>
            <Button sx={MakeStylSpisPK02(1)}>Удалить</Button>
          </Grid>
        </Grid>
      );
    }
    return resStr;
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
