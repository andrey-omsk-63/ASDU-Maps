import * as React from "react";
import { useSelector } from "react-redux";

//import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import { ReplaceInSvg } from "../../MapServiceFunctions";

import { styleWVG00, styleModalEndBind } from "../../MainMapStyle";
//import { styleWVG01, styleWVG02 } from "../../MainMapStyle";

//import { Directions } from "../../../App"; // интерфейс massForm
// interface DataGl {
//   labels: string[];
//   datasets: Datasets[];
// }

// interface Datasets {
//   label: string;
//   data: number[];
//   borderWidth: number;
//   borderColor: string;
//   backgroundColor: string;
//   pointRadius: number;
// }

//import { KolIn } from "./../../MapConst";

let nameIn = "";
//let timeInterval = 80;

const MapWindViewImg = (props: {
  close: Function; // функция возврата в родительский компонент
  idx: number; //
  route: any;
}) => {
  //console.log("MapWindPK:", props.route);
  //== Piece of Redux =======================================
  // let massplan = useSelector((state: any) => {
  //   const { massplanReducer } = state;
  //   return massplanReducer.massplan;
  // });
  // console.log("###massplan:", massplan);
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  //console.log('massplan:', massplan, massSpis);
  //const dispatch = useDispatch();
  //===========================================================
  // const [value, setValue] = React.useState(67);
  // const [openImg, setOpenImg] = React.useState(false);
  const [openGraf, setOpenGraf] = React.useState(true);

  //=== инициализация ======================================
  if (props.route) nameIn = props.route.targetID + ".";

  //========================================================
  const CloseEnd = React.useCallback(() => {
    props.close(null);
  }, [props]);

  //=== обработка Esc ======================================
  const escFunction = React.useCallback(
    (event) => {
      if (event.keyCode === 27) {
        console.log("ESC!!!");
        CloseEnd();
      }
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
    setOpenGraf(false);
    props.close(false);
  };

  const CloseEndGl = (event: any, reason: string) => {
    if (reason === "escapeKeyDown") handleClose();
  };

  // const styleWindPK02 = {
  //   fontSize: 12.9,
  //   textAlign: "left",
  //   bgcolor: "#F1F5FB",
  //   border: "1px solid #d4d4d4",
  //   borderRadius: 1,
  //   color: "black",
  //   boxShadow: 3,
  //   p: 0.5,
  //   margin: "3px 0 1px 0",
  // };

  const styleWVG00 = {
    outline: "none",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: window.innerHeight * 0.8,
    bgcolor: "background.paper",
    border: "1px solid #FFFFFF",
    borderRadius: 1,
    boxShadow: 24,
    textAlign: "center",
    padding: "5px 15px 5px 2px",
  };

  const styleWindPK04 = {
    border: "1px solid #d4d4d4",
    marginTop: 1,
    bgcolor: "#F1F5FB",
    height: window.innerHeight * 0.8,
    borderRadius: 1,
    overflowX: "auto",
    boxShadow: 6,
    p: 1,
  };

  const styleWindPK055 = {
    height: window.innerHeight * 0.8,
    fontSize: 12.9,
    cursor: "pointer",
    textAlign: "center",
  };

  let expSvg = ReplaceInSvg(datestat.exampleImg1, (window.innerHeight * 0.8).toString());

  return (
    <Modal open={openGraf} onClose={CloseEndGl} hideBackdrop={false}>
      <Box sx={styleWVG00}>
        <Button sx={styleModalEndBind} onClick={() => handleClose()}>
          <b>&#10006;</b>
        </Button>
        Перекрёсток с направлением <b>{nameIn + (props.idx + 1)}</b>
        <Box sx={styleWindPK04}>
          
          <Box sx={styleWindPK055}>
            <div dangerouslySetInnerHTML={{ __html: expSvg }} />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default MapWindViewImg;
