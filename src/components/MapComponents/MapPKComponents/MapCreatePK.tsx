import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { massplanCreate } from './../../../redux/actions';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
//import TextField from "@mui/material/TextField";

import MapPointDataError from './../MapPointDataError';

import { BadExit, UniqueName, InputFromList } from '../../MapServiceFunctions';
import { PreparCurrenciesPlan, InputNamePK } from '../../MapServiceFunctions';
import { SaveFormPK } from '../../MapServiceFunctions';

import { AREA, SUMPK } from '../../MainMapGl';

import { PlanCoord } from '../../../interfacePlans.d'; // интерфейс

import { styleModalEnd, MakeStyleFormPK00 } from '../../MainMapStyle';
import { styleFormPK01, styleFormPK04 } from '../../MainMapStyle';
import { MakeStyleFormPK022, styleFormPK05 } from '../../MainMapStyle';

let HAVE = 0;
let massVert: any = [];
let massPkId: any = [];
let isOpen = false;
let oldArea = -1;
let nameArea = '';
let soobErr = '';

let currenciesPlan: any = [];

let NewCoordPlan: PlanCoord = {
  nomPK: 0,
  areaPK: 0,
  namePK: '',
  coordPlan: [],
};

let massBoard = [
  {
    ID: 0,
    title: 'Откуда',
    items: [],
  },
  {
    ID: 1,
    title: 'Куда',
    items: [],
  },
];

const MapCreatePK = (props: { setOpen: any; SetMass: Function }) => {
  //== Piece of Redux =======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map;
  });
  let massroute = useSelector((state: any) => {
    const { massrouteReducer } = state;
    return massrouteReducer.massroute;
  });
  let massplan = useSelector((state: any) => {
    const { massplanReducer } = state;
    return massplanReducer.massplan;
  });
  console.log('massplan:', massplan);
  const dispatch = useDispatch();
  //===========================================================
  const [openSetErr, setOpenSetErr] = React.useState(false);
  const [badExit, setBadExit] = React.useState(false);
  const [currentBoard, setCurrentBoard] = React.useState<any>(null);
  const [currentItem, setCurrentItem] = React.useState<any>(null);
  const [currencyPlan, setCurrencyPlan] = React.useState('0');
  let AreA = AREA === '0' ? 1 : Number(AREA);
  const sumPlan = SUMPK;
  //=== инициализация ======================================
  if (!isOpen || AreA !== oldArea) {
    let massNumPk: Array<number> = [];
    for (let i = 0; i < massplan.plans.length; i++) {
      for (let j = 0; j < sumPlan; j++) {
        if (j + 1 === massplan.plans[i].nomPK) massNumPk.push(massplan.plans[i].nomPK);
      }
    }
    currenciesPlan = PreparCurrenciesPlan(sumPlan, massNumPk);

    for (let i = 0; i < map.dateMap.tflight.length; i++) {
      let num = Number(map.dateMap.tflight[i].area.num);
      if (num === AreA) {
        nameArea = map.dateMap.tflight[i].area.nameArea;
        break;
      }
    }

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

    massPkId = [];
    massBoard[0].items = massVert;
    massBoard[1].items = [];
    NewCoordPlan.nomPK = Number(currenciesPlan[0].label);
    NewCoordPlan.areaPK = AreA;
    NewCoordPlan.namePK = 'План координации ' + UniqueName();
    NewCoordPlan.coordPlan = [];
    isOpen = true;
    oldArea = AreA;
    HAVE = 0;
    console.log('Inic:', AreA, massBoard);
  }
  //========================================================
  const [boards, setBoards] = React.useState(massBoard);
  const [valuen, setValuen] = React.useState(NewCoordPlan.namePK);

  const CloseEnd = React.useCallback(() => {
    HAVE = 0;
    oldArea = -1;
    isOpen = false;
    props.setOpen(false); // полный выход
  }, [props]);

  const handleCloseBad = React.useCallback(() => {
    HAVE && setBadExit(true);
    !HAVE && CloseEnd(); // выход без сохранения
  }, [CloseEnd]);

  const handleCloseBadExit = (mode: boolean) => {
    setBadExit(false);
    mode && CloseEnd(); // выход без сохранения
  };
  //=== Функции - обработчики ==============================
  const handleChangePlan = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrencyPlan(event.target.value);
    NewCoordPlan.nomPK = Number(currenciesPlan[Number(event.target.value)].label);
  };

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) {
      setValuen(event.target.value.trimStart()); // удаление пробелов в начале строки
      NewCoordPlan.namePK = event.target.value.trimStart();
    }
  };

  const SaveForm = (mode: boolean) => {
    if (mode) {
      if (boards[1].items.length > 2) {
        NewCoordPlan.coordPlan = [];
        for (let i = 0; i < boards[1].items.length; i++) {
          let aa: any = boards[1].items[i];
          let mask = {
            id: aa.id,
          };
          NewCoordPlan.coordPlan.push(mask);
        }
        massplan.plans.push({ ...NewCoordPlan });
        massplan.plans.sort(function FuncSort(a: any, b: any) {
          return b.nomPK < a.nomPK ? 1 : b.nomPK > a.nomPK ? -1 : 0;
        });
        dispatch(massplanCreate(massplan));
        console.log('Finish:', massplan);
        CloseEnd();
      } else {
        soobErr = 'Количество перекрёстков в плане не может быть меньше 3-х';
        setOpenSetErr(true);
      }
    } else handleCloseBad();
  };
  //=== Drag and Drop ======================================
  const dragOverHandler = (e: any, board: any) => {
    e.preventDefault();
    e.target.className === 'MuiBox-root css-3pfbt1' &&
      currentBoard.ID === board.ID &&
      (e.target.style.backgroundColor = '#bae186'); // тёмно салатовый
  };

  const dragLeaveHandler = (e: any) => {
    e.target.style.backgroundColor = '#F8FCF3'; // светло светло салатовый
  };

  const dragStartHandler = (e: any, board: any, item: any) => {
    setCurrentBoard(board);
    setCurrentItem(item);
    e.target.style.backgroundColor = '#bae186'; // тёмно салатовый
  };

  const dropHandler = (e: any, board: any, item: any) => {
    e.preventDefault();
    const currentIndex = currentBoard.items.indexOf(currentItem);
    if (currentIndex >= 0 && board.ID !== currentBoard.ID) {
      currentBoard.items.splice(currentIndex, 1);
      if (currentBoard.ID) {
        massPkId.splice(currentIndex, 1); // удаление из левого окна
        props.SetMass(massPkId);
      }
      HAVE++;
    }
    //const dropIndex = board.items.indexOf(item);
    //board.items.splice(dropIndex + 1, 0, currentItem);
    setBoards(
      boards.map((b: any) => {
        if (b.ID === board.ID) return board;
        if (b.ID === currentBoard.ID) return currentBoard;
        return b;
      }),
    );
    e.target.style.backgroundColor = '#F8FCF3'; // светло светло салатовый
  };

  const dropCardHandler = (e: any, board: any) => {
    if (board.ID !== currentBoard.ID) {
      board.items.push(currentItem);
      if (board.ID) {
        massPkId.push(currentItem.id); // добавление в левое окно
        props.SetMass(massPkId);
      }
      HAVE++;
    }
    const currentIndex = currentBoard.items.indexOf(currentItem);
    if (currentIndex >= 0 && board.ID !== currentBoard.ID) {
      currentBoard.items.splice(currentIndex, 1);
      HAVE++;
    }
    setBoards(
      boards.map((b: any) => {
        if (b.ID === board.ID) return board;
        if (b.ID === currentBoard.ID) return currentBoard;
        return b;
      }),
    );
  };
  //=== обработка Esc ======================================
  const escFunction = React.useCallback(
    (event) => {
      if (event.keyCode === 27) {
        console.log('ESC!!!', HAVE);
        HAVE = 0;
        isOpen = false;
        props.setOpen(false); // полный выход
        event.preventDefault();
      }
    },
    [props],
  );

  React.useEffect(() => {
    document.addEventListener('keydown', escFunction);
    return () => document.removeEventListener('keydown', escFunction);
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
          <Grid item xs={1} sx={{ marginTop: -0.8 }}>
            {InputFromList(handleChangePlan, currencyPlan, currenciesPlan)}
          </Grid>
          <Grid item xs={3.5}></Grid>
          <Grid item xs sx={{ border: 0 }}>
            <b>Район {AreA}</b> <em>{nameArea}</em>
          </Grid>
        </Grid>
        <Grid container sx={{ fontSize: 14, marginTop: 0.5 }}>
          <Grid item xs={1.6} sx={{ border: 0 }}>
            <b>Название ПК</b>
          </Grid>
          <Grid item xs sx={{ marginTop: -0.2 }}>
            {InputNamePK(handleChangeName, valuen)}
          </Grid>
        </Grid>
      </>
    );
  };

  return (
    <>
      {badExit && <>{BadExit(badExit, handleCloseBadExit)}</>}
      <Box sx={MakeStyleFormPK00(696)}>
        <Button sx={styleModalEnd} onClick={() => handleCloseBad()}>
          <b>&#10006;</b>
        </Button>
        {HeaderFormPK()}
        {boards.map((board: any) => (
          <Box
            key={board.ID}
            sx={MakeStyleFormPK022(board.ID)}
            onDragOver={(e) => dragOverHandler(e, board)}
            onDrop={(e) => dropCardHandler(e, board)}>
            {board.items.map((item: any) => (
              <Box
                key={item.id}
                sx={styleFormPK04}
                onDragOver={(e) => dragOverHandler(e, board)}
                onDragLeave={(e) => dragLeaveHandler(e)}
                onDragStart={(e) => dragStartHandler(e, board, item)}
                onDrop={(e) => dropHandler(e, board, item)}
                draggable={true}>
                {item.id} - {item.name}
              </Box>
            ))}
          </Box>
        ))}
        {HAVE > 0 ? (
          <>{SaveFormPK(SaveForm)}</>
        ) : (
          <Box sx={styleFormPK05}>
            "Перетяните" курсором нужные элементы из левого окна в правое
          </Box>
        )}
      </Box>
      {openSetErr && (
        <MapPointDataError
          sErr={soobErr}
          setOpen={setOpenSetErr}
          fromCross={0}
          toCross={0}
          update={0}
          svg={{}}
          setSvg={{}}
        />
      )}
    </>
  );
};

export default MapCreatePK;