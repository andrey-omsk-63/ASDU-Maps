import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { massdkCreate, massrouteCreate } from "./../redux/actions";
import { coordinatesCreate, massrouteproCreate } from "./../redux/actions";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { YMaps, Map, Placemark, YMapsApi } from "react-yandex-maps";

import MapRouteInfo from "./MapComponents/MapRouteInfo";
import MapChangeAdress from "./MapComponents/MapChangeAdress";
import MapPointDataError from "./MapComponents/MapPointDataError";
import MapRouteBind from "./MapComponents/MapRouteBind";
import MapCreatePointVertex from "./MapComponents/MapCreatePointVertex";
import MapRouteProtokol from "./MapComponents/MapRouteProtokol";
import MapReversRoute from "./MapComponents/MapReversRoute";
import MapVertexForma from "./MapComponents/MapVertexForma";
import MapWaysForma from "./MapComponents/MapWaysForma";

import { RecordMassRoute, MakeNewPointContent } from "./MapServiceFunctions";
import { YandexServices, ShowFormalRoute } from "./MapServiceFunctions";
import { DecodingCoord, CodingCoord, InputMenu } from "./MapServiceFunctions";
import { getMultiRouteOptions, DoublRoute } from "./MapServiceFunctions";
import { getReferencePoints, CenterCoordBegin } from "./MapServiceFunctions";
import { getMassPolyRouteOptions, DelOrCreate } from "./MapServiceFunctions";
import { getMassMultiRouteOptions, MakeToCross } from "./MapServiceFunctions";
import { getMassMultiRouteInOptions, MakeRevers } from "./MapServiceFunctions";
import { getPointData, getPointOptions } from "./MapServiceFunctions";
import { СontentModalPressBalloon, MakeFromCross } from "./MapServiceFunctions";
import { ChangeCrossFunc, PreparCurrencies } from "./MapServiceFunctions";
import { RecevKeySvg, StrokaMenuGlob, MasskPoint } from "./MapServiceFunctions";
import { DelVertexOrPoint, MenuProcesRoute } from "./MapServiceFunctions";
import { DelPointVertexContent, MassCoord } from "./MapServiceFunctions";
import { FillMassRouteContent } from "./MapServiceFunctions";
import { PreparCurrenciesMode } from "./MapServiceFunctions";

import { SendSocketCreateWay, SendSocketGetSvg } from "./MapSocketFunctions";
import { SendSocketCreateWayFromPoint } from "./MapSocketFunctions";
import { SendSocketCreateWayToPoint } from "./MapSocketFunctions";

import { styleSetPoint } from "./MainMapStyle";

let coordStart: any = []; // рабочий массив коллекции входящих связей
let coordStop: any = []; // рабочий массив коллекции входящих связей
let coordStartIn: any = []; // рабочий массив коллекции исходящих связей
let coordStopIn: any = []; // рабочий массив коллекции исходящих связей
let massRoute: any = []; // рабочий массив сети связей
let masSvg: any = ["", ""];

let debugging: boolean, flagOpen: boolean, flagBind: boolean;
let flagRevers: boolean, needLinkBind: boolean, FlagDemo: boolean;
debugging = flagOpen = flagBind = flagRevers = needLinkBind = FlagDemo = false;
let newPointCoord: any, homeRegion: any, pointCenter: any;
newPointCoord = homeRegion = pointCenter = 0;

let activeRoute: any = null;
let soobError = "";
let oldsErr = "";
let zoom = 10;
let indexPoint: number = -1;
let reqRoute: any = {
  dlRoute: 0,
  tmRoute: 0,
};

let pointAa: any = 0;
let pointAaIndex: number = -1;
let fromCross: any = {
  pointAaRegin: "",
  pointAaArea: "",
  pointAaID: 0,
  pointAcod: "",
};
let pointBb: any = 0;
let pointBbIndex: number = -1;
let toCross: any = {
  pointBbRegin: "",
  pointBbArea: "",
  pointBbID: 0,
  pointBcod: "",
};

let funcContex: any = null;
let funcBound: any = null;
let currencies: any = [];
let currenciesMode: any = [];
let AREA = "0";
let MODE = "0";
let idxDel = -1;

const MainMap = (props: {
  ws: WebSocket;
  region: any;
  sErr: string;
  svg: any;
  setSvg: any;
  trigger: boolean;
}) => {
  const WS = props.ws;
  if (WS.url === "wss://localhost:3000/W") debugging = true;
  //== Piece of Redux =======================================
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  //console.log("massdk:", massdk);
  let massroute = useSelector((state: any) => {
    const { massrouteReducer } = state;
    return massrouteReducer.massroute;
  });
  //console.log("massroute:", massroute);
  let massroutepro = useSelector((state: any) => {
    const { massrouteproReducer } = state;
    return massrouteproReducer.massroutepro;
  });
  let coordinates = useSelector((state: any) => {
    const { coordinatesReducer } = state;
    return coordinatesReducer.coordinates;
  });
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map;
  });
  //console.log("map:", map);
  const dispatch = useDispatch();
  //===========================================================
  const [currency, setCurrency] = React.useState("0");
  const [currencyMode, setCurrencyMode] = React.useState("0");
  const [openSetInf, setOpenSetInf] = React.useState(false);
  const [openSetPro, setOpenSetPro] = React.useState(false);
  const [openSetVertForm, setOpenSetVertForm] = React.useState(false);
  const [openSetWaysForm, setOpenSetWaysForm] = React.useState(false);
  const [openSetEr, setOpenSetEr] = React.useState(false);
  const [openSetBind, setOpenSetBind] = React.useState(false);
  const [flagDemo, setFlagDemo] = React.useState(false);
  const [flagPro, setFlagPro] = React.useState(false);
  const [flagPusk, setFlagPusk] = React.useState(false);
  const [flagRoute, setFlagRoute] = React.useState(false);
  const [revers, setRevers] = React.useState(false);
  const [openSet, setOpenSet] = React.useState(false);
  const [openSetCreate, setOpenSetCreate] = React.useState(false);
  const [openSetDelete, setOpenSetDelete] = React.useState(false);
  const [openSetAdress, setOpenSetAdress] = React.useState(false);
  const [openSetRevers, setOpenSetRevers] = React.useState(false);
  const [makeRevers, setMakeRevers] = React.useState(false);
  const [needRevers, setNeedRevers] = React.useState(0);
  const [ymaps, setYmaps] = React.useState<YMapsApi | null>(null);
  const mapp = React.useRef<any>(null);
  const MyYandexKey = "65162f5f-2d15-41d1-a881-6c1acf34cfa1";

  const DelCollectionRoutes = () => {
    coordStart = [];
    coordStop = [];
    coordStartIn = [];
    coordStopIn = [];
  };

  const ZeroRoute = (mode: boolean) => {
    pointAa = pointBb = 0;
    pointAaIndex = pointBbIndex = -1;
    DelCollectionRoutes();
    flagBind = false;
    setFlagRoute(false);
    setFlagPusk(mode);
    ymaps && addRoute(ymaps); // перерисовка связей
  };

  const SoobOpenSetEr = (soob: string) => {
    soobError = soob;
    setOpenSetEr(true);
  };

  const FillMassRoute = () => {
    massRoute = [];
    massRoute = FillMassRouteContent(AREA, FlagDemo, massroute);
  };

  const MakeRecordMassRoute = (mode: boolean, mass: any) => {
    let aRou = reqRoute;
    fromCross.pointAcod = CodingCoord(pointAa);
    toCross.pointBcod = CodingCoord(pointBb);
    if (DoublRoute(massroute.ways, pointAa, pointBb)) {
      SoobOpenSetEr("Дубликатная связь");
    } else {
      let mask = RecordMassRoute(fromCross, toCross, mass, aRou);
      massroute.ways.push(mask);
      massroutepro.ways.push(mask);
      dispatch(massrouteCreate(massroute));
      dispatch(massrouteproCreate(massroutepro));
      if (massroute.vertexes[pointAaIndex].area === 0) {
        SendSocketCreateWayFromPoint(WS, fromCross, toCross, mass, aRou);
      } else {
        if (massroute.vertexes[pointBbIndex].area === 0) {
          SendSocketCreateWayToPoint(WS, fromCross, toCross, mass, aRou);
        } else {
          SendSocketCreateWay(WS, fromCross, toCross, mass, aRou);
        }
      }
      setFlagPro(true); //включение протокола
    }
    if (flagRevers && needRevers !== 3) {
      setOpenSetRevers(true);
      flagRevers = false;
    } else {
      ZeroRoute(mode);
    }
    setNeedRevers(0);
    flagDemo && FillMassRoute();
    ymaps && addRoute(ymaps); // перерисовка связей
  };

  const MakeСollectionRoute = () => {
    DelCollectionRoutes();
    for (let i = 0; i < massroute.ways.length; i++) {
      if (massroute.ways[i].starts === CodingCoord(pointAa)) {
        coordStop.push(DecodingCoord(massroute.ways[i].stops)); // исходящие связи
        coordStart.push(pointAa);
      }
      if (massroute.ways[i].stops === CodingCoord(pointAa)) {
        coordStartIn.push(DecodingCoord(massroute.ways[i].starts)); // входящие связи
        coordStopIn.push(pointAa);
      }
    }
    flagDemo && FillMassRoute();
    ymaps && addRoute(ymaps); // перерисовка связей
  };

  const ReversRoute = () => {
    let noDoublRoute = true;
    let pa = pointAa;
    pointAa = pointBb;
    pointBb = pa;
    pa = pointAaIndex;
    pointAaIndex = pointBbIndex;
    pointBbIndex = pa;
    ChangeCrossFunc(fromCross, toCross); // поменялось внутри func через ссылки React
    if (DoublRoute(massroute.ways, pointAa, pointBb)) {
      SoobOpenSetEr("Дубликатная связь");
      ZeroRoute(false);
      noDoublRoute = false;
    } else {
      MakeСollectionRoute();
      setRevers(!revers);
    }
    return noDoublRoute;
  };

  const LinkBind = () => {
    let arIn = massroute.vertexes[pointAaIndex].area;
    let idIn = massroute.vertexes[pointAaIndex].id;
    let arOn = massroute.vertexes[pointBbIndex].area;
    let idOn = massroute.vertexes[pointBbIndex].id;
    SendSocketGetSvg(WS, homeRegion, arIn, idIn, arOn, idOn);
    flagBind = true;
    setOpenSetBind(true);
  };

  const PressButton = (mode: number) => {
    switch (mode) {
      case 3: // режим включения Demo сети связей
        setFlagDemo(true);
        FlagDemo = true;
        FillMassRoute();
        ymaps && addRoute(ymaps); // перерисовка связей
        break;
      case 6: // режим отмены Demo сети связей
        setFlagDemo(false);
        FlagDemo = true;
        massRoute = [];
        ymaps && addRoute(ymaps); // перерисовка связей
        break;
      case 12: // реверс связи
        ReversRoute();
        break;
      case 24: // вывод протокола
        setOpenSetPro(true);
        break;
      case 33: // привязка направлений + сохранение связи
        LinkBind();
        flagRevers = true;
        break;
      case 35: // отказ от создания реверсной связи
        flagRevers = false;
        setMakeRevers(false);
        ZeroRoute(false);
        break;
      case 36: // реверс связи + привязка направлений + сохранение связи
        if (ReversRoute()) LinkBind();
        setMakeRevers(false);
        break;
      case 37: // реверс связи + редактирование
        if (ReversRoute()) {
          const ReadyRoute = () => {
            if (activeRoute) {
              needLinkBind = true;
              setOpenSetInf(true);
            } else {
              setTimeout(() => {
                ReadyRoute();
              }, 100);
            }
          };
          ReadyRoute();
        }
        setMakeRevers(false);
        setNeedRevers(3);
        break;
      case 69: // редактирование связи
        setOpenSetInf(true);
        setNeedRevers(0);
        break;
      case 77: // удаление связи / отмена назначений
        ZeroRoute(false);
        break;
      case 121: // выбор района
        FillMassRoute();
        ZeroRoute(false);
        flagDemo && ymaps && addRoute(ymaps); // перерисовка связей
        break;
      case 212: // выбор режима работы
        SetOpenSetVertForm(false);
        setOpenSetWaysForm(false)
        ZeroRoute(false);
    }
  };

  const addRoute = (ymaps: any) => {
    mapp.current.geoObjects.removeAll(); // удаление старой коллекции связей
    let massPolyRoute: any = []; // cеть связей
    for (let i = 0; i < massRoute.length; i++) {
      massPolyRoute[i] = new ymaps.Polyline(
        [DecodingCoord(massRoute[i].starts), DecodingCoord(massRoute[i].stops)],
        { balloonContent: "Ломаная линия" },
        getMassPolyRouteOptions()
      );
      mapp.current.geoObjects.add(massPolyRoute[i]);
    }
    let massMultiRoute: any = []; // исходящие связи
    for (let i = 0; i < coordStart.length; i++) {
      massMultiRoute[i] = new ymaps.multiRouter.MultiRoute(
        getReferencePoints(coordStart[i], coordStop[i]),
        getMassMultiRouteOptions()
      );
      mapp.current.geoObjects.add(massMultiRoute[i]);
    }
    let massMultiRouteIn: any = []; // входящие связи
    for (let i = 0; i < coordStartIn.length; i++) {
      massMultiRouteIn[i] = new ymaps.multiRouter.MultiRoute(
        getReferencePoints(coordStartIn[i], coordStopIn[i]),
        getMassMultiRouteInOptions()
      );
      mapp.current.geoObjects.add(massMultiRouteIn[i]);
    }
    const multiRoute = new ymaps.multiRouter.MultiRoute(
      getReferencePoints(pointAa, pointBb),
      getMultiRouteOptions()
    );
    activeRoute = null;
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
  };

  const SetReqRoute = (mode: any, need: boolean) => {
    reqRoute = JSON.parse(JSON.stringify(mode));
    need && LinkBind();
    needLinkBind = false;
  };

  const UpdateAddRoute = () => {
    ymaps && addRoute(ymaps); // перерисовка связей
  };

  const OnPlacemarkClickPoint = (index: number) => {
    if (pointAa === 0) {
      if (!massdk[index].area && MODE === "1") return;
      pointAaIndex = index; // начальная точка
      pointAa = [massdk[index].coordinates[0], massdk[index].coordinates[1]];
      fromCross = MakeFromCross(massdk[index]);
      MakeСollectionRoute();
      setFlagPusk(true);
      if (MODE === "1") setOpenSetVertForm(true);
    } else {
      let soob = "Связь между перекрёстками в разных районах создовать нельзя";
      if (MODE === "0") {
        if (pointBb === 0) {
          if (pointAaIndex === index) {
            SoobOpenSetEr("Начальная и конечная точки совпадают");
          } else {
            pointBbIndex = index; // конечная точка
            let areaAa = massroute.vertexes[pointAaIndex].area;
            let areaBb = massroute.vertexes[pointBbIndex].area;
            if (areaAa === 0 && areaBb === 0) {
              pointBbIndex = 0; // конечная точка
              SoobOpenSetEr("Связь между двумя точками создовать нельзя");
            } else {
              if (areaAa !== areaBb && areaAa !== 0 && areaBb !== 0) {
                pointBbIndex = 0; // конечная точка
                SoobOpenSetEr(soob);
              } else {
                pointBb = MassCoord(massdk[index]);
                toCross = MakeToCross(massdk[index]);
                if (DoublRoute(massroute.ways, pointAa, pointBb)) {
                  SoobOpenSetEr("Дубликатная связь");
                  ZeroRoute(false);
                } else {
                  setFlagRoute(true);
                  ymaps && addRoute(ymaps); // перерисовка связей
                }
              }
            }
          }
        } else {
          indexPoint = index;
          setOpenSet(true); // переход в меню работы с точками
        }
      }
    }
  };

  const ModalPressBalloon = () => {
    const [openSetErBall, setOpenSetErBall] = React.useState(false);
    let pointRoute: any = 0;
    let areaPoint = -1;
    if (indexPoint >= 0) areaPoint = massdk[indexPoint].area;
    if (indexPoint >= 0 && indexPoint < massdk.length)
      pointRoute = MassCoord(massdk[indexPoint]);

    const handleClose = (param: number) => {
      switch (param) {
        case 1: // Начальная точка
          if (pointBbIndex === indexPoint) {
            soobError = "Начальная и конечная точки совпадают";
            setOpenSetErBall(true);
          } else {
            pointAaIndex = indexPoint;
            pointAa = pointRoute;
            fromCross = MakeFromCross(massdk[pointAaIndex]);
            MakeСollectionRoute();
          }
          break;
        case 2: // Конечная точка
          if (pointAaIndex === indexPoint) {
            soobError = "Начальная и конечная точки совпадают";
            setOpenSetErBall(true);
          } else {
            if (
              massroute.vertexes[pointAaIndex].area === 0 &&
              massroute.vertexes[indexPoint].area === 0
            ) {
              SoobOpenSetEr("Связь между двумя точками создовать нельзя");
            } else {
              pointBbIndex = indexPoint;
              pointBb = pointRoute;
              toCross = MakeToCross(massdk[pointBbIndex]);
              if (DoublRoute(massroute.ways, pointAa, pointBb)) {
                SoobOpenSetEr("Дубликатная связь");
                ZeroRoute(false);
              }
              ymaps && addRoute(ymaps); // перерисовка связей
            }
          }
          break;
        case 4: // Редактирование адреса
          setOpenSetAdress(true);
      }
    };

    return (
      <Modal open={openSet} onClose={() => setOpenSet(false)} hideBackdrop>
        <Box sx={styleSetPoint}>
          {СontentModalPressBalloon(setOpenSet, handleClose, areaPoint)}
          {openSetAdress && (
            <MapChangeAdress
              ws={WS}
              iPoint={indexPoint}
              setOpen={setOpenSetAdress}
              zeroRoute={ZeroRoute}
              funcClose={setOpenSet}
            />
          )}
          {openSetErBall && (
            <MapPointDataError
              sErr={soobError}
              setOpen={setOpenSetErBall}
              ws={WS}
              fromCross={fromCross}
              toCross={toCross}
              update={UpdateAddRoute}
            />
          )}
        </Box>
      </Modal>
    );
  };

  const MakeNewPoint = (coords: any, avail: boolean) => {
    MakeNewPointContent(WS, coords, avail, homeRegion, massroute);
    coordinates.push(coords);
    dispatch(coordinatesCreate(coordinates));
    setOpenSetCreate(false);
  };

  const PlacemarkDo = () => {
    let pAaI = pointAaIndex;
    let pBbI = pointBbIndex;

    const DoPlacemarkDo = (props: { coordinate: any; idx: number }) => {
      const MemoPlacemarkDo = React.useMemo(
        () => (
          <Placemark
            key={props.idx}
            geometry={props.coordinate}
            properties={getPointData(props.idx, pAaI, pBbI, massdk, map)}
            options={getPointOptions(
              debugging,
              props.idx,
              AREA,
              MODE,
              map,
              pAaI,
              pBbI,
              massdk,
              massroute
            )}
            modules={["geoObject.addon.balloon", "geoObject.addon.hint"]}
            onClick={() => OnPlacemarkClickPoint(props.idx)}
          />
        ),
        [props.coordinate, props.idx]
      );
      return MemoPlacemarkDo;
    };

    return (
      <>
        {flagOpen &&
          coordinates.map((coordinate: any, idx: any) => (
            <DoPlacemarkDo key={idx} coordinate={coordinate} idx={idx} />
          ))}
      </>
    );
  };

  const handleCloseDel = (mode: boolean) => {
    if (mode) {
      let massRouteRab = DelPointVertexContent(WS, massroute, idxDel);
      massroute.ways.splice(0, massroute.ways.length); // massroute = [];
      massroute.ways = massRouteRab;
      if (flagDemo) massRoute = massroute.ways;
      DelCollectionRoutes(); // удаление колекции связей
      massdk.splice(idxDel, 1); // удаление самой точки/перекрёстка
      massroute.vertexes.splice(idxDel, 1);
      dispatch(massdkCreate(massdk));
      dispatch(massrouteCreate(massroute));
      coordinates.splice(idxDel, 1);
      dispatch(coordinatesCreate(coordinates));
      ymaps && addRoute(ymaps); // перерисовка связей
    }
    setOpenSetDelete(false);
  };

  const InstanceRefDo = (ref: React.Ref<any>) => {
    if (ref) {
      mapp.current = ref;
      mapp.current.events.remove("contextmenu", funcContex);
      funcContex = function (e: any) {
        if (mapp.current.hint) {
          newPointCoord = e.get("coords"); // нажата правая кнопка мыши
          idxDel = DelOrCreate(massdk, newPointCoord);
          if (MODE === "0") {
            idxDel >= 0 && setOpenSetDelete(true);
            idxDel < 0 && setOpenSetCreate(true);
          } else {
            idxDel >= 0 && setOpenSetWaysForm(true);
          }
        }
      };
      mapp.current.events.add("contextmenu", funcContex);
      mapp.current.events.remove("boundschange", funcBound);
      funcBound = function () {
        pointCenter = mapp.current.getCenter();
        zoom = mapp.current.getZoom(); // покрутили колёсико мыши
      };
      mapp.current.events.add("boundschange", funcBound);
    }
  };

  const handleChangeArea = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrency(event.target.value);
    AREA = event.target.value;
    PressButton(121);
  };

  const handleChangeMode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrencyMode(event.target.value);
    MODE = event.target.value;
    PressButton(212);
  };

  //=== инициализация ======================================
  if (!flagOpen && Object.keys(massroute).length) {
    if (props.region) homeRegion = props.region;
    if (!props.region && massroute.vertexes.length)
      homeRegion = massroute.vertexes[0].region;
    for (let i = 0; i < massroute.points.length; i++)
      massroute.vertexes.push(massroute.points[i]);
    for (let i = 0; i < massroute.vertexes.length; i++) {
      massdk.push(MasskPoint(massroute.vertexes[i]));
      coordinates.push(DecodingCoord(massroute.vertexes[i].dgis));
    }
    dispatch(massdkCreate(massdk));
    dispatch(massrouteCreate(massroute));
    dispatch(coordinatesCreate(coordinates));
    pointCenter = CenterCoordBegin(map);
    let homeReg = map.dateMap.regionInfo[homeRegion]; // подготовка ввода района
    currencies = PreparCurrencies(map.dateMap.areaInfo[homeReg]);
    currenciesMode = PreparCurrenciesMode();
    console.log("currenciesMode:", currenciesMode);
    flagOpen = true;
    console.log("massroute:", massroute);
    console.log("map:", map);
  }
  //========================================================
  let mapState: any = {
    center: pointCenter,
    zoom,
  };

  if (props.sErr && props.sErr !== oldsErr) {
    ymaps && addRoute(ymaps); // перерисовка связей
    oldsErr = props.sErr;
  }
  masSvg = ["", ""];
  if (!debugging) {
    if (props.svg) {
      masSvg[0] = props.svg[RecevKeySvg(massroute.vertexes[pointAaIndex])];
      masSvg[1] = props.svg[RecevKeySvg(massroute.vertexes[pointBbIndex])];
    }
  }

  const SetOpenSetVertForm = (mode: boolean) => {
    ZeroRoute(false);
    setOpenSetVertForm(mode);
  };

  const SetOpenSetWaysForm = (mode: boolean) => {
    ZeroRoute(false);
    setOpenSetWaysForm(mode);
  };

  return (
    <Grid container sx={{ height: "99.9vh" }}>
      {InputMenu(handleChangeArea, currency, currencies)}
      {InputMenu(handleChangeMode, currencyMode, currenciesMode)}
      {MakeRevers(makeRevers, needRevers, PressButton)}
      {ShowFormalRoute(flagDemo, PressButton)}
      {MenuProcesRoute(flagPusk, flagBind, flagRoute, PressButton)}
      {flagPro && <>{StrokaMenuGlob("Протокол", PressButton, 24)}</>}
      {Object.keys(massroute).length && (
        <YMaps query={{ apikey: MyYandexKey, lang: "ru_RU" }}>
          <Map
            modules={["multiRouter.MultiRoute", "Polyline"]}
            state={mapState}
            instanceRef={(ref) => InstanceRefDo(ref)}
            onLoad={(ref) => {
              ref && setYmaps(ref);
            }}
            width={"99.8%"}
            height={"97%"}
          >
            {YandexServices()}
            <PlacemarkDo />
            <ModalPressBalloon />
            {openSetPro && <MapRouteProtokol setOpen={setOpenSetPro} />}
            {openSetVertForm && pointAaIndex >= 0 && (
              <MapVertexForma setOpen={SetOpenSetVertForm} idx={pointAaIndex} />
            )}
            {openSetWaysForm && (
              <MapWaysForma setOpen={SetOpenSetWaysForm} idx={idxDel} />
            )}
            {openSetEr && (
              <MapPointDataError
                sErr={soobError}
                setOpen={setOpenSetEr}
                ws={WS}
                fromCross={fromCross}
                toCross={toCross}
                update={UpdateAddRoute}
              />
            )}
            {openSetInf && (
              <MapRouteInfo
                activeRoute={activeRoute}
                idxA={pointAaIndex}
                idxB={pointBbIndex}
                setOpen={setOpenSetInf}
                reqRoute={reqRoute}
                setReqRoute={SetReqRoute}
                needLinkBind={needLinkBind}
              />
            )}
            {openSetBind && (
              <MapRouteBind
                setOpen={setOpenSetBind}
                debug={debugging}
                svg={masSvg}
                setSvg={props.setSvg}
                idxA={pointAaIndex}
                idxB={pointBbIndex}
                func={MakeRecordMassRoute}
              />
            )}
            {openSetCreate && (
              <MapCreatePointVertex
                setOpen={setOpenSetCreate}
                region={homeRegion}
                coord={newPointCoord}
                createPoint={MakeNewPoint}
                area={AREA}
              />
            )}
            {openSetDelete &&
              DelVertexOrPoint(openSetDelete, massdk, idxDel, handleCloseDel)}
            {openSetRevers && (
              <MapReversRoute
                setOpen={setOpenSetRevers}
                makeRevers={setMakeRevers}
                needRevers={setNeedRevers}
              />
            )}
          </Map>
        </YMaps>
      )}
    </Grid>
  );
};

export default MainMap;
