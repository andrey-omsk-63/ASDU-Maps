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
import MapWaysFormMenu from "./MapComponents/MapWaysFormMenu";
import MapWaysForma from "./MapComponents/MapWaysForma";

import { RecordMassRoute, MakeNewPointContent } from "./MapServiceFunctions";
import { YandexServices, ShowFormalRoute } from "./MapServiceFunctions";
import { DecodingCoord, CodingCoord, InputMenu } from "./MapServiceFunctions";
import { getMultiRouteOptions, DoublRoute } from "./MapServiceFunctions";
import { getReferencePoints, CenterCoordBegin } from "./MapServiceFunctions";
import { getMassPolyRouteOptions, NearestPoint } from "./MapServiceFunctions";
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

let debugging: boolean,
  flagOpen: boolean,
  flagBind: boolean = false;
let flagRevers: boolean, needLinkBind: boolean, FlagDemo: boolean;
debugging = flagOpen = flagBind = flagRevers = needLinkBind = FlagDemo = false;
let newPointCoord: any, homeRegion: any, pointCenter: any;
newPointCoord = homeRegion = pointCenter = 0;
let soobError = "";
let oldsErr = "";
let zoom = 10;
let reqRoute: any = {
  dlRoute: 0,
  tmRoute: 0,
};
let pointAa: any = 0;
let fromCross: any = {
  pointAaRegin: "",
  pointAaArea: "",
  pointAaID: 0,
  pointAcod: "",
};
let pointBb: any = 0;
let toCross: any = {
  pointBbRegin: "",
  pointBbArea: "",
  pointBbID: 0,
  pointBcod: "",
};
let funcContex: any, funcBound: any, funcClick: any, activeRoute: any;
funcContex = funcBound = funcClick = activeRoute = null;
let currencies: any = [];
let currenciesMode: any = [];
let AREA = "0";
let MODE = "0";
let idxDel: number, nomRoute: number, idxRoute: number, pointAaIndex: number;
let indexPoint: number, pointBbIndex: number;
idxDel = nomRoute = idxRoute = indexPoint = pointAaIndex = pointBbIndex = -1;
let oldPropsSvg: any = null;

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
  const dispatch = useDispatch();
  //===========================================================
  const [currency, setCurrency] = React.useState("0");
  const [currencyMode, setCurrencyMode] = React.useState("0");
  const [openSetInf, setOpenSetInf] = React.useState(false);
  const [openSetPro, setOpenSetPro] = React.useState(false);
  const [openSetVertForm, setOpenSetVertForm] = React.useState(false);
  const [openSetWaysForm, setOpenSetWaysForm] = React.useState(false);
  const [openSetWaysFormMenu, setOpenSetWaysFormMenu] = React.useState(false);
  const [openSetEr, setOpenSetEr] = React.useState(false);
  const [openSetBind, setOpenSetBind] = React.useState(false);
  const [flagDemo, setFlagDemo] = React.useState(false);
  const [flagPro, setFlagPro] = React.useState(false);
  const [flagPusk, setFlagPusk] = React.useState(false);
  const [flagRoute, setFlagRoute] = React.useState(false);
  const [revers, setRevers] = React.useState(false); // для ререндера
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

  const ZeroRoute = React.useCallback(
    (mode: boolean) => {
      pointAa = pointBb = 0;
      pointAaIndex = pointBbIndex = nomRoute = -1;
      DelCollectionRoutes();
      flagBind = false;
      setFlagRoute(false);
      setFlagPusk(mode);
      setOpenSetVertForm(false);
      setOpenSetWaysForm(false);
      setOpenSetWaysFormMenu(false);
      ymaps && addRoute(ymaps); // перерисовка связей
    },
    [ymaps]
  );

  const SoobOpenSetEr = (soob: string) => {
    soobError = soob;
    setOpenSetEr(true);
  };

  const FillMassRoute = () => {
    massRoute = [];
    massRoute = FillMassRouteContent(AREA, FlagDemo, massroute);
  };

  const MakeRecordMassRoute = (mode: boolean, mass: any) => {
    console.log("MakeRecordMassRoute:", mode, mass);
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

  const MakeСollectionRoute = (needStops: boolean) => {
    DelCollectionRoutes();
    for (let i = 0; i < massroute.ways.length; i++) {
      if (needStops) {
        if (massroute.ways[i].starts === CodingCoord(pointAa)) {
          coordStop.push(DecodingCoord(massroute.ways[i].stops)); // исходящие связи
          coordStart.push(pointAa);
        }
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
      MakeСollectionRoute(true);
      setRevers(!revers); // ререндер
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
        ZeroRoute(false);
    }
  };

  const addRoute = (ymaps: any) => {
    mapp.current.geoObjects.removeAll(); // удаление старой коллекции связей
    let massPolyRoute: any = []; // cеть связей
    for (let i = 0; i < massRoute.length; i++) {
      massPolyRoute[i] = new ymaps.Polyline(
        [DecodingCoord(massRoute[i].starts), DecodingCoord(massRoute[i].stops)],
        { hintContent: "Формальная связь" },
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

  const OnPlacemarkClickPoint = (index: number, coor: any) => {
    let COORD = coor ? coor : MassCoord(massdk[index]);
    if (pointAa === 0) {
      if (!massdk[index].area && MODE === "1") return;
      if (!openSetWaysForm) {
        pointAaIndex = index; // начальная точка
        pointAa = COORD;
        fromCross = MakeFromCross(massdk[index]);
        MakeСollectionRoute(MODE === "1" ? false : true);
        setFlagPusk(true);
      }
      if (MODE === "1" && !openSetWaysForm) setOpenSetVertForm(true);
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
                pointBb = COORD;
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
            MakeСollectionRoute(true);
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
      setOpenSet(false);
    };

    return (
      <Modal open={openSet} onClose={() => setOpenSet(false)}>
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
            properties={getPointData(props.idx, pAaI, pBbI, massdk, map, MODE)}
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
            onClick={() => OnPlacemarkClickPoint(props.idx, 0)}
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
      mapp.current.events.remove("contextmenu", funcContex); // нажата правая кнопка мыши
      funcContex = function (e: any) {
        if (mapp.current.hint) {
          newPointCoord = e.get("coords");
          idxDel = NearestPoint(massdk, newPointCoord);
          if (MODE === "0") {
            idxDel >= 0 && setOpenSetDelete(true);
            idxDel < 0 && setOpenSetCreate(true);
          } else {
            if (idxDel >= 0 && nomRoute < 0) {
              nomRoute = 0;
              idxRoute = idxDel;
              setOpenSetWaysFormMenu(true);
              pointAaIndex = idxDel; // начальная точка
              pointAa = MassCoord(massdk[idxDel]);
              MakeСollectionRoute(false);
              setRevers(!revers); // ререндер
            }
          }
        }
      };
      mapp.current.events.add("contextmenu", funcContex);
      mapp.current.events.remove("click", funcClick); // нажата левая кнопка мыши
      funcClick = function (e: any) {
        let idx = NearestPoint(massdk, e.get("coords"));
        if (idx >= 0 && MODE === "0")
          OnPlacemarkClickPoint(idx, e.get("coords"));
      };
      mapp.current.events.add("click", funcClick);
      mapp.current.events.remove("boundschange", funcBound); // покрутили колёсико мыши
      funcBound = function () {
        pointCenter = mapp.current.getCenter();
        zoom = mapp.current.getZoom();
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

  const SetOpenSetVertForm = (mode: boolean) => {
    ZeroRoute(false);
    setOpenSetVertForm(mode);
  };

  const SetOpenSetWaysForm = (mode: boolean) => {
    !mode && ZeroRoute(false);
    nomRoute = -1;
    setOpenSetWaysForm(mode);
  };

  const SetOpenSetWaysFormMenu = (mode: number, idx: number, pusto: number) => {
    setOpenSetWaysFormMenu(false);
    if (pusto > 0) {
      nomRoute = mode;
      pointBbIndex = idx; // номер в massdk
      setOpenSetWaysForm(true);
    } else {
      ZeroRoute(false);
    }
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
    if (props.svg !== oldPropsSvg) {
      oldPropsSvg = props.svg
      if (props.svg && pointAaIndex >= 0 && pointBbIndex >= 0) {
        masSvg[0] = props.svg[RecevKeySvg(massroute.vertexes[pointAaIndex])];
        masSvg[1] = props.svg[RecevKeySvg(massroute.vertexes[pointBbIndex])];
      }
    }
  }
  if (openSetBind && pointAaIndex < 0 && pointBbIndex < 0)
    setOpenSetBind(false); // отработка Esc из RouteBind

  //=== обработка Esc ======================================
  const escFunction = React.useCallback(
    (event) => {
      if (event.keyCode === 27)
        if (
          pointAa ||
          flagBind ||
          flagRoute ||
          flagPusk ||
          openSetVertForm ||
          openSetWaysForm
        )
          ZeroRoute(false);
    },
    [ZeroRoute, flagRoute, flagPusk, openSetVertForm, openSetWaysForm]
  );

  React.useEffect(() => {
    document.addEventListener("keydown", escFunction);
    return () => document.removeEventListener("keydown", escFunction);
  }, [escFunction]);
  //========================================================
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
            {openSetWaysFormMenu && (
              <MapWaysFormMenu
                setOpen={SetOpenSetWaysFormMenu}
                idx={idxRoute}
              />
            )}
            {openSetWaysForm && (
              <MapWaysForma
                setOpen={SetOpenSetWaysForm}
                idx={idxRoute}
                nomInMass={nomRoute}
              />
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
            {openSetBind && pointAaIndex >= 0 && pointBbIndex >= 0 && (
              <MapRouteBind
                setOpen={setOpenSetBind}
                svg={masSvg}
                setSvg={props.setSvg}
                idxA={pointAaIndex}
                idxB={pointBbIndex}
                reqRoute={reqRoute}
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
