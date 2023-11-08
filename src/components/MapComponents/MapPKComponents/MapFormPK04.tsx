import * as React from "react";
import { useSelector } from "react-redux";
//import { massplanCreate, statsaveCreate } from './../../../redux/actions';

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

//import { AREA } from "../../MainMapGl";

import { styleModalEndBind, stylePKForm00 } from "../../MainMapStyle";
import { styleFormPK01, stylePKForm01 } from "../../MainMapStyle";
import { stylePKForm02, styleSpisPK05 } from "../../MainMapStyle";

const MapFormPK04 = (props: { view: boolean; handleClose: Function }) => {
  //== Piece of Redux =======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map;
  });
  // let massroute = useSelector((state: any) => {
  //   const { massrouteReducer } = state;
  //   return massrouteReducer.massroute;
  // });
  let massplan = useSelector((state: any) => {
    const { massplanReducer } = state;
    return massplanReducer.massplan;
  });
  //console.log("###massplan:", massplan);
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  //console.log('massplan:', massplan, massSpis);
  //=== инициализация ======================================
  let plan = massplan.plans[datestat.idxMenu];
  let nameArea = "";
  for (let i = 0; i < map.dateMap.tflight.length; i++) {
    let num = Number(map.dateMap.tflight[i].area.num);
    if (num === plan.areaPK) {
      nameArea = map.dateMap.tflight[i].area.nameArea;
      break;
    }
  }
  //========================================================
  const handleClose = () => {
    props.handleClose(false);
  };

  const CloseEnd = (event: any, reason: string) => {
    if (reason === "escapeKeyDown") handleClose();
  };
  //========================================================

  const RandomNumber = (min: number, max: number) => {
    let rand = Math.random() * (max - min) + min;
    return Math.floor(rand);
  };

  const StrokaFormPK04 = () => {
    let resStr = [];
    for (let i = 0; i < 48; i++) {
      let aa = RandomNumber(0, 5);
      let bb = RandomNumber(1, 12) * 100;
      let arg7 = !aa ? 0 : aa === 1 ? -bb : bb;
      const stylePKForm03 = {
        padding: "10px 0px 10px 0px",
        borderBottom: 1,
      };
      resStr.push(
        <Grid key={i} container sx={{ marginBottom: 0 }}>
          <Grid item xs={0.25} sx={stylePKForm03}>
            {i + 1}
          </Grid>
          <Grid item xs={0.75} sx={stylePKForm03}>
            {i * 10 - i + 2}
          </Grid>
          <Grid item xs={1.4} sx={stylePKForm03}>
            {RandomNumber(5, 12) * 100}
          </Grid>
          <Grid item xs={1.4} sx={stylePKForm03}>
            {RandomNumber(18, 55) * 100}
          </Grid>
          <Grid item xs={1.4} sx={stylePKForm03}>
            1, 2, 4
          </Grid>
          <Grid item xs={1.4} sx={stylePKForm03}>
            {RandomNumber(6, 11)}
          </Grid>
          <Grid item xs={1.4} sx={stylePKForm03}>
            0
          </Grid>
          <Grid item xs={1.4} sx={stylePKForm03}>
            {arg7}
          </Grid>
          <Grid item xs sx={stylePKForm03}>
            №21, 500 авт/ч, 18с.
          </Grid>
        </Grid>
      );
    }
    return resStr;
  };

  const HeaderTabl = () => {
    return (
      <Grid container sx={stylePKForm02}>
        <Grid item xs={0.25} sx={{ padding: "5px 0px 5px 0px", border: 0 }}>
          №
        </Grid>
        <Grid item xs={0.75} sx={{ padding: "5px 0px 5px 0px", border: 0 }}>
          № напр
        </Grid>
        <Grid item xs={1.4} sx={{ padding: "5px 0px 5px 0px", border: 0 }}>
          Инт.(авт/ч)
        </Grid>
        <Grid item xs={1.4} sx={{ padding: "5px 0px 5px 0px", border: 0 }}>
          Нас.(авт/ч)
        </Grid>
        <Grid item xs={1.4} sx={{ padding: "5px 0px 5px 0px", border: 0 }}>
          № зел.фазы
        </Grid>
        <Grid item xs={1.4} sx={{ padding: "5px 0px 5px 0px", border: 0 }}>
          Начало зел.фазы
        </Grid>
        <Grid item xs={1.4} sx={{ padding: "5px 0px 5px 0px", border: 0 }}>
          Конец зел.фазы
        </Grid>
        <Grid item xs={1.4} sx={{ padding: "5px 0px 5px 0px", border: 0 }}>
          Пост. поток
        </Grid>
        <Grid item xs sx={{ padding: "5px 0px 5px 0px", border: 0 }}>
          Состав направлений
        </Grid>
      </Grid>
    );
  };

  return (
    <Modal open={props.view} onClose={CloseEnd} hideBackdrop={false}>
      <Box sx={stylePKForm01}>
        <Button sx={styleModalEndBind} onClick={() => handleClose()}>
          <b>&#10006;</b>
        </Button>
        <Box sx={styleFormPK01}>
          <b>Начальные параметры направлений ПК №{plan.nomPK}</b>
        </Box>

        <Grid container>
          <Grid item xs={8} sx={{ border: 0 }}>
            <Box sx={styleSpisPK05}>
              <Box sx={{}}>
                <b>Название ПК:</b>&nbsp;&nbsp;
              </Box>
              <Box sx={{ fontSize: 15 }}>
                <em>{plan.namePK.slice(0, 53)}</em>
              </Box>
            </Box>
          </Grid>
          <Grid item xs sx={{ textAlign: "right", border: 0 }}>
            <Box sx={{ position: "absolute", right: "15px", border: 0 }}>
              <Box sx={styleSpisPK05}>
                <Box sx={{}}>
                  <b>Pайон: {plan.areaPK}</b> &nbsp;
                </Box>
                <Box sx={{ fontSize: 15 }}>
                  <em>{nameArea}</em>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {HeaderTabl()}
        <Box sx={stylePKForm00}>{StrokaFormPK04()}</Box>
      </Box>
    </Modal>
  );
};

export default MapFormPK04;
