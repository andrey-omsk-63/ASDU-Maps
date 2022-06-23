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
import { MapNewPoint, RecordMassRoute } from "./MapServiceFunctions";
import { DecodingCoord, CodingCoord } from "./MapServiceFunctions";
import {MassOtladka} from "./MapServiceFunctions";

import { styleSetPoint, styleTypography } from "./MainMapStyle";
import { styleApp01, styleModalEndMapGl, styleModalMenu } from "./MainMapStyle";

import { Tflight } from "./../interfaceMAP.d";
import { Pointer } from "./../App";

let coordinates: Array<Array<number>> = [[]]; // массив координат
let coordStart: any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // рабочий массив координат связей
let coordStop: any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // рабочий массив координат связей

let dateMap: Tflight[] = [{} as Tflight];
let flagOpen = false;
let flagRoute = false;
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
  console.log('MassOtladka:',MassOtladka)
  //== Piece of Redux ======================================
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
  //========================================================
  // инициализация
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
    dispatch(massdkCreate(massdk));
    dispatch(massrouteCreate(massroute));
  }
  //========================================================
  const [openSetInf, setOpenSetInf] = React.useState(false);
  const [openSetEr, setOpenSetEr] = React.useState(false);

  const ZeroRoute = () => {
    pointA = 0;
    pointB = 0;
    pointAa = 0;
    pointBb = 0;
    pointAaIndex = -1;
    pointBbIndex = -1;
    coordStart = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    coordStop = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    flagRoute = false;
    setSize(window.innerWidth + Math.random());
  };

  const MakeRecordMassRoute = () => {
    let flStart = false;
    let flStop = false;
    let pointAcod = CodingCoord(pointA);
    let pointBcod = CodingCoord(pointB);
    for (let i = 0; i < massroute.length; i++) {
      if (massroute[i].start === pointAcod) flStart = true;
      if (massroute[i].stop === pointBcod) flStop = true;
    }
    if (flStart && flStop) {
      soobError = "Не сохранено - дубликатная связь";
      setOpenSetEr(true);
    } else {
      massroute.push(RecordMassRoute(pointAcod, pointBcod, activeRoute));
      console.log("massroute:", massroute);
      ZeroRoute();
    }
  };

  const PressMenuButton = (mode: number) => {
    switch (mode) {
      case 1: // создание/пересоздание маршрута
        if (pointAa === 0) {
          soobError = "Не задана начальная точка связи";
          setOpenSetEr(true);
          break;
        }
        if (pointBb === 0) {
          soobError = "Не задана конечная точка связи";
          setOpenSetEr(true);
          break;
        }
        pointA = pointAa;
        pointB = pointBb;
        flagRoute = true;
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
        break;
      case 69: // инфа о маршруте
        if (activeRoute) setOpenSetInf(true);
        break;
      case 77: // удаление маршрута
        pointCenter = pointCenterOld;
        ZeroRoute();
    }
  };

  const [zoom, setZoom] = React.useState<number>(9.5);

  const mapState = {
    center: pointCenter,
    zoom,
    //autoFitToViewport: true,
    behaviors: ["default", "scrollZoom"],
    controls: [],
    yandexMapDisablePoiInteractivity: true,
  };

  const MapGl = (props: { pointa: any; pointb: any }) => {
    const mapp = React.useRef<any>(null);
    let pointAA = props.pointa;
    let pointBB = props.pointb;

    const MakeRoute = () => {
      //=== Запуск создания связи ===
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
        {
          routeActiveStrokeWidth: 5,
          //routeActiveStrokeColor: "#224E1F",
          routeStrokeWidth: 1.5,
        }
      );

      const getMultiRouteOptions = () => {
        return {
          routeActiveStrokeWidth: 3,
          routeStrokeStyle: "dot",
          routeStrokeWidth: 0,
        };
      };

      // const multiRoute0 = new ymaps.multiRouter.MultiRoute(
      let polyRoute0 = new ymaps.Polyline(
        // {
        //   referencePoints: [coordStart[0], coordStop[0]],
        // },
        [coordStart[0], coordStop[0]],
        { balloonContent: "Ломаная линия" },
        {
          // Отключаем кнопку закрытия балуна
          balloonCloseButton: false,
          // Цвет линии
          strokeColor: "#1A9165",
          // Ширина линии
          strokeWidth: 3,
          // Коэффициент прозрачности.
          //strokeOpacity: 1,
        }
        // getMultiRouteOptions()
      );
      const multiRoute0 = new ymaps.multiRouter.MultiRoute(
        {
          referencePoints: [coordStart[0], coordStop[0]],
        },
        getMultiRouteOptions()
      );
      const multiRoute1 = new ymaps.multiRouter.MultiRoute(
        {
          referencePoints: [coordStart[1], coordStop[1]],
        },
        getMultiRouteOptions()
      );
      const multiRoute2 = new ymaps.multiRouter.MultiRoute(
        {
          referencePoints: [coordStart[2], coordStop[2]],
        },
        getMultiRouteOptions()
      );
      const multiRoute3 = new ymaps.multiRouter.MultiRoute(
        {
          referencePoints: [coordStart[3], coordStop[3]],
        },
        getMultiRouteOptions()
      );
      const multiRoute4 = new ymaps.multiRouter.MultiRoute(
        {
          referencePoints: [coordStart[4], coordStop[4]],
        },
        getMultiRouteOptions()
      );
      const multiRoute5 = new ymaps.multiRouter.MultiRoute(
        {
          referencePoints: [coordStart[5], coordStop[5]],
        },
        getMultiRouteOptions()
      );
      const multiRoute6 = new ymaps.multiRouter.MultiRoute(
        {
          referencePoints: [coordStart[6], coordStop[6]],
        },
        getMultiRouteOptions()
      );
      const multiRoute7 = new ymaps.multiRouter.MultiRoute(
        {
          referencePoints: [coordStart[7], coordStop[7]],
        },
        getMultiRouteOptions()
      );
      const multiRoute8 = new ymaps.multiRouter.MultiRoute(
        {
          referencePoints: [coordStart[8], coordStop[8]],
        },
        getMultiRouteOptions()
      );
      const multiRoute9 = new ymaps.multiRouter.MultiRoute(
        {
          referencePoints: [coordStart[9], coordStop[9]],
        },
        getMultiRouteOptions()
      );
      const multiRoute10 = new ymaps.multiRouter.MultiRoute(
        {
          referencePoints: [coordStart[10], coordStop[10]],
        },
        getMultiRouteOptions()
      );
      const multiRoute11 = new ymaps.multiRouter.MultiRoute(
        {
          referencePoints: [coordStart[11], coordStop[11]],
        },
        getMultiRouteOptions()
      );
      // === максимум 12 связей ===
      mapp.current.geoObjects.add(multiRoute);
      mapp.current.geoObjects.add(multiRoute0);
      mapp.current.geoObjects.add(multiRoute1);
      mapp.current.geoObjects.add(multiRoute2);
      mapp.current.geoObjects.add(multiRoute3);
      mapp.current.geoObjects.add(multiRoute4);
      mapp.current.geoObjects.add(multiRoute5);
      mapp.current.geoObjects.add(multiRoute6);
      mapp.current.geoObjects.add(multiRoute7);
      mapp.current.geoObjects.add(multiRoute8);
      mapp.current.geoObjects.add(multiRoute9);
      mapp.current.geoObjects.add(multiRoute10);
      mapp.current.geoObjects.add(multiRoute11);

      multiRoute.model.events.add("requestsuccess", function () {
        activeRoute = multiRoute.getActiveRoute();
      });
    };

    const getPointData = (index: number) => {
      let textBalloon = "";
      if (index === pointAaIndex) textBalloon = "Начало";
      if (index === pointBbIndex) textBalloon = "Конец";
      //let textID = massdk[index].ID;
      return {
        hintContent: massdk[index].nameCoordinates,
        //balloonContent: PressBalloon(index),
        //iconCaption: textBalloon,
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

    const OnPlacemarkClickPoint = (index: number) => {
      if (pointAa === 0) {
        // начальная точка
        pointAaIndex = index;
        pointAa = [massdk[index].coordinates[0], massdk[index].coordinates[1]];
        pointCenter = pointCenterOld;
        // === создание коллекции связей ===
        let j = 0;
        for (let i = 0; i < massroute.length; i++) {
          if (massroute[i].start === CodingCoord(pointAa) && j < 12) {
            coordStart[j] = pointAa;
            coordStop[j] = DecodingCoord(massroute[i].stop);
            j++;
          }
        }
        pointCenter = pointCenterOld;
        setSize(window.innerWidth + Math.random());
      } else {
        if (pointBb === 0) {
          // конечная точка
          if (pointAaIndex === index) {
            // в меню работы с точками
            indexPoint = index;
            setOpenSet(true);
            // soobError = 'Начальная и конечная точки совпадают';
            // setOpenSetEr(true);
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
          // в меню работы с точками
          indexPoint = index;
          setOpenSet(true);
        }
      }
    };

    const [openSet, setOpenSet] = React.useState(false);
    const handleCloseSet = (event: any, reason: string) => {
      if (reason !== "backdropClick") setOpenSet(false);
    };

    const handleCloseSetBut = () => {
      setOpenSet(false);
    };

    const [openSetAdress, setOpenSetAdress] = React.useState(false);

    const ModalPressBalloon = () => {
      const [openSetErBall, setOpenSetErBall] = React.useState(false);
      let flStart = false;
      let flStop = false;
      let pointRoute: any = 0;
      let pointCod = "";
      if (indexPoint >= 0 && indexPoint < massdk.length) {
        pointRoute = [
          massdk[indexPoint].coordinates[0],
          massdk[indexPoint].coordinates[1],
        ];
        pointCod = CodingCoord(pointRoute);
        for (let i = 0; i < massroute.length; i++) {
          if (massroute[i].start === pointCod) flStart = true;
          if (massroute[i].stop === pointCod) flStop = true;
        }
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
              massdk.splice(indexPoint, 1);
              coordinates.splice(indexPoint, 1);
              setOpenSet(false);
            }
            break;
          case 4: // Редактирование адреса
            setOpenSetAdress(true);
        }
      };

      const StrokaPressBalloon = (soob: string, mode: number) => {
        return (
          <Button
            sx={styleModalMenu}
            variant="contained"
            onClick={() => handleClose(mode)}
          >
            <b>{soob}</b>
          </Button>
        );
      };

      return (
        <Modal open={openSet} onClose={handleCloseSet} hideBackdrop>
          <Box sx={styleSetPoint}>
            <Button sx={styleModalEndMapGl} onClick={handleCloseSetBut}>
              <b>&#10006;</b>
            </Button>
            <Box sx={{ marginTop: 2, textAlign: "center" }}>
              {StrokaPressBalloon("Удаление точки", 3)}
              {StrokaPressBalloon("Редактирование адреса", 4)}
              {flStart && <>{StrokaPressBalloon("Demo связанных точек", 5)}</>}
              {flStop && <>{StrokaPressBalloon("Demo головной точки", 6)}</>}
            </Box>
            <Typography variant="h6" sx={styleTypography}>
              Перестроение связи:
            </Typography>
            <Box sx={{ textAlign: "center" }}>
              {StrokaPressBalloon("Начальная точка", 1)}
              {StrokaPressBalloon("Конечная точка", 2)}
            </Box>
            {openSetAdress && (
              <MapInputAdress
                indexPoint={indexPoint}
                setOpen={setOpenSetAdress}
              />
            )}
            {openSetErBall && (
              <MapPointDataError
                soobError={soobError}
                setOpen={setOpenSetErBall}
              />
            )}
          </Box>
        </Modal>
      );
    };

    const NewPoint = (coords: any) => {
      massdk.push(MapNewPoint(coords, chNewCoord++));
      coordinates.push(coords);
      setSize(window.innerWidth + Math.random());
    };

    return (
      <YMaps
        query={{
          apikey: "65162f5f-2d15-41d1-a881-6c1acf34cfa1",
          //apikey: "b9f13766-acdb-46cd-a2a1-fc790dd80cec",
          lang: "ru_RU",
        }}
      >
        <Map
          modules={["multiRouter.MultiRoute", "Polyline"]}
          state={mapState}
          instanceRef={(ref) => {
            if (ref) {
              mapp.current = ref;
              // нажата правая кнопка мыши
              mapp.current.events.add("contextmenu", function (e: any) {
                if (mapp.current.hint) {
                  // pointCenter = pointCenterOld;
                  NewPoint(e.get("coords"));
                }
              });
              // нажата левая/правая кнопка мыши
              mapp.current.events.add("mousedown", function (e: any) {
                // 0, 1 или 2 в зависимости от того, какая кнопка мыши нажата (В IE значение может быть от 0 до 7).
                if (e.get("domEvent").originalEvent.button === 0) {
                  pointCenterOld = pointCenter;
                  pointCenter = e.get("coords");
                }
              });
              // покрутили колёсико мыши
              mapp.current.events.add(["boundschange"], function () {
                setZoom(mapp.current.getZoom());
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
            <MapPointDataError soobError={soobError} setOpen={setOpenSetEr} />
          )}
          {openSetInf && (
            <MapRouteInfo
              activeRoute={activeRoute}
              name1={massdk[pointAaIndex].nameCoordinates}
              name2={massdk[pointBbIndex].nameCoordinates}
              setOpen={setOpenSetInf}
            />
          )}
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

  const StrokaMenuButton = (soob: string, mode: number) => {
    return (
      <Button sx={styleApp01} onClick={() => PressMenuButton(mode)}>
        <b>{soob}</b>
      </Button>
    );
  };

  return (
    <Grid container sx={{ border: 0, height: "99.5vh" }}>
      {!flagRoute && <>{StrokaMenuButton("Отмена назначений", 77)}</>}
      {flagRoute && (
        <>
          {StrokaMenuButton("Сохранить связь", 21)}
          {StrokaMenuButton("Отменить связь", 77)}
          {StrokaMenuButton("Реверс связи", 12)}
          {StrokaMenuButton("Информ о связи", 69)}
        </>
      )}
      <MapGl pointa={pointA} pointb={pointB} />
    </Grid>
  );
};

export default MainMap;
