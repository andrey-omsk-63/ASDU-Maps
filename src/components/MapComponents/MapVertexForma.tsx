import * as React from "react";
import { useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { ComplianceMapMassdk } from "./../MapServiceFunctions";

import { styleModalEnd } from "./../MainMapStyle";

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
  const idxMap = ComplianceMapMassdk(props.idx, massdk, map);
  const MAP = map.dateMap.tflight[idxMap];

  console.log("MapVertexForma:", props.idx, idxMap);

  const handleCloseSetEnd = () => {
    props.setOpen(false);
  };

  const styleFormInf = {
    outline: "none",
    position: "relative",
    marginTop: "-92vh",
    marginLeft: "auto",
    width: 460,
    height: 700,
    bgcolor: "background.paper",
    border: "3px solid #000",
    borderColor: "primary.main",
    borderRadius: 2,
    boxShadow: 24,
    p: 1.5,
  };

  const styleFormName = {
    fontSize: 17,
    marginTop: 0.5,
    marginBottom: 2,
    textAlign: "center",
  };

  const styleFT02 = {
    padding: 0.7,
    textAlign: "center",
    bgcolor: "#C0E2C3",
  };

  const styleFormTabl = {
    border: 1,
    borderRadius: 1,
    borderColor: "primary.main",
    marginTop: 1.5,
    marginLeft: -0.5,
    marginRight: -0.5,
    height: 333,
  };

  const styleFT03 = {
    borderRight: 1,
    borderBottom: 1,
    borderColor: "primary.main",
    padding: 0.7,
    textAlign: "center",
  };

  const styleFT033 = {
    borderBottom: 1,
    borderColor: "primary.main",
    padding: 0.7,
    textAlign: "center",
  };

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
    for (let i = 0; i < lng; i++) {
      

      resStr.push(
        <Grid key={i} container item xs={12} sx={{ fontSize: 14 }}>
          <Grid xs={1} item sx={styleFT03}>
            <Box sx={{ p: 0.2 }}>{i + 1}</Box>
          </Grid>
          <Grid xs={3.5} item sx={styleFT03}>
            0
          </Grid>
          <Grid xs={3.5} item sx={styleFT03}>
            0
          </Grid>
          <Grid xs={4} item sx={styleFT033}>
            0
          </Grid>
        </Grid>
      );
    }
    return resStr;
  };

  const StrokaTabl = (recLeft: string, recRight: string) => {
    return (
      <>
        <Grid container sx={{ marginTop: 1 }}>
          <Grid item xs={0.25}></Grid>
          <Grid item xs={5}>
            <b>{recLeft}</b>
          </Grid>
          <Grid item xs>
            {recRight}
          </Grid>
        </Grid>
      </>
    );
  };

  let aa = idxMap >= 0 ? MAP.area.nameArea : "";
  let bb = massdk.length > props.idx ? massdk[props.idx].area : "";
  let soob1 = bb + " " + aa;
  let soob2 = idxMap >= 0 ? MAP.phases.length : "нет информации";

  return (
    <Box sx={styleFormInf}>
      <Button sx={styleModalEnd} onClick={() => handleCloseSetEnd()}>
        <b>&#10006;</b>
      </Button>
      {massdk.length > props.idx && (
        <>
          <Box sx={styleFormName}>
            <b>
              <em>{massdk[props.idx].nameCoordinates}</em>
            </b>
          </Box>
          <Box sx={{ fontSize: 12, marginTop: 0.5 }}>Общие</Box>
          {StrokaTabl("Район", soob1)}
          {StrokaTabl("Номер перекрёстка", massdk[props.idx].ID)}
          {StrokaTabl("Время цикла cек.", "нет информации")}
          <Box sx={{ fontSize: 12, marginTop: 2.5 }}>Свойства фаз</Box>
          {StrokaTabl("Количество фаз", soob2)}
          {StrokaTabl("Начальное смещение", "нет информации")}
          <Box sx={{ fontSize: 12, marginTop: 2.5 }}>
            Таблица параметров фаз
          </Box>
          <Box sx={styleFormTabl}>
            {HeaderTablFaz()}
            {StrokaMainTabl()}
          </Box>
        </>
      )}
    </Box>
  );
};

export default MapVertexForma;
