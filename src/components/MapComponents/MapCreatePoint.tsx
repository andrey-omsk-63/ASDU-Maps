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

import { MapssdkNewPoint, MassrouteNewPoint } from "./../MapServiceFunctions";

import { SubArea, SUBAREA, homeRegion } from "./../MainMapGl";

import { styleSetAdress, styleBoxForm, styleInpKnop } from "./../MainMapStyle";
import { styleSet, styleSetAdrArea, styleSetAdrID } from "./../MainMapStyle";
import { styleSetArea, styleBoxFormArea } from "./../MainMapStyle";

let subArea = -1;
let flagInput = true;
let massKey: string[] = ["0"];
let currencies: any = [];
let soobErr = "";

const MapCreatePoint = (props: {
  setOpen: any;
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
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  const dispatch = useDispatch();
  //========================================================
  const NameMode = () => {
    let nameMode =
      "(" +
      new Date().toLocaleDateString() +
      " " +
      new Date().toLocaleTimeString() +
      ")";
    return nameMode;
  };

  const [openSetErr, setOpenSetErr] = React.useState(false);
  const [openSetAdress, setOpenSetAdress] = React.useState(true);
  const [valueAdr, setValueAdr] = React.useState("Объект" + NameMode());
  const [currency, setCurrency] = React.useState(massKey[0]);
  const REGION = homeRegion;

  if (flagInput) {
    let dat = [];
    for (let i = 0; i < SubArea.length; i++)
      dat.push(SubArea[i].toString() + "-й подрайон");

    massKey = [];
    let massDat = [];
    currencies = [];
    for (let key in dat) {
      massKey.push(key);
      massDat.push(dat[key]);
    }
    for (let i = 0; i < massKey.length; i++)
      currencies.push({ value: massKey[i], label: massDat[i] });

    let subb = !Number(SUBAREA) ? SubArea[0] : Number(SUBAREA);
    let idx = SubArea.indexOf(subb);
    subArea = SubArea[idx];
    flagInput = false;

    setCurrency(massKey[idx]);
  }

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
    if (!datestat.permitСreatPoint) {
      soobErr =
        "Новую точку создовать нельзя пока не пришло подтверждение с сервера о том, что обработана информация о создании предыдущей точки";
      setOpenSetErr(true);
    } else {
      let tempId = 10001;
      let Have = true;
      while (Have) {
        let have = 0;
        for (let i = 0; i < massroute.points.length; i++) {
          if (tempId === massroute.points[i].id) {
            tempId++;
            have++;
          }
        }
        if (!have) Have = false;
      }

      massdk.push(
        MapssdkNewPoint(REGION, props.coord, valueAdr, 0, subArea, tempId)
      );

      let rec = MassrouteNewPoint(
        REGION,
        props.coord,
        valueAdr,
        subArea,
        tempId
      );
      massroute.vertexes.push(rec);
      massroute.points.push(rec);

      dispatch(massdkCreate(massdk));
      dispatch(massrouteCreate(massroute));
      setOpenSetAdress(false);
      props.createPoint(props.coord, true);
      flagInput = true;
    }
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

    console.log("handleChangeSArea:", subArea, typeof subArea);

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
    <>
      <Modal open={openSetAdress} onClose={handleCloseEnd}>
        <Grid item container sx={styleSetAdress}>
          <Grid item>
            <Grid item container sx={styleSetAdrArea}>
              <Grid item xs={9.5}>
                {InputSubArea()}
              </Grid>
            </Grid>
            <Grid item container sx={styleSetAdrID}>
              <Grid item xs={9.5}>
                {InputAdress()}
              </Grid>
              <Grid item xs={2.2}>
                <Button sx={styleInpKnop} onClick={handleCloseSetAdr}>
                  Ввод
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Modal>
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

export default MapCreatePoint;
