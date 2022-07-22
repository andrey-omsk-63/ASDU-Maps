import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { massrouteCreate } from "./../../redux/actions";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import { SendSocketDeleteWay } from "./../MapServiceFunctions";

import { styleModalEnd, styleSetInf } from "./../MainMapStyle";

const MapPointDataError = (props: {
  sErr: string;
  setOpen: any;
  debugging: boolean;
  //ws: WebSocket;
  ws: any;
  fromCross: any;
  toCross: any;
}) => {
  //== Piece of Redux =======================================
  // let massdk = useSelector((state: any) => {
  //   const { massdkReducer } = state;
  //   return massdkReducer.massdk;
  // });
  let massroute = useSelector((state: any) => {
    const { massrouteReducer } = state;
    return massrouteReducer.massroute;
  });
  // const map = useSelector((state: any) => {
  //   const { mapReducer } = state;
  //   return mapReducer.map;
  // });
  const dispatch = useDispatch();
  //=========================================================
  const styleModalMenu = {
    backgroundColor: "#E6F5D6",
    textTransform: "unset !important",
    color: "black",
  };

  const [openSetEr, setOpenSetEr] = React.useState(true);
  const handleCloseSetEr = (event: any, reason: string) => {
    if (reason !== "backdropClick") setOpenSetEr(false);
  };

  const handleCloseSetEndEr = () => {
    props.setOpen(false);
    setOpenSetEr(false);
  };

  const DeleteWay = () => {
    let index = -1;
    for (let i = 0; i < massroute.ways.length; i++) {
      if (
        props.fromCross.pointAaRegin === massroute.ways[i].region.toString() &&
        props.fromCross.pointAaArea ===
          massroute.ways[i].sourceArea.toString() &&
        props.fromCross.pointAaID === massroute.ways[i].sourceID &&
        props.toCross.pointBbID === massroute.ways[i].targetID &&
        props.toCross.pointBbArea === massroute.ways[i].targetArea.toString()
      )
        index = i;
    }
    massroute.ways.splice(index, 1);
    dispatch(massrouteCreate(massroute));
  };

  const handleClose = (mode: number) => {
    if (mode === 1) {
      DeleteWay();
      SendSocketDeleteWay(
        props.debugging,
        props.ws,
        props.fromCross,
        props.toCross
      );
    }
    handleCloseSetEndEr();
  };

  return (
    <Modal open={openSetEr} onClose={handleCloseSetEr} hideBackdrop>
      <Box sx={styleSetInf}>
        <Button sx={styleModalEnd} onClick={handleCloseSetEndEr}>
          <b>&#10006;</b>
        </Button>
        <Typography variant="h6" sx={{ textAlign: "center", color: "red" }}>
          {props.sErr}
        </Typography>
        {props.sErr === "Дубликатная связь" && (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6">Удалить исходную связь?</Typography>
            <Button sx={styleModalMenu} onClick={() => handleClose(1)}>
              Да
            </Button>
            &nbsp;
            <Button sx={styleModalMenu} onClick={() => handleClose(2)}>
              Нет
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default MapPointDataError;
