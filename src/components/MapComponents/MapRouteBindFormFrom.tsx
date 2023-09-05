import * as React from "react";
import { useSelector } from "react-redux";
//import { massrouteCreate, massrouteproCreate } from "./../../redux/actions";

import Box from "@mui/material/Box";
//import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import MapWaysFormaMain from "./MapWaysFormaMain";

import { Directions } from "./../../App"; // интерфейс massForm

import { styleFormNameRoute } from "./../MainMapStyle";

//import { StrokaMenuFooterBind } from "./../MapServiceFunctions";

const MapRouteBindFormFrom = (props: {
  setOpen: any;
  maskForm: Directions;
  idxA: number;
  idxB: number;
}) => {
  //== Piece of Redux =======================================
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  //console.log("massdk:", massdk);
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
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: 460,
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

  const handleClose = (mode: boolean, mask: Directions) => {
    console.log("handleClose:", mode, mask);
    handleCloseSetEnd();
  };

  let soob1 = massdk[props.idxA].area ? " перекрёстка " : " объекта ";
  let soob2 = massdk[props.idxB].area ? " c перекрёстком " : " c объектом ";

  return (
    <Modal open={openSetForm} onClose={handleCloseSetEnd}>
      <Box sx={styleSetInf}>
        <Button sx={styleModalEnd} onClick={handleCloseSetEnd}>
          <b>&#10006;</b>
        </Button>
        <Box sx={styleFormNameRoute}>
          Входящая связь {soob1}
          <b>{massdk[props.idxA].nameCoordinates}</b>
          {soob2}
          <b>{massdk[props.idxB].nameCoordinates}</b>
        </Box>
        <MapWaysFormaMain maskForm={props.maskForm} setClose={handleClose} />
      </Box>
    </Modal>
  );
};

export default MapRouteBindFormFrom;
