import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { massdkCreate, massrouteCreate } from "./../../redux/actions";
import { coordinatesCreate } from "./../../redux/actions";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

import { SendSocketDeletePoint } from "./../MapSocketFunctions";
import { SocketDeleteWay } from "./../MapSocketFunctions";
import { SendSocketCreateWayFromPoint } from "./../MapSocketFunctions";
import { SendSocketCreateWayToPoint } from "./../MapSocketFunctions";

import { styleSet, styleInpKnop, styleSetAdress } from "./../MainMapStyle";
import { styleBoxForm } from "./../MainMapStyle";

let reqRoute: any = {
  dlRoute: 0,
  tmRoute: 0,
};
let fromCross: any = {
  pointAaRegin: "",
  pointAaArea: "",
  pointAaID: 0,
  pointAcod: "",
};
let toCross: any = {
  pointBbRegin: "",
  pointBbArea: "",
  pointBbID: 0,
  pointBcod: "",
};
let massBind = [-1, -1];

const MapChangeAdress = (props: {
  iP: number;
  Open: any;
  zero: any;
  Cl: any;
}) => {
  //== Piece of Redux ======================================
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  let massroute = useSelector((state: any) => {
    const { massrouteReducer } = state;
    return massrouteReducer.massroute;
  });
  let coordinates = useSelector((state: any) => {
    const { coordinatesReducer } = state;
    return coordinatesReducer.coordinates;
  });
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  const dispatch = useDispatch();
  //========================================================
  const [openSetAdress, setOpenSetAdress] = React.useState(true);
  const WS = datestat.ws;

  const [valuen, setValuen] = React.useState(
    massdk[props.iP].nameCoordinates
  );

  const handleKey = (event: any) => {
    if (event.key === "Enter") event.preventDefault();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValuen(event.target.value.trimStart()); // удаление пробелов в начале строки
  };

  const handleCloseSet = () => {
    props.Open(false);
    setOpenSetAdress(false);
  };

  const handleCloseSetAdr = () => {
    if (massdk[props.iP].nameCoordinates !== valuen) {
      const handleSendOpen = () => {
        if (WS.url !== "wss://localhost:3000/W") {
          if (WS.readyState === WebSocket.OPEN) {
            WS.send(
              JSON.stringify({
                type: "createPoint",
                data: {
                  position: coor,
                  name: valuen,
                  id: idPoint,
                },
              })
            );
          } else {
            setTimeout(() => {
              handleSendOpen();
            }, 1000);
          }
        }
      };

      massdk[props.iP].nameCoordinates = valuen; // были изменения
      massroute.vertexes[props.iP].name = valuen;
      let recMassdk = massdk[props.iP];
      let recMassroute = massroute.vertexes[props.iP];
      let recCoordinates = coordinates[props.iP];
      let coor = massroute.vertexes[props.iP].dgis;
      let idPoint = massroute.vertexes[props.iP].id;

      let massWays: any = [];
      for (let i = 0; i < massroute.ways.length; i++) {
        if (
          !massroute.ways[i].sourceArea &&
          massroute.ways[i].sourceID === idPoint
        ) {
          massWays.push(massroute.ways[i]);
          SocketDeleteWay(WS, massroute.ways[i]);
        }
        if (
          !massroute.ways[i].targetArea &&
          massroute.ways[i].targetID === idPoint
        ) {
          massWays.push(massroute.ways[i]);
          SocketDeleteWay(WS, massroute.ways[i]);
        }
      }
      SendSocketDeletePoint(WS, idPoint);
      //SendSocketCreatePoint(deb, WS, coor, valuen);
      handleSendOpen(); // создание новой точки со старым ID

      massdk.splice(props.iP, 1); // удаление самой точки
      massroute.vertexes.splice(props.iP, 1);
      coordinates.splice(props.iP, 1);

      massdk.push(recMassdk); // пересоздание точки
      massroute.vertexes.push(recMassroute);
      coordinates.push(recCoordinates);

      dispatch(massdkCreate(massdk));
      dispatch(massrouteCreate(massroute));
      dispatch(coordinatesCreate(coordinates));

      for (let i = 0; i < massWays.length; i++) {
        fromCross.pointAaRegin = massWays[i].region.toString(); // пересоздание связей
        fromCross.pointAaArea = massWays[i].sourceArea.toString();
        fromCross.pointAaID = massWays[i].sourceID;
        fromCross.pointAcod = massWays[i].starts;
        toCross.pointBbRegin = massWays[i].region.toString();
        toCross.pointBbArea = massWays[i].targetArea.toString();
        toCross.pointBbID = massWays[i].targetID;
        toCross.pointBcod = massWays[i].stops;
        massBind[0] = massWays[i].lsource;
        massBind[1] = massWays[i].ltarget;
        reqRoute.dlRoute = massWays[i].lenght;
        reqRoute.tmRoute = massWays[i].time;
        if (!massWays[i].sourceArea) {
          SendSocketCreateWayFromPoint(
            WS,
            fromCross,
            toCross,
            massBind,
            reqRoute
          );
        } else {
          SendSocketCreateWayToPoint(
            WS,
            fromCross,
            toCross,
            massBind,
            reqRoute
          );
        }
      }
      props.zero(false); // очищение списка связей
      props.Cl(false); // закрытие меню работы с точками
    }
    handleCloseSet();
  };

  return (
    <Box>
      <Modal open={openSetAdress} onClose={handleCloseSet} hideBackdrop={false}>
        <Grid item container sx={styleSetAdress}>
          <Grid item xs={9.6} sx={{ border: 0 }}>
            <Box sx={styleSet}>
              <Box component="form" sx={styleBoxForm}>
                <TextField
                  size="small"
                  onKeyPress={handleKey} //отключение Enter
                  InputProps={{
                    disableUnderline: true,
                    style: { fontSize: 13.3 },
                  }}
                  value={valuen}
                  onChange={handleChange}
                  variant="standard"
                  helperText="Отредактируйте адрес точки"
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs sx={{ border: 0 }}>
            <Button sx={styleInpKnop} onClick={handleCloseSetAdr}>
              Ввод
            </Button>
          </Grid>
        </Grid>
      </Modal>
    </Box>
  );
};

export default MapChangeAdress;
