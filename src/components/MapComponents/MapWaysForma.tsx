import * as React from "react";
import { useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import MapPointDataError from "./MapPointDataError";
//import MapWaysFormMenu from "./MapWaysFormMenu";

//import { ComplianceMapMassdk } from "./../MapServiceFunctions";

import { styleModalEnd, styleFormInf } from "./../MainMapStyle";
//import { styleFT02, styleFT03, styleFT033 } from "./../MainMapStyle";
//import { styleFormTabl } from "./../MainMapStyle";

let allRight = false;
let openSetErr = false;
let OpenMenu = false;
let soobErr = "";
let massTargetRoute: Array<number> = [];
let massTargetName: Array<string> = [];
//let nomInMass = 0;
let oldIdx = -1;

const MapWaysForma = (props: { setOpen: any; idx: number }) => {
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
  //console.log("massroute:", massroute);
  //===========================================================
  const [nomInMass, setNomInMass] = React.useState(0);
  //const idxMap = ComplianceMapMassdk(props.idx, massdk, map);
  //const MAP = map.dateMap.tflight[idxMap];
  const propsArea = massroute.vertexes[props.idx].area;
  const propsId = massroute.vertexes[props.idx].id;

  //console.log("MapWaysForma:", props.idx, idxMap, propsArea, propsId);
  //=== инициализация ======================================
  if (oldIdx !== props.idx) {
    oldIdx = props.idx;
    allRight = false;
    openSetErr = false;
    OpenMenu = false;
    setNomInMass(0);
    //soobErr = "";
    massTargetRoute = [];
    massTargetName = [];
    for (let i = 0; i < massroute.ways.length; i++) {
      if (
        massroute.ways[i].targetArea === propsArea &&
        massroute.ways[i].targetID === propsId
      ) {
        massTargetRoute.push(i);
        for (let j = 0; j < massroute.vertexes.length; j++) {
          if (
            massroute.ways[i].sourceArea === massroute.vertexes[j].area &&
            massroute.ways[i].sourceID === massroute.vertexes[j].id
          )
            massTargetName.push(massroute.vertexes[j].name);
        }
      }
    }
    if (!massTargetRoute.length) {
      openSetErr = true;
      soobErr =
        "На перекрёстке " +
        massroute.vertexes[props.idx].name +
        " нет входящих направлений";
    } else {
      if (massTargetRoute.length === 1) {
        allRight = true;
      } else {
        //setOpenMenu(true);
        OpenMenu = true;
      }
    }
    //console.log("massTargetRoute:", massTargetRoute, massTargetName);
  }
  //==========================================================
  const styleFW02 = {
    fontSize: 15.2,
    maxHeight: "21px",
    minHeight: "21px",
    width: 550,
    backgroundColor: "#E9F5D8",
    color: "black",
    marginTop: 1,
    textTransform: "unset !important",
  };

  const styleFW01 = {
    outline: "none",
    position: "relative",
    //marginTop: "-91vh",
    marginTop: "9vh",
    marginLeft: "auto",
    width: 555,
    bgcolor: "background.paper",
    border: "2px solid #000",
    borderColor: "primary.main",
    borderRadius: 2,
    boxShadow: 24,
    p: 3,
  };

  const styleFormNameRoute = {
    marginTop: 0.5,
    marginBottom: 2,
    textAlign: "center",
  };

  const handleCloseSetEnd = () => {
    oldIdx = -1;
    props.setOpen(false);
  };

  const handleCloseAllRight = (mode: number) => {
    allRight = true;
    setNomInMass(mode);
    props.setOpen(true);
  };

  const MenuRoutes = () => {
    const [openMenu, setOpenMenu] = React.useState(true);

    const handleClose = (mode: number) => {
      if (typeof mode !== "number") {
        handleCloseSetEnd();
      } else {
        if (mode === 777) {
          handleCloseSetEnd();
        } else {
          handleCloseAllRight(mode);
          //allRight = true;
          //nomInMass = mode;
          setOpenMenu(false);
        }
      }
    };

    const SpisRoutes = () => {
      let resStr = [];
      resStr.push(
        <Button
          key={Math.random()}
          sx={styleModalEnd}
          onClick={() => handleClose(777)}
        >
          <b>&#10006;</b>
        </Button>
      );
      resStr.push(
        <Box key={Math.random()} sx={{ textAlign: "center", marginBottom: 1 }}>
          Входящая связь перекрёстка <b>{massdk[props.idx].nameCoordinates}</b>{" "}
          с перекрёстком
        </Box>
      );
      for (let i = 0; i < massTargetName.length; i++) {
        resStr.push(
          <Button
            key={i}
            sx={styleFW02}
            variant="contained"
            onClick={() => handleClose(i)}
          >
            <b>{massTargetName[i].slice(0, 60)}</b>
          </Button>
        );
      }
      return resStr;
    };

    return (
      <>
        <Modal open={openMenu} onClose={handleClose} hideBackdrop>
          <Box sx={styleFW01}>{SpisRoutes()}</Box>
        </Modal>
      </>
    );
    //}
  };

  // const HeaderTablFaz = () => {
  //   return (
  //     <Grid container>
  //       <Grid item xs={1} sx={styleFT02}>
  //         №
  //       </Grid>
  //       <Grid item xs={3.5} sx={styleFT02}>
  //         Мин.длит.фаз(с)
  //       </Grid>
  //       <Grid item xs={3.5} sx={styleFT02}>
  //         Нач.длит.фаз(с)
  //       </Grid>
  //       <Grid item xs={4} sx={styleFT02}>
  //         Порядок фаз
  //       </Grid>
  //     </Grid>
  //   );
  // };

  // const StrokaMainTabl = () => {
  //   let resStr = [];
  //   let lng = idxMap >= 0 ? MAP.phases.length : 0;
  //   for (let i = 0; i < lng; i++) {
  //     resStr.push(
  //       <Grid key={i} container item xs={12} sx={{ fontSize: 14 }}>
  //         <Grid xs={1} item sx={styleFT03}>
  //           <Box sx={{ p: 0.2 }}>{i + 1}</Box>
  //         </Grid>
  //         <Grid xs={3.5} item sx={styleFT03}>
  //           0
  //         </Grid>
  //         <Grid xs={3.5} item sx={styleFT03}>
  //           0
  //         </Grid>
  //         <Grid xs={4} item sx={styleFT033}>
  //           0
  //         </Grid>
  //       </Grid>
  //     );
  //   }
  //   return resStr;
  // };

  const StrokaTabl = (recLeft: string, recRight: string) => {
    return (
      <>
        <Grid container sx={{ marginTop: 1 }}>
          <Grid item xs={0.25}></Grid>
          <Grid item xs={8.5} sx={{ fontSize: 15 }}>
            <b>{recLeft}</b>
          </Grid>
          <Grid item xs>
            {recRight}
          </Grid>
        </Grid>
      </>
    );
  };

  //let aa = idxMap >= 0 ? MAP.area.nameArea : "";
  //let bb = massdk.length > props.idx ? massdk[props.idx].area : "";
  //let soob1 = bb + " " + aa;
  //let soob2 = idxMap >= 0 ? MAP.phases.length : "нет информации";

  return (
    <>
      {allRight && (
        <Box sx={styleFormInf}>
          <Button sx={styleModalEnd} onClick={() => handleCloseSetEnd()}>
            <b>&#10006;</b>
          </Button>
          {massdk.length > props.idx && (
            <>
              <Box sx={styleFormNameRoute}>
                Входящая связь перекрёстка{" "}
                <b>{massdk[props.idx].nameCoordinates}</b> с перекрёстком{" "}
                <b>{massTargetName[nomInMass]}</b>
              </Box>
              <Box sx={{ fontSize: 12, marginTop: 0.5 }}>Основные свойства</Box>
              {StrokaTabl("№ Направления", "нет информации")}
              {StrokaTabl("Насыщение(т.е./ч.)", "нет информации")}
              {StrokaTabl("Интенсивность(т.е./ч.)", "нет информации")}
              {StrokaTabl("Дисперсия пачки(%)", "нет информации")}
              {StrokaTabl("Длинна перегона(м)", "нет информации")}
              {StrokaTabl("Вес остановки", "нет информации")}
              {StrokaTabl("Вес задержки", "нет информации")}
              {StrokaTabl("Смещ.начала зелёного(сек)", "нет информации")}
              {StrokaTabl("Смещ.конца зелёного(сек)", "нет информации")}
              {StrokaTabl(
                "Интенсивность пост.потока(т.е./ч.)",
                "1200"
              )}
              {StrokaTabl("Зелёные фазы для данного направления", " 2 ")}
              {/* <Box sx={{ fontSize: 12, marginTop: 1.5 }}>
                Выберите зелёные фазы для данного направления
              </Box> */}
              {/* <Box sx={styleFormTabl}>
                {HeaderTablFaz()}
                {StrokaMainTabl()}
              </Box> */}
            </>
          )}
        </Box>
      )}
      {openSetErr && (
        <MapPointDataError
          sErr={soobErr}
          setOpen={handleCloseSetEnd}
          ws={{}}
          fromCross={0}
          toCross={0}
          update={0}
        />
      )}
      {OpenMenu && <>{MenuRoutes()}</>}
    </>
  );
};

export default MapWaysForma;
