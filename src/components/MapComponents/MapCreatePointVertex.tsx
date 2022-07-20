import * as React from "react";
//import { useDispatch, useSelector } from "react-redux";
//import { massdkCreate, massrouteCreate } from "./../../redux/actions";

//import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
//import TextField from "@mui/material/TextField";

//import { MapssdkNewPoint, MassrouteNewPoint } from "./../MapServiceFunctions";

import MapCreatePoint from "./MapCreatePoint";
import MapCreateVertex from "./MapCreateVertex";

import { styleModalEnd, styleModalMenu } from "./../MainMapStyle";
// import { styleSetAdress, styleBoxForm, styleInpKnop } from "./../MainMapStyle";
// import { styleSet } from "./../MainMapStyle";

//let chNewCoord = 1;

const MapCreatePointVertex = (props: {
  setOpen: any;
  region: number;
  coord: any;
  createPoint: any;
  createVertex: any;
}) => {
  //== Piece of Redux ======================================
  // let massdk = useSelector((state: any) => {
  //   const { massdkReducer } = state;
  //   return massdkReducer.massdk;
  // });
  // let massroute = useSelector((state: any) => {
  //   const { massrouteReducer } = state;
  //   return massrouteReducer.massroute;
  // });
  // const dispatch = useDispatch();
  //========================================================

  const styleSet = {
    position: "absolute",
    marginTop: "18vh",
    marginLeft: "27vh",
    width: 340,
    bgcolor: "background.paper",
    border: "3px solid #000",
    borderColor: "primary.main",
    borderRadius: 2,
    boxShadow: 24,
    p: 1.5,
  };

  const [openSet, setOpenSet] = React.useState(true);
  const [openSetPoint, setOpenSetPoint] = React.useState(false);
  const [openSetVert, setOpenSetVert] = React.useState(false);
  //const [openSetAdress, setOpenSetAdress] = React.useState(true);

  const handleCloseSet = (event: any, reason: string) => {
    if (reason !== "backdropClick") setOpenSet(false);
  };

  // const handleCloseSetPoint = (event: any, reason: string) => {
  //   if (reason !== "backdropClick") setOpenSetPoint(false);
  // };

  // const handleCloseSetVert = (event: any, reason: string) => {
  //   if (reason !== "backdropClick") setOpenSetVert(false);
  // };

  const handleCloseSetEnd = () => {
    props.setOpen(false);
    setOpenSet(false);
  };

  // const handleCloseSetPointEnd = () => {
  //   setOpenSetPoint(false);
  // };

  // const handleCloseSetVertEnd = () => {
  //   setOpenSetVert(false);
  // };

  const handleClose = (mode: number) => {
    if (mode === 1) {
      setOpenSetPoint(true);
    } else {
      setOpenSetVert(true);
    }
  };

  // const handleClosePoint = (mode: number) => {
  //   props.createPoint(props.coord);
  //   chNewCoord++;
  //   handleCloseSetEnd();
  // };

  // const handleCloseVertex = (mode: number) => {
  //   props.createPoint(props.coord);
  //   handleCloseSetEnd();
  // };

  //========================================================
  // let valueN = "Новая точка " + String(chNewCoord);
  // let aa = valueN;
  // const [valuen, setValuen] = React.useState(aa);

  // const handleKey = (event: any) => {
  //   if (event.key === "Enter") event.preventDefault();
  // };

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setValuen(event.target.value);
  //   aa = event.target.value;
  //   console.log("valueName:", aa, valuen);
  //   setOpenSetAdress(true);
  // };

  // const handleCloseSetAdr = () => {
  //   massdk.push(MapssdkNewPoint(props.region, props.coord, valuen));
  //   massroute.vertexes.push(
  //     MassrouteNewPoint(props.region, props.coord, valuen)
  //   );
  //   dispatch(massdkCreate(massdk));
  //   dispatch(massrouteCreate(massroute));
  //   props.setOpen(false);
  //   setOpenSetAdress(false);
  // };

  // const handleCloseSetAdress = () => {
  //   setOpenSetAdress(false);
  // };

  // const MapCreatePointt = () => {
  //   return (
  //     <Box>
  //       <Modal open={openSetAdress} onClose={handleCloseSetAdress} hideBackdrop>
  //         <Grid item container sx={styleSetAdress}>
  //           <Grid item xs={9.5} sx={{ border: 0 }}>
  //             <Box sx={styleSet}>
  //               <Box
  //                 component="form"
  //                 sx={styleBoxForm}
  //                 noValidate
  //                 autoComplete="off"
  //               >
  //                 <TextField
  //                   size="small"
  //                   onKeyPress={handleKey} //отключение Enter
  //                   inputProps={{ style: { fontSize: 13.3 } }}
  //                   value={valuen}
  //                   onChange={handleChange}
  //                   variant="standard"
  //                 />
  //               </Box>
  //             </Box>
  //           </Grid>
  //           <Grid item xs sx={{ border: 0 }}>
  //             <Box>
  //               <Button
  //                 sx={styleInpKnop}
  //                 variant="contained"
  //                 onClick={handleCloseSetAdr}
  //               >
  //                 Ввод
  //               </Button>
  //             </Box>
  //           </Grid>
  //         </Grid>
  //       </Modal>
  //     </Box>
  //   );
  // };

  // const MapCreateVertex = () => {
  //   return (
  //     <Modal open={openSetVert} onClose={handleCloseSetVert} hideBackdrop>
  //       <>
  //         <Box sx={styleSetV}>
  //           <Button sx={styleModalEnd} onClick={handleCloseSetVertEnd}>
  //             <b>&#10006;</b>
  //           </Button>
  //           <Box sx={{ textAlign: "center" }}>
  //             <Typography variant="h6">Что создаём?</Typography>
  //             <br />
  //             <Button sx={styleModalMenu} onClick={() => handleCloseVertex(1)}>
  //               Точку
  //             </Button>
  //             &nbsp;
  //             <Button sx={styleModalMenu} onClick={() => handleCloseVertex(2)}>
  //               Vertex
  //             </Button>
  //           </Box>
  //         </Box>
  //       </>
  //     </Modal>
  //   );
  // };

  console.log("!!!");

  return (
    <Modal open={openSet} onClose={handleCloseSet} hideBackdrop>
      <>
        <Box sx={styleSet}>
          <Button sx={styleModalEnd} onClick={handleCloseSetEnd}>
            <b>&#10006;</b>
          </Button>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6">Что создаём?</Typography>
            <br />
            <Button sx={styleModalMenu} onClick={() => handleClose(1)}>
              Точку
            </Button>
            &nbsp;
            <Button sx={styleModalMenu} onClick={() => handleClose(2)}>
              Перекрёсток
            </Button>
          </Box>
        </Box>
        {openSetPoint && (
          <MapCreatePoint
            //setOpen={setOpenSet}
            region={props.region}
            coord={props.coord}
            createPoint={props.createPoint}
          />
        )}
        {openSetVert && (
          <MapCreateVertex
            region={props.region}
            coord={props.coord}
            createPoint={props.createPoint}
          />
        )}
      </>
    </Modal>
  );
};

export default MapCreatePointVertex;
