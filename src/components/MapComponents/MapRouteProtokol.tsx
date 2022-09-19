import * as React from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import { styleModalEnd, styleSetInf } from "./../MainMapStyle";

const MapRouteProtokol = (props: { setOpen: any }) => {
  //== Piece of Redux =======================================
  let massroutepro = useSelector((state: any) => {
    const { massrouteproReducer } = state;
    return massrouteproReducer.massroutepro;
  });

  const [openSetPro, setOpenSetPro] = React.useState(true);

  const handleCloseSetEndPro = () => {
    props.setOpen(false);
    setOpenSetPro(false);
  };

  let massPro = massroutepro.ways;
  console.log("!!!", massroutepro.ways, massPro);

  let massProtokol = [];
  let massArea: Array<number> = [];
  for (let i = 0; i < massPro.length; i++) {
    let flagAvail = false;
    for (let j = 0; j < massArea.length; j++) {
      if (massPro[i].sourceArea === massArea[j]) flagAvail = true;
    }
    if (!flagAvail) massArea.push(massPro[i].sourceArea);
  }
  console.log("MassArea", massArea);
  // massArea = massArea.sort(function (a, b) {
  //   return a - b;
  // });
  let massAreaSort = new Float64Array(massArea);
  console.log("MassAreaSort", massAreaSort);

  massAreaSort = massAreaSort.sort(); // отсортированый массив подрайонов
  for (let i = 0; i < massAreaSort.length; i++) {
    let masSpis: any = [];
    masSpis = massPro.filter(
      (mass: { sourceArea: number }) => mass.sourceArea === massAreaSort[i]
    );
    console.log("1MasSpis", i, masSpis);
    masSpis.sort((x: any, y: any) => x.sourceID - y.sourceID);
    console.log("2MasSpis", i, masSpis);
    massProtokol.push(masSpis);
  }
  console.log("MassProtokol", massProtokol);

  return (
    <Modal open={openSetPro} onClose={handleCloseSetEndPro} hideBackdrop>
      <Box sx={styleSetInf}>
        <Button sx={styleModalEnd} onClick={handleCloseSetEndPro}>
          <b>&#10006;</b>
        </Button>
        <Box>
          <b>Протокол созданных связей:</b>
          <br />
        </Box>
      </Box>
    </Modal>
  );
};

export default MapRouteProtokol;
