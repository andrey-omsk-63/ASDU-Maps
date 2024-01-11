import * as React from "react";
//import { useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

//import { StrokaTablWindPK } from "../../MapServiceFunctions";

import { styleWVG00, styleModalEndBind } from "../../MainMapStyle";
import { styleWVG01, styleWVG02, styleFormPK01 } from "../../MainMapStyle";

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

//let nameIn = "";
let timeInterval = 80;

const MapOptimCalc = (props: {
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

  //=== инициализация ======================================
  //if (props.name) nameIn = props.name + ".";
  const labels: string[] = [];
  let data: DataGl = {
    labels,
    datasets: [
      {
        label: "Затор",
        data: [],
        borderWidth: 1,
        borderColor: "red",
        backgroundColor: "red",
        pointRadius: 1,
      },
      {
        label: "Свободно",
        data: [],
        borderWidth: 1,
        borderColor: "green",
        backgroundColor: "green",
        pointRadius: 1,
      },
    ],
  };

  //========================================================
  const CloseEnd = React.useCallback(() => {
    props.handleClose(false);
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

  //========================================================

  const handleClose = () => {
    setOpenGraf(false);
    props.handleClose(false);
  };

  const CloseEndGl = (event: any, reason: string) => {
    if (reason === "escapeKeyDown") handleClose();
  };

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
    for (let i = 0; i < timeInterval; i++) labels.push(i.toString());
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
      <Grid container item>
        <Grid item xs sx={{ width: "99vh", height: "55vh" }}>
          <PointsGraf01 />
        </Grid>
      </Grid>
    );
  };

  const styleCalc01 = {
    fontSize: 12,
    marginTop: 0.5,
    textAlign: "left",
    padding: "0px 5px 5px 5px",
  };

  return (
    <Modal open={openGraf} onClose={CloseEndGl} hideBackdrop={false}>
      <Box sx={styleWVG00}>
        <Button sx={styleModalEndBind} onClick={() => handleClose()}>
          <b>&#10006;</b>
        </Button>
        <Box sx={styleFormPK01}>
          <b>Расчёт оптимального времени цикла</b>
        </Box>
        <Box sx={styleWVG01(20)}>
          <Box sx={styleCalc01}>Параметры расчёта</Box>
          <Box sx={{ padding: "0px 5px 5px 5px" }}>
            <Grid container sx={{ border: 0, height: 20 }}>
              <Grid item xs={6} sx={{ border: 1 }}></Grid>
              <Grid item xs sx={{ border: 1 }}></Grid>
            </Grid>
          </Box>
        </Box>
        <Grid container sx={{}}>
          <Grid item xs={0.15} sx={{ border: 0 }}>
            <Box sx={styleWVG02}>
              <b>Tзадержки</b>
            </Box>
          </Grid>
          <Grid item xs sx={{ border: 0 }}>
            <Box sx={styleWVG01(55)}>{PointsGraf00()}</Box>
            <Box sx={{ fontSize: 12.1 }}>
              <b>Время цикла (сек)</b>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default MapOptimCalc;
