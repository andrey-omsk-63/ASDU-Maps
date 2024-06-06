//import * as React from "react";
//import { useSelector } from "react-redux";

// import Grid from "@mui/material/Grid";
// import Button from "@mui/material/Button";
// import Box from "@mui/material/Box";
// import TextField from "@mui/material/TextField";
// import MenuItem from "@mui/material/MenuItem";
// import Modal from "@mui/material/Modal";
// import Typography from "@mui/material/Typography";

import "./MainMapStyle.css";

import { DecodingCoord } from "./MapServiceFunctions";

import { BALLOON, PLANER, VIEWDIR } from "./MainMapGl";

let CONT = "";

//=== addRoute =====================================
export const getMassPolyRouteOptions1 = (
  ymaps: any,
  route: any,
  InfoRoute: Function,
  RunReBing: Function
) => {
  let balloonLayout = ymaps.templateLayoutFactory.createClass(CONT, {
    build: function () {
      this.constructor.superclass.build.call(this);
      this._$element = $(".my-balloon", this.getParentElement());
      this._$element
        .find(".exit")
        .on("click", $.proxy(this.onCloseClick, this));
      this._$element
        .find(".goto1")
        .on("click", $.proxy(this.onGoTo1Click, this));
      this._$element
        .find(".goto2")
        .on("click", $.proxy(this.onGoTo2Click, this));
    },
    onCloseClick: function (e: any) {
      e.preventDefault();
      InfoRoute(null);
      this.events.fire("userclose");
    },
    onGoTo1Click: function (e: any) {
      e.preventDefault();
      InfoRoute(route);
    },
    onGoTo2Click: function (e: any) {
      e.preventDefault();
      InfoRoute(null);
      RunReBing(route);
      this.events.fire("userclose");
    },
  });

  return {
    balloonLayout: BALLOON ? balloonLayout : "",
    balloonPanelMaxMapArea: 0,
    strokeColor: "#1A9165", // зелёный
    strokeWidth: 3,
  };
};

export const getMassPolyRouteOptions2 = (
  ymaps: any,
  route: any,
  InfoRoute: Function,
  RunReBing: Function
) => {
  let balloonLayout = ymaps.templateLayoutFactory.createClass(CONT, {
    build: function () {
      this.constructor.superclass.build.call(this);
      this._$element = $(".my-balloon", this.getParentElement());
      this._$element
        .find(".exit")
        .on("click", $.proxy(this.onCloseClick, this));
      this._$element
        .find(".goto1")
        .on("click", $.proxy(this.onGoTo1Click, this));
      this._$element
        .find(".goto2")
        .on("click", $.proxy(this.onGoTo2Click, this));
    },
    onCloseClick: function (e: any) {
      e.preventDefault();
      InfoRoute(null);
      this.events.fire("userclose");
    },
    onGoTo1Click: function (e: any) {
      e.preventDefault();
      InfoRoute(route);
    },
    onGoTo2Click: function (e: any) {
      e.preventDefault();
      InfoRoute(null);
      RunReBing(route);
      this.events.fire("userclose");
    },
  });

  return {
    balloonLayout: BALLOON ? balloonLayout : "",
    balloonPanelMaxMapArea: 0,
    strokeColor: "#9F61F1", // сиреневый
    strokeWidth: 3,
  };
};

export const getMassMultiRouteOptions = () => {
  return {
    balloonCloseButton: false,
    routeStrokeStyle: "dot",
    strokeColor: "#1A9165", // зелёный
    routeActiveStrokeWidth: 2,
    routeStrokeWidth: 0,
    wayPointVisible: false,
  };
};

export const getMassMultiRouteInOptions = () => {
  return {
    routeActiveStrokeWidth: 2,
    routeStrokeStyle: "dot",
    routeActiveStrokeColor: "#E91427", // красный
    routeStrokeWidth: 0,
    wayPointVisible: false,
  };
};

const NameVertex = (area: number, id: number, massroute: any) => {
  let name = "";
  for (let i = 0; i < massroute.vertexes.length; i++) {
    if (massroute.vertexes[i].area === area && massroute.vertexes[i].id === id)
      name = massroute.vertexes[i].name;
  }
  return name;
};

const MakeCONT = (massRoute: any, massroute: any) => {
  let cont1 = massRoute.sourceArea ? "перекрёстка " : "объекта ";
  let cont2 = massRoute.targetArea ? "перекрёстком " : "объектом ";
  let cont =
    "Связь " +
    cont1 +
    "[" +
    massRoute.sourceArea +
    "," +
    massRoute.sourceID +
    "]<br/><b>";
  cont += NameVertex(massRoute.sourceArea, massRoute.sourceID, massroute);
  cont +=
    "</b><br /> c " +
    cont2 +
    "[" +
    massRoute.targetArea +
    "," +
    massRoute.targetID +
    "]<br/><b>";
  cont +=
    NameVertex(massRoute.targetArea, massRoute.targetID, massroute) + "</b>";
  CONT =
    "<div class='my-balloon'>" +
    '<a class="exit" href="#"><b>&#10006;</b></a>' +
    cont;
  //PLANER - номер выбраного ПК
  //VIEWDIR - разрешение посмотра инф-ии о направл.в балунt
  //console.log('###:',VIEWDIR)
  if (PLANER > 0 && VIEWDIR) {
    CONT +=
      "<div class='go-over'>" +
      '<a class="goto1" href="#"><b>Информация о направлениях</b></a></div>';
  }
  CONT +=
    "<div class='go-over'>" +
    '<a class="goto2" href="#"><b>Изменение привязки направлений</b></a></div>' +
    "</div>";
};

const MakeHint = (i: number, massRoute: any) => {
  let hint = "Связь между ";
  if (massRoute[i].sourceArea && massRoute[i].targetArea) {
    hint += "перекрёстками";
  } else {
    if (massRoute[i].sourceArea) {
      hint += "перекрёстком и объекатом";
    } else hint += "объекатом и перекрёстком";
  }
  hint +=
    "<br/>[" + massRoute[i].sourceArea + "," + massRoute[i].sourceID + "] и [";
  hint += massRoute[i].targetArea + "," + massRoute[i].targetID + "]";
  return hint;
};

export const MakePolyRoute = (
  ymaps: any,
  mapp: any,
  massRoute: any,
  massroute: any,
  InfoRoute: Function, // информация о связи
  RunReBing: Function // перезапуск превязки
) => {
  let massPolyRoute1: any = []; // cеть формальных связей
  let massPolyRoute2: any = []; // cеть формальных связей
  let massCoord1 = [];
  let massRoute1 = [];
  let massCoord2 = [];
  let massRoute2 = [];
  for (let i = 0; i < massRoute.length; i++) {
    let aa = [
      DecodingCoord(massRoute[i].starts),
      DecodingCoord(massRoute[i].stops),
    ];
    let shift = aa[0][0] > aa[1][0] ? 0.0002 : -0.0002;
    let bb = [
      [aa[0][0] + shift, aa[0][1]],
      [aa[1][0] + shift, aa[1][1]],
    ];
    if (shift > 0) {
      massCoord1.push(bb);
      massRoute1.push(massRoute[i]);
    } else {
      massCoord2.push(bb);
      massRoute2.push(massRoute[i]);
    }
  }

  for (let i = 0; i < massCoord1.length; i++) {
    MakeCONT(massRoute1[i], massroute);
    massPolyRoute1[i] = new ymaps.Polyline(
      [massCoord1[i][0], massCoord1[i][1]],
      { hintContent: MakeHint(i, massRoute1) },
      getMassPolyRouteOptions1(ymaps, massRoute1[i], InfoRoute, RunReBing)
    );
    mapp.current.geoObjects.add(massPolyRoute1[i]);
    //massPolyRoute1[i].options.set('boundsAutoApply', true);
  }

  for (let i = 0; i < massCoord2.length; i++) {
    MakeCONT(massRoute2[i], massroute);
    massPolyRoute2[i] = new ymaps.Polyline(
      [massCoord2[i][0], massCoord2[i][1]],
      { hintContent: MakeHint(i, massRoute2) },
      getMassPolyRouteOptions2(ymaps, massRoute2[i], InfoRoute, RunReBing)
    );
    mapp.current.geoObjects.add(massPolyRoute2[i]);
  }
  return;
};

export const MakeMainRoute = (
  ymaps: any,
  mapp: any,
  pointAa: any,
  pointBb: any
) => {
  let reqRoute: any = {
    dlRoute: 0,
    tmRoute: 0,
  };
  const multiRoute = new ymaps.multiRouter.MultiRoute(
    getReferencePoints(pointAa, pointBb),
    getMultiRouteOptions()
  );
  let activeRoute = null;
  mapp.current.geoObjects.add(multiRoute); // основная связь
  multiRoute.model.events.add("requestsuccess", function () {
    activeRoute = multiRoute.getActiveRoute();
    if (activeRoute) {
      let dist = activeRoute.properties.get("distance").value;
      reqRoute.dlRoute = Math.round(dist);
      let duration = activeRoute.properties.get("duration").value;
      reqRoute.tmRoute = Math.round(duration);
    }
  });
  return [activeRoute, reqRoute];
};

const getReferencePoints = (pointA: any, pointB: any) => {
  return {
    referencePoints: [pointA, pointB],
  };
};

const getMultiRouteOptions = () => {
  return {
    routeActiveStrokeWidth: 5,
    //routeActiveStrokeColor: "#224E1F",
    routeStrokeWidth: 1.5,
    wayPointVisible: false,
  };
};

export const MakeMultiRouteIn = (
  ymaps: any,
  mapp: any,
  coordStartIn: any,
  coordStopIn: any
) => {
  let massMultiRouteIn: any = []; // входящие связи
  for (let i = 0; i < coordStartIn.length; i++) {
    massMultiRouteIn[i] = new ymaps.multiRouter.MultiRoute(
      getReferencePoints(coordStartIn[i], coordStopIn[i]),
      getMassMultiRouteInOptions()
    );
    mapp.current.geoObjects.add(massMultiRouteIn[i]);
  }
};

export const MakeMultiRoute = (
  ymaps: any,
  mapp: any,
  coordStart: any,
  coordStop: any
) => {
  let massMultiRoute: any = []; // исходящие связи
  for (let i = 0; i < coordStart.length; i++) {
    massMultiRoute[i] = new ymaps.multiRouter.MultiRoute(
      getReferencePoints(coordStart[i], coordStop[i]),
      getMassMultiRouteOptions()
    );
    mapp.current.geoObjects.add(massMultiRoute[i]);
  }
};
