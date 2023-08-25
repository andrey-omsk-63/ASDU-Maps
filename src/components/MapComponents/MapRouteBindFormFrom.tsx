import * as React from "react";
//import { useDispatch, useSelector } from "react-redux";
//import { massrouteCreate, massrouteproCreate } from "./../../redux/actions";

import Box from "@mui/material/Box";
//import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
// import TextField from "@mui/material/TextField";
// import Typography from "@mui/material/Typography";
// import MenuItem from "@mui/material/MenuItem";

import { StrokaMenuFooterBind } from "./../MapServiceFunctions";

// import { SendSocketDeleteWay } from "./../MapSocketFunctions";
// import { SendSocketDeleteWayFromPoint } from "./../MapSocketFunctions";
// import { SendSocketDeleteWayToPoint } from "./../MapSocketFunctions";
// import { SendSocketCreateWay } from "./../MapSocketFunctions";
// import { SendSocketCreateWayFromPoint } from "./../MapSocketFunctions";
// import { SendSocketCreateWayToPoint } from "./../MapSocketFunctions";

//import { styleModalEnd,
//styleSetInf
// } from "./../MainMapStyle";
// import { styleModalMenu, styleSetArea } from "./MapPointDataErrorStyle";
// import { styleBoxFormArea, styleBoxFormNapr } from "./MapPointDataErrorStyle";
// import { styleSetNapr, styleSave } from "./MapPointDataErrorStyle";

const MapRouteBindFormFrom = (props: { setOpen: any; idx: number }) => {
  //const WS = props.ws;
  //== Piece of Redux =======================================
  // let massroute = useSelector((state: any) => {
  //   const { massrouteReducer } = state;
  //   return massrouteReducer.massroute;
  // });
  // let massroutepro = useSelector((state: any) => {
  //   const { massrouteproReducer } = state;
  //   return massrouteproReducer.massroutepro;
  // });
  // const dispatch = useDispatch();
  const [openSetForm, setOpenSetForm] = React.useState(true);

  const styleModalEnd = {
    position: "absolute",
    top: "0%",
    left: "auto",
    right: "-0%",
    height: "21px",
    maxWidth: "2%",
    minWidth: "2%",
    color: "black",
  };

  const styleSetInf = {
    outline: "none",
    position: "absolute",
    marginTop: "18vh",
    marginLeft: "7vh",
    width: 380,
    //height: 500,
    bgcolor: "background.paper",
    border: "1px solid #000",
    borderColor: "primary.main",
    borderRadius: 2,
    boxShadow: 24,
    p: 1.5,
  };

  const handleCloseSetEnd = () => {
    props.setOpen(false);
    setOpenSetForm(false);
  };

  const handleClose = (mode: number) => {
    handleCloseSetEnd();
  };

  return (
    <Modal open={openSetForm} onClose={handleCloseSetEnd}>
      <Box sx={styleSetInf}>
        <Button sx={styleModalEnd} onClick={handleCloseSetEnd}>
          <b>&#10006;</b>
        </Button>
        <Box
          sx={{ border: 1, marginTop: 1.5, width: 377, height: 500,  }}
        ></Box>
        <Box sx={{ marginTop: 1.5, textAlign: "center" }}>
          {StrokaMenuFooterBind("Выход без сохранения", 0, handleClose)}
          {StrokaMenuFooterBind("Сохранить", 1, handleClose)}
        </Box>
      </Box>
    </Modal>
  );
};

export default MapRouteBindFormFrom;
