import * as React from "react";

import MapPointDataError from "../MapPointDataError";
//import MapOptimCalc from "./MapOptimCalc";
//import MapStabilCalc from "./MapStabilCalc";
// import MapFormPK03 from './MapFormPK03';
// import MapFormPK04 from './MapFormPK04';
// import MapFormPK05 from './MapFormPK05';

import { OPTIM } from "../../MainMapGl";

// import { MakeStylSpisPK06 } from "../../MainMapStyle";

const MapDispOptim = (props: { setOpen: any }) => {
  let soob = "Здесь будет оптимизация ПК относительно ";
  switch (OPTIM) {
    case "1": //
      soob += "начального сдвига фаз";
      break;
    case "2": //
      soob += "длительности фаз";
  }

  return (
    <>
      {/* {CALC === '1' && <MapOptimCalc view={true} handleClose={props.setOpen} />}
      {CALC === '2' && <MapStabilCalc view={true} handleClose={props.setOpen} />} */}
      {Number(OPTIM) > 0 && (
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

export default MapDispOptim;
