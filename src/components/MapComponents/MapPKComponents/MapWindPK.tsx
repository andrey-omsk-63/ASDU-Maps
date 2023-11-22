import * as React from "react";
//import { useSelector, useDispatch } from "react-redux";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

import { styleWindPK00, styleWindPK01 } from "../../MainMapStyle";
import { styleWindPK02, styleWindPK03 } from "../../MainMapStyle";

const MapWindPK = () => {
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
  //const [openSetErr, setOpenSetErr] = React.useState(false);
  //const [trigger, setTrigger] = React.useState(false);
  //const [view, setView] = React.useState(false);

  //=== инициализация ======================================

  //========================================================
  // const CloseEnd = React.useCallback(() => {
  //   props.setOpen(false); // полный выход
  // }, [props]);

  // const CloseEnd = React.useCallback(() => {
  //   datestat.needMenuForm = false; //  не выдавать меню форм
  //   dispatch(statsaveCreate(datestat));
  //   props.setOpen(false); // полный выход
  // }, [datestat, dispatch, props]);

  // const handleCloseBad = React.useCallback(() => {
  //   CloseEnd(); // выход без сохранения
  // }, [CloseEnd]);

  // const handleCloseBadExit = (mode: boolean) => {
  //   //setBadExit(false);
  //   mode && CloseEnd(); // выход без сохранения
  // };
  //=== Функции - обработчики ==============================

  //========================================================
  const StrokaTabl = (rec1: string, rec2: any) => {
    return (
      <Grid container sx={{ marginBottom: 0.5 }}>
        <Grid item xs={9} sx={{ border: 0 }}>
          {rec1}
        </Grid>
        <Grid item xs sx={{ border: 0 }}>
          {rec2}
        </Grid>
      </Grid>
    );
  };

  function valuetext(value: number) {
    return `${value}°C`;
  }

  return (
    <Box sx={styleWindPK00}>
      <Box sx={styleWindPK01}>
        <b>Общая информация</b>
        <Box sx={styleWindPK02}>
          <Box sx={{ marginBottom: 0.5 }}>Функция до 422.611</Box>
          <Box sx={{ marginBottom: 0.5 }}>Функция после 422.611</Box>
          <Box sx={{ marginBottom: 0.5 }}>Время расчёта 0.016 сек.</Box>
        </Box>

        <b>Свойства направления</b>
        <Box sx={styleWindPK02}>
          <Box sx={{ marginBottom: 0.5, height: window.innerHeight * 0.2 }}>
            Здесь будет график
          </Box>
        </Box>

        <Box sx={styleWindPK02}>
          <Box sx={{ marginBottom: 0.5, padding: "5px 0px 5px" }}>
            {StrokaTabl("Номер", 43)}
            {StrokaTabl("Насыщение", 3600)}
            {StrokaTabl("Интенсивность", 900)}
            {StrokaTabl("Дисперсия пачки", 50)}
            {StrokaTabl("Длина перегона", 248)}
            {StrokaTabl("Вес остановки", 1)}
            {StrokaTabl("Вес задержки", 1)}
            {StrokaTabl("Смещ-е нач.зелёного", 7)}
            {StrokaTabl("Смещ-е кон.зелёного", 0)}
            {StrokaTabl("Интенс-ть пост.потока", 500)}
            {StrokaTabl("Т остановки", 0)}
            {StrokaTabl("Т задержки", 0.433)}
            {StrokaTabl("Тсл.+перегр.", 0.473)}
          </Box>
        </Box>

        <Box sx={styleWindPK02}>
          <Box sx={styleWindPK03}>
            <b>Насыщенность зелёного = 67%</b>
            <Box sx={{ width: 200 }}>
              <Slider
                aria-label="Temperature"
                defaultValue={30}
                getAriaValueText={valuetext}
                color="secondary"
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MapWindPK;
