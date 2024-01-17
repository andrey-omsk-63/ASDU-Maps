import * as React from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import MapWaysFormaMain from "./MapWaysFormaMain";

import { BadExit } from "../MapServiceFunctions";

import { Directions } from "../../App"; // интерфейс massForm

import { styleSetBindForm } from "../MainMapStyle";
import { styleFormNameRoute, styleModalEnd } from "../MainMapStyle";

//import { StrokaMenuFooterBind } from "./../MapServiceFunctions";

let HAVE = 0;

const MapRouteBindForm = (props: {
  setOpen: any;
  maskForm: Directions;
  IDX: number;
  idxA: number;
  idxB: number;
  kolDir: number;
}) => {
  //console.log("MapRouteBindForm:", props.kolDir, props.maskForm);
  //== Piece of Redux =======================================
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  //========================================================
  const [openSetForm, setOpenSetForm] = React.useState(true);
  const [badExit, setBadExit] = React.useState(false);

  const handleClose = (mode: boolean, mask: Directions) => {
    HAVE = 0;
    props.setOpen(mode, mask, props.IDX); // выход из формы
    setOpenSetForm(false);
  };

  const handleCloseSetEnd = () => {
    HAVE && setBadExit(true);
    !HAVE && handleClose(false, props.maskForm); // выход без сохранения
  };

  const handleCloseBadExit = (mode: boolean) => {
    setBadExit(false);
    mode && handleClose(false, props.maskForm); // выход без сохранения
  };

  const handleCloseEnd = (event: any, reason: string) => {
    if (reason === "escapeKeyDown") handleCloseSetEnd();
  };

  const SetHave = (have: number) => {
    HAVE = have;
  };

  let NAME = props.maskForm.name.slice(0, -1);

  let massNameDir = [];
  for (let i = 1; i <= props.kolDir; i++) {
    let nameDir = NAME + i.toString();
    if (nameDir !== props.maskForm.name) massNameDir.push(nameDir);
  }
 
  let soob1 = massdk[props.idxA].area ? " перекрёстка " : " объекта ";
  let soob2 = massdk[props.idxB].area ? " c перекрёстком " : " c объектом ";

  return (
    <>
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
          <MapWaysFormaMain
            maskForm={props.maskForm}
            setClose={handleClose}
            setHave={SetHave}
            massDir={massNameDir}
          />
        </Box>
      </Modal>
      {badExit && <>{BadExit(badExit, handleCloseBadExit)}</>}
    </>
  );
};

export default MapRouteBindForm;
