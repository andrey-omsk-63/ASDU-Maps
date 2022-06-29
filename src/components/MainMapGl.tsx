import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { massdkCreate, massrouteCreate } from "./../redux/actions";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import { YMaps, Map, Placemark, FullscreenControl } from "react-yandex-maps";
import { GeolocationControl } from "react-yandex-maps";
import { RulerControl, SearchControl } from "react-yandex-maps";
import { TrafficControl, TypeSelector, ZoomControl } from "react-yandex-maps";

import MapRouteInfo from "./MapComponents/MapRouteInfo";
import MapInputAdress from "./MapComponents/MapInputAdress";
import MapPointDataError from "./MapComponents/MapPointDataError";
import MapRouteBind from "./MapComponents/MapRouteBind";

import { MapNewPoint, RecordMassRoute } from "./MapServiceFunctions";
import { DecodingCoord, CodingCoord } from "./MapServiceFunctions";
import { getMultiRouteOptions } from "./MapServiceFunctions";
import { getMassPolyRouteOptions } from "./MapServiceFunctions";
import { getMassMultiRouteOptions } from "./MapServiceFunctions";
import { getMassMultiRouteInOptions } from "./MapServiceFunctions";
import { massOtladka } from "./MapServiceFunctions";

import { styleSetPoint, styleTypography } from "./MainMapStyle";
import { styleApp01, styleModalEndMapGl, styleModalMenu } from "./MainMapStyle";

import { Tflight } from "./../interfaceMAP.d";
import { Pointer } from "./../App";

let coordinates: Array<Array<number>> = [[]]; // массив координат
let coordStart: any = []; // рабочий массив координат связей
let coordStop: any = []; // рабочий массив координат связей
let coordStartIn: any = []; // рабочий массив координат связей
let coordStopIn: any = []; // рабочий массив координат связей
let massRoute: any = []; // рабочий массив сети связей

let dateMap: Tflight[] = [{} as Tflight];
let flagOpen = false;
let flagPusk = false;
let flagRoute = false;
let flagBind = false;
let flagDemo = false;
let chNewCoord = 1;
let activeRoute: any;

let pointCenter: any = 0;
let pointCenterOld: any = 0;
let pointA: any = 0;
let pointAa: any = 0;
let pointB: any = 0;
let pointBb: any = 0;
let indexPoint: number = -1;
let pointAaIndex: number = -1;
let pointBbIndex: number = -1;
let soobError = "";

const MainMap = (props: { Y: number; X: number }) => {
  //== Piece of Redux =======================================
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  let massroute = useSelector((state: any) => {
    const { massrouteReducer } = state;
    return massrouteReducer.massroute;
  });
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map;
  });
  dateMap = map.dateMap;
  const dispatch = useDispatch();
  //=== инициализация ======================================
  if (!flagOpen) {
    for (let i = 0; i < dateMap.length; i++) {
      let masskPoint: Pointer = {
        ID: -1,
        coordinates: [],
        nameCoordinates: "",
        region: "",
        area: "",
        subarea: 0,
        newCoordinates: 0,
      };
      let mass = [0, 0];
      mass[0] = dateMap[i].points.Y;
      mass[1] = dateMap[i].points.X;
      masskPoint.ID = dateMap[i].ID;
      masskPoint.coordinates = mass;
      masskPoint.nameCoordinates = dateMap[i].description;
      masskPoint.region = dateMap[i].region.num;
      masskPoint.area = dateMap[i].area.num;
      masskPoint.subarea = dateMap[i].subarea;
      masskPoint.newCoordinates = 0;

      massdk.push(masskPoint);
      coordinates.push(mass);
    }
    coordinates.splice(0, 1);
    pointCenter = [props.Y, props.X];
    pointCenterOld = pointCenter;
    flagOpen = true;
    massroute = massOtladka; // костыль, потом убрать
    dispatch(massdkCreate(massdk));
    dispatch(massrouteCreate(massroute));
  }
  //========================================================
  const [zoom, setZoom] = React.useState<number>(9.5);
  const [openSetInf, setOpenSetInf] = React.useState(false);
  const [openSetEr, setOpenSetEr] = React.useState(false);
  const [openSetBind, setOpenSetBind] = React.useState(false);
  const [openSet, setOpenSet] = React.useState(false);
  const [openSetAdress, setOpenSetAdress] = React.useState(false);

  const ZeroRoute = () => {
    pointA = 0;
    pointB = 0;
    pointAa = 0;
    pointBb = 0;
    pointAaIndex = -1;
    pointBbIndex = -1;
    coordStart = [];
    coordStop = [];
    coordStartIn = [];
    coordStopIn = [];
    flagRoute = false;
    flagBind = false;
    pointCenter = pointCenterOld;
    setSize(window.innerWidth + Math.random());
  };

  const MakeRecordMassRoute = () => {
    let flDubl = false;
    let pointAcod = CodingCoord(pointA);
    let pointBcod = CodingCoord(pointB);
    for (let i = 0; i < massroute.length; i++) {
      if (massroute[i].start === pointAcod && massroute[i].stop === pointBcod)
        flDubl = true;
    }
    if (flDubl) {
      soobError = "Не сохранено - дубликатная связь";
      setOpenSetEr(true);
    } else {
      massroute.push(RecordMassRoute(pointAcod, pointBcod, activeRoute));
      ZeroRoute();
    }
  };

  const PressMenuButton = (mode: number) => {
    switch (mode) {
      case 3: // режим включения Demo сети связей
        massRoute = massroute;
        flagDemo = true;
        setSize(window.innerWidth + Math.random());
        break;
      case 6: // режим отмены Demo сети связей
        massRoute = [];
        flagDemo = false;
        setSize(window.innerWidth + Math.random());
        break;
      case 12: // реверс маршрута
        let pa = pointA;
        pointA = pointB;
        pointB = pa;
        pa = pointAa;
        pointAa = pointBb;
        pointBb = pa;
        pa = pointAaIndex;
        pointAaIndex = pointBbIndex;
        pointBbIndex = pa;
        setSize(window.innerWidth + Math.random());
        break;
      case 21: // сохранение маршрута
        MakeRecordMassRoute();
        flagPusk = false;
        break;
      case 33: // привязка направлений
        flagBind = true;
        setOpenSetBind(true);
        break;
      case 69: // инфа о маршруте
        if (activeRoute) setOpenSetInf(true);
        break;
      case 77: // удаление маршрута
        pointCenter = pointCenterOld;
        ZeroRoute();
    }
  };

  const mapState = {
    center: pointCenter,
    zoom, //autoFitToViewport: true, behaviors: ["default", "scrollZoom"], controls: [],
    yandexMapDisablePoiInteractivity: true,
  };

  const MapGl = (props: { pointa: any; pointb: any }) => {
    const mapp = React.useRef<any>(null);
    let pointAA = props.pointa;
    let pointBB = props.pointb;

    const MakeRoute = () => {
      pointCenter = pointCenterOld; // === Запуск создания связи ===
      pointA = pointAa;
      pointB = pointBb;
      flagRoute = true;
      setSize(window.innerWidth + Math.random());
    };

    const addRoute = (ymaps: any) => {
      const multiRoute = new ymaps.multiRouter.MultiRoute(
        {
          referencePoints: [pointAA, pointBB],
        },
        getMultiRouteOptions()
      );
      let massPolyRoute: any = []; // cеть связей
      for (let i = 0; i < massRoute.length; i++) {
        massPolyRoute[i] = new ymaps.Polyline(
          [DecodingCoord(massRoute[i].start), DecodingCoord(massRoute[i].stop)],
          { balloonContent: "Ломаная линия" },
          getMassPolyRouteOptions()
        );
        mapp.current.geoObjects.add(massPolyRoute[i]);
      }
      let massMultiRoute: any = []; // исходящие связи
      for (let i = 0; i < coordStart.length; i++) {
        massMultiRoute[i] = new ymaps.multiRouter.MultiRoute(
          {
            referencePoints: [coordStart[i], coordStop[i]],
          },
          getMassMultiRouteOptions()
        );
        mapp.current.geoObjects.add(massMultiRoute[i]);
      }
      let massMultiRouteIn: any = []; // входящие связи
      for (let i = 0; i < coordStartIn.length; i++) {
        massMultiRouteIn[i] = new ymaps.multiRouter.MultiRoute(
          {
            referencePoints: [coordStartIn[i], coordStopIn[i]],
          },
          getMassMultiRouteInOptions()
        );
        mapp.current.geoObjects.add(massMultiRouteIn[i]);
      }
      mapp.current.geoObjects.add(multiRoute); // основная связь
      multiRoute.model.events.add("requestsuccess", function () {
        activeRoute = multiRoute.getActiveRoute();
      });
    };

    const getPointData = (index: number) => {
      let textBalloon = "";
      if (index === pointAaIndex) textBalloon = "Начало";
      if (index === pointBbIndex) textBalloon = "Конец";
      return {
        hintContent: massdk[index].nameCoordinates, //balloonContent: PressBalloon(index), iconCaption: textBalloon,
        iconContent: textBalloon,
      };
    };

    const getPointOptions = (index: number) => {
      let colorBalloon = "islands#violetStretchyIcon";
      if (massdk[index].newCoordinates > 0)
        colorBalloon = "islands#darkOrangeStretchyIcon";
      if (index === pointAaIndex) colorBalloon = "islands#redStretchyIcon";
      if (index === pointBbIndex) colorBalloon = "islands#darkBlueStretchyIcon";
      return {
        preset: colorBalloon,
      };
    };

    const MakeСollectionRoute = () => {
      for (let i = 0; i < massroute.length; i++) {
        if (massroute[i].start === CodingCoord(pointAa)) {
          coordStart.push(pointAa); // исходящие связи
          coordStop.push(DecodingCoord(massroute[i].stop));
        }
        if (massroute[i].stop === CodingCoord(pointAa)) {
          coordStartIn.push(DecodingCoord(massroute[i].start)); // входящие связи
          coordStopIn.push(pointAa);
        }
      }
    };

    const OnPlacemarkClickPoint = (index: number) => {
      pointCenter = pointCenterOld;
      if (pointAa === 0) {
        pointAaIndex = index; // начальная точка
        pointAa = [massdk[index].coordinates[0], massdk[index].coordinates[1]];
        MakeСollectionRoute();
        flagPusk = true;
        //pointCenter = pointCenterOld;
        setSize(window.innerWidth + Math.random());
      } else {
        if (pointBb === 0) {
          if (pointAaIndex === index) {
            indexPoint = index; // конечная точка
            //setOpenSet(true);   // в меню работы с точками
            soobError = "Начальная и конечная точки совпадают";
            setOpenSetEr(true);
          } else {
            pointBbIndex = index;
            pointBb = [
              massdk[index].coordinates[0],
              massdk[index].coordinates[1],
            ];
            pointCenter = pointCenterOld;
            MakeRoute();
          }
        } else {
          indexPoint = index;
          setOpenSet(true); // в меню работы с точками
        }
      }
    };

    const ModalPressBalloon = () => {
      const [openSetErBall, setOpenSetErBall] = React.useState(false);
      let pointRoute: any = 0;

      if (indexPoint >= 0 && indexPoint < massdk.length) {
        pointRoute = [
          massdk[indexPoint].coordinates[0],
          massdk[indexPoint].coordinates[1],
        ];
      }

      const handleClose = (param: number) => {
        switch (param) {
          case 1: // Начальная точка
            if (pointBbIndex === indexPoint) {
              soobError = "Начальная и конечная точки совпадают";
              setOpenSetErBall(true);
            } else {
              pointAaIndex = indexPoint;
              pointAa = pointRoute;
              pointCenter = pointCenterOld;
              MakeRoute();
            }
            break;
          case 2: // Конечная точка
            if (pointAaIndex === indexPoint) {
              soobError = "Начальная и конечная точки совпадают";
              setOpenSetErBall(true);
            } else {
              pointBbIndex = indexPoint;
              pointBb = pointRoute;
              pointCenter = pointCenterOld;
              MakeRoute();
            }
            break;
          case 3: // Удаление точки
            if (pointAaIndex === indexPoint || pointBbIndex === indexPoint) {
              soobError = "Начальную и конечную точки удалять нельзя";
              setOpenSetErBall(true);
            } else {
              let massRouteRab: any = []; // удаление из массива сети связей
              let coordPoint: any = CodingCoord(coordinates[indexPoint]);
              for (let i = 0; i < massroute.length; i++) {
                if (
                  coordPoint !== massroute[i].start &&
                  coordPoint !== massroute[i].stop
                )
                  massRouteRab.push(massroute[i]);
              }
              massroute.splice(0, massroute.length); // massroute = [];
              massroute = massRouteRab;
              massRoute = massroute;
              coordStart = []; // удаление колекции связей
              coordStop = [];
              coordStartIn = [];
              coordStopIn = [];
              massdk.splice(indexPoint, 1); // удаление самой точки
              coordinates.splice(indexPoint, 1);
              setOpenSet(false);
              //pointCenter = pointCenterOld;
              setSize(window.innerWidth + Math.random());
            }
            break;
          case 4: // Редактирование адреса
            setOpenSetAdress(true);
        }
      };

      const StrokaPressBalloon = (soob: string, mode: number) => {
        return (
          <Button sx={styleModalMenu} onClick={() => handleClose(mode)}>
            <b>{soob}</b>
          </Button>
        );
      };

      return (
        <Modal open={openSet} onClose={() => setOpenSet(false)} hideBackdrop>
          <Box sx={styleSetPoint}>
            <Button sx={styleModalEndMapGl} onClick={() => setOpenSet(false)}>
              <b>&#10006;</b>
            </Button>
            <Box sx={{ marginTop: 2, textAlign: "center" }}>
              {StrokaPressBalloon("Удаление точки", 3)}
              {StrokaPressBalloon("Редактирование адреса", 4)}
            </Box>
            <Typography variant="h6" sx={styleTypography}>
              Перестроение связи:
            </Typography>
            <Box sx={{ textAlign: "center" }}>
              {StrokaPressBalloon("Начальная точка", 1)}
              {StrokaPressBalloon("Конечная точка", 2)}
            </Box>
            {openSetAdress && (
              <MapInputAdress iPoint={indexPoint} setOpen={setOpenSetAdress} />
            )}
            {openSetErBall && (
              <MapPointDataError sErr={soobError} setOpen={setOpenSetErBall} />
            )}
          </Box>
        </Modal>
      );
    };

    return (
      <YMaps
        query={{
          apikey: "65162f5f-2d15-41d1-a881-6c1acf34cfa1", // "b9f13766-acdb-46cd-a2a1-fc790dd80cec",
          lang: "ru_RU",
        }}
      >
        <Map
          modules={["multiRouter.MultiRoute", "Polyline"]}
          state={mapState}
          instanceRef={(ref) => {
            if (ref) {
              mapp.current = ref;
              mapp.current.events.add("contextmenu", function (e: any) {
                // нажата правая кнопка мыши (создание новой точки)
                if (mapp.current.hint) {
                  massdk.push(MapNewPoint(e.get("coords"), chNewCoord++));
                  coordinates.push(e.get("coords"));
                  setSize(window.innerWidth + Math.random());
                }
              });
              mapp.current.events.add("mousedown", function (e: any) {
                // нажата левая/правая кнопка мыши 0, 1 или 2 в зависимости от того, какая кнопка мыши нажата (В IE значение может быть от 0 до 7).
                if (e.get("domEvent").originalEvent.button === 0) {
                  pointCenterOld = pointCenter;
                  pointCenter = e.get("coords");
                }
              });
              mapp.current.events.add(["boundschange"], function () {
                setZoom(mapp.current.getZoom()); // покрутили колёсико мыши
              });
            }
          }}
          onLoad={addRoute}
          width={"99.8%"}
          height={"97%"}
        >
          {coordinates.map((coordinate, idx) => (
            <Placemark
              key={idx}
              geometry={coordinate}
              properties={getPointData(idx)}
              options={getPointOptions(idx)}
              modules={["geoObject.addon.balloon", "geoObject.addon.hint"]}
              onClick={() => OnPlacemarkClickPoint(idx)}
            />
          ))}
          <FullscreenControl />
          <GeolocationControl options={{ float: "left" }} />
          <RulerControl options={{ float: "right" }} />
          <SearchControl
            options={{
              float: "left",
              provider: "yandex#search",
              size: "large",
            }}
          />
          <TrafficControl options={{ float: "right" }} />
          <TypeSelector options={{ float: "right" }} />
          <ZoomControl options={{ float: "right" }} />
          {/* служебные компоненты */}
          <ModalPressBalloon />
          {openSetEr && (
            <MapPointDataError sErr={soobError} setOpen={setOpenSetEr} />
          )}
          {openSetInf && (
            <MapRouteInfo
              activeRoute={activeRoute}
              name1={massdk[pointAaIndex].nameCoordinates}
              name2={massdk[pointBbIndex].nameCoordinates}
              setOpen={setOpenSetInf}
            />
          )}
          {openSetBind && <MapRouteBind setOpen={setOpenSetBind} />}
        </Map>
      </YMaps>
    );
  };

  //отслеживание изменения размера экрана - костыль, делает ререндер
  const [size, setSize] = React.useState(0);
  React.useLayoutEffect(() => {
    function updateSize() {
      setSize(window.innerWidth);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const StrokaMenuGlob = (soob: string, mode: number) => {
    return (
      <Button sx={styleApp01} onClick={() => PressMenuButton(mode)}>
        <b>{soob}</b>
      </Button>
    );
  };

  return (
    <Grid container sx={{ height: "99.5vh" }}>
      {flagPusk && !flagBind && <>{StrokaMenuGlob("Отмена назначений", 77)}</>}
      {flagPusk && flagRoute && !flagBind && (
        <>
          {StrokaMenuGlob("Привязка направлен", 33)}
          {StrokaMenuGlob("Реверс связи", 12)}
          {StrokaMenuGlob("Информ о связи", 69)}
        </>
      )}
      {flagPusk && flagRoute && flagBind && (
        <>
          {StrokaMenuGlob("Сохранить связь", 21)}
          {StrokaMenuGlob("Отменить связь", 77)}
          {StrokaMenuGlob("Информ о связи", 69)}
        </>
      )}
      {!flagDemo && <>{StrokaMenuGlob("Demo сети", 3)}</>}
      {flagDemo && <>{StrokaMenuGlob("Конец Demo", 6)}</>}
      <MapGl pointa={pointA} pointb={pointB} />
    </Grid>
  );
};

export default MainMap;
