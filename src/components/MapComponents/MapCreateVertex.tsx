import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { massdkCreate, massrouteCreate } from "./../../redux/actions";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

import MapPointDataError from "./MapPointDataError";

import { SubArea, SUBAREA, homeRegion } from "./../MainMapGl";

import { MapssdkNewPoint, MassrouteNewPoint } from "./../MapServiceFunctions";
import { NoVertex, UniqueName } from "./../MapServiceFunctions";

import { styleInpKnop, styleSetAdrAreaID } from "./../MainMapStyle";
import { styleSetAdrArea, styleSetAdrID } from "./../MainMapStyle";
import { styleSetArea, styleSetID } from "./../MainMapStyle";
import { styleSetAdrAreaLess, styleSetSubarea_Adress } from "./../MainMapStyle";
import { styleBoxFormArea, styleBoxFormID } from "./../MainMapStyle";

let soobErr = "";
let adrV = "";

let massKey: string[] = [];
let massDat: string[] = [];
let currencies: any = [];
let Area = "0";
let AREA = "0";
let massKeyt: string[] = [];
let currenciest: any = [];

let oldCoord: any = 0;
let propsCoord = [0, 0];
let subArea = -1;

const MapCreateVertex = (props: {
  setOpen: any;
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

    let homeReg = map.dateMap.regionInfo[homeRegion];
    let dat = map.dateMap.areaInfo[homeReg];
    massKey = [];
    massDat = [];
    currencies = [];
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

    AREA = props.area;
    Area = AREA === "0" ? "1" : props.area;
    subArea = SUBAREA === "0" ? 1 : Number(SUBAREA);

    let datt = [];
    for (let i = 0; i < SubArea.length; i++)
      datt.push(SubArea[i].toString() + "-й подрайон");

    massKeyt = [];
    let massDatt = [];
    currenciest = [];
    for (let key in datt) {
      massKeyt.push(key);
      massDatt.push(datt[key]);
    }
    for (let i = 0; i < massKeyt.length; i++) {
      let maskCurrencies = {
        value: "",
        label: "",
      };
      maskCurrencies.value = massKeyt[i];
      maskCurrencies.label = massDatt[i];
      currenciest.push(maskCurrencies);
    }
  }
  //========================================================
  const [openSetAdress, setOpenSetAdress] = React.useState(true);
  const [currency, setCurrency] = React.useState(massKey[0]);
  const [valuen, setValuen] = React.useState(1);
  const [openSetErr, setOpenSetErr] = React.useState(false);
  const [openSetNoVertex, setOpenSetNoVertex] = React.useState(false);
  const [openSetInpAdr, setOpenSetInpAdr] = React.useState(false);
  const REGION = homeRegion;
  const [currencyt, setCurrencyt] = React.useState(
    massKeyt[SubArea.indexOf(subArea)]
  );
  const [valueAdr, setValueAdr] = React.useState("Перекрёсток" + UniqueName());

  const handleKey = (event: any) => {
    if (event.key === "Enter") event.preventDefault();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    Area = event.target.value;
    setCurrency(event.target.value);
    setOpenSetAdress(true);
  };

  const handleChangeID = (event: any) => {
    let valueInp = event.target.value.replace(/^0+/, "");
    if (Number(valueInp) < 0) valueInp = 0;
    if (valueInp === "") valueInp = 0;
    valueInp = Math.trunc(Number(valueInp)).toString();
    setValuen(valueInp);
    setValueAdr("ДК " + valueInp + " " + UniqueName());
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
        massroute.vertexes[i].region === REGION &&
        massroute.vertexes[i].area === Number(Area) &&
        massroute.vertexes[i].id === Number(valuen)
      ) {
        doublAreaID = false;
        soobErr = "Такой светофор уже существует (ID: " + valuen + ")";
        setOpenSetErr(true);
      }
    }
    return doublAreaID;
  };

  const CheckAvailVertex = () => {
    let availVertex = false;
    for (let i = 0; i < map.dateMap.tflight.length; i++) {
      if (
        map.dateMap.tflight[i].region.num === REGION.toString() &&
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
      let ar = Number(Area);
      massdk.push(
        MapssdkNewPoint(REGION, propsCoord, adrV, ar, subArea, Number(valuen))
      );
      massroute.vertexes.push(
        MassrouteNewPoint(REGION, propsCoord, adrV, ar, Number(valuen))
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
      } else setOpenSetNoVertex(true);
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
    } else handleCloseSetAdress();
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

  const InputAdressVertex = () => {
    const handleChangeAdr = (event: any) => {
      let valueInp = event.target.value.replace(/^0+/, "");
      setValueAdr(valueInp);
    };

    const InputAdress = () => {
      return (
        <Box sx={styleSetArea}>
          <Box component="form" sx={styleBoxFormID}>
            <TextField
              size="small"
              onKeyPress={handleKey} //отключение Enter
              type="text"
              InputProps={{
                disableUnderline: true,
                style: { fontSize: 13.3, backgroundColor: "#FFFBE5" },
              }}
              value={valueAdr}
              onChange={handleChangeAdr}
              variant="standard"
              helperText="Введите наименование (адрес)"
              color="secondary"
            />
          </Box>
        </Box>
      );
    };

    const handleChangeSArea = (event: React.ChangeEvent<HTMLInputElement>) => {
      let sub = Number(event.target.value);
      subArea = SubArea[sub];
      setCurrencyt(event.target.value);
    };

    const InputSubArea = () => {
      return (
        <Box sx={styleSetArea}>
          <Box component="form" sx={styleBoxFormArea}>
            <TextField
              select
              size="small"
              onKeyPress={handleKey} //отключение Enter
              InputProps={{ disableUnderline: true }}
              value={currencyt}
              onChange={handleChangeSArea}
              variant="standard"
              helperText="Введите подрайон"
              color="secondary"
            >
              {currenciest.map((option: any) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>
      );
    };

    const handleCloseEndOther = (event: any, reason: string) => {
      if (reason === "escapeKeyDown") handleCloseInpAdr(false);
    };

    return (
      <Modal open={openSetInpAdr} onClose={() => handleCloseEndOther}>
        <Grid item container sx={styleSetSubarea_Adress}>
          <Grid item>
            <Grid item container sx={styleSetAdrArea}>
              <Grid item xs={9.5}>
                {InputSubArea()}
              </Grid>
            </Grid>
            <Grid item container sx={styleSetAdrID}>
              <Grid item xs={9.5} sx={{ border: 0 }}>
                {InputAdress()}
              </Grid>
              <Grid item xs={2.2} sx={{ border: 0 }}>
                <Button
                  sx={styleInpKnop}
                  onClick={() => handleCloseInpAdr(true)}
                >
                  Ввод
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Modal>
    );
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
      {openSetInpAdr && <>{InputAdressVertex()}</>}
      {openSetErr && (
        <MapPointDataError
          sErr={soobErr}
          setOpen={setOpenSetErr}
          fromCross={0}
          toCross={0}
          update={0}
          setSvg={{}}
        />
      )}
    </>
  );
};

export default MapCreateVertex;
