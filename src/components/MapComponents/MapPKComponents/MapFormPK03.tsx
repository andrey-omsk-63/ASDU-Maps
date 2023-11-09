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
import { stylePKForm02,styleSpisPK05 } from "../../MainMapStyle";

const MapFormPK03 = (props: { view: boolean; handleClose: Function }) => {
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
  console.log('###massplan:', massplan);
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

  const StrokaFormPK03 = () => {
    let resStr = [];
    for (let i = 0; i < 48; i++) {
      let arg6 =
        i === 1 || i === 3
          ? "Затор"
          : (RandomNumber(0, 1000) / 1000 + RandomNumber(0, 10)).toFixed(3);
      let arg7 = !i
        ? "(30) 4"
        : "(" +
          (RandomNumber(1, 7) * 100 + RandomNumber(0, 99)) +
          ") " +
          RandomNumber(20, 99);
      let coler = i === 1 || i === 3 ? "#ffdbec" : !i ? "#D5E9F9" : "#F1F5FB";
      const stylePKForm03 = {
        padding: "10px 0px 10px 0px",
        borderBottom: '1px solid #d4d4d4',
        bgcolor: coler,
      };
      resStr.push(
        <Grid key={i} container sx={{ marginBottom: 0 }}>
          <Grid item xs={0.25} sx={stylePKForm03}>
            {i + 1}
          </Grid>
          <Grid item xs={0.75} sx={stylePKForm03}>
            {i * 10 - i + 2}
          </Grid>
          <Grid item xs={1.5} sx={stylePKForm03}>
            {RandomNumber(5, 12) * 100}
          </Grid>
          <Grid item xs={1.5} sx={stylePKForm03}>
            {RandomNumber(0, 16) * 1000}
          </Grid>
          <Grid item xs={1.5} sx={stylePKForm03}>
            {(RandomNumber(0, 16) + RandomNumber(100, 1000) / 1000).toFixed(3)}
          </Grid>
          <Grid item xs={1.5} sx={stylePKForm03}>
            {RandomNumber(0, 1000) / 1000}
          </Grid>
          <Grid item xs={2} sx={stylePKForm03}>
            {arg6}
          </Grid>
          <Grid item xs={1.5} sx={stylePKForm03}>
            {arg7}%
          </Grid>
          <Grid item xs sx={stylePKForm03}>
            {RandomNumber(20, 89)}
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
        <Grid item xs={1.5} sx={{ padding: "5px 0px 5px 0px", border: 0 }}>
          Инт.(авт/ч)
        </Grid>
        <Grid item xs={1.5} sx={{ padding: "5px 0px 5px 0px", border: 0 }}>
          Поток нас.(авт/ч)
        </Grid>
        <Grid item xs={1.5} sx={{ padding: "5px 0px 5px 0px", border: 0 }}>
          Остановка (авт * ч/ч)
        </Grid>
        <Grid item xs={1.5} sx={{ padding: "5px 0px 5px 0px", border: 0 }}>
          Задержка (авт * ч/ч)
        </Grid>
        <Grid item xs={2} sx={{ padding: "5px 0px 5px 0px", border: 0 }}>
          Задержка в т.ч случ авт-ч/ч
        </Grid>
        <Grid item xs={1.5} sx={{ padding: "5px 0px 5px 0px", border: 0 }}>
          Остановок
        </Grid>
        <Grid item xs sx={{ padding: "5px 0px 5px 0px", border: 0 }}>
          Загрузка(%)
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
          <b>Выходные данные по направлениям ПК №{plan.nomPK}</b>
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
        <Box sx={stylePKForm00}>{StrokaFormPK03()}</Box>
      </Box>
    </Modal>
  );
};

export default MapFormPK03;
