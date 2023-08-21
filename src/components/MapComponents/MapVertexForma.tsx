import * as React from "react";
import { useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { ComplianceMapMassdk } from "./../MapServiceFunctions";

import { styleModalEnd, styleFormInf, styleFormName } from "./../MainMapStyle";
import { styleFT02, styleFT03, styleFT033 } from "./../MainMapStyle";
import { styleFormTabl, styleFormMenu } from "./../MainMapStyle";

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

  const handleCloseSetEnd = () => {
    props.setOpen(false);
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

  const SaveForm = (mode: boolean) => {
    handleCloseSetEnd()
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
          <Grid container>
            <Grid item xs={6} sx={{ marginTop: 0.5, textAlign: "center" }}>
              <Button sx={styleFormMenu} onClick={() => SaveForm(true)}>
                Сохранить изменения
              </Button>
            </Grid>
            <Grid item xs={6} sx={{ marginTop: 0.5, textAlign: "center" }}>
              <Button
                sx={styleFormMenu}
                onClick={() => SaveForm(false)}
              >
                Выйти без сохранения
              </Button>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default MapVertexForma;
