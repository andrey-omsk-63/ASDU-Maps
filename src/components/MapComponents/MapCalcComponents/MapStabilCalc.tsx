import * as React from "react";
//import { useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import { StrTablVert, WaysInput } from "../../MapServiceFunctions";

import { styleWVG00, styleModalEndBind } from "../../MainMapStyle";
//import { styleSetPK05, styleSetPK06 } from "../../MainMapStyle";
import { styleFormPK03, styleSetPK04 } from "../../MainMapStyle";
import { styleWVG01, styleWVG02, styleFormPK01 } from "../../MainMapStyle";
import { styleCalc01, styleCalc02 } from "../../MainMapStyle";

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

//import { KolIn } from "./../../MapConst";

let flagInput = true;
let openGrafik = false;

let sumIterate = 2000;
let slIintens = 20;

const MapStabilCalc = (props: {
  view: boolean;
  handleClose: Function; // функция возврата в родительский компонент
}) => {
  //console.log("MapWindPK:", props.name);
  //== Piece of Redux =======================================
  // let massplan = useSelector((state: any) => {
  //   const { massplanReducer } = state;
  //   return massplanReducer.massplan;
  // });
  // console.log("###massplan:", massplan);
  // let datestat = useSelector((state: any) => {
  //   const { statsaveReducer } = state;
  //   return statsaveReducer.datestat;
  // });
  //console.log('massplan:', massplan, massSpis);
  //const dispatch = useDispatch();
  //===========================================================
  const [openGraf, setOpenGraf] = React.useState(true);
  const [trigger, setTrigger] = React.useState(false);

  //=== инициализация ======================================
  if (flagInput) {
    flagInput = false;
    sumIterate = 2000;
    slIintens = 20;
    openGrafik = false;
  }
  const labels: string[] = [];
  let data: DataGl = {
    labels,
    datasets: [
      {
        label: "- Вероятность затора на Х - направлениях сети",
        data: [],
        borderWidth: 1,
        borderColor: "red",
        backgroundColor: "red",
        pointRadius: 1,
      },
    ],
  };
  //========================================================
  const handleClose = React.useCallback(() => {
    flagInput = true;
    openGrafik = false;
    setOpenGraf(false);
    props.handleClose(false);
  }, [props]);

  const CloseEndGl = (event: any, reason: string) => {
    if (reason === "escapeKeyDown") handleClose();
  };
  //=== обработка Esc ======================================
  const escFunction = React.useCallback(
    (event) => {
      if (event.keyCode === 27) {
        console.log("ESC!!!");
        handleClose();
      }
    },
    [handleClose]
  );

  React.useEffect(() => {
    document.addEventListener("keydown", escFunction);
    return () => document.removeEventListener("keydown", escFunction);
  }, [escFunction]);
  //=== Функции - обработчики ==============================
  const CalcStabil = (mode: number) => {
    if (mode) {
      openGrafik = true;
      setTrigger(!trigger);
    } else {
      handleClose();
    }
  };

  const SetSumIterate = (valueInp: number) => {
    sumIterate = valueInp; // Минимальное время цикла
    setTrigger(!trigger); // ререндер
  };

  const SetSlIintens = (valueInp: number) => {
    slIintens = valueInp; // Максимальное время цикла
    setTrigger(!trigger); // ререндер
  };
  //========================================================
  const PointsGraf01 = () => {
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top" as const,
        },
        title: {
          display: false,
        },
      },
    };
    return <Line options={options} data={data} />;
  };

  const PointsGraf00 = () => {
    while (labels.length > 0) labels.pop(); // labels = [];
    for (let i = 0; i <= 12; i++) labels.push(i.toString());
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

    return (
      <Grid container>
        <Grid item xs sx={{ width: "99vh", height: "55vh" }}>
          <PointsGraf01 />
        </Grid>
      </Grid>
    );
  };

  const CalcGraf = () => {
    return (
      <Grid container sx={{}}>
        <Grid item xs={0.15} sx={{ border: 0 }}>
          <Box sx={styleWVG02}>
            <b>P(X)</b>
          </Box>
        </Grid>
        <Grid item xs sx={{ border: 0 }}>
          <Box sx={styleWVG01(55)}>{openGrafik && <>{PointsGraf00()}</>}</Box>
          <Box sx={{ fontSize: 12.1 }}>
            <b>Количество заторных направлений</b>
          </Box>
        </Grid>
      </Grid>
    );
  };

  const CalcTablLeftPart = () => {
    return (
      <Grid item xs={6} sx={{ border: 0 }}>
        <Box sx={styleCalc02}>
          {StrTablVert(
            3,
            "Число итераций",
            WaysInput(0, sumIterate, SetSumIterate, 0, 4000)
          )}
        </Box>
      </Grid>
    );
  };

  const CalcTablRightPart = () => {
    return (
      <Grid item xs={6} sx={{ border: 0 }}>
        <Box sx={styleCalc02}>
          {StrTablVert(
            6,
            "Сл.составляющая интенсивности до",
            WaysInput(0, slIintens, SetSlIintens, 0, 40)
          )}
        </Box>
      </Grid>
    );
  };

  const CalcTabl = () => {
    return (
      <Grid container sx={{}}>
        <Grid item xs={0.15}></Grid>
        <Grid item xs>
          <Box sx={styleWVG01(9)}>
            <Box sx={styleCalc01}>Параметры расчёта</Box>
            <Grid container sx={{}}>
              {CalcTablLeftPart()}
              {CalcTablRightPart()}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    );
  };

  return (
    <Modal open={openGraf} onClose={CloseEndGl} hideBackdrop={false}>
      <Box sx={styleWVG00}>
        <Button sx={styleModalEndBind} onClick={() => handleClose()}>
          <b>&#10006;</b>
        </Button>
        <Box sx={styleFormPK01}>
          <b>Расчёт устойчивости программы координации</b>
        </Box>
        {CalcTabl()}
        {CalcGraf()}
        <Box sx={styleSetPK04}>
          <Box sx={{ display: "inline-block", margin: "0px 15px 0px 0px" }}>
            <Button sx={styleFormPK03} onClick={() => CalcStabil(0)}>
              Отмена
            </Button>
          </Box>
          <Box sx={{ display: "inline-block", margin: "0px 5px 0px 15px" }}>
            <Button sx={styleFormPK03} onClick={() => CalcStabil(1)}>
              Рассчитать
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default MapStabilCalc;
