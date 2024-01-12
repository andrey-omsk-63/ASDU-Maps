import * as React from "react";

import MapPointDataError from "../MapPointDataError";
import MapOptimCalc from "./MapOptimCalc";
import MapStabilCalc from "./MapStabilCalc";
// import MapFormPK03 from './MapFormPK03';
// import MapFormPK04 from './MapFormPK04';
// import MapFormPK05 from './MapFormPK05';

import { CALC } from "../../MainMapGl";

// import { MakeStylSpisPK06 } from "../../MainMapStyle";

const MapDispCalc = (props: { setOpen: any }) => {
  let soob = "Здесь будет запуск формы ";
  switch (CALC) {
    case "1": // Оптимальное время цикла
      soob += "Оптимальное время цикла";
      break;
    case "2": // Устойчивость программы координации
      soob += "Устойчивость программы координации";
      break;
    case "3": // Выходные данные по направлениям
      soob += "!!!ещё какая-то херня №3";
      break;
    case "4": // Начальные параметры направлений
      soob += "!!!ещё какая-то херня №4";
  }

  return (
    <>
      {CALC === '1' && <MapOptimCalc view={true} handleClose={props.setOpen} />}
      {CALC === '2' && <MapStabilCalc view={true} handleClose={props.setOpen} />}
      {Number(CALC) > 2 && (
        <MapPointDataError
          sErr={soob}
          setOpen={props.setOpen}
          fromCross={0}
          toCross={0}
          update={0}
          setSvg={{}}
        />
      )}
    </>
  );
};

export default MapDispCalc;
