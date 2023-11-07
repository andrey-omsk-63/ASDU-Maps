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
//import { StylSpisPK02, styleSpisPK03, StylSpisPK022 } from '../../MainMapStyle';
import { stylePKForm02, styleSpisPK05 } from "../../MainMapStyle";

const MapFormPK02 = (props: { view: boolean; handleClose: Function }) => {
  //== Piece of Redux =======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map;
  });
  let massroute = useSelector((state: any) => {
    const { massrouteReducer } = state;
    return massrouteReducer.massroute;
  });
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

  const StrokaFormPK01 = () => {
    let resStr = [];
    for (let i = 0; i < plan.coordPlan.length; i++) {
      let nameVert = "";
      for (let j = 0; j < massroute.vertexes.length; j++) {
        if (
          massroute.vertexes[j].area === plan.areaPK &&
          massroute.vertexes[j].id === plan.coordPlan[i].id
        ) {
          nameVert = massroute.vertexes[j].name;
          break;
        }
      }
      resStr.push(
        <Grid key={i} container sx={{ marginBottom: 1.5 }}>
          <Grid item xs={0.125} sx={{ padding: "1px 0px 1px 0px", border: 0 }}>
            {i + 1}
          </Grid>
          <Grid item xs={0.365} sx={{ padding: "1px 0px 1px 0px", border: 0 }}>
            {plan.coordPlan[i].id}
          </Grid>
          <Grid item xs={2.125} sx={{ textAlign: "left", border: 0 }}>
            {nameVert}
          </Grid>
          <Grid item xs={0.5} sx={{ border: 0 }}>
            107
          </Grid>
          <Grid item xs={0.5} sx={{ border: 0 }}>
            4
          </Grid>
          <Grid item xs={0.5} sx={{ border: 0 }}>
            3
          </Grid>

          <Grid item xs={0.99} sx={{ border: 0 }}>
            1(2)
          </Grid>
          <Grid item xs={0.99} sx={{ border: 0 }}>
            3(4)
          </Grid>
          <Grid item xs={0.99} sx={{ border: 0 }}>
            4(5)
          </Grid>
          <Grid item xs={0.99} sx={{ border: 0 }}>
            3(5)
          </Grid>
          <Grid item xs={0.99} sx={{ border: 0 }}>
            4(5)
          </Grid>
          <Grid item xs={0.99} sx={{ border: 0 }}>
            3(4)
          </Grid>
          <Grid item xs={0.99} sx={{ border: 0 }}>
            4(6)
          </Grid>
          <Grid item xs sx={{ border: 0 }}>
            3(5)
          </Grid>

          {/* <Grid item xs={0.497} sx={{ border: 0 }}>
            1
          </Grid>
          <Grid item xs={0.497} sx={{ border: 0 }}>
            3
          </Grid>
          <Grid item xs={0.497} sx={{ border: 0 }}>
            4
          </Grid>
          <Grid item xs={0.497} sx={{ border: 0 }}>
            3
          </Grid>
          <Grid item xs={0.497} sx={{ border: 0 }}>
            4
          </Grid>
          <Grid item xs={0.497} sx={{ border: 0 }}>
            3
          </Grid>
          <Grid item xs={0.497} sx={{ border: 0 }}>
            4
          </Grid>
          <Grid item xs sx={{ border: 0 }}>
            3
          </Grid> */}
        </Grid>
      );
    }
    return resStr;
  };

  const HeaderTabl = () => {
    return (
      <Grid container sx={stylePKForm02}>
        <Grid item xs={0.125} sx={{ padding: "1px 0px 1px 0px", border: 0 }}>
          №
        </Grid>
        <Grid item xs={0.365} sx={{ border: 0 }}>
          №пер
        </Grid>
        <Grid item xs={2.125} sx={{ border: 0 }}>
          Название
        </Grid>
        <Grid item xs={0.5} sx={{ border: 0 }}>
          Кол-во фаз
        </Grid>
        <Grid item xs={0.5} sx={{ border: 0 }}>
          Кол-во напр
        </Grid>
        <Grid item xs={0.5} sx={{ border: 0 }}>
          Смещ
        </Grid>

        <Grid item xs={0.99} sx={{ border: 0 }}>
          Длит / (мин.длит) 1Ф
        </Grid>
        <Grid item xs={0.99} sx={{ border: 0 }}>
          Длит / (мин.длит) 2Ф
        </Grid>
        <Grid item xs={0.99} sx={{ border: 0 }}>
          Длит / (мин.длит) 3Ф
        </Grid>
        <Grid item xs={0.99} sx={{ border: 0 }}>
          Длит / (мин.длит) 4Ф
        </Grid>
        <Grid item xs={0.99} sx={{ border: 0 }}>
          Длит / (мин.длит) 5Ф
        </Grid>
        <Grid item xs={0.99} sx={{ border: 0 }}>
          Длит / (мин.длит) 6Ф
        </Grid>
        <Grid item xs={0.99} sx={{ border: 0 }}>
          Длит / (мин.длит) 7Ф
        </Grid>
        <Grid item xs sx={{ border: 0 }}>
          Длит / (мин.длит) 8Ф
        </Grid>

        {/* <Grid item xs={0.497} sx={{ border: 0 }}>
          Мин дл.1Ф
        </Grid>
        <Grid item xs={0.497} sx={{ border: 0 }}>
          Мин дл.2Ф
        </Grid>
        <Grid item xs={0.497} sx={{ border: 0 }}>
          Мин дл.3Ф
        </Grid>
        <Grid item xs={0.497} sx={{ border: 0 }}>
          Мин дл.4Ф
        </Grid>
        <Grid item xs={0.497} sx={{ border: 0 }}>
          Мин дл.5Ф
        </Grid>
        <Grid item xs={0.497} sx={{ border: 0 }}>
          Мин дл.6Ф
        </Grid>
        <Grid item xs={0.497} sx={{ border: 0 }}>
          Мин дл.7Ф
        </Grid>
        <Grid item xs>
          Мин дл.8Ф
        </Grid> */}
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
          <b>Начальные параметры перекрёстков ПК №{plan.nomPK}</b>
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
        {/* <Box sx={{ width: "100%", overflowY: "auto" }}>
          <Box sx={{ width: "121%" }}> */}
        {HeaderTabl()}
        <Box sx={stylePKForm00}>{StrokaFormPK01()}</Box>
        {/* </Box>
        </Box> */}
      </Box>
    </Modal>
  );
};

export default MapFormPK02;
