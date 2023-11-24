import * as React from "react";
//import { useSelector, useDispatch } from "react-redux";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Slider from "@mui/material/Slider";

import { StrokaTablWindPK } from "../../MapServiceFunctions";

import { styleWindPK00, styleWindPK01 } from "../../MainMapStyle";
import { styleWindPK02 } from "../../MainMapStyle";
import { styleWindPK90, styleWindPKEnd } from "../../MainMapStyle";
import { styleModalEndBind, stylePKForm01 } from "../../MainMapStyle";
import { styleWindPK04 } from "../../MainMapStyle";

import { Directions } from "../../../App"; // интерфейс massForm

import { KolIn } from "./../../MapConst";

let nameIn = "";
let IDX = -1;

let massForm: Directions = {
  name: "0121", // номер направления
  satur: 3600, // Насыщение(т.е./ч.)
  intensTr: 900, // Интенсивность(т.е./ч.)
  dispers: 50, // Дисперсия пачки(%)
  peregon: 248, // Длинна перегона(м)
  wtStop: 1, // Вес остановки
  wtDelay: 1, // Вес задержки
  offsetBeginGreen: 7, // Смещ.начала зелёного(сек)
  offsetEndGreen: 0, // Смещ.конца зелёного(сек)
  intensFl: 1200, // Интенсивность пост.потока(т.е./ч.)
  phases: [], // зелёные фазы для данного направления
  edited: false,
  opponent: "", // Левый поворот конкурирует с направлением...
};

const MapWindPK = (props: {
  close: Function; // функция возврата в родительский компонент
  route: any;
}) => {
  console.log("MapWindPK:", props.route);
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
  //console.log('massplan:', massplan, massSpis);
  //const dispatch = useDispatch();
  //===========================================================
  const [value, setValue] = React.useState(67);
  const [openGraf, setOpenGraf] = React.useState(false);

  //=== инициализация ======================================
  if (props.route) nameIn = ("00" + props.route.targetID).slice(-3);

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
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };
  //========================================================
  // const StrokaTablWindPK = (rec1: string, rec2: any) => {
  //   return (
  //     <Grid container sx={{ marginBottom: 0.5 }}>
  //       <Grid item xs={8} sx={{ border: 0 }}>
  //         {rec1}
  //       </Grid>
  //       <Grid item xs sx={{ border: 0 }}>
  //         <b>{rec2}</b>
  //       </Grid>
  //     </Grid>
  //   );
  // };

  const ClickBlok = (idx: number) => {
    IDX = idx;
    setOpenGraf(true);
  };

  const ContentTabl = (idx: number) => {
    return (
      <Box sx={styleWindPK01}>
        <Box sx={styleWindPK90(705)}>
          <Box sx={{ height: 133, fontSize: 12.9 }}>
            Здесь может быть картинка перекрёстка с направлением{" "}
            {nameIn + (idx + 1)}
          </Box>
          <b>Свойства направления</b>
          <Box sx={styleWindPK02}>
            <Box
              onClick={() => ClickBlok(idx)}
              sx={{ marginBottom: 0.5, height: 155 }}
            >
              Здесь будет график направления {nameIn + (idx + 1)}
            </Box>
          </Box>
          <Box sx={styleWindPK02}>
            <Box sx={{ marginBottom: 0.5 }}>
              {StrokaTablWindPK("Номер", massForm.name)}
              {StrokaTablWindPK("Насыщение", massForm.satur)}
              {StrokaTablWindPK("Интенсивность", massForm.intensTr)}
              {StrokaTablWindPK("Дисперсия пачки", massForm.dispers)}
              {StrokaTablWindPK("Длина перегона", massForm.peregon)}
              {StrokaTablWindPK("Вес остановки", massForm.wtStop)}
              {StrokaTablWindPK("Вес задержки", massForm.wtDelay)}
              {StrokaTablWindPK(
                "Смещ-е нач.зелёного",
                massForm.offsetBeginGreen
              )}
              {StrokaTablWindPK("Смещ-е кон.зелёного", massForm.offsetEndGreen)}
              {StrokaTablWindPK("Интенс-ть пост.потока", massForm.intensFl)}
              {StrokaTablWindPK("Т остановки", 0)}
              {StrokaTablWindPK("Т задержки", 0.433)}
              {StrokaTablWindPK("Тсл.+перегр.", 0.473)}
            </Box>
          </Box>

          <Box sx={styleWindPK02}>
            Насыщенность зелёного = <b>{value}</b>%
            <Box sx={{ width: 200 }}>
              <Slider
                value={value}
                onChange={handleSliderChange}
                color="secondary"
                disabled={true}
              />
            </Box>
            <Grid container sx={{ height: window.innerHeight * 0.024 }}>
              <Grid item xs={3} sx={{ bgcolor: "#C2ECAE" }}></Grid>
              <Grid item xs={3} sx={{ bgcolor: "#9DDB59" }}></Grid>
              <Grid item xs={3} sx={{ bgcolor: "#69A824" }}></Grid>
              <Grid item xs={3} sx={{ bgcolor: "#477218" }}></Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    );
  };

  const SpisDirections = (sum: number) => {
    let resStr = [];
    for (let i = 0; i < sum; i++) {
      massForm.name = nameIn + (i + 1).toString();
      resStr.push(
        <Grid key={i} item xs={12 / sum} sx={{ border: 0 }}>
          <Box>{ContentTabl(i)}</Box>
        </Grid>
      );
    }
    resStr.push(
      <Button key={-1} sx={styleWindPKEnd} onClick={() => CloseEnd()}>
        <b>&#10006;</b>
      </Button>
    );
    return resStr;
  };

  const ContentInfo = () => {
    return (
      <Box sx={styleWindPK01}>
        <Box sx={styleWindPK90(100)}>
          <b>Общая информация</b>
          <Box sx={styleWindPK02}>
            <Box sx={{ marginBottom: 0.5 }}>Функция до 422.611</Box>
            <Box sx={{ marginBottom: 0.5 }}>Функция после 422.611</Box>
            <Box sx={{ marginBottom: 0.5 }}>Время расчёта 0.016 сек.</Box>
          </Box>
        </Box>
      </Box>
    );
  };

  const ViewGraf = (idx: number) => {
    const handleClose = () => {
      setOpenGraf(false);
    };

    const CloseEnd = (event: any, reason: string) => {
      if (reason === "escapeKeyDown") handleClose();
    };

    return (
      <Modal open={openGraf} onClose={CloseEnd} hideBackdrop={false}>
        <Box sx={stylePKForm01}>
          <Button sx={styleModalEndBind} onClick={() => handleClose()}>
            <b>&#10006;</b>
          </Button>
          <Box sx={styleWindPK04}>
            <b>График направления {nameIn + (idx + 1)}</b>
          </Box>
        </Box>
      </Modal>
    );
  };

  return (
    <>
      {props.route ? (
        <Box sx={styleWindPK00(KolIn)}>
          <Grid container sx={{ marginBottom: 0.5 }}>
            {SpisDirections(KolIn)}
          </Grid>
        </Box>
      ) : (
        <Box sx={styleWindPK00(1)}>{ContentInfo()}</Box>
      )}
      {openGraf && <>{ViewGraf(IDX)} </>}
    </>
  );
};

export default MapWindPK;
