import * as React from 'react';

import MapPointDataError from './../MapPointDataError';
import MapFormPK01 from './MapFormPK01';

import { FORM } from '../../MainMapGl';

// import { MakeStylSpisPK06 } from "../../MainMapStyle";

const MapDispPKForm = (props: { setOpen: any }) => {
  //== Piece of Redux =======================================
  // const map = useSelector((state: any) => {
  //   const { mapReducer } = state;
  //   return mapReducer.map;
  // });
  // let massroute = useSelector((state: any) => {
  //   const { massrouteReducer } = state;
  //   return massrouteReducer.massroute;
  // });
  // let massplan = useSelector((state: any) => {
  //   const { massplanReducer } = state;
  //   return massplanReducer.massplan;
  // });
  //console.log("massplan:", massplan);
  //=== инициализация ======================================
  let soob = 'Здесь будет запуск формы ';
  switch (FORM) {
    case '1': // Данные о перекрёстках
      soob += 'Данные о перекрёстках';
      break;
    case '2': // Начальные параметры перекрёстков
      soob += 'Начальные параметры перекрёстков';
      break;
    case '3': // Выходные данные по направлениям
      soob += 'Выходные данные по направлениям';
      break;
    case '4': // Начальные параметры направлений
      soob += 'Начальные параметры направлений';
  }
  //========================================================

  return (
    <>
      {FORM === '1' && <MapFormPK01 view={true} handleClose={props.setOpen} />}
      {Number(FORM) > 1 && (
        <MapPointDataError
          sErr={soob}
          setOpen={props.setOpen}
          fromCross={0}
          toCross={0}
          update={0}
          svg={{}}
          setSvg={{}}
        />
      )}
    </>
  );
};

export default MapDispPKForm;
