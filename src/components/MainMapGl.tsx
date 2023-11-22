import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { massdkCreate, massrouteCreate } from "./../redux/actions";
import { coordinatesCreate, massrouteproCreate } from "./../redux/actions";
import { statsaveCreate } from "./../redux/actions";

import Grid from "@mui/material/Grid";
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
import MapCreatePK from "./MapComponents/MapPKComponents/MapCreatePK";
import MapSpisPK from "./MapComponents/MapPKComponents/MapSpisPK";
import MapWindPK from "./MapComponents/MapPKComponents/MapWindPK";
import MapDispPKForm from "./MapComponents/MapPKComponents/MapDispPKForm";

import { RecordMassRoute, MakeNewPointContent } from "./MapServiceFunctions";
import { YandexServices, ShowFormalRoute } from "./MapServiceFunctions";
import { DecodingCoord, CodingCoord, InputMenu } from "./MapServiceFunctions";
import { DoublRoute, MakeToCross, MakeRevers } from "./MapServiceFunctions";
import { getPointData, GetPointOptions } from "./MapServiceFunctions";
import { СontentModalPressBalloon, MakeFromCross } from "./MapServiceFunctions";
import { ChangeCrossFunc, PreparCurrencies } from "./MapServiceFunctions";
import { RecevKeySvg, StrokaMenuGlob, MasskPoint } from "./MapServiceFunctions";
import { DelVerOrPoint, MainMenu, NearestPoint } from "./MapServiceFunctions";
import { DelPointVertexContent, MassCoord } from "./MapServiceFunctions";
import { FillMassRouteContent, InputMenuForm } from "./MapServiceFunctions";
import { PreparCurrenciesMode, CenterCoordBegin } from "./MapServiceFunctions";
import { PreparCurrenciesForm } from "./MapServiceFunctions";

import { MakeMultiRouteIn, MakePolyRoute } from "./MapRouteFunctions";
import { MakeMultiRoute, MakeMainRoute } from "./MapRouteFunctions";

import { SendSocketCreateWay, SendSocketGetSvg } from "./MapSocketFunctions";
import { SendSocketCreateWayFromPoint } from "./MapSocketFunctions";
import { SendSocketCreateWayToPoint } from "./MapSocketFunctions";

import { YMapsModul, MyYandexKey } from "./MapConst";

export let AREA = "0"; // район  0 - все районы
export let MODE = "0"; // режим работы - меню режимов
export let FORM = "0"; // какую форму нужно выдать черех диспетчер
export let homeRegion: any = 0;
export let debug: boolean = false;
export let MASSPK: any = []; // массив 'подсвечиваемых' перекрёстков
export let BALLOON: boolean = true; // разрешение/запрет на выдачу балуна
export let masSvg: any = ["", ""]; // массив изображений перекрёстков для RouteBind
let coordStart: any = []; // рабочий массив коллекции входящих связей
let coordStop: any = []; // рабочий массив коллекции входящих связей
let coordStartIn: any = []; // рабочий массив коллекции исходящих связей
let coordStopIn: any = []; // рабочий массив коллекции исходящих связей
let massRoute: any = []; // рабочий массив сети связей
let flagOpen: boolean, flagBind: boolean;
let flagRevers: boolean, needLinkBind: boolean, FlagDemo: boolean;
flagOpen = flagBind = flagRevers = needLinkBind = FlagDemo = false;
let newPointCoord: any, pointCenter: any, pointAa: any, pointBb: any;
newPointCoord = pointCenter = pointAa = pointBb = 0;
let soobError = "";
let oldsErr = "";
let zoom = 10;
let reqRoute: any = {
  dlRoute: 0,
  tmRoute: 0,
};
let fromCross: any = {
  pointAaRegin: "",
  pointAaArea: "",
  pointAaID: 0,
  pointAcod: "",
};
let toCross: any = {
  pointBbRegin: "",
  pointBbArea: "",
  pointBbID: 0,
  pointBcod: "",
};
let funcBound: any = null;
let funcContex: any, VertexForma: any, funcClick: any, activeRoute: any;
funcContex = VertexForma = funcClick = activeRoute = null;
let currencies: any = [];
let currenciesMode: any = [];
let currenciesForm: any = [];
let idxDel: number, nomRoute: number, idxRoute: number, pointAaIndex: number;
let indexPoint: number, pointBbIndex: number;
idxDel = nomRoute = idxRoute = indexPoint = pointAaIndex = pointBbIndex = -1;
let oldPropsSvg: any = null;
let openEF = false;
let fromIdx: number, inIdx: number, idxPKForm: number, modeBind: number;
fromIdx = inIdx = idxPKForm = modeBind = -1;

const MainMap = (props: {
  region: any;
  sErr: string;
  svg: any;
  setSvg: any;
  trigger: boolean;
}) => {
  //== Piece of Redux =======================================
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
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
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  let massplan = useSelector((state: any) => {
    const { massplanReducer } = state;
    return massplanReducer.massplan;
  });
  const dispatch = useDispatch();
  const WS = datestat.ws;
  if (WS.url === "wss://localhost:3000/W") debug = true;
  //===========================================================
  const [triggerForm, setTriggerForm] = React.useState(false);
  const [currency, setCurrency] = React.useState("0");
  const [currencyMode, setCurrencyMode] = React.useState("0");
  const [currencyForm, setCurrencyForm] = React.useState("0");
  const [openInf, setOpenInf] = React.useState(false);
  const [openPro, setOpenPro] = React.useState(false);
  const [openVertForm, setOpenVertForm] = React.useState(false);
  const [openWaysForm, setOpenWaysForm] = React.useState(false);
  const [openPKForm, setOpenPKForm] = React.useState(false);
  const [openPKSpis, setOpenPKSpis] = React.useState(false);
  const [openPKWind, setOpenPKWind] = React.useState(false);
  const [dispPKForm, setDispPKForm] = React.useState(false);
  const [openWaysFormMenu, setOpenWaysFormMenu] = React.useState(false);
  const [openEr, setOpenEr] = React.useState(false);
  const [openBind, setOpenBind] = React.useState(false);
  const [flagDemo, setFlagDemo] = React.useState(false);
  const [flagPro, setFlagPro] = React.useState(false);
  const [flagPusk, setFlagPusk] = React.useState(false);
  const [flagRoute, setFlagRoute] = React.useState(false);
  const [revers, setRevers] = React.useState(false); // для ререндера
  const [open, setOpen] = React.useState(false);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openDel, setOpenDel] = React.useState(false);
  const [openAdress, setOpenAdress] = React.useState(false);
  const [openRevers, setOpenRevers] = React.useState(false);
  const [makeRevers, setMakeRevers] = React.useState(false);
  const [needRevers, setNeedRevers] = React.useState(0);
  const [ymaps, setYmaps] = React.useState<YMapsApi | null>(null);
  const mapp = React.useRef<any>(null);

  const DelCollectionRoutes = () => {
    coordStart = [];
    coordStop = [];
    coordStartIn = [];
    coordStopIn = [];
  };

  const HandlLockUp = React.useCallback(
    (mode: Boolean) => {
      datestat.lockUp = mode; // блокировка/разблокировка меню районов и меню режимов
      dispatch(statsaveCreate(datestat));
    },
    [datestat, dispatch]
  );

  const RunReBing = React.useCallback(
    (route: any) => {
      reqRoute.dlRoute = route.lenght;
      reqRoute.tmRoute = route.time;
      let arIn = route.sourceArea;
      let idIn = route.sourceID;
      let arOn = route.targetArea;
      let idOn = route.targetID;
      SendSocketGetSvg(WS, homeRegion, arIn, idIn, arOn, idOn);
      for (let i = 0; i < massroute.vertexes.length; i++) {
        let rec = massroute.vertexes[i];
        if (rec.area === arIn && rec.id === idIn) pointAaIndex = i;
        if (rec.area === arOn && rec.id === idOn) pointBbIndex = i;
      }
      flagBind = true;
      modeBind = 3; // режим открытия RouteBind
      setOpenBind(true);
    },
    [WS, massroute.vertexes]
  );

  const addRoute = React.useCallback(
    (ymaps: any) => {
      mapp.current.geoObjects.removeAll(); // удаление старой коллекции связей
      massRoute.length &&
        MakePolyRoute(ymaps, mapp, massRoute, massroute, RunReBing); // формальные связи
      coordStart.length && MakeMultiRoute(ymaps, mapp, coordStart, coordStop); // исходящие связи
      coordStartIn.length &&
        MakeMultiRouteIn(ymaps, mapp, coordStartIn, coordStopIn); // входящие связи
      if (pointAa) {
        let aa = MakeMainRoute(ymaps, mapp, pointAa, pointBb);
        activeRoute = aa[0];
        reqRoute = aa[1];
      }
    },
    [massroute, RunReBing]
  );
  //========================================================
  const ZeroRoute = React.useCallback(
    (mode: boolean) => {
      pointAa = pointBb = 0;
      pointAaIndex = pointBbIndex = nomRoute = -1;
      DelCollectionRoutes();
      flagBind = false;
      setFlagRoute(false);
      setFlagPusk(mode);
      setOpenVertForm(false);
      setOpenWaysForm(false);
      setOpenWaysFormMenu(false);
      setOpenPKForm(false);
      BALLOON = true; // разрешение на выдачу балуна
      setOpenPKSpis(false);
      MASSPK = [];
      idxPKForm = -1;
      HandlLockUp(false); // разблокировка меню районов и меню режимов
      ymaps && addRoute(ymaps); // перерисовка связей
    },
    [ymaps, HandlLockUp, addRoute]
  );

  const SoobOpenSetEr = (soob: string) => {
    soobError = soob;
    if (soobError === "Дубликатная связь") {
      fromIdx = pointAaIndex;
      inIdx = pointBbIndex;
    }
    setOpenEr(true);
  };

  const FillMassRoute = () => {
    massRoute = [];
    massRoute = FillMassRouteContent(AREA, FlagDemo, massroute);
  };

  const MakeRecordMassRoute = (mode: boolean, mass: any) => {
    if (!mode) {
      ZeroRoute(mode);
    } else {
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
        setOpenRevers(true);
        flagRevers = false;
      } else ZeroRoute(mode);
    }
    setNeedRevers(0);
    flagDemo && FillMassRoute();
    ymaps && addRoute(ymaps); // перерисовка связей
  };

  const MakeСollectionRoute = (needStops: boolean) => {
    DelCollectionRoutes();
    for (let i = 0; i < massroute.ways.length; i++) {
      if (needStops && massroute.ways[i].starts === CodingCoord(pointAa)) {
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
      MakeСollectionRoute(true);
      setRevers(!revers); // ререндер
    }
    return noDoublRoute;
  };

  const BeginPK = () => {
    ZeroRoute(false);
    if (AREA === "0") {
      AREA = "1";
      setCurrency("1");
      FillMassRoute();
    }
  };

  const TurnOnDemoRoute = () => {
    setFlagDemo(true);
    FlagDemo = true;
    FillMassRoute();
    ymaps && addRoute(ymaps); // перерисовка связей
  };

  const PressButton = (mode: number) => {
    switch (mode) {
      case 3: // режим включения Demo сети связей
        TurnOnDemoRoute();
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
        setOpenPro(true);
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
              setOpenInf(true);
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
        setOpenInf(true);
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
      case 201: // список всех ПК
        BeginPK();
        datestat.needMenuForm = true; // выдавать меню форм
        HandlLockUp(true); // блокировка меню районов и меню режимов
        setOpenPKSpis(true);
        TurnOnDemoRoute();
        break;
      case 202: // создание нового ПК
        BeginPK();
        idxPKForm = -1;
        HandlLockUp(true); // блокировка меню районов и меню режимов
        BALLOON = false; // запрет на выдачу балуна
        setOpenPKForm(true);
        TurnOnDemoRoute();
        break;
      case 203: // вызов диспетчера форм ПК
        setDispPKForm(true);
        break;
      case 212: // выбор режима работы
        if (MODE === "2") setOpenPKWind(true);
        if (MODE !== "2") setOpenPKWind(false);
        ZeroRoute(false);
    }
  };

  const OnPlacemarkClickPoint = (index: number, coor: any) => {
    let COORD = coor ? coor : MassCoord(massdk[index]);
    if (pointAa === 0) {
      if (!massdk[index].area && MODE === "1") return; // включён режим "Перекрёстки"
      if (MODE === "2") return; // включён режим "Модели (ПК)"
      if (!openWaysForm) {
        ZeroRoute(false); //==================================
        pointAaIndex = index; // начальная точка
        pointAa = COORD;
        fromCross = MakeFromCross(massdk[index]);
        MakeСollectionRoute(MODE === "1" ? false : true);
        setFlagPusk(true);
      }
      if (MODE === "1" && !openWaysForm) {
        VertexForma = null;
        datestat.oldIdxForm = -1;
        HandlLockUp(true);
        BALLOON = false; // запрет на выдачу балуна
        setOpenVertForm(true); // запуск новой формы
      }
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
          setOpen(true); // переход в меню работы с точками
        }
      }
    }
  };

  const ModalPressBalloon = () => {
    const [openErBall, setOpenErBall] = React.useState(false);
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
            setOpenErBall(true);
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
            setOpenErBall(true);
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
          setOpenAdress(true);
      }
      setOpen(false);
    };

    return (
      <>
        <Modal open={open} onClose={() => setOpen(false)}>
          {СontentModalPressBalloon(setOpen, handleClose, areaPoint)}
        </Modal>
        {openAdress && (
          <MapChangeAdress
            iP={indexPoint}
            Open={setOpenAdress}
            zero={ZeroRoute}
            Cl={setOpen}
          />
        )}
        {openErBall && (
          <MapPointDataError
            sErr={soobError}
            setOpen={setOpenErBall}
            fromCross={fromCross}
            toCross={toCross}
            update={UpdateAddRoute}
            setSvg={props.setSvg}
          />
        )}
      </>
    );
  };

  const PlacemarkDo = () => {
    let pA = pointAaIndex;
    let pB = pointBbIndex;
    const DoPlacemarkDo = (props: { coordinate: any; idx: number }) => {
      const MemoPlacemarkDo = React.useMemo(
        () => (
          <Placemark
            key={props.idx}
            geometry={props.coordinate}
            properties={getPointData(props.idx, pA, pB, massdk, map)}
            options={GetPointOptions(props.idx, map, pA, pB, massdk, massroute)}
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

  const ContentContextmenu = (e: any) => {
    newPointCoord = e.get("coords");
    idxDel = NearestPoint(massdk, newPointCoord);
    if (MODE === "0") {
      idxDel >= 0 && setOpenDel(true);
      idxDel < 0 && setOpenCreate(true);
    }
    if (MODE === "1" && idxDel >= 0 && nomRoute < 0 && !openVertForm) {
      nomRoute = 0;
      idxRoute = idxDel;
      setOpenWaysFormMenu(true);
      pointAaIndex = idxDel; // начальная точка
      pointAa = MassCoord(massdk[idxDel]);
      MakeСollectionRoute(false);
      setRevers(!revers); // ререндер
    }
  };

  const InstanceRefDo = (ref: React.Ref<any>) => {
    if (ref) {
      mapp.current = ref;
      mapp.current.events.remove("contextmenu", funcContex); // нажата правая кнопка мыши
      funcContex = function (e: any) {
        mapp.current.hint && ContentContextmenu(e);
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
  //=== Функции - обработчики ==============================
  const LinkBind = () => {
    let arIn = massroute.vertexes[pointAaIndex].area;
    let idIn = massroute.vertexes[pointAaIndex].id;
    let arOn = massroute.vertexes[pointBbIndex].area;
    let idOn = massroute.vertexes[pointBbIndex].id;
    SendSocketGetSvg(WS, homeRegion, arIn, idIn, arOn, idOn);
    flagBind = true;
    modeBind = 0; // режим открытия RouteBind
    setOpenBind(true);
  };

  const SetReqRoute = (mode: any, need: boolean) => {
    reqRoute = JSON.parse(JSON.stringify(mode));
    need && LinkBind();
    needLinkBind = false;
  };

  const UpdateAddRoute = () => {
    ymaps && addRoute(ymaps); // перерисовка связей
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
    setOpenDel(false);
  };

  const MakeNewPoint = (coords: any, avail: boolean) => {
    MakeNewPointContent(WS, coords, avail, homeRegion, massroute);
    coordinates.push(coords);
    dispatch(coordinatesCreate(coordinates));
    setOpenCreate(false);
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

  const handleChangeForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrencyForm(event.target.value);
    FORM = event.target.value;
    PressButton(203);
  };

  const SetOpenVertForm = (mode: boolean, forma: any, openErr: boolean) => {
    setOpenVertForm(false); // закрытие старой формы
    HandlLockUp(true); // блокировка меню районов и меню режимов
    if (!mode) {
      VertexForma = null;
      openEF = false;
      ZeroRoute(false);
    } else {
      VertexForma = forma;
      openEF = openErr;
      setOpenVertForm(true);
      setTriggerForm(!triggerForm); // запуск новой формы
    }
  };

  const SetOpenWaysFormMenu = (mode: number, idx: number, pusto: number) => {
    setOpenWaysFormMenu(false);
    ZeroRoute(false);
  };

  const SetMassPkId = (massPkId: any, AreA: number) => {
    MASSPK = massPkId;
    AREA = AreA.toString();
    setRevers(!revers); // ререндер
  };

  const SetModePKForm = (idx: number) => {
    idxPKForm = idx;
    AREA = massplan.plans[idx].areaPK.toString();
    setCurrency(AREA);
    FillMassRoute();
    ymaps && addRoute(ymaps); // перерисовка связей
    setOpenPKSpis(false); // закрытие списка планов
    datestat.needMenuForm = false; //  не выдавать меню форм
    dispatch(statsaveCreate(datestat));
    HandlLockUp(true); // блокировка меню районов и меню режимов
    BALLOON = false; // запрет на выдачу балуна
    setOpenPKForm(true); // окрытие MapCreatePK
    TurnOnDemoRoute();
  };

  const SetPuskMenu = (mode: number) => {
    datestat.needMenuForm = true; // выдавать меню форм
    HandlLockUp(true); // блокировка меню районов и меню режимов
    setOpenPKSpis(true); // открытие списка планов
    TurnOnDemoRoute();
  };

  const SetDispPKForm = (mode: boolean) => {
    FORM = "0";
    setCurrencyForm("0");
    setDispPKForm(mode);
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
    currenciesForm = PreparCurrenciesForm();
    flagOpen = true;
    console.log("massroute:", massroute);
    console.log("map:", map);
  }
  //========================================================
  let mapState: any = {
    center: pointCenter,
    zoom,
    controls: [],
  };

  if (props.sErr && props.sErr !== oldsErr) {
    ymaps && addRoute(ymaps); // перерисовка связей
    oldsErr = props.sErr;
  }
  masSvg = ["", ""];
  if (!debug && props.svg !== oldPropsSvg) {
    oldPropsSvg = props.svg;
    if (props.svg && pointAaIndex >= 0 && pointBbIndex >= 0) {
      // передача изображений в обычную привязку
      masSvg[0] = props.svg[RecevKeySvg(massroute.vertexes[pointAaIndex])];
      masSvg[1] = props.svg[RecevKeySvg(massroute.vertexes[pointBbIndex])];
    }
    if (props.svg && openEr) {
      // передача изображений в привязку через "дубликатные связи"
      masSvg[0] = props.svg[RecevKeySvg(massroute.vertexes[fromIdx])];
      masSvg[1] = props.svg[RecevKeySvg(massroute.vertexes[inIdx])];
    }
    if (props.svg && openWaysFormMenu) {
      // передача изображений в привязку через меню "перекрёстки"
      masSvg[0] = props.svg;
    }
  }
  if (openBind && pointAaIndex < 0 && pointBbIndex < 0) setOpenBind(false); // отработка Esc из RouteBind
  //=== обработка Esc ======================================
  const escFunction = React.useCallback(
    (event) => {
      if (event.keyCode === 27) {
        if (pointAa || flagBind || flagRoute || flagPusk) ZeroRoute(false);
        if (openVertForm || openWaysForm) ZeroRoute(false);
      }
    },
    [ZeroRoute, flagRoute, flagPusk, openVertForm, openWaysForm]
  );
  React.useEffect(() => {
    document.addEventListener("keydown", escFunction);
    return () => document.removeEventListener("keydown", escFunction);
  }, [escFunction]);
  //========================================================
  return (
    <Grid container sx={{ height: "99.9vh" }}>
      {!datestat.lockUp && (
        <>
          {InputMenu(handleChangeArea, currency, currencies)}
          {InputMenu(handleChangeMode, currencyMode, currenciesMode)}
        </>
      )}
      {MakeRevers(makeRevers, needRevers, PressButton)}
      {ShowFormalRoute(flagDemo, PressButton)}
      {MODE === "2" && datestat.needMenuForm && (
        <>{InputMenuForm(handleChangeForm, currencyForm, currenciesForm)}</>
      )}
      {MainMenu(flagPusk, flagRoute, PressButton, datestat.lockUp)}
      {flagPro && MODE === "0" && (
        <>{StrokaMenuGlob("Протокол", PressButton, 24)}</>
      )}
      {Object.keys(massroute).length && (
        <YMaps query={{ apikey: MyYandexKey, lang: "ru_RU" }}>
          <Map
            modules={YMapsModul}
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
            {openPKWind && <MapWindPK />}
            {dispPKForm && <MapDispPKForm setOpen={SetDispPKForm} />}
            {openPro && <MapRouteProtokol setOpen={setOpenPro} />}
            {openVertForm && pointAaIndex >= 0 && triggerForm && (
              <MapVertexForma
                setOpen={SetOpenVertForm}
                idx={pointAaIndex}
                forma={VertexForma}
                openErr={openEF}
              />
            )}
            {openVertForm && pointAaIndex >= 0 && !triggerForm && (
              <MapVertexForma
                setOpen={SetOpenVertForm}
                idx={pointAaIndex}
                forma={VertexForma}
                openErr={openEF}
              />
            )}

            {openPKForm && (
              <MapCreatePK
                setOpen={ZeroRoute}
                SetMass={SetMassPkId}
                idx={idxPKForm}
                setPuskMenu={SetPuskMenu}
              />
            )}
            {openPKSpis && (
              <MapSpisPK
                setOpen={ZeroRoute}
                setMode={SetModePKForm}
                SetMass={SetMassPkId}
              />
            )}
            {openWaysFormMenu && !openVertForm && (
              <MapWaysFormMenu
                setOpen={SetOpenWaysFormMenu}
                idx={idxRoute}
                setSvg={props.setSvg}
              />
            )}
            {openEr && (
              <MapPointDataError
                sErr={soobError}
                setOpen={setOpenEr}
                fromCross={fromCross}
                toCross={toCross}
                update={UpdateAddRoute}
                setSvg={props.setSvg}
              />
            )}
            {openInf && (
              <MapRouteInfo
                activeRoute={activeRoute}
                idxA={pointAaIndex}
                idxB={pointBbIndex}
                setOpen={setOpenInf}
                reqRoute={reqRoute}
                setReqRoute={SetReqRoute}
                needLinkBind={needLinkBind}
              />
            )}
            {openBind && pointAaIndex >= 0 && pointBbIndex >= 0 && (
              <MapRouteBind
                setOpen={setOpenBind}
                svg={masSvg}
                setSvg={props.setSvg}
                idxA={pointAaIndex}
                idxB={pointBbIndex}
                reqRoute={reqRoute}
                func={MakeRecordMassRoute}
                mode={modeBind}
              />
            )}
            {openCreate && (
              <MapCreatePointVertex
                setOpen={setOpenCreate}
                region={homeRegion}
                coord={newPointCoord}
                createPoint={MakeNewPoint}
              />
            )}
            {openDel &&
              DelVerOrPoint(openDel, massdk, massroute, idxDel, handleCloseDel)}
            {openRevers && (
              <MapReversRoute
                setOpen={setOpenRevers}
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
