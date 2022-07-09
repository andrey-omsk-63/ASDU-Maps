import * as React from "react";
import { useSelector } from "react-redux";

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
  //========================================================
  const [openSetAdress, setOpenSetAdress] = React.useState(true);

  const [valuen, setValuen] = React.useState(
    massdk[props.iPoint].nameCoordinates
  );
  // const handleCloseSetEr = (event: any, reason: string) => {
  //   if (reason !== "backdropClick") setOpenSetAdress(false);
  // };

  const handleKey = (event: any) => {
    if (event.key === "Enter") event.preventDefault();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValuen(event.target.value);
  };

  const handleCloseSetAdr = () => {
    massdk[props.iPoint].nameCoordinates = valuen;
    props.setOpen(false);
    setOpenSetAdress(false);
  };

  return (
    <Box>
      <Modal open={openSetAdress} onClose={handleCloseSetAdr} hideBackdrop>
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
                  size="small"
                  onKeyPress={handleKey} //отключение Enter
                  inputProps={{ style: { fontSize: 13.3 } }}
                  value={valuen}
                  onChange={handleChange}
                  variant="standard"
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
