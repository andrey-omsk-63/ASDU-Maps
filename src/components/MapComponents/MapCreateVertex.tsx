import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
//import { massdkCreate, massrouteCreate } from "./../../redux/actions";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

//import { MapssdkNewPoint, MassrouteNewPoint } from "./../MapServiceFunctions";
import MapCreateVertexInpID from "./MapCreateVertexInpID";

import { styleSetAdress, styleInpKnop } from "./../MainMapStyle";

const MapCreateVertex = (props: {
  region: number;
  coord: any;
  createPoint: any;
}) => {
  const styleSet = {
    width: "230px",
    maxHeight: "3px",
    minHeight: "3px",
    bgcolor: "#FAFAFA",
    boxShadow: 14,
    textAlign: "center",
    p: 1.5,
  };

  const styleBoxForm = {
    "& > :not(style)": {
      marginTop: "-13px",
      marginLeft: "-12px",
      width: "253px",
    },
  };

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
  const [openSetID, setOpenSetID] = React.useState(false);
  const [currency, setCurrency] = React.useState(massKey[0]);
  
  const handleKey = (event: any) => {
    if (event.key === "Enter") event.preventDefault();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrency(event.target.value);
    console.log("setCurrency:", event.target.value, currency);
    setOpenSetAdress(true);
  };

  const handleCloseSetAdr = () => {
    // let adr = 'Новый перекрёсток'
    // massdk.push(
    //   MapssdkNewPoint(props.region, props.coord, adr, Number(currency))
    // );
    // massroute.vertexes.push(
    //   MassrouteNewPoint(props.region, props.coord, adr, Number(currency))
    // );
    // dispatch(massdkCreate(massdk));
    // dispatch(massrouteCreate(massroute));
    // setOpenSetAdress(false);
    // props.createPoint(props.coord);
    setOpenSetID(true);
    //setOpenSetAdress(false);
  };

  // const handleCloseSetID = () => {
  //   // let adr = 'Новый перекрёсток'
  //   // massdk.push(
  //   //   MapssdkNewPoint(props.region, props.coord, adr, Number(currency))
  //   // );
  //   // massroute.vertexes.push(
  //   //   MassrouteNewPoint(props.region, props.coord, adr, Number(currency))
  //   // );
  //   // dispatch(massdkCreate(massdk));
  //   // dispatch(massrouteCreate(massroute));
  //   // setOpenSetAdress(false);
  //   // props.createPoint(props.coord);
  //   setOpenSetID(true);
  //   setOpenSetAdress(false);
  // };

  const handleCloseSetAdress = () => {
    setOpenSetID(true);
    setOpenSetAdress(false);
  };

  // const handleChangeID = (event: any) => {
  //   let valueInp = event.target.value.replace(/^0+/, "");
  //   // if (valueInp > maxi) valueInp = maxi;
  //   // if (valueInp < 0) valueInp = 0;
  //   // if (event.target.value === '') valueInp = 0;
  //   setValuen(valueInp);
  // };

  return (
    <Box>
      <Modal open={openSetAdress} onClose={handleCloseSetAdress} hideBackdrop>
        <>
          <Grid item container sx={styleSetAdress}>
            <Grid item xs={9.5} sx={{ border: 0 }}>
              <Box sx={styleSet}>
                <Box
                  component="form"
                  sx={styleBoxForm}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    select
                    size="small"
                    onKeyPress={handleKey} //отключение Enter
                    // inputProps={{ style: { fontSize: 13.3 } }}
                    // InputLabelProps={{ style: { fontSize: 13.3 } }}
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
            </Grid>
            <Grid item xs sx={{ border: 0 }}>
              <Box>
                <Button
                  sx={styleInpKnop}
                  variant="contained"
                  onClick={handleCloseSetAdress}
                >
                  Ввод
                </Button>
              </Box>
            </Grid>
          </Grid>
        </>
      </Modal>
      {openSetID && (
        <MapCreateVertexInpID
          region={props.region}
          coord={props.coord}
          area={currency}
          createPoint={props.createPoint}
        />
      )}
    </Box>
  );
};

export default MapCreateVertex;
