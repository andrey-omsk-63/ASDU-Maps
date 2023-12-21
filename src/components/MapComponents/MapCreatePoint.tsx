import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { massdkCreate, massrouteCreate } from "./../../redux/actions";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

import { MapssdkNewPoint, MassrouteNewPoint } from "./../MapServiceFunctions";

import { SubArea, debug, homeRegion } from "./../MainMapGl";

import { styleSetAdress, styleBoxForm, styleInpKnop } from "./../MainMapStyle";
import { styleSet, styleSetAdrArea, styleSetAdrID } from "./../MainMapStyle";
import { styleSetArea, styleBoxFormArea } from "./../MainMapStyle";

let subArea = -1;
let flagInput = true;
let massKey: string[] = [];
let currencies: any = [];

const MapCreatePoint = (props: {
  setOpen: any;
  //region: number;
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
  const dispatch = useDispatch();
  //========================================================
  if (flagInput) {
    let dat = [];
    for (let i = 0; i < SubArea.length; i++) {
      dat.push(SubArea[i].toString() + "-й подрайон");
      if (!i) subArea = SubArea[i];
    }
    massKey = [];
    let massDat = [];
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
    flagInput = false;
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
  const [valueAdr, setValueAdr] = React.useState("Объект" + NameMode());
  const [currency, setCurrency] = React.useState(massKey[0]);
  const REGION = homeRegion;

  const handleKey = (event: any) => {
    if (event.key === "Enter") event.preventDefault();
  };

  const handleChangeAdr = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueAdr(event.target.value.trimStart()); // удаление пробелов в начале строки
    setOpenSetAdress(true);
  };

  const handleCloseSetAdress = () => {
    props.setOpen(false);
    setOpenSetAdress(false);
    flagInput = true;
  };

  const handleCloseSetAdr = () => {
    let id = debug ? 0 : 0;
    massdk.push(MapssdkNewPoint(REGION, props.coord, valueAdr, 0, subArea, id));
    massroute.vertexes.push(
      MassrouteNewPoint(REGION, props.coord, valueAdr, 0, 0)
    );
    dispatch(massdkCreate(massdk));
    dispatch(massrouteCreate(massroute));
    setOpenSetAdress(false);
    props.createPoint(props.coord, true);
  };

  const handleCloseEnd = (event: any, reason: string) => {
    if (reason === "escapeKeyDown") handleCloseSetAdress();
  };

  const InputAdress = () => {
    return (
      <Box sx={styleSet}>
        <Box component="form" sx={styleBoxForm}>
          <TextField
            size="small"
            onKeyPress={handleKey} //отключение Enter
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
    console.log("subArea:", subArea);
    setCurrency(event.target.value);
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
            value={currency}
            onChange={handleChangeSArea}
            variant="standard"
            helperText="Введите подрайон"
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

  return (
    <Modal open={openSetAdress} onClose={handleCloseEnd}>
      <Grid item container sx={styleSetAdress}>
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
              <Button sx={styleInpKnop} onClick={handleCloseSetAdr}>
                Ввод
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default MapCreatePoint;
