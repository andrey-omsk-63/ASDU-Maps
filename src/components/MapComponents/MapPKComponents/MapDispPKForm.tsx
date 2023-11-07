import * as React from 'react';

import MapPointDataError from './../MapPointDataError';
import MapFormPK01 from './MapFormPK01';
import MapFormPK02 from './MapFormPK02';
import MapFormPK03 from './MapFormPK03';

import { FORM } from '../../MainMapGl';

// import { MakeStylSpisPK06 } from "../../MainMapStyle";

const MapDispPKForm = (props: { setOpen: any }) => {
  
  
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
 

  return (
    <>
      {FORM === '1' && <MapFormPK01 view={true} handleClose={props.setOpen} />}
      {FORM === '2' && <MapFormPK02 view={true} handleClose={props.setOpen} />}
      {FORM === '3' && <MapFormPK03 view={true} handleClose={props.setOpen} />}
      {Number(FORM) > 3 && (
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
