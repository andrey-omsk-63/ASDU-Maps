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

import { SubArea } from "./../MainMapGl";

import { MapssdkNewPoint, MassrouteNewPoint } from "./../MapServiceFunctions";
import { NoVertex, UniqueName } from "./../MapServiceFunctions";

import { styleInpKnop, styleSetAdrAreaID } from "./../MainMapStyle";
import { styleSetAdrArea, styleSetAdrID } from "./../MainMapStyle";
import { styleSetArea, styleSetID } from "./../MainMapStyle";
import { styleSetAdrAreaLess } from "./../MainMapStyle";
import { styleBoxFormArea, styleBoxFormID } from "./../MainMapStyle";

let soobErr = "";
let adrV = "";

let oldCoord: any = 0;
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

  const [openSetAdress, setOpenSetAdress] = React.useState(true);
  const [currency, setCurrency] = React.useState(massKey[0]);
  const [valuen, setValuen] = React.useState(1);
  const [openSetErr, setOpenSetErr] = React.useState(false);
  const [openSetNoVertex, setOpenSetNoVertex] = React.useState(false);
  const [openSetInpAdr, setOpenSetInpAdr] = React.useState(false);
  const AREA = props.area;
  let Area = AREA === "0" ? "1" : props.area;

  let subArea = -1;
  let datt = [];
  for (let i = 0; i < SubArea.length; i++) {
    datt.push(SubArea[i].toString() + "-й подрайон");
    if (!i) subArea = SubArea[i];
  }
  let massKeyt = [];
  let massDatt = [];
  const currenciest: any = [];
  for (let key in dat) {
    massKeyt.push(key);
    massDatt.push(dat[key]);
  }
  for (let i = 0; i < massKey.length; i++) {
    let maskCurrencies = {
      value: "",
      label: "",
    };
    maskCurrencies.value = massKeyt[i];
    maskCurrencies.label = massDatt[i];
    currenciest.push(maskCurrencies);
  }

  const [currencyt, setCurrencyt] = React.useState(massKeyt[0]);
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
        massroute.vertexes[i].region === props.region &&
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
          3, // subarea =================================================
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

  const InputAdressVertex = () =>
    //openSetInpAdres: boolean,
    //handleCloseInp: Function,
    //valueAdr: string,
    //setValueAdr: Function
    {
      const styleSetAdres = {
        outline: "none",
        width: "318px",
        height: "7vh",
        marginTop: "26vh",
        marginLeft: "46px",
        border: "1px solid #FFFEF7", // светло серый
        borderRadius: 1,
        boxShadow: 24,
        bgcolor: "#FFFEF7", // светло серый
        opacity: 0.85,
      };

      const styleSetAdress = {
        outline: "none",
        width: "318px",
        height: "14vh",
        marginTop: "9vh",
        marginLeft: "48px",
        border: "3px solid #FFFEF7", // светло серый
        borderRadius: 1,
        boxShadow: 24,
        bgcolor: "#FFFEF7", // светло серый
        opacity: 0.85,
      };

      const styleSetAd = {
        width: "230px",
        maxHeight: "3px",
        minHeight: "3px",
        bgcolor: "#FAFAFA", // светло серый
        boxShadow: 3,
        textAlign: "center",
        p: 1.5,
      };

      const styleBoxFormAdres = {
        "& > :not(style)": {
          marginTop: "-9px",
          marginLeft: "-12px",
          width: "253px",
        },
      };

      // let subArea = -1;
      // let dat = [];
      // for (let i = 0; i < SubArea.length; i++) {
      //   dat.push(SubArea[i].toString() + "-й подрайон");
      //   if (!i) subArea = SubArea[i];
      // }
      // let massKey = [];
      // let massDat = [];
      // const currencies: any = [];
      // for (let key in dat) {
      //   massKey.push(key);
      //   massDat.push(dat[key]);
      // }
      // for (let i = 0; i < massKey.length; i++) {
      //   let maskCurrencies = {
      //     value: "",
      //     label: "",
      //   };
      //   maskCurrencies.value = massKey[i];
      //   maskCurrencies.label = massDat[i];
      //   currencies.push(maskCurrencies);
      // }

      // const [currency, setCurrency] = React.useState(massKey[0]);
      // const [valueAdr, setValueAdr] = React.useState("Перекрёсток" + UniqueName())

      const handleChangeAdr = (event: any) => {
        let valueInp = event.target.value.replace(/^0+/, "");
        setValueAdr(valueInp);
      };

      const handleChangeSArea = (
        event: React.ChangeEvent<HTMLInputElement>
      ) => {
        let sub = Number(event.target.value);
        subArea = SubArea[sub];
        console.log("subArea:", subArea);
        setCurrencyt(event.target.value);
      };

      const InputAdress = () => {
        return (
          <Box sx={styleSetAd}>
            <Box component="form" sx={styleBoxFormAdres}>
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
        <Modal open={openSetInpAdr} onClose={() => handleCloseInpAdr(false)}>
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
      {openSetInpAdr && (
        <>
          {
            InputAdressVertex()
            //openSetInpAdr,
            //handleCloseInpAdr
            // valueAdr,
            // setValueAdr
          }
        </>
      )}
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
