import * as React from "react";
//import { useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
//import Slider from "@mui/material/Slider";

//import { StrokaTablWindPK } from "../../MapServiceFunctions";

import { styleModalEndBind, stylePKForm01 } from "../../MainMapStyle";
//import { styleWindPK04 } from "../../MainMapStyle";

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

//import { styleModalEndBind, stylePKForm01 } from "../../MainMapStyle";

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

let nameIn = "";
let timeInterval = 80;

const MapWindViewGraf = (props: {
  close: Function; // функция возврата в родительский компонент
  idx: number; //
  route: any;
}) => {
  //console.log("MapWindPK:", props.route);
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
  // const [value, setValue] = React.useState(67);
  // const [openImg, setOpenImg] = React.useState(false);
  const [openGraf, setOpenGraf] = React.useState(true);

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

  //========================================================

  const handleClose = () => {
    setOpenGraf(false);
    props.close(false);
  };

  const CloseEndGl = (event: any, reason: string) => {
    if (reason === "escapeKeyDown") handleClose();
  };

  const PointsGraf01 = () => {
    //console.log('!!!!!!:',needRend,data)
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
    // return <>{needRend && <Line options={options} data={data} />}</>;
    return <Line options={options} data={data} />;
  };

  const PointsGraf00 = () => {
    //const colMin = 60 / pointer[namer][0].Time;
    for (let i = 0; i < timeInterval; i++) {
      // let int = "";
      // if (i % colMin === 0) {
      //   if (i / colMin < 10) int += "0";
      //   int += String(i / colMin);
      //   int += ":00";
      // }
      labels.push(i.toString());
    }
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

  const styleXTC03 = {
    marginTop: 1,
    height: "55vh",
    bgcolor: "#F1F5FB", // светло серый
    border: "1px solid #d4d4d4", // серый
    borderRadius: 1,
    boxShadow: 12,
  };

  return (
    <Modal open={openGraf} onClose={CloseEndGl} hideBackdrop={false}>
      <Box sx={stylePKForm01}>
        <Button sx={styleModalEndBind} onClick={() => handleClose()}>
          <b>&#10006;</b>
        </Button>
        {/* <Box sx={styleWindPK04}> */}
        Изменение потока на направлении <b>{nameIn + (props.idx + 1)}</b>
        <Box sx={styleXTC03}>{PointsGraf00()}</Box>
        {/* </Box> */}
        <Box sx={{ fontSize: 12.1 }}>Тцикла</Box>
      </Box>
    </Modal>
  );
};

export default MapWindViewGraf;
//{/* {pointer !== null && <>{PointsGraf00()}</>} */}
