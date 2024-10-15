import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { massrouteCreate } from "./../../redux/actions";

import { DecodingCoord } from "./../MapServiceFunctions";

import { SendSocketCreateWay } from "./../MapSocketFunctions";
import { SendSocketCreateWayFromPoint } from "./../MapSocketFunctions";
import { SendSocketCreateWayToPoint } from "./../MapSocketFunctions";
import { SendSocketDeleteWayFromPoint } from "./../MapSocketFunctions";
import { SendSocketDeleteWayToPoint } from "./../MapSocketFunctions";
import { SendSocketDeleteWay } from "./../MapSocketFunctions";

const CalculatNullWays = (props: { ymaps: any; mapp: any; func: Function }) => {
  //== Piece of Redux ======================================
  let massroute = useSelector((state: any) => {
    const { massrouteReducer } = state;
    return massrouteReducer.massroute;
  });
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  const dispatch = useDispatch();
  const WS = datestat.ws;
  //========================================================

  let have = 0;
  let Have = 0;
  for (let i = 0; i < massroute.ways.length; i++) {
    if (!massroute.ways[i].lenght || !massroute.ways[i].time) {
      let rec = massroute.ways[i];
      have++;
      let pAa = DecodingCoord(rec.starts);
      let pBb = DecodingCoord(rec.stops);
      if (props.ymaps) {
        const multiRoute = new props.ymaps.multiRouter.MultiRoute(
          { referencePoints: [pAa, pBb] },
          {
            routeActiveStrokeWidth: 0,
            //routeActiveStrokeColor: "#FA032F",
            wayPointVisible: false,
          }
        );
        let activeRoute: any = null;
        props.mapp.current.geoObjects.add(multiRoute); // основная связь
        multiRoute.model.events.add("requestsuccess", function () {
          activeRoute = multiRoute.getActiveRoute();
          if (activeRoute) {
            let reqRoute: any = {
              dlRoute: 0,
              tmRoute: 0,
            };
            let massBind = [rec.lsource, rec.ltarget];
            let dist = activeRoute.properties.get("distance").value;
            rec.lenght = reqRoute.dlRoute = Math.round(dist); // длина связи
            let duration = activeRoute.properties.get("duration").value;
            rec.time = reqRoute.tmRoute = Math.round(duration); // время прохождения

            if (!rec.sourceArea) {
              SendSocketDeleteWayFromPoint(WS, pAa, pBb);
              SendSocketCreateWayFromPoint(WS, pAa, pBb, massBind, reqRoute);
            } else {
              if (!rec.targetArea) {
                SendSocketDeleteWayToPoint(WS, pAa, pBb);
                SendSocketCreateWayToPoint(WS, pAa, pBb, massBind, reqRoute);
              } else {
                SendSocketDeleteWay(WS, pAa, pBb);
                SendSocketCreateWay(WS, pAa, pBb, massBind, reqRoute);
                // console.log(
                //   "Обновлена связь:",
                //   i,
                //   rec.sourceID,
                //   rec.targetID,
                //   reqRoute
                // );
              }
            }
            Have++;
          }
        });
      }
      //console.log("###:", i, pAa, pBb);
    }
  }

  if (have) {
    const ReadyRoute = () => {
      if (have === Have) {
        dispatch(massrouteCreate(massroute));
        props.func(false);
        console.log("Готово:", have, Have);
      } else {
        setTimeout(() => {
          ReadyRoute();
        }, 500);
      }
    };
    ReadyRoute();
  }
  return <></>; // костыль
};

export default CalculatNullWays;
