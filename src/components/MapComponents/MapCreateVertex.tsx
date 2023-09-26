import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { massdkCreate, massrouteCreate } from "./../../redux/actions";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
//import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

import MapPointDataError from "./MapPointDataError";

import { MapssdkNewPoint, MassrouteNewPoint } from "./../MapServiceFunctions";
import { NoVertex, InputAdressVertex } from "./../MapServiceFunctions";

import { styleInpKnop, styleSetAdrAreaID } from "./../MainMapStyle";
import { styleSetAdrArea, styleSetAdrID } from "./../MainMapStyle";
import { styleSetArea, styleSetID } from "./../MainMapStyle";
import { styleSetAdrAreaLess } from "./../MainMapStyle";
import { styleBoxFormArea, styleBoxFormID } from "./../MainMapStyle";

let soobErr = "";
let adrV = "";

let oldCoord: any = 0;
//let flagLevel01 = true;
let propsCoord = [0, 0];

const MapCreateVertex = (props: {
  setOpen: any;
  region: number;
  area: string;
  coord: any;
  createPoint: any;
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
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map;
  });
  const dispatch = useDispatch();
  //====== инициализация ===================================
  if (oldCoord !== props.coord) {
    oldCoord = props.coord;
    propsCoord = [0, 0];
  }
  //========================================================
  let homeRegion = map.dateMap.regionInfo[props.region];
  let dat = map.dateMap.areaInfo[homeRegion];
  let massKey = [];
  let massDat = [];
  const currencies: any = [];
  for (let key in dat) {
    massKey.push(key);
    massDat.push(dat[key]);
  }
  for (let i = 0; i < massKey.length; i++) {
    let maskCurrencies = {
      value: "",
      label: "",
    };
    maskCurrencies.value = massKey[i];
    maskCurrencies.label = massDat[i];
    currencies.push(maskCurrencies);
  }

  const NameMode = () => {
    let nameMode =
      "(" +
      new Date().toLocaleDateString() +
      " " +
      new Date().toLocaleTimeString() +
      ")";
    return nameMode;
  };

  const [openSetAdress, setOpenSetAdress] = React.useState(true);
  const [currency, setCurrency] = React.useState(massKey[0]);
  const [valuen, setValuen] = React.useState(1);
  const [valueAdr, setValueAdr] = React.useState("Перекрёсток" + NameMode());
  const [openSetErr, setOpenSetErr] = React.useState(false);
  const [openSetNoVertex, setOpenSetNoVertex] = React.useState(false);
  const [openSetInpAdr, setOpenSetInpAdr] = React.useState(false);
  const AREA = props.area;
  let Area = AREA === "0" ? "1" : props.area;

  const handleKey = (event: any) => {
    if (event.key === "Enter") event.preventDefault();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    Area = event.target.value;
    setCurrency(event.target.value);
    console.log("setCurrency:", currency, typeof currency, AREA, Area);
    setOpenSetAdress(true);
  };

  const handleChangeID = (event: any) => {
    let valueInp = event.target.value.replace(/^0+/, "");
    if (Number(valueInp) < 0) valueInp = 0;
    if (valueInp === "") valueInp = 0;
    valueInp = Math.trunc(Number(valueInp)).toString();
    setValuen(valueInp);
    setValueAdr("ДК " + valueInp + " " + NameMode());
  };

  const handleCloseSetAdress = () => {
    props.setOpen(false);
    setOpenSetAdress(false);
  };

  const handleCloseEnd = (event: any, reason: string) => {
    if (reason === "escapeKeyDown") handleCloseSetAdress();
  };

  const CheckDoublAreaID = () => {
    let doublAreaID = true;
    for (let i = 0; i < massroute.vertexes.length; i++) {
      if (
        massroute.vertexes[i].region === props.region &&
        massroute.vertexes[i].area === Number(Area) &&
        massroute.vertexes[i].id === Number(valuen)
      ) {
        doublAreaID = false;
        soobErr =
          "Такой светофор уже существует (район: " +
          Area +
          " ID: " +
          valuen +
          ")";
        setOpenSetErr(true);
      }
    }
    return doublAreaID;
  };

  const CheckAvailVertex = () => {
    let availVertex = false;
    for (let i = 0; i < map.dateMap.tflight.length; i++) {
      if (
        map.dateMap.tflight[i].region.num === props.region.toString() &&
        map.dateMap.tflight[i].area.num === Area &&
        map.dateMap.tflight[i].ID === Number(valuen)
      ) {
        availVertex = true;
        adrV = map.dateMap.tflight[i].description;
        break;
      }
    }
    return availVertex;
  };

  const SaveVertex = () => {
    let avail = false;
    if (!propsCoord[0]) {
      // светофор в базе есть
      for (let i = 0; i < map.dateMap.tflight.length; i++) {
        if (
          map.dateMap.tflight[i].ID === Number(valuen) &&
          Number(map.dateMap.tflight[i].area.num) === Number(Area)
        ) {
          propsCoord[0] = map.dateMap.tflight[i].points.Y;
          propsCoord[1] = map.dateMap.tflight[i].points.X;
          avail = true;
          break;
        }
      }
    }
    if (propsCoord[0]) {
      massdk.push(
        MapssdkNewPoint(
          props.region,
          propsCoord,
          adrV,
          Number(Area), // area
          Number(valuen) // id
        )
      );
      massroute.vertexes.push(
        MassrouteNewPoint(
          props.region,
          propsCoord,
          adrV,
          Number(Area), // area
          Number(valuen) // id
        )
      );

      dispatch(massdkCreate(massdk));
      dispatch(massrouteCreate(massroute));
      //================================= потом исправить ======
      props.createPoint(propsCoord, avail);
      //========================================================
    }
    handleCloseSetAdress();
  };

  const handleClose = () => {
    if (CheckDoublAreaID()) {
      if (CheckAvailVertex()) {
        SaveVertex();
      } else {
        setOpenSetNoVertex(true);
      }
    }
  };

  const InputArea = () => {
    return (
      <Box sx={styleSetArea}>
        <Box component="form" sx={styleBoxFormArea}>
          <TextField
            select
            size="small"
            onKeyPress={handleKey} //отключение Enter
            InputProps={{ disableUnderline: true }}
            value={currency}
            onChange={handleChange}
            variant="standard"
            helperText="Введите район"
            color="secondary"
          >
            {currencies.map((option: any) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>
    );
  };

  const InputID = () => {
    return (
      <Box sx={styleSetID}>
        <Box component="form" sx={styleBoxFormID}>
          <TextField
            size="small"
            onKeyPress={handleKey} //отключение Enter
            type="number"
            InputProps={{
              disableUnderline: true,
              style: { fontSize: 13.3, backgroundColor: "#FFFBE5" },
            }}
            value={valuen}
            onChange={handleChangeID}
            variant="standard"
            helperText="Введите ID"
            color="secondary"
          />
        </Box>
      </Box>
    );
  };

  const handleCloseNoVertex = (mode: boolean) => {
    if (mode) {
      setOpenSetInpAdr(true);
    } else {
      handleCloseSetAdress();
    }
    setOpenSetNoVertex(false);
  };

  const handleCloseInpAdr = (mode: boolean) => {
    if (mode) {
      adrV = valueAdr;
      propsCoord = props.coord;
      SaveVertex();
    }
    setOpenSetInpAdr(false);
  };

  return (
    <>
      <Modal open={openSetAdress} onClose={handleCloseEnd}>
        <Grid item container sx={styleSetAdrAreaID}>
          <Grid item>
            <Grid item container sx={styleSetAdrArea}>
              <Grid item xs={9.5}>
                {AREA === "0" && <InputArea />}
                {AREA !== "0" && (
                  <Box sx={styleSetAdrAreaLess}>
                    {massDat[Number(AREA) - 1]}
                  </Box>
                )}
              </Grid>
            </Grid>
            <Grid item container sx={styleSetAdrID}>
              <Grid item xs={9.5}>
                {InputID()}
              </Grid>
              <Grid item xs={2.2}>
                <Button sx={styleInpKnop} onClick={handleClose}>
                  Ввод
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Modal>
      {openSetNoVertex && <>{NoVertex(openSetNoVertex, handleCloseNoVertex)}</>}
      {openSetInpAdr && (
        <>
          {InputAdressVertex(
            openSetInpAdr,
            handleCloseInpAdr,
            valueAdr,
            setValueAdr
          )}
        </>
      )}
      {openSetErr && (
        <MapPointDataError
          sErr={soobErr}
          setOpen={setOpenSetErr}
          //ws={{}}
          fromCross={0}
          toCross={0}
          update={0}
          svg={{}}
          setSvg={{}}
        />
      )}
    </>
  );
};

export default MapCreateVertex;
