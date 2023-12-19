import * as React from "react";
import { useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
//import Modal from "@mui/material/Modal";
import Slider from "@mui/material/Slider";

import MapWindViewGraf from "./MapWindViewGraf";
import MapWindViewImg from "./MapWindViewImg";

import { StrokaTablWindPK, ReplaceInSvg } from "../../MapServiceFunctions";

import { styleWindPK00, styleWindPK01 } from "../../MainMapStyle";
import { styleWindPK02, styleWindPK05 } from "../../MainMapStyle";
import { styleWindPK90, styleWindPKEnd } from "../../MainMapStyle";
//import { styleModalEndBind, stylePKForm01 } from "../../MainMapStyle";
import { styleWindPK06 } from "../../MainMapStyle";
import { styleWindPK07, styleWindPK08 } from "../../MainMapStyle";

import { Directions } from "../../../App"; // интерфейс massForm

import { KolIn } from "./../../MapConst";

import { Chart as ChartJS, CategoryScale } from "chart.js";
import { LinearScale, PointElement } from "chart.js";
import { LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

//import { Directions } from "../../../App"; // интерфейс massForm
interface DataGl {
  labels: string[];
  datasets: Datasets[];
}

interface Datasets {
  label: string;
  data: number[];
  borderWidth: number;
  borderColor: string;
  backgroundColor: string;
  pointRadius: number;
}

let nameIn = "";
let IDX = -1;
let timeInterval = 80;

let massForm: Directions = {
  name: "0121", // номер направления
  satur: 3600, // Насыщение(т.е./ч.)
  intensTr: 900, // Интенсивность(т.е./ч.)
  dispers: 50, // Дисперсия пачки(%)
  peregon: 248, // Длинна перегона(м)
  wtStop: 1, // Вес остановки
  wtDelay: 1, // Вес задержки
  offsetBeginGreen: 7, // Смещ.начала зелёного(сек)
  offsetEndGreen: 0, // Смещ.конца зелёного(сек)
  intensFl: 1200, // Интенсивность пост.потока(т.е./ч.)
  phases: [], // зелёные фазы для данного направления
  edited: false,
  opponent: "", // Левый поворот конкурирует с направлением...
};

const MapWindPK = (props: {
  close: Function; // функция возврата в родительский компонент
  route: any;
}) => {
  //console.log("MapWindPK:", props.route);
  //== Piece of Redux =======================================
  // let massplan = useSelector((state: any) => {
  //   const { massplanReducer } = state;
  //   return massplanReducer.massplan;
  // });
  // console.log("###massplan:", massplan);
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  //console.log('massplan:', massplan, massSpis);
  //const dispatch = useDispatch();
  //===========================================================
  const [value, setValue] = React.useState(67);
  const [openImg, setOpenImg] = React.useState(false);
  const [openGraf, setOpenGraf] = React.useState(false);

  //=== инициализация ======================================
  if (props.route) nameIn = props.route.targetID + ".";
  const labels: string[] = [];
  let data: DataGl = {
    labels,
    datasets: [
      {
        label: "Вх.поток",
        data: [],
        borderWidth: 1,
        borderColor: "blue",
        backgroundColor: "blue",
        pointRadius: 1,
      },
      {
        label: "Вых.поток",
        data: [],
        borderWidth: 1,
        borderColor: "orange",
        backgroundColor: "orange",
        pointRadius: 1,
      },
      {
        label: "Очередь",
        data: [],
        borderWidth: 1,
        borderColor: "red",
        backgroundColor: "red",
        pointRadius: 1,
      },
    ],
  };

  //========================================================
  const CloseEnd = React.useCallback(() => {
    props.close(null);
  }, [props]);

  //=== обработка Esc ======================================
  const escFunction = React.useCallback(
    (event) => {
      if (event.keyCode === 27) {
        console.log("ESC!!!");
        CloseEnd();
      }
    },
    [CloseEnd]
  );

  React.useEffect(() => {
    document.addEventListener("keydown", escFunction);
    return () => document.removeEventListener("keydown", escFunction);
  }, [escFunction]);
  //=== Функции - обработчики ==============================
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };
  //========================================================
  const ClickImg = (idx: number) => {
    IDX = idx;
    setOpenImg(true);
  };

  const ClickBlok = (idx: number) => {
    IDX = idx;
    setOpenGraf(true);
  };

  const PointsGraf01 = () => {
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top" as const,
          labels: {
            font: {
              weight: "bold",
              size: 7,
            },
            boxWidth: 10,
          },
        },
        title: {
          display: false,
        },
      },
      scales: {
        x: {
          ticks: {
            font: {
              size: 8,
            },
          },
        },
        y: {
          ticks: {
            font: {
              size: 8,
            },
          },
        },
      },
    };
    return <Line options={options} data={data} />;
  };

  const PointsGraf00 = () => {
    while (labels.length > 0) labels.pop(); // labels = [];
    for (let i = 0; i < timeInterval; i++) labels.push(i.toString());
    //for (let i = 0; i < timeInterval; i++) labels.push(i.toString());
    // let int = 0;
    // //график прямого
    // let datas = [];
    // // for (let i = 0; i < pointer[namer].length; i++) {
    // //   datas.push(pointer[namer][i].Value[0]);
    // // }
    // if (pointer[namer].length !== 0)
    //   int = pointer[namer][pointer[namer].length - 1].Value[0];
    // datas.push(int);
    // for (let i = 0; i < pointer[namer].length - 1; i++) {
    //   int = 0;
    //   if (pointer[namer].length !== 0) int = pointer[namer][i].Value[0];
    //   datas.push(int);
    // }
    // data.datasets[0].data = datas;
    // //график обратного
    // datas = [];
    // // for (let i = 0; i < pointer[namer].length; i++) {
    // //   datas.push(pointer[namer][i].Value[1]);
    // // }
    // if (pointer[namer].length !== 0)
    //   int = pointer[namer][pointer[namer].length - 1].Value[1];
    // datas.push(int);
    // for (let i = 0; i < pointer[namer].length - 1; i++) {
    //   int = 0;
    //   if (pointer[namer].length !== 0) int = pointer[namer][i].Value[1];
    //   datas.push(int);
    // }
    // data.datasets[1].data = datas;
    //console.log(":");

    return <>{PointsGraf01()}</>;
  };

  const OutputGraf = (idx: number) => {
    return (
      <Box sx={styleWindPK05} onClick={() => ClickBlok(idx)}>
        <Grid container>
          <Grid item xs={0.5} sx={{ border: 0 }}>
            <Box sx={styleWindPK06}>
              <b>Tе:Тцикла*C</b>
            </Box>
          </Grid>

          <Grid item xs={11.5} sx={{ fontSize: 8.3, border: 0 }}>
            <Box sx={styleWindPK07}>
              Изменение потока на направлении <b>{nameIn + (idx + 1)}</b>
              <Box sx={styleWindPK08}>{PointsGraf00()}</Box>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ fontSize: 8.1, textAlign: "center" }}>
          <b>Тцикла</b>
        </Box>
      </Box>
    );
  };

  const styleWindPK055 = {
    height: 136,
    fontSize: 12.9,
    cursor: "pointer",
    textAlign: "center",
  };

  const ContentTabl = (idx: number) => {
    let expSvg = ReplaceInSvg(datestat.exampleImg1, "136");
    return (
      <Box sx={styleWindPK01}>
        <Box sx={styleWindPK90(712)}>
          <Box sx={styleWindPK02}>
            <Box sx={styleWindPK055} onClick={() => ClickImg(idx)}>
              <div dangerouslySetInnerHTML={{ __html: expSvg }} />
            </Box>
          </Box>
          <b>Свойства направления</b>
          <Box sx={styleWindPK02}>{OutputGraf(idx)}</Box>
          <Box sx={styleWindPK02}>
            <Box sx={{ marginBottom: 0.5 }}>
              {StrokaTablWindPK("Номер", massForm.name)}
              {StrokaTablWindPK("Насыщение", massForm.satur)}
              {StrokaTablWindPK("Интенсивность", massForm.intensTr)}
              {StrokaTablWindPK("Дисперсия пачки", massForm.dispers)}
              {StrokaTablWindPK("Длина перегона", massForm.peregon)}
              {StrokaTablWindPK("Вес остановки", massForm.wtStop)}
              {StrokaTablWindPK("Вес задержки", massForm.wtDelay)}
              {StrokaTablWindPK(
                "Смещ-е нач.зелёного",
                massForm.offsetBeginGreen
              )}
              {StrokaTablWindPK("Смещ-е кон.зелёного", massForm.offsetEndGreen)}
              {StrokaTablWindPK("Интенс-ть пост.потока", massForm.intensFl)}
              {StrokaTablWindPK("Т остановки", 0)}
              {StrokaTablWindPK("Т задержки", 0.433)}
              {StrokaTablWindPK("Тсл.+перегр.", 0.473)}
            </Box>
          </Box>

          <Box sx={styleWindPK02}>
            Насыщенность зелёного = <b>{value}</b>%
            <Box sx={{ width: 200, height: 40 }}>
              <Slider
                value={value}
                onChange={handleSliderChange}
                color="secondary"
                disabled={true}
              />
            </Box>
            <Grid container sx={{ height: window.innerHeight * 0.015 }}>
              <Grid item xs={3} sx={{ bgcolor: "#C2ECAE" }}></Grid>
              <Grid item xs={3} sx={{ bgcolor: "#9DDB59" }}></Grid>
              <Grid item xs={3} sx={{ bgcolor: "#69A824" }}></Grid>
              <Grid item xs={3} sx={{ bgcolor: "#477218" }}></Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    );
  };

  const SpisDirections = (sum: number) => {
    let resStr = [];
    for (let i = 0; i < sum; i++) {
      massForm.name = nameIn + (i + 1).toString();
      resStr.push(
        <Grid key={i} item xs={12 / sum} sx={{ border: 0 }}>
          <Box>{ContentTabl(i)}</Box>
        </Grid>
      );
    }
    resStr.push(
      <Button key={-1} sx={styleWindPKEnd} onClick={() => CloseEnd()}>
        <b>&#10006;</b>
      </Button>
    );
    return resStr;
  };

  const ContentInfo = () => {
    return (
      <Box sx={styleWindPK01}>
        <Box sx={styleWindPK90(datestat.nomMenu > 0 ? 127 : 100)}>
          <b>Общая информация</b>
          <Box sx={styleWindPK02}>
            <Box sx={{ marginBottom: 0.5 }}>Функция до 422.611</Box>
            <Box sx={{ marginBottom: 0.5 }}>Функция после 422.611</Box>
            <Box sx={{ marginBottom: 0.5 }}>Время расчёта 0.016 сек.</Box>
          </Box>
          {datestat.nomMenu > 0 && (
            <Box sx={{ fontSize: 12.9, marginTop: 1 }}>
              <b>Выбран план координации №{datestat.nomMenu} </b>
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  // const ViewImg = (idx: number) => {
  //   const handleClose = () => {
  //     setOpenImg(false);
  //   };

  //   const CloseEnd = (event: any, reason: string) => {
  //     if (reason === "escapeKeyDown") handleClose();
  //   };

  //   return (
  //     <Modal open={openImg} onClose={CloseEnd} hideBackdrop={false}>
  //       <Box sx={stylePKForm01}>
  //         <Button sx={styleModalEndBind} onClick={() => handleClose()}>
  //           <b>&#10006;</b>
  //         </Button>
  //         <Box sx={styleWindPK04}>
  //           Картинка перекрёстка <b>{props.route.targetID}</b> с направлением{" "}
  //           <b>{nameIn + (idx + 1)}</b>
  //         </Box>
  //       </Box>
  //     </Modal>
  //   );
  // };

  return (
    <>
      {props.route ? (
        <Box sx={styleWindPK00(KolIn)}>
          <Grid container sx={{ marginBottom: 0.5 }}>
            {SpisDirections(KolIn)}
          </Grid>
        </Box>
      ) : (
        <Box sx={styleWindPK00(1)}>{ContentInfo()}</Box>
      )}
      {openImg && (
        <MapWindViewImg close={setOpenImg} idx={IDX} route={props.route} />
      )}
      {openGraf && (
        <MapWindViewGraf close={setOpenGraf} idx={IDX} route={props.route} />
      )}
    </>
  );
};

export default MapWindPK;
