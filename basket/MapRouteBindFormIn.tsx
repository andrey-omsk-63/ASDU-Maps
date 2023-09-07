import * as React from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import MapWaysFormaMain from "../src/components/MapComponents/MapWaysFormaMain";

import { Directions } from "../src/App"; // интерфейс massForm

import { styleSetBindForm } from "../src/components/MainMapStyle";
import { styleFormNameRoute, styleModalEnd } from "../src/components/MainMapStyle";

//import { StrokaMenuFooterBind } from "./../MapServiceFunctions";

const MapRouteBindFormIn = (props: {
  setOpen: any;
  maskForm: Directions;
  IDX: number;
  idxA: number;
  idxB: number;
}) => {
  //== Piece of Redux =======================================
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  //========================================================
  const [openSetForm, setOpenSetForm] = React.useState(true);

  const handleCloseSetEnd = () => {
    props.setOpen(false, props.maskForm, props.IDX);
    setOpenSetForm(false);
  };

  const handleCloseEnd = (event: any, reason: string) => {
    //console.log("handleCloseEnd:", reason); // Заглушка
    if (reason === "escapeKeyDown") handleCloseSetEnd();
  };

  const handleClose = (mode: boolean, mask: Directions) => {
    props.setOpen(mode, mask, props.IDX);
    setOpenSetForm(false);
  };

  let soob1 = massdk[props.idxA].area ? " перекрёстка " : " объекта ";
  let soob2 = massdk[props.idxB].area ? " c перекрёстком " : " c объектом ";

  return (
    <Modal open={openSetForm} onClose={handleCloseEnd}>
      <Box sx={styleSetBindForm}>
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

export default MapRouteBindFormIn;
