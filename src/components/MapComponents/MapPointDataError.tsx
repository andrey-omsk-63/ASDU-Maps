import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { massrouteCreate, massrouteproCreate } from "./../../redux/actions";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import { SendSocketDeleteWay } from "./../MapServiceFunctions";
import { SendSocketDeleteWayFromPoint } from "./../MapServiceFunctions";
import { SendSocketDeleteWayToPoint } from "./../MapServiceFunctions";

import { styleModalEnd, styleSetInf } from "./../MainMapStyle";

let lengthRoute = 0;
let index = -1;

const MapPointDataError = (props: {
  sErr: string;
  setOpen: any;
  debug: boolean;
  ws: any;
  fromCross: any;
  toCross: any;
  activeRoute: any;
  update: any;
}) => {
  const WS = props.ws;
  //== Piece of Redux =======================================
  let massroute = useSelector((state: any) => {
    const { massrouteReducer } = state;
    return massrouteReducer.massroute;
  });
  let massroutepro = useSelector((state: any) => {
    const { massrouteproReducer } = state;
    return massrouteproReducer.massroutepro;
  });
  const dispatch = useDispatch();
  //=========================================================
  const styleModalMenu = {
    backgroundColor: "#E6F5D6",
    textTransform: "unset !important",
    color: "black",
  };

  const [openSetEr, setOpenSetEr] = React.useState(true);

  const handleCloseSetEnd = () => {
    props.setOpen(false);
    setOpenSetEr(false);
  };

  const DeleteWay = () => {
    massroute.ways.splice(index, 1); // удаление из базы
    dispatch(massrouteCreate(massroute));

    let idx = -1; // удаление из протокола
    for (let i = 0; i < massroutepro.ways.length; i++) {
      if (
        props.fromCross.pointAaRegin ===
          massroutepro.ways[i].region.toString() &&
        props.fromCross.pointAaArea ===
          massroutepro.ways[i].sourceArea.toString() &&
        props.fromCross.pointAaID === massroutepro.ways[i].sourceID &&
        props.toCross.pointBbID === massroutepro.ways[i].targetID &&
        props.toCross.pointBbArea === massroutepro.ways[i].targetArea.toString()
      ) {
        idx = i;
      }
    }
    if (idx >= 0) {
      massroutepro.ways.splice(idx, 1);
      dispatch(massrouteproCreate(massroutepro));
    }
    props.update();
  };

  const handleClose = (mode: number) => {
    if (mode === 1) {
      DeleteWay();
      if (props.fromCross.pointAaArea === "0") {
        SendSocketDeleteWayFromPoint(
          props.debug,
          WS,
          props.fromCross,
          props.toCross,
          lengthRoute
        );
      } else {
        if (props.toCross.pointBbArea === "0") {
          SendSocketDeleteWayToPoint(
            props.debug,
            WS,
            props.fromCross,
            props.toCross,
            lengthRoute
          );
        } else {
          SendSocketDeleteWay(props.debug, WS, props.fromCross, props.toCross);
        }
      }
    }
    handleCloseSetEnd();
  };

  index = -1;
  for (let i = 0; i < massroute.ways.length; i++) {
    if (
      props.fromCross.pointAaRegin === massroute.ways[i].region.toString() &&
      props.fromCross.pointAaArea === massroute.ways[i].sourceArea.toString() &&
      props.fromCross.pointAaID === massroute.ways[i].sourceID &&
      props.toCross.pointBbID === massroute.ways[i].targetID &&
      props.toCross.pointBbArea === massroute.ways[i].targetArea.toString()
    ) {
      index = i;
      lengthRoute = massroute.ways[i].lenght;
    }
  }

  return (
    <Modal open={openSetEr} onClose={handleCloseSetEnd} hideBackdrop>
      <Box sx={styleSetInf}>
        <Button sx={styleModalEnd} onClick={handleCloseSetEnd}>
          <b>&#10006;</b>
        </Button>
        <Typography variant="h6" sx={{ textAlign: "center", color: "red" }}>
          {props.sErr}
        </Typography>
        {props.sErr === "Дубликатная связь" && (
          <>
            <Box sx={{ textAlign: "left", marginLeft: 5, marginTop: 1 }}>
              <b>Выход</b> &nbsp;Подрайон:{" "}
              <b>{massroute.ways[index].targetArea}</b>
              &nbsp;ID:&nbsp;
              <b>{massroute.ways[index].sourceID}</b> Напр:&nbsp;
              <b>{massroute.ways[index].lsource}</b>
            </Box>

            <Box sx={{ textAlign: "left", marginLeft: 5 }}>
              <b>Вход</b> &nbsp;&nbsp;&nbsp;&nbsp;Подрайон:{" "}
              <b>{massroute.ways[index].targetArea}</b>
              &nbsp;ID:&nbsp;
              <b>{massroute.ways[index].targetID}</b> Напр:&nbsp;
              <b>{massroute.ways[index].ltarget}</b>
            </Box>

            <Box sx={{ textAlign: "left", marginLeft: 5 }}>
              <b> Длина связи: &nbsp; {massroute.ways[index].lenght} </b> м
            </Box>

            <Box sx={{ textAlign: "center", marginTop: 1 }}>
              <Typography variant="h6">Удалить исходную связь?</Typography>
              <Button sx={styleModalMenu} onClick={() => handleClose(1)}>
                Да
              </Button>
              &nbsp;
              <Button sx={styleModalMenu} onClick={() => handleClose(2)}>
                Нет
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default MapPointDataError;
