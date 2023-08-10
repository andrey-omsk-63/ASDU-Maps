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
import { NoVertex } from "./../MapServiceFunctions";

import { styleInpKnop, styleSetAdrAreaID } from "./../MainMapStyle";
import { styleSetAdrArea, styleSetAdrID } from "./../MainMapStyle";
import { styleSetArea, styleSetID } from "./../MainMapStyle";
import { styleSetAdrAreaLess, styleModalEndMapGl } from "./../MainMapStyle";
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
  console.log("MAP:", map);
  const dispatch = useDispatch();
  //====== инициализация ===================================
  if (oldCoord !== props.coord) {
    //flagLevel01 = true;
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

  const [openSetAdress, setOpenSetAdress] = React.useState(true);
  const [currency, setCurrency] = React.useState(massKey[0]);
  const [valuen, setValuen] = React.useState(1);
  const [valueAdr, setValueAdr] = React.useState("123456");
  const [openSetErr, setOpenSetErr] = React.useState(false);
  const [openSetNoVertex, setOpenSetNoVertex] = React.useState(false);
  const [openSetInpAdres, setOpenSetInpAdres] = React.useState(false);
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
  };

  const handleCloseSetAdress = () => {
    props.setOpen(false);
    setOpenSetAdress(false);
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
        soobErr = "Дубликатная запись ключ: Pайон_ID";
        console.log();
        console.log(soobErr);
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
    console.log("CheckAvailVertex", availVertex);
    return availVertex;
  };

  const SaveVertex = () => {
    if (!propsCoord[0]) {
      // светофор в базе есть
      for (let i = 0; i < map.dateMap.tflight.length; i++) {
        if (
          map.dateMap.tflight[i].ID === Number(valuen) &&
          Number(map.dateMap.tflight[i].area.num) === Number(Area)
        ) {
          propsCoord[0] = map.dateMap.tflight[i].points.Y;
          propsCoord[1] = map.dateMap.tflight[i].points.X;
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
      props.createPoint(propsCoord);
    }
    handleCloseSetAdress();
  };

  const handleClose = () => {
    if (CheckDoublAreaID()) {
      if (CheckAvailVertex()) {
        console.log("333333");
        SaveVertex();
      } else {
        console.log("111111");
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

  const handleCloseNoVertex = (mode: boolean) => {
    if (mode) {
      console.log("555555");
      //=======================================
      setOpenSetInpAdres(true);
    } else {
      console.log("444444");
      handleCloseSetAdress();
    }
    setOpenSetNoVertex(false);
  };

  const handleCloseInpAdr = (mode: boolean) => {
    adrV = valueAdr
    propsCoord = props.coord;
    SaveVertex();
  };

  const handleChangeAdr = (event: any) => {
    let valueInp = event.target.value.replace(/^0+/, "");
    setValueAdr(valueInp);
  };

  const InputAdressVertex = (
    openSetInpAdres: boolean,
    handleCloseInp: Function
  ) => {
    const styleSetAdres = {
      outline: "none",
      position: "absolute",
      marginTop: "15vh",
      marginLeft: "24vh",
      width: 400,
      height: "50px",
      bgcolor: "background.paper",
      border: "3px solid #000",
      borderColor: "primary.main",
      borderRadius: 2,
      boxShadow: 24,
      textAlign: "center",
      p: 1,
    };

    const styleSetAd = {
      width: "370px",
      maxHeight: "3px",
      minHeight: "3px",
      bgcolor: "#FAFAFA",
      boxShadow: 3,
      textAlign: "center",
      p: 1.5,
    };

    const styleBoxFormAdres = {
      "& > :not(style)": {
        marginTop: "-9px",
        marginLeft: "-12px",
        width: 390,
      },
    };

    return (
      <Modal
        open={openSetInpAdres}
        onClose={() => handleCloseInp(false)}
        hideBackdrop
      >
        <Box sx={styleSetAdres}>
          <Button
            sx={styleModalEndMapGl}
            onClick={() => handleCloseInpAdr(true)}
          >
            <b>&#10006;</b>
          </Button>
          <Box sx={styleSetAd}>
            <Box component="form" sx={styleBoxFormAdres}>
              <TextField
                size="small"
                onKeyPress={handleKey} //отключение Enter
                type="text"
                InputProps={{
                  disableUnderline: true,
                  style: { fontSize: 13.3 },
                }}
                value={valueAdr}
                onChange={handleChangeAdr}
                variant="standard"
                helperText="Введите адрес светофора"
                color="secondary"
              />
            </Box>
          </Box>
        </Box>
      </Modal>
    );
  };

  return (
    <Box>
      <Modal open={openSetAdress} onClose={handleCloseSetAdress} hideBackdrop>
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
                <Box sx={styleSetID}>
                  <Box component="form" sx={styleBoxFormID}>
                    <TextField
                      size="small"
                      onKeyPress={handleKey} //отключение Enter
                      type="number"
                      InputProps={{
                        disableUnderline: true,
                        style: { fontSize: 13.3 },
                      }}
                      value={valuen}
                      onChange={handleChangeID}
                      variant="standard"
                      helperText="Введите ID"
                      color="secondary"
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs>
                <Button sx={styleInpKnop} onClick={handleClose}>
                  Ввод
                </Button>
              </Grid>
            </Grid>
          </Grid>
          {openSetNoVertex && (
            <>{NoVertex(openSetNoVertex, handleCloseNoVertex)}</>
          )}
          {openSetInpAdres && (
            <>{InputAdressVertex(openSetInpAdres, handleCloseInpAdr)}</>
          )}
          {openSetErr && (
            <MapPointDataError
              sErr={soobErr}
              setOpen={setOpenSetErr}
              ws={{}}
              fromCross={0}
              toCross={0}
              update={0}
            />
          )}
        </Grid>
      </Modal>
    </Box>
  );
};

export default MapCreateVertex;
