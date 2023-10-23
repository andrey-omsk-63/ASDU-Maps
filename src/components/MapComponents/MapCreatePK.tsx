import * as React from "react";
import {
  useSelector,
  //useDispatch
} from "react-redux";
//import { statsaveCreate } from "../../redux/actions";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

//import MapPointDataError from "./MapPointDataError";

//import { ComplianceMapMassdk } from "./../MapServiceFunctions";
import { BadExit } from "./../MapServiceFunctions";
//import { SaveFormVert } from "./../MapServiceFunctions";

import { AREA } from "./../MainMapGl";

import { styleModalEnd, styleFormMenu } from "./../MainMapStyle";

//let oldIdx = -1;
let massForm: any = null;
let HAVE = 0;

//let FAZA = 0;

// const maskFaz: any = {
//   MinDuration: 0,
//   StartDuration: 0,
//   PhaseOrder: 0,
// };

const MapCreatePK = (props: {
  setOpen: any;
  idx: number;
  openErr: boolean;
}) => {
  //== Piece of Redux =======================================
  // const map = useSelector((state: any) => {
  //   const { mapReducer } = state;
  //   return mapReducer.map;
  // });
  //console.log("map:", map);
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  
  let massroute = useSelector((state: any) => {
    const { massrouteReducer } = state;
    return massrouteReducer.massroute;
  });
  console.log("massroute:", massroute);
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

  //=== инициализация ======================================
  let massVert: any = [];
  console.log("###Inic:",massroute.vertexes.length, massroute.vertexes);
  for (let i = 0; i < massroute.vertexes.length; i++) {
    //console.log("!!!Inic:", massroute.vertexes[i].area, Number(AreA));
    if (massroute.vertexes[i].area === AreA) {
      let maskVert = {
        area: massroute.vertexes[i].area,
        id: massroute.vertexes[i].id,
        name: massroute.vertexes[i].name,
      };
      massVert.push(maskVert);
    }
  }
  console.log("Inic:", AreA, typeof AreA, massVert);

  //========================================================
  const CloseEnd = React.useCallback(() => {
    //oldIdx = -1;
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
        console.log("ESC!!!", HAVE);
        HAVE = 0;
        props.setOpen(false, null); // полный выход
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

  const styleFormPK00 = {
    outline: "none",
    position: "relative",
    marginTop: "-97vh",
    marginLeft: "auto",
    marginRight: "9px",
    width: 696,
    height: window.innerHeight * 0.92,
    bgcolor: "background.paper",
    border: "1px solid #000",
    borderColor: "primary.main",
    borderRadius: 1,
    boxShadow: 24,
    p: 1.5,
  };

  const styleFormPK01 = {
    fontSize: 18,
    textAlign: "center",
    color: "#5B1080",
  };

  const styleFormPK02 = {
    border: "1px solid #000",
    bgcolor: "#F0F0F0",
    height: window.innerHeight * 0.803,
    borderColor: "primary.main",
    borderRadius: 1,
    boxShadow: 9,
  };

  const styleFormPK03 = {
    // marginTop: 0.5,
    //marginRight: 1,
    maxHeight: "24px",
    minHeight: "24px",
    backgroundColor: "#E6F5D6", // светло салатовый
    border: "1px solid #000",
    borderRadius: 1,
    borderColor: "#d4d4d4", // серый
    textTransform: "unset !important",
    boxShadow: 6,
    color: "black",
  };

  const HeaderFormPK = () => {
    return (
      <>
        <Box sx={styleFormPK01}>
          <b>Создание нового плана координации</b>
        </Box>
        <Grid container sx={{ fontSize: 14, marginTop: 1 }}>
          <Grid item xs={1.6} sx={{ border: 0, marginTop: 0 }}>
            <b>Номер ПК</b>
          </Grid>
          <Grid item xs={0.7} sx={{ border: 1 }}></Grid>
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
          <Grid item xs={3}>
            {massVert[i].id}
          </Grid>
          <Grid item xs>
            {massVert[i].name}
          </Grid>
        </Grid>
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
          <Grid item xs={5.57} sx={{textAlign: "right" }}>
          
            <Button sx={styleFormPK03} onClick={() => SaveForm(true)}>
              Сохранить изменения
            </Button>
          </Grid>
          <Grid item xs={0.82}></Grid>
          <Grid item xs sx={{ textAlign: "left" }}>
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
