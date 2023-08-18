import * as React from "react";
import { useSelector } from "react-redux";


import Box from "@mui/material/Box";
import Button from "@mui/material/Button";


import { ComplianceMapMassdk } from "./../MapServiceFunctions";

import { styleModalEnd } from "./../MainMapStyle";



let oldIdx = -1;

const MapWaysFormMenu = (props: {
  setOpen: any;
  idx: number;
  massTargetName: Array<string>;
  handleCloseAllRight: Function;
}) => {
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
  let massroute = useSelector((state: any) => {
    const { massrouteReducer } = state;
    return massrouteReducer.massroute;
  });
  console.log("massroute:", massroute);
  //===========================================================
  
  const idxMap = ComplianceMapMassdk(props.idx, massdk, map);
  

  console.log("MapWaysFormMenu:");
  //=== инициализация ======================================
  //==========================================================
  const styleFW02 = {
    fontSize: 15.2,
    maxHeight: "21px",
    minHeight: "21px",
    width: 550,
    backgroundColor: "#E9F5D8",
    color: "black",
    //marginRight: 1,
    marginTop: 1,
    textTransform: "unset !important",
  };

  const styleFW01 = {
    outline: "none",
    position: "relative",
    marginTop: "-91vh",
    marginLeft: "auto",
    width: 555,
    bgcolor: "background.paper",
    border: "2px solid #000",
    borderColor: "primary.main",
    borderRadius: 2,
    boxShadow: 24,
    p: 3,
  };

  const handleCloseSetEnd = () => {
    oldIdx = -1;
    props.setOpen(false);
  };

  const handleClose = (mode: number) => {
    if (typeof mode !== "number") handleCloseSetEnd();
    if (mode === 777) {
      handleCloseSetEnd();
    } else {
      props.handleCloseAllRight(mode);
    }
  };

  const SpisRoutes = () => {
    let resStr = [];
    resStr.push(
      <Button
        key={Math.random()}
        sx={styleModalEnd}
        onClick={() => handleClose(777)}
      >
        <b>&#10006;</b>
      </Button>
    );
    resStr.push(
      <Box key={Math.random()} sx={{ textAlign: "center", marginBottom: 1 }}>
        Входящая связь перекрёстка <b>{massdk[props.idx].nameCoordinates}</b> с
        перекрёстком
      </Box>
    );
    for (let i = 0; i < props.massTargetName.length; i++) {
      resStr.push(
        <Button
          key={i}
          sx={styleFW02}
          variant="contained"
          onClick={() => handleClose(i)}
        >
          <b>{props.massTargetName[i].slice(0, 60)}</b>
        </Button>
      );
    }
    return resStr;
  };

  return <Box sx={styleFW01}>{SpisRoutes()}</Box>;
};

export default MapWaysFormMenu;
