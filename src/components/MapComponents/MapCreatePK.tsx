import * as React from "react";
import {
  useSelector,
  //useDispatch
} from "react-redux";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

//import MapPointDataError from "./MapPointDataError";

//import { ComplianceMapMassdk } from "./../MapServiceFunctions";
import { BadExit } from "./../MapServiceFunctions";
//import { SaveFormVert } from "./../MapServiceFunctions";

import { AREA } from "./../MainMapGl";

import { styleModalEnd, styleFormPK00 } from "./../MainMapStyle";
import { styleFormPK01, styleFormPK03, styleFormPK04 } from "./../MainMapStyle";
import { MakeStyleFormPK022 } from "./../MainMapStyle";

let massForm: any = null;
let HAVE = 0;
let massVert: any = [];
let isOpen = false;
let oldArea = -1;

const MapCreatePK = (props: {
  setOpen: any;
  idx: number;
  openErr: boolean;
}) => {
  //== Piece of Redux =======================================

  let massroute = useSelector((state: any) => {
    const { massrouteReducer } = state;
    return massrouteReducer.massroute;
  });
  //const dispatch = useDispatch();
  //===========================================================

  const [badExit, setBadExit] = React.useState(false);
  //const [openSetErr, setOpenSetErr] = React.useState(props.openErr);
  //const [trigger, setTrigger] = React.useState(false);
  let AreA = AREA === "0" ? 1 : Number(AREA);
  //const styleFormPK02 = MakeStyleFormPK02();

  let massBoard = [
    {
      ID: 0,
      title: "Откуда",
      items: [],
    },
    {
      ID: 1,
      title: "Куда",
      items: [],
    },
  ];

  const [boards, setBoards] = React.useState(massBoard);
  const [currentBoard, setCurrentBoard] = React.useState<any>(null);
  const [currentItem, setCurrentItem] = React.useState<any>(null);

  //=== инициализация ======================================
  if (!isOpen || AreA !== oldArea) {
    massVert = [];
    for (let i = 0; i < massroute.vertexes.length; i++) {
      if (massroute.vertexes[i].area === AreA) {
        let maskVert = {
          area: massroute.vertexes[i].area,
          id: massroute.vertexes[i].id,
          name: massroute.vertexes[i].name,
        };
        massVert.push(maskVert);
      }
    }

    massVert.sort(function Func(a: any, b: any) {
      return b.id < a.id ? 1 : b.id > a.id ? -1 : 0;
    });

    massBoard[0].items = massVert;
    massBoard[1].items = [];
    setBoards(massBoard);

    console.log("Inic:", AreA, massBoard);

    console.log("###Inic:", boards);

    isOpen = true;
    oldArea = AreA;
  }

  //========================================================
  const CloseEnd = React.useCallback(() => {
    HAVE = 0;
    isOpen = false;
    props.setOpen(false, massForm); // полный выход
  }, [props]);

  const handleCloseBad = React.useCallback(() => {
    HAVE && setBadExit(true);
    !HAVE && CloseEnd(); // выход без сохранения
  }, [CloseEnd]);

  // const handleCloseEnd = (event: any, reason: string) => {
  //   if (reason === "escapeKeyDown") handleCloseBad();
  // };

  const handleCloseBadExit = (mode: boolean) => {
    setBadExit(false);
    mode && CloseEnd(); // выход без сохранения
  };

  //=== Функции - обработчики ==============================
  const SaveForm = (mode: boolean) => {
    console.log("######Inic:", boards);
    if (mode) {
      CloseEnd(); // здесь должно быть сохранение
    } else {
      handleCloseBad();
    }
  };

  //========================================================

  //=== обработка Esc ======================================
  const escFunction = React.useCallback(
    (event) => {
      if (event.keyCode === 27) {
        console.log("ESC!!!", HAVE);
        HAVE = 0;
        isOpen = false;
        props.setOpen(false, null); // полный выход
        event.preventDefault();
      }
    },
    [props]
  );

  React.useEffect(() => {
    document.addEventListener("keydown", escFunction);
    return () => document.removeEventListener("keydown", escFunction);
  }, [escFunction]);
  //========================================================

  const HeaderFormPK = () => {
    return (
      <>
        <Box sx={styleFormPK01}>
          <b>Создание нового плана координации</b>
        </Box>
        <Grid container sx={{ fontSize: 14, marginTop: 1 }}>
          <Grid item xs={1.6} sx={{ border: 0 }}>
            <b>Номер ПК</b>
          </Grid>
          <Grid item xs={0.7} sx={{ border: 1 }}></Grid>
          <Grid item xs={3.8}></Grid>
          <Grid item xs sx={{ border: 0 }}>
            <b>Район {AreA}</b>
          </Grid>
        </Grid>
        <Grid container sx={{ fontSize: 14, marginTop: 0.5 }}>
          <Grid item xs={1.6} sx={{ border: 0 }}>
            <b>Название ПК</b>
          </Grid>
          <Grid item xs sx={{ border: 1 }}></Grid>
        </Grid>
      </>
    );
  };

  const dragOverHandler = (e: any, mode: number) => {
    //function dragOverHandler(e: any) {
    //console.log("dragOverHandler", mode, e.target.className);
    e.preventDefault();
    if (e.target.className === "item") {
      e.target.style.boxShadow = "0 2px 3px gray";
    }
  };

  function dragLeaveHandler(e: any) {
    console.log("dragLeaveHandler");
    e.target.style.boxShadow = "none";
  }

  const dragStartHandler = (e: any, board: any, item: any) => {
    //function dragStartHandler(e: any, board: any, item: any) {
    console.log("dragStartHandler", board, item);
    setCurrentBoard(board);
    setCurrentItem(item);
  };

  function dragEndHandler(e: any) {
    console.log("dragEndHandler");
    e.target.style.boxShadow = "none";
  }

  function dropHandler(e: any, board: any, item: any) {
    console.log("dropHandler");
    e.preventDefault();
    const currentIndex = currentBoard.items.indexOf(currentItem);
    currentBoard.items.splice(currentIndex, 1);
    const dropIndex = board.items.indexOf(item);
    board.items.splice(dropIndex + 1, 0, currentItem);
    setBoards(
      boards.map((b: any) => {
        if (b.ID === board.id) return board;
        if (b.id === currentBoard.id) return currentBoard;
        return b;
      })
    );
    e.target.style.boxShadow = "none";
  }

  function dropCardHandler(e: any, board: any) {
    console.log("dropCardHandler");
    board.items.push(currentItem);
    const currentIndex = currentBoard.items.indexOf(currentItem);
    currentBoard.items.splice(currentIndex, 1);
    setBoards(
      boards.map((b: any) => {
        if (b.ID === board.ID) return board;
        if (b.ID === currentBoard.ID) return currentBoard;
        return b;
      })
    );
    e.target.style.boxShadow = "none";
  }

  return (
    <>
      {badExit && <>{BadExit(badExit, handleCloseBadExit)}</>}
      <Box sx={styleFormPK00}>
        <Button sx={styleModalEnd} onClick={() => handleCloseBad()}>
          <b>&#10006;</b>
        </Button>
        {HeaderFormPK()}

        {boards.map((board: any) => (
          <Box
            key={board.ID}
            sx={MakeStyleFormPK022(board.ID)}
            onDragOver={(e) => dragOverHandler(e, 1)}
            onDrop={(e) => dropCardHandler(e, board)}
          >
            {board.items.map((item: any) => (
              <Box
                key={item.id}
                sx={styleFormPK04}
                onDragOver={(e) => dragOverHandler(e, 2)}
                onDragLeave={(e) => dragLeaveHandler(e)}
                onDragStart={(e) => dragStartHandler(e, board, item)}
                onDragEnd={(e) => dragEndHandler(e)}
                onDrop={(e) => dropHandler(e, board, item)}
                draggable={true}
              >
                {item.id} - {item.name}
              </Box>
            ))}
            {/* {StrokaFormPkFrom(board.ID)} */}
          </Box>
        ))}

        <Grid container sx={{ marginTop: 0.8 }}>
          <Grid item xs={5.57} sx={{ textAlign: "right" }}>
            <Button sx={styleFormPK03} onClick={() => SaveForm(true)}>
              Сохранить изменения
            </Button>
          </Grid>
          <Grid item xs={0.82}></Grid>
          <Grid item xs sx={{ textAlign: "left" }}>
            <Button sx={styleFormPK03} onClick={() => SaveForm(false)}>
              Выйти без сохранения
            </Button>
          </Grid>
        </Grid>
      </Box>
      {/* {openSetErr && (
        <MapPointDataError
          sErr={soobErr}
          setOpen={setOpenSetErr}
          fromCross={0}
          toCross={0}
          update={0}
          svg={{}}
          setSvg={{}}
        />
      )} */}
    </>
  );
};

export default MapCreatePK;

//{
/* <Grid container sx={{ marginTop: 1 }}>
  <Grid item xs={5.9} sx={styleFormPK02}>
    {StrokaFormPkFrom()}
  </Grid>
  <Grid item xs={0.2}></Grid>
  <Grid item xs sx={styleFormPK02}></Grid>
</Grid>; */
//}
// <Grid key={i} container sx={{ fontSize: 12 }}>
//   <Grid item xs={1} sx={{ paddingLeft: 0.5 }}>
//     {massVert[i].id}
//   </Grid>
//   <Grid item xs>
//     {massVert[i].name}
//   </Grid>
// </Grid>

// const StrokaFormPkFrom = (idx: number) => {
//   let resStr = [];
//   if (!idx) {
//     for (let i = 0; i < massVert.length; i++) {
//       resStr.push(
//         <Box sx={styleFormPK04}>
//           {massVert[i].id} - {massVert[i].name}
//         </Box>
//       );
//     }
//   }
//   return resStr;
// };
