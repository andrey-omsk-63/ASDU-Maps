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
import MapVertexSetup from "./MapComponents/MapVertexSetup";
import MapCreatePK from "./MapComponents/MapPKComponents/MapCreatePK";
import MapSpisPK from "./MapComponents/MapPKComponents/MapSpisPK";
import MapWindPK from "./MapComponents/MapPKComponents/MapWindPK";
import MapSetupPK from "./MapComponents/MapPKComponents/MapSetupPK";
import MapDispCalc from "./MapComponents/MapCalcComponents/MapDispCalc";
import MapDispOptim from "./MapComponents/MapOptimComponents/MapDispOptim";
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
import { FillMassRouteContent, InputMenuPK } from "./MapServiceFunctions";
import { InputMenuForm, MasrouteAgreeMap } from "./MapServiceFunctions";
import { PreparCurrenciesMode, CenterCoordBegin } from "./MapServiceFunctions";
import { PreparCurrenciesForm, InputMenuMODE } from "./MapServiceFunctions";
import { PreparCurrenciesPK, SubareaFindById } from "./MapServiceFunctions";
import { PreparCurrenciesCalc, InputMenuCalc } from "./MapServiceFunctions";
import { PreparCurrenciesOptim, InputMenuOptim } from "./MapServiceFunctions";

import { MakeMultiRouteIn, MakePolyRoute } from "./MapRouteFunctions";
import { MakeMultiRoute, MakeMainRoute } from "./MapRouteFunctions";

import { SendSocketCreateWay, SendSocketGetSvg } from "./MapSocketFunctions";
import { SendSocketCreateWayFromPoint } from "./MapSocketFunctions";
import { SendSocketCreateWayToPoint } from "./MapSocketFunctions";

import { YMapsModul, MyYandexKey, FromCross, ToCross, ZONE } from "./MapConst";

export let AREA = ZONE.toString(); // район  0 - все районы
export let MODE = "-1"; // режим работы - меню режимов  0 - заголовок
export let PK = "0"; // режим работы - меню ПК и моделей  0 - заголовок
export let CALC = "0"; // режим работы - меню расчётов  0 - заголовок
export let OPTIM = "0"; // режим работы - меню оптимизации ПК  0 - заголовок
export let FORM = "0"; // какую форму нужно выдать через диспетчер
export let homeRegion: any = 0;
export let debug: boolean = false;
export let SubArea: Array<number> = []; // массив подрайонов
export let SUBAREA = "0"; // выбранный подрайон  0 - все подрайоны
export let MASSPK: any = []; // массив 'подсвечиваемых' перекрёстков
export let BALLOON: boolean = true; // разрешение/запрет на выдачу балуна
export let PLANER: number = 0; // номер выбраного ПК
export let VIEWDIR: boolean = true; // разрешение посмотра инф-ии о направл.в балуне
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
let fromCross: any = FromCross;
let toCross: any = ToCross;
let funcBound: any = null;
let oldPropsSvg: any = null;
let funcContex: any, VertexForma: any, funcClick: any, activeRoute: any;
funcContex = VertexForma = funcClick = activeRoute = null;
let currencies: any = [];
let currenciesMode: any = [];
let currenciesPK: any = [];
let currenciesCalc: any = [];
let currenciesOptim: any = [];
let currenciesForm: any = [];
let idxDel: number, pointAaIndex: number;
let indexPoint: number, pointBbIndex: number;
idxDel = indexPoint = pointAaIndex = pointBbIndex = -1;
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
  const [currencyPK, setCurrencyPK] = React.useState("0");
  const [currencyCalc, setCurrencyCalc] = React.useState("0");
  const [currencyOptim, setCurrencyOptim] = React.useState("0");
  const [currencyForm, setCurrencyForm] = React.useState("0");
  const [openInf, setOpenInf] = React.useState(false);
  const [openPro, setOpenPro] = React.useState(false);
  const [openVertForm, setOpenVertForm] = React.useState(false);
  const [openVertSetup, setOpenVertSetup] = React.useState(false);
  const [openWaysForm, setOpenWaysForm] = React.useState(false);
  const [openPKForm, setOpenPKForm] = React.useState(false);
  const [openPKSpis, setOpenPKSpis] = React.useState(false);
  const [openPKSetup, setOpenPKSetup] = React.useState(false);
  const [dispCalc, setDispCalc] = React.useState(false);
  const [dispOptim, setDispOptim] = React.useState(false);
  const [dispPKForm, setDispPKForm] = React.useState(false);
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
  const [routePKW, setRoutePKW] = React.useState<any>(null);
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
      modeBind = 3; // режим открытия RouteBind
      setOpenBind((flagBind = true));
    },
    [WS, massroute.vertexes]
  );

  const InfoRoute = React.useCallback((route: any) => {
    setRoutePKW(route);
  }, []);

  const addRoute = React.useCallback(
    (ymaps: any) => {
      mapp.current.geoObjects.removeAll(); // удаление старой коллекции связей
      massRoute.length &&
        MakePolyRoute(ymaps, mapp, massRoute, massroute, InfoRoute, RunReBing); // формальные связи
      coordStart.length && MakeMultiRoute(ymaps, mapp, coordStart, coordStop); // исходящие связи
      coordStartIn.length &&
        MakeMultiRouteIn(ymaps, mapp, coordStartIn, coordStopIn); // входящие связи
      if (pointAa) {
        let aa = MakeMainRoute(ymaps, mapp, pointAa, pointBb);
        activeRoute = aa[0];
        reqRoute = aa[1];
      }
    },
    [massroute, InfoRoute, RunReBing]
  );
  //========================================================
  const ZeroRoute = React.useCallback(
    (mode: boolean) => {
      pointAa = pointBb = 0;
      pointAaIndex = idxPKForm = pointBbIndex = -1;
      DelCollectionRoutes();
      setFlagRoute((flagBind = false));
      setFlagPusk(mode);
      setOpenVertForm(false);
      setOpenWaysForm(false);
      setOpenPKForm(false);
      setRoutePKW(null);
      BALLOON = true; // разрешение на выдачу балуна
      setOpenPKSpis(false);
      HandlLockUp(false); // разблокировка меню районов и меню режимов
      ymaps && addRoute(ymaps); // перерисовка связей
    },
    [ymaps, HandlLockUp, addRoute]
  );

  const ZeroMenuPK = (nom: number, spis: any) => {
    PLANER = nom; // номер выбраного ПК
    MASSPK = spis; // массив 'подсвечиваемых' перекрёстков
    VIEWDIR = true; // разрешение посмотра инф-ии о направл.в балуне
    ZeroRoute(false);
    if (datestat.needMenuForm) {
      setOpenPKSpis(true);
      VIEWDIR = false; // разрешение посмотра инф-ии о направл.в балуне
      datestat.needMakeSpisPK = false;
      dispatch(statsaveCreate(datestat));
    } else {
      setCurrencyPK("0"); // переключение меню 'ПК и модели' на заголовок
    }
    ymaps && addRoute(ymaps); // перерисовка связей
  };

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
    massRoute = FillMassRouteContent(FlagDemo, massroute, massdk);
  };

  const MakeRecordMassRoute = (mode: boolean, mass: any) => {
    props.setSvg(null);
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
    setCurrencyPK((PK = "0")); // переключение меню 'ПК и модели' на заголовок
    VIEWDIR = true; // разрешение посмотра инф-ии о направл.в балуне
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
      ZeroRoute((noDoublRoute = false));
    } else {
      MakeСollectionRoute(true);
      setRevers(!revers); // ререндер
    }
    return noDoublRoute;
  };

  const BeginPK = () => {
    ZeroRoute(false);
    if (Number(SUBAREA) <= 0) {
      setCurrency((SUBAREA = "1"));
      FillMassRoute();
    }
  };

  const TurnOnDemoRoute = () => {
    setFlagDemo((FlagDemo = true));
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
        setMakeRevers((flagRevers = false));
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
              setOpenInf((needLinkBind = true));
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
        HandlLockUp((datestat.needMenuForm = true)); // выдавать меню форм / блокировка меню районов и меню режимов
        setOpenPKSpis(true);
        VIEWDIR = false; // разрешение посмотра инф-ии о направл.в балуне
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
      case 204: // настройка ПК
        setOpenPKSetup(true);
        break;
      case 205: // вызов диспетчера форм расчётов
        setDispCalc(true);
        break;
      case 212: // выбор режима работы
        ZeroRoute(false);
        if (MODE === "2") setOpenVertSetup(true);
        break;
      case 401: // кнопка №3
        setCurrencyMode("0"); // переключение меню 'Перекрёстки и связи' на заголовок
        MODE = "2";
        SoobOpenSetEr("Здесь будет расчёт целевой функции");
        break;
      case 402: // вызов диспетчера форм расчётов
        setDispOptim(true);
    }
  };

  const OnPlacemarkClickPoint = (index: number, coor: any) => {
    if (MODE === "1" && pointAa !== 0) {
      // листание перекрёстков
      if (datestat.have) {
        SoobOpenSetEr("Завершите работу с перекрёстком нормальным образом");
        return;
      } else pointAa = 0;
    }
    let soob = "Связь между перекрёстками в разных подрайонах создовать нельзя";
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
      if (MODE === "1" && !openWaysForm && !datestat.have) {
        VertexForma = null;
        datestat.oldIdxForm = -1;
        HandlLockUp(true);
        BALLOON = false; // запрет на выдачу балуна
        setOpenVertForm(true); // запуск новой формы
      }
    } else {
      if (MODE === "0") {
        if (pointBb === 0) {
          if (pointAaIndex === index) {
            SoobOpenSetEr("Начальная и конечная точки совпадают");
          } else {
            pointBbIndex = index; // конечная точка
            let recA = massroute.vertexes[pointAaIndex];
            let recB = massroute.vertexes[pointBbIndex];
            let areaAa = recA.area;
            let areaBb = recB.area;
            if (areaAa === 0 && areaBb === 0) {
              pointBbIndex = 0; // конечная точка
              SoobOpenSetEr("Связь между двумя точками создовать нельзя");
            } else {
              let sbAa = SubareaFindById(massdk, areaAa, recA.id);
              let sbBb = SubareaFindById(massdk, areaBb, recB.id);
              if (sbAa !== sbBb) {
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
            options={GetPointOptions(props.idx, map, pA, pB, massdk)}
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
    if (MODE === "1") {
      idxDel >= 0 && setOpenDel(true);
      idxDel < 0 && setOpenCreate(true);
    }
  };

  const InstanceRefDo = (ref: React.Ref<any>) => {
    if (ref) {
      // console.log('2###:',MODE, openWaysForm,datestat.have)
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

  const handleChangeSubArea = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === "0" && MODE === "0") {
      SUBAREA = SubArea[0].toString();
      setCurrency("1"); // встать на перваый подрайон в списке
    } else {
      if (Number(event.target.value) > SubArea.length) {
        console.log("Здесь будет добавление подрайона");
      } else {
        if (Number(event.target.value)) {
          SUBAREA = SubArea[Number(event.target.value) - 1].toString();
        } else SUBAREA = event.target.value;
        setCurrency(event.target.value);
      }
    }
    PressButton(121);
  };

  const handleChangeMode = (event: React.ChangeEvent<HTMLInputElement>) => {
    let mode = Number(event.target.value);
    mode--;
    if (mode === 0) {
      mode = 1;
    } else if (mode === 1) mode = 0;
    setCurrencyMode(event.target.value);
    setCurrencyPK("0"); // переключение меню ПК и моделей на заголовок
    MODE = mode.toString();
    if (MODE === "0") {
      if (SUBAREA === "0") {
        SUBAREA = SubArea[0].toString();
        setCurrency("1");
      }
      TurnOnDemoRoute(); // влючение ФС
    }
    PressButton(212);
  };

  const handleChangePK = (event: React.ChangeEvent<HTMLInputElement>) => {
    let pk = Number(event.target.value);
    if (!pk) pk++;
    setCurrencyPK(pk.toString());
    setCurrencyMode("0"); // переключение меню 'Перекрёстки и связи' на заголовок
    PK = pk.toString();
    MODE = "2";
    TurnOnDemoRoute(); // влючение ФС
    ZeroRoute(false);
    pk === 1 && PressButton(202);
    pk === 2 && PressButton(201);
    pk === 4 && PressButton(204);
  };

  const handleChangeCalc = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrencyMode("0"); // переключение меню 'Перекрёстки и связи' на заголовок
    MODE = "2";
    setCurrencyCalc(event.target.value);
    CALC = event.target.value;
    PressButton(205);
  };

  const handleChOptim = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrencyMode("0"); // переключение меню 'Перекрёстки и связи' на заголовок
    MODE = "2";
    setCurrencyOptim(event.target.value);
    OPTIM = event.target.value;
    PressButton(402);
  };

  const handleChForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrencyForm(event.target.value);
    FORM = event.target.value;
    PressButton(203);
  };

  const SetOpenVertForm = (mode: boolean, forma: any, openErr: boolean) => {
    setOpenVertForm(false); // закрытие старой формы
    HandlLockUp(true); // блокировка меню районов и меню режимов
    if (!mode) {
      VertexForma = null; // полное закрытие
      ZeroRoute((openEF = false));
    } else {
      VertexForma = forma;
      openEF = openErr;
      setOpenVertForm(true);
      setTriggerForm(!triggerForm); // перезапуск новой формы
    }
  };

  const SetMassPkId = (massPkId: any, subarea: number, mode: number) => {
    MASSPK = massPkId;
    SUBAREA = subarea.toString();
    TurnOnDemoRoute(); // перерисовка связей
    if (massplan.plans.length) PLANER = massplan.plans[datestat.idxMenu].nomPK;
    setCurrency((SubArea.indexOf(subarea) + 1).toString());
    mode && setRevers(!revers); // ререндер
  };

  const SetModePKForm = (idx: number) => {
    idxPKForm = idx;
    SUBAREA = massplan.plans[idx].subareaPK.toString();
    setCurrency((SubArea.indexOf(Number(SUBAREA)) + 1).toString());
    setOpenPKSpis((BALLOON = false)); // запрет на выдачу балуна / закрытие списка планов
    VIEWDIR = true; // разрешение посмотра инф-ии о направл.в балуне
    datestat.needMenuForm = false; //  не выдавать меню форм
    dispatch(statsaveCreate(datestat));
    HandlLockUp(true); // блокировка меню районов и меню режимов
    setOpenPKForm(true); // окрытие MapCreatePK
    TurnOnDemoRoute();
  };

  const SetPuskMenu = (mode: number) => {
    HandlLockUp(true); // не выдавать меню форм / блокировка меню районов и меню режимов
    setOpenPKSpis((datestat.needMenuForm = true)); // открытие списка планов
    dispatch(statsaveCreate(datestat));
    TurnOnDemoRoute();
    VIEWDIR = false; // разрешение посмотра инф-ии о направл.в балуне
  };

  const SetDispPKForm = (mode: boolean) => {
    setCurrencyForm((FORM = "0"));
    setDispPKForm(mode);
  };

  const SetDispCalc = (mode: boolean) => {
    setCurrencyCalc((CALC = "0"));
    setDispCalc(mode);
  };

  const SetDispOptim = (mode: boolean) => {
    setCurrencyOptim((OPTIM = "0"));
    setDispOptim(mode);
  };

  const SetOpenPKSetup = (mode: boolean) => {
    setCurrencyPK((PK = "0")); // переключение меню 'ПЛ и модели' на заголовок
    setOpenPKSetup(mode);
  };

  const SetOpenVertSetup = (mode: boolean) => {
    setCurrencyMode("0"); // переключение меню 'Перекрёстки и связи' на заголовок
    MODE = "-1";
    setOpenVertSetup(false);
  };
  //=== инициализация ======================================
  if (!flagOpen && Object.keys(massroute).length) {
    if (props.region) homeRegion = props.region;
    if (!props.region && massroute.vertexes.length)
      homeRegion = massroute.vertexes[0].region;
    massroute.vertexes = MasrouteAgreeMap(massroute);
    for (let i = 0; i < massroute.points.length; i++)
      massroute.vertexes.push(massroute.points[i]); // дописывание инф-ии о точках в массив перекрёстков
    for (let i = 0; i < massroute.vertexes.length; i++) {
      massdk.push(MasskPoint(massroute.vertexes[i]));
      coordinates.push(DecodingCoord(massroute.vertexes[i].dgis));
    }
    dispatch(massdkCreate(massdk));
    dispatch(massrouteCreate(massroute));
    dispatch(coordinatesCreate(coordinates));
    pointCenter = CenterCoordBegin(map);
    let massVert = map.dateMap.tflight;
    for (let i = 0; i < massVert.length; i++)
      if (SubArea.indexOf(massVert[i].subarea) < 0)
        SubArea.push(massVert[i].subarea);
    SubArea.sort((a, b) => a - b); // сортировка по возрастанию
    currencies = PreparCurrencies(); // для меню подрайонов
    currenciesMode = PreparCurrenciesMode(); // для меню подрайонов режимов работы
    currenciesPK = PreparCurrenciesPK(); // для меню ПК и модели
    currenciesCalc = PreparCurrenciesCalc(); // для меню расчётов
    currenciesOptim = PreparCurrenciesOptim(); // для меню оптимизации ПК
    currenciesForm = PreparCurrenciesForm(); // для меню диспетчера форм
    flagOpen = true;
    console.log("map:", map);
    console.log("massroute:", massroute);
    console.log("!!!massdk:", massdk);
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
    if (PLANER > 0 && routePKW) {
      // передача изображений в привязку через "инф-я о направлениях"
      let regArea = homeRegion.toString() + "-" + AREA + "-";
      masSvg[0] = props.svg[regArea + routePKW.sourceID.toString()];
      masSvg[1] = props.svg[regArea + routePKW.targetID.toString()];
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
          {InputMenu(handleChangeSubArea, currency, currencies)}
          {InputMenuMODE(handleChangeMode, currencyMode, currenciesMode)}
          {InputMenuPK(handleChangePK, currencyPK, currenciesPK)}
          {PLANER > 0 && (
            <>
              {MODE !== "0" && (
                <>{InputMenuForm(handleChForm, currencyForm, currenciesForm)}</>
              )}
              {InputMenuCalc(handleChangeCalc, currencyCalc, currenciesCalc)}
              {InputMenuOptim(handleChOptim, currencyOptim, currenciesOptim)}
              {StrokaMenuGlob("Целевая функция", PressButton, 401)}
            </>
          )}
        </>
      )}
      {MakeRevers(makeRevers, needRevers, PressButton)}
      {ShowFormalRoute(flagDemo, PressButton)}
      {MainMenu(flagPusk, flagRoute, PressButton)}
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
            {PLANER > 0 && (
              <MapWindPK close={setRoutePKW} route={routePKW} svg={masSvg} />
            )}
            {dispCalc && <MapDispCalc setOpen={SetDispCalc} />}
            {dispOptim && <MapDispOptim setOpen={SetDispOptim} />}
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
            {openVertSetup && <MapVertexSetup close={SetOpenVertSetup} />}
            {openPKForm && (
              <MapCreatePK
                setOpen={ZeroMenuPK}
                SetMass={SetMassPkId}
                idx={idxPKForm}
                setPuskMenu={SetPuskMenu}
              />
            )}
            {openPKSpis && (
              <MapSpisPK
                setOpen={ZeroMenuPK}
                setMode={SetModePKForm}
                SetMass={SetMassPkId}
              />
            )}
            {openPKSetup && (
              <MapSetupPK close={SetOpenPKSetup} plan={null} setplan={null} />
            )}
            {openEr && (
              <MapPointDataError
                setOpen={setOpenEr}
                sErr={soobError}
                fromCross={fromCross}
                toCross={toCross}
                update={UpdateAddRoute}
                setSvg={props.setSvg}
              />
            )}
            {openInf && (
              <MapRouteInfo
                setOpen={setOpenInf}
                activeRoute={activeRoute}
                idxA={pointAaIndex}
                idxB={pointBbIndex}
                reqRoute={reqRoute}
                setReqRoute={SetReqRoute}
                needLinkBind={needLinkBind}
              />
            )}
            {openBind && pointAaIndex >= 0 && pointBbIndex >= 0 && (
              <MapRouteBind
                setOpen={setOpenBind}
                svg={masSvg}
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
