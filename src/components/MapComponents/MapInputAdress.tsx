import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { massdkCreate, massrouteCreate } from "./../../redux/actions";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

import { styleSet, styleInpKnop, styleSetAdress } from "./../MainMapStyle";
import { styleBoxForm } from "./../MainMapStyle";

const MapInputAdress = (props: { iPoint: number; setOpen: any }) => {
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
  const [openSetAdress, setOpenSetAdress] = React.useState(true);

  const [valuen, setValuen] = React.useState(
    massdk[props.iPoint].nameCoordinates
  );

  const handleKey = (event: any) => {
    if (event.key === "Enter") event.preventDefault();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValuen(event.target.value);
  };

  const handleCloseSet = () => {
    props.setOpen(false);
    setOpenSetAdress(false);
  };

  const handleCloseSetAdr = () => {
    console.log("Сохраняем!!!")
    massdk[props.iPoint].nameCoordinates = valuen;
    massroute.vertexes[props.iPoint].name = valuen;
    dispatch(massdkCreate(massdk));
    dispatch(massrouteCreate(massroute));
    handleCloseSet();
  };

  return (
    <Box>
      <Modal open={openSetAdress} onClose={handleCloseSet} hideBackdrop>
        <Grid item container sx={styleSetAdress}>
          <Grid item xs={9.5} sx={{ border: 0 }}>
            <Box sx={styleSet}>
              <Box component="form" sx={styleBoxForm}>
                <TextField
                  size="small"
                  onKeyPress={handleKey} //отключение Enter
                  inputProps={{ style: { fontSize: 13.3 } }}
                  value={valuen}
                  onChange={handleChange}
                  variant="standard"
                  helperText="Отредактируйте адрес"
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs sx={{ border: 0 }}>
            <Box>
              <Button
                sx={styleInpKnop}
                variant="contained"
                onClick={handleCloseSetAdr}
              >
                Ввод
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Modal>
    </Box>
  );
};

export default MapInputAdress;
