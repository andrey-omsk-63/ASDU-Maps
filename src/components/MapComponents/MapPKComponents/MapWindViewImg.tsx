import * as React from "react";
//import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import { ReplaceInSvg } from "../../MapServiceFunctions";

import { styleModalEnd } from "../../MainMapStyle";
import { styleWVI00, styleWVI01 } from "../../MainMapStyle";

//import { KolIn } from "./../../MapConst";

let nameIn = "";

const MapWindViewImg = (props: {
  close: Function; // функция возврата в родительский компонент
  idx: number; //
  name: any;
  svg: any;
}) => {
  //console.log("MapWindPK:", props.route);
  //== Piece of Redux =======================================
  // let massplan = useSelector((state: any) => {
  //   const { massplanReducer } = state;
  //   return massplanReducer.massplan;
  // });
  // console.log("###massplan:", massplan);
  // let datestat = useSelector((state: any) => {
  //   const { statsaveReducer } = state;
  //   return statsaveReducer.datestat;
  // });
  //===========================================================
  const [openImg, setOpenImg] = React.useState(true);

  //=== инициализация ======================================
  if (props.name) nameIn = props.name + ".";

  //========================================================
  const CloseEnd = React.useCallback(() => {
    props.close(null);
  }, [props]);

  //=== обработка Esc ======================================
  const escFunction = React.useCallback(
    (event) => {
      if (event.keyCode === 27) CloseEnd();
    },
    [CloseEnd]
  );

  React.useEffect(() => {
    document.addEventListener("keydown", escFunction);
    return () => document.removeEventListener("keydown", escFunction);
  }, [escFunction]);
  //=== Функции - обработчики ==============================

  //========================================================

  const handleClose = () => {
    setOpenImg(false);
    props.close(false);
  };

  const CloseEndGl = (event: any, reason: string) => {
    if (reason === "escapeKeyDown") handleClose();
  };

  let lngth = Math.round(window.innerHeight * 0.8).toString();
  let expSvg = ReplaceInSvg(props.svg, lngth);

  return (
    <Modal open={openImg} onClose={CloseEndGl} hideBackdrop={false}>
      <Box sx={styleWVI00}>
        <Button sx={styleModalEnd} onClick={() => handleClose()}>
          <b>&#10006;</b>
        </Button>
        Перекрёсток с направлением <b>{nameIn + (props.idx + 1)}</b>
        <Box sx={styleWVI01}>
          <div dangerouslySetInnerHTML={{ __html: expSvg }} />
        </Box>
      </Box>
    </Modal>
  );
};

export default MapWindViewImg;
