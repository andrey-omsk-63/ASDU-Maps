import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { massplanCreate, statsaveCreate } from "./../../../redux/actions";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import MapPointDataError from "./../MapPointDataError";
import MapSetupPK from "./MapSetupPK";

import { BadExit, UniqueName, InputFromList } from "../../MapServiceFunctions";
import { PreparCurrenciesPlan, InputNamePK } from "../../MapServiceFunctions";
import { SaveFormPK, InputArrow, ExitArrow } from "../../MapServiceFunctions";
import { SubareaFindById, ExitCross } from "../../MapServiceFunctions";

import { AREA, SUBAREA, MASSPK, PLANER } from "../../MainMapGl";
import { SUMPK, MassBoard } from "../../MapConst";

import { PlanCoord } from "../../../interfacePlans.d"; // интерфейс

import { MakeStyleFormPK00 } from "../../MainMapStyle";
import { styleFormPK01, styleFormPK04 } from "../../MainMapStyle";
import { MakeStyleFormPK022, styleFormPK05 } from "../../MainMapStyle";
import { styleFormPK07 } from "../../MainMapStyle";
import { styleFormPK06, styleSpisPK07 } from "../../MainMapStyle";
import { styleSpisPK08, styleSpisPK09 } from "../../MainMapStyle";

interface Stroka {
  area: number;
  id: number;
  name: string;
}

let HAVE = 0;
let startPlan: string = "0";
let massPkId: any = [];
let massPkIdOld: any = [];
let isOpen = false;
let oldSubArea = -1;
let oldIdx = -2;
let nameArea = "";
let soobErr = "";
let EscClinch = false;
let needSort = false;
let oldNomPK = -1;
let currenciesPlan: any = [];
let massBoard = MassBoard;
let soobForArrow = "";

let NewCoordPlan: PlanCoord = {
  nomPK: 0, // номер плана координации
  areaPK: 0, // район плана координации
  subareaPK: 0, // подрайон плана координации
  namePK: "", // наименование плана координации
  timeCycle: 80, // длительность цикла
  ki: 100, // коэффициент
  ks: 100, // коэффициент
  phaseOptim: true, // оптимизировать длительност фаз
  coordPlan: [], // id перекрёстков входящих в ПК
};

const MapCreatePK = (props: {
  setOpen: Function; // функция возврата в родительский компонент
  SetMass: Function; // массив "подсвечиваемых" перекрёстков
  idx: number; // индекса редактируемого ПК
  setPuskMenu: Function; // перезапуск меню ПК после корректировки
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
  let massplan = useSelector((state: any) => {
    const { massplanReducer } = state;
    return massplanReducer.massplan;
  });
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  const dispatch = useDispatch();
  //===========================================================
  const [openSetErr, setOpenSetErr] = React.useState(false);
  const [setupPlan, setSetupPlan] = React.useState(false);
  const [badExit, setBadExit] = React.useState(false);
  const [currentBoard, setCurrentBoard] = React.useState<any>(null);
  const [currentItem, setCurrentItem] = React.useState<any>(null);
  const [trigger, setTrigger] = React.useState(false);
  const [arrow, setArrow] = React.useState(false);

  let subAreA = SUBAREA === "0" ? 1 : Number(SUBAREA);

  subAreA = props.idx < 0 ? subAreA : massplan.plans[props.idx].subareaPK;
  const sumPlan = SUMPK;
  const modeWork = props.idx < 0 ? "create" : "edit";

  const CloseEnd = React.useCallback(
    (mode: number) => {
      HAVE = 0;
      oldSubArea = -1;
      isOpen = false;
      props.setOpen(datestat.nomMenu, mode ? massPkId : massPkIdOld); // полный выход
      if (modeWork === "edit" || datestat.needMenuForm)
        props.setPuskMenu(NewCoordPlan.nomPK); // перезапуск меню ПК
      if (modeWork !== "create") {
        datestat.needMakeSpisPK = true; // вызов списка ПК после корректровки ПК
        dispatch(statsaveCreate(datestat));
      }
      // props.setOpen(datestat.nomMenu, mode ? massPkId : massPkIdOld); // полный выход
      massPkId = [];
    },
    [props, modeWork, datestat, dispatch]
  );

  const handleCloseBad = React.useCallback(() => {
    HAVE && setBadExit(true);
    !HAVE && CloseEnd(0); // выход без сохранения
  }, [CloseEnd]);

  const handleCloseBadExit = (mode: boolean) => {
    setBadExit(false);
    mode && CloseEnd(0); // выход без сохранения
  };
  //=== инициализация ======================================
  if (EscClinch) {
    EscClinch = false;
  } else {
    if (!isOpen || subAreA !== oldSubArea || props.idx !== oldIdx) {
      let massVert: any = [];
      let massExist: any = [];
      massPkId = []; // правое окно
      massPkIdOld = MASSPK;
      let massNumPk: Array<number> = [];
      oldNomPK = -1;
      //============
      if (modeWork === "create") {
        startPlan = "0";
        // создания списка свободных номеров ПК
        for (let i = 0; i < massplan.plans.length; i++) {
          for (let j = 0; j < sumPlan; j++)
            if (j + 1 === massplan.plans[i].nomPK)
              massNumPk.push(massplan.plans[i].nomPK);
        }
        currenciesPlan = PreparCurrenciesPlan(sumPlan, massNumPk);
        NewCoordPlan.nomPK = Number(currenciesPlan[0].label);
        NewCoordPlan.namePK = "План координации" + UniqueName();
        NewCoordPlan.areaPK = Number(AREA);
      } else {
        oldNomPK = massplan.plans[props.idx].nomPK;
        NewCoordPlan.nomPK = oldNomPK;
        NewCoordPlan.namePK = massplan.plans[props.idx].namePK;
        NewCoordPlan.timeCycle = massplan.plans[props.idx].timeCycle;
        NewCoordPlan.ki = massplan.plans[props.idx].ki;
        NewCoordPlan.ks = massplan.plans[props.idx].ks;
        NewCoordPlan.phaseOptim = massplan.plans[props.idx].phaseOptim;
        for (let i = 0; i < massplan.plans.length; i++) {
          for (let j = 0; j < sumPlan; j++)
            if (
              j + 1 === massplan.plans[i].nomPK &&
              j + 1 !== NewCoordPlan.nomPK
            )
              massNumPk.push(massplan.plans[i].nomPK);
        }
        currenciesPlan = PreparCurrenciesPlan(sumPlan, massNumPk);
        for (let i = 0; i < currenciesPlan.length; i++)
          if (currenciesPlan[i].label === NewCoordPlan.nomPK.toString())
            startPlan = currenciesPlan[i].value;
        // создание списка перекрёстков в правом окне
        for (let i = 0; i < massplan.plans[props.idx].coordPlan.length; i++)
          massPkId.push(massplan.plans[props.idx].coordPlan[i].id);
      }
      //============
      NewCoordPlan.subareaPK = subAreA;
      NewCoordPlan.areaPK = Number(AREA);
      // создание списка перекрёстков для левого окна
      for (let i = 0; i < massroute.vertexes.length; i++) {
        let ID = massroute.vertexes[i].id;
        if (
          massroute.vertexes[i].area &&
          SubareaFindById(massdk, 1, ID) === subAreA
        ) {
          let maskVert: Stroka = {
            area: massroute.vertexes[i].area,
            id: massroute.vertexes[i].id,
            name: massroute.vertexes[i].name,
          };
          if (massPkId.indexOf(ID) < 0) {
            massVert.push(maskVert); // левое окно
          } else massExist.push(maskVert); // правое окно
        }
      }
      // сортировка массива
      massVert.sort(function Func(a: any, b: any) {
        return b.id < a.id ? 1 : b.id > a.id ? -1 : 0;
      });
      let massRab: any = [];
      for (let i = 0; i < massPkId.length; i++)
        for (let j = 0; j < massExist.length; j++)
          if (massPkId[i] === massExist[j].id) massRab.push(massExist[j]);
      massBoard[0].items = massVert; // левое окно
      massBoard[1].items = massRab; // правое окно
      isOpen = true;
      oldSubArea = subAreA;
      oldIdx = props.idx;
      HAVE = 0;
      needSort = false;
      props.SetMass(massPkId, subAreA, 1);
    }
  }
  //========================================================
  const [boards, setBoards] = React.useState(massBoard);
  const [valuen, setValuen] = React.useState(NewCoordPlan.namePK);
  const [currencyPlan, setCurrencyPlan] = React.useState(startPlan);

  //=== Функции - обработчики ==============================
  const handleChangePlan = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrencyPlan(event.target.value);
    NewCoordPlan.nomPK = Number(
      currenciesPlan[Number(event.target.value)].label
    );
    HAVE++;
    needSort = true;
  };

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) {
      setValuen(event.target.value.trimStart()); // удаление пробелов в начале строки
      NewCoordPlan.namePK = event.target.value.trimStart();
      HAVE++;
    }
  };

  const SaveForm = (mode: number) => {
    //mode: 0 - Выйти без сохранения  1 - Сохранить изменения  2 - Сохранить как новый
    if (mode) {
      if (boards[1].items.length) {
        NewCoordPlan.coordPlan = [];
        for (let i = 0; i < boards[1].items.length; i++) {
          let aa: any = boards[1].items[i];
          let mask = {
            id: aa.id,
          };
          NewCoordPlan.coordPlan.push(mask);
        }
        if (modeWork === "create") {
          massplan.plans.push({ ...NewCoordPlan }); // режим создания ПК
          massplan.plans.sort(function FuncSort(a: any, b: any) {
            return b.nomPK < a.nomPK ? 1 : b.nomPK > a.nomPK ? -1 : 0;
          });
        } else {
          if (mode === 1) {
            // Сохранить изменения
            datestat.nomMenu = NewCoordPlan.nomPK; //  активная строка списка ПК
            dispatch(statsaveCreate(datestat));
            massplan.plans[props.idx] = { ...NewCoordPlan }; // режим корректировки ПК
            datestat.needMakeSpisPK = false; // запрет вызова списка ПК после корректровки ПК
          } else {
            // Сохранить как новый
            if (NewCoordPlan.nomPK === oldNomPK) {
              let nom = -1;
              for (let i = 0; i < currenciesPlan.length; i++)
                if (currenciesPlan[i].label === oldNomPK.toString()) nom = i;
              let nomm = nom === currenciesPlan.length - 1 ? nom - 1 : nom + 1;
              NewCoordPlan.nomPK = Number(currenciesPlan[nomm].label);
            }
            NewCoordPlan.namePK += "(новый)";
            datestat.nomMenu = NewCoordPlan.nomPK; //  активная строка списка ПК
            dispatch(statsaveCreate(datestat));
            massplan.plans.push({ ...NewCoordPlan }); // режим добавления ПК
            massplan.plans.sort(function FuncSort(a: any, b: any) {
              return b.nomPK < a.nomPK ? 1 : b.nomPK > a.nomPK ? -1 : 0;
            });
          }
          datestat.needMakeSpisPK = true; // вызов списка ПК после корректровки ПК
          datestat.lockUp = true; // блокировка меню районов и меню режимов
        }
        dispatch(statsaveCreate(datestat));
        if (needSort) {
          massplan.plans.sort(function Func(a: any, b: any) {
            return b.nomPK < a.nomPK ? 1 : b.nomPK > a.nomPK ? -1 : 0;
          });
          needSort = false;
        }
        dispatch(massplanCreate(massplan));
        //========================================================
        // здесь должен быть запрос на запись к серверу
        //========================================================
        console.log("Finish:", massplan);
        CloseEnd(mode); // выход с сохранением
      } else {
        soobErr = "Количество перекрёстков в плане не может быть меньше 1-го";
        setOpenSetErr(true);
      }
    } else handleCloseBad(); // выход без сохранения
  };

  const SetPlan = (plSetup: any) => {
    HAVE++;
  };
  //=== Drag and Drop ======================================
  const dragOverHandler = (e: any, board: any) => {
    e.preventDefault();
    e.target.className === "MuiBox-root css-3pfbt1" &&
      currentBoard.ID === board.ID &&
      (e.target.style.backgroundColor = "#bae186"); // тёмно салатовый
  };

  const dragLeaveHandler = (e: any) => {
    e.target.style.backgroundColor = "#F8FCF3"; // светло светло салатовый
  };

  const dragStartHandler = (e: any, board: any, item: any) => {
    setCurrentBoard(board);
    setCurrentItem(item);
    e.target.style.backgroundColor = "#bae186"; // тёмно салатовый
  };

  const dropHandler = (e: any, board: any, item: any) => {
    e.preventDefault();
    const currentIndex = currentBoard.items.indexOf(currentItem);
    if (currentIndex >= 0 && board.ID !== currentBoard.ID) {
      currentBoard.items.splice(currentIndex, 1);
      if (currentBoard.ID) {
        massPkId.splice(currentIndex, 1); // удаление из правого окна
        props.SetMass(massPkId, subAreA, 1);
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
      })
    );
    e.target.style.backgroundColor = "#F8FCF3"; // светло светло салатовый
  };

  const dropCardHandler = (e: any, board: any) => {
    if (board.ID !== currentBoard.ID) {
      board.items.push(currentItem);
      const currentIndex = currentBoard.items.indexOf(currentItem);
      if (board.ID) {
        massPkId.push(currentItem.id); // добавление в правое окно
        props.SetMass(massPkId, subAreA, 1);
      }
      HAVE++;

      if (currentIndex >= 0 && board.ID !== currentBoard.ID) {
        currentBoard.items.splice(currentIndex, 1);
        HAVE++;
      }
      setBoards(
        boards.map((b: any) => {
          if (b.ID === board.ID) return board;
          if (b.ID === currentBoard.ID) return currentBoard;
          return b;
        })
      );
    }
  };
  //========================================================
  const HeaderFormPK = () => {
    let soob = modeWork === "create" ? "Создание нового " : "Корректировка ";
    return (
      <>
        <Box sx={styleFormPK01}>
          <b>{soob}плана координации</b>
        </Box>
        <Grid container sx={styleSpisPK08}>
          <Grid item xs={1.6}>
            <b>Номер ПК</b>
          </Grid>
          <Grid item xs={1} sx={{ marginTop: -0.8 }}>
            {InputFromList(handleChangePlan, currencyPlan, currenciesPlan)}
          </Grid>
          <Grid item xs={2.6}></Grid>
          <Grid item xs={1.7}>
            <b>Подрайон {subAreA}</b> <em>{nameArea}</em>
          </Grid>
          <Grid item xs sx={{ textAlign: "right", padding: "0 1px 0 0" }}>
            <Button sx={styleFormPK07} onClick={() => setSetupPlan(true)}>
              Параметры плана
            </Button>
          </Grid>
        </Grid>
        <Grid container sx={styleSpisPK09}>
          <Grid item xs={1.6}>
            <b>Название ПК</b>
          </Grid>
          <Grid item xs sx={{ marginTop: -0.2 }}>
            {InputNamePK(handleChangeName, valuen)}
          </Grid>
        </Grid>
      </>
    );
  };

  const MoveLeftWind = () => {
    let leng = boards[0].items.length;
    for (let i = 0; i < leng; i++) {
      let aa: Stroka = boards[0].items[0];
      let idd = aa.id;
      let rec = boards[0].items[0];
      boards[0].items.splice(0, 1); // удаление из левого окна
      boards[1].items.push(rec); // добавление в правое окно
      massPkId.push(idd); // добавление  подсветки в правое окно
    }
    props.SetMass(massPkId, subAreA, 1);
    HAVE++;
    setArrow(false);
    setTrigger(!trigger); // ререндер
  };

  const MoveRightWind = () => {
    let leng = boards[1].items.length;
    for (let i = 0; i < leng; i++) {
      let rec = boards[1].items[0];
      boards[1].items.splice(0, 1); // удаление из правого окна
      boards[0].items.push(rec); // добавление в левое окно
    }
    massPkId = []; // удаление подсветки из правого окна
    props.SetMass(massPkId, subAreA, 1);
    HAVE++;
    setArrow(false);
    setTrigger(!trigger); // ререндер
  };

  const handleMouseEnterLeft = (e: any) => {
    soobForArrow = "Все элементы из левого окна переместятся в правое";
    setArrow(true);
    setTrigger(!trigger); // ререндер
  };

  const handleMouseEnterRight = (e: any) => {
    soobForArrow = "Все элементы из правого окна переместятся в левое";
    setArrow(true);
    setTrigger(!trigger); // ререндер
  };

  const handleMouseLeave = (e: any) => {
    setArrow(false);
    setTrigger(!trigger); // ререндер
  };

  const FooterFormPK = (arrow: boolean) => {
    return (
      <Grid container>
        <Grid item xs={1.1}>
          {boards[0].items.length > 0 && (
            <Button
              sx={styleFormPK06}
              onMouseEnter={handleMouseEnterLeft}
              onClick={() => MoveLeftWind()}
              onMouseLeave={handleMouseLeave}
            >
              🢡
            </Button>
          )}
        </Grid>
        <Grid item xs={9.8}>
          {arrow ? (
            <Box sx={styleFormPK05}>{soobForArrow}</Box>
          ) : (
            <>
              {HAVE > 0 ? (
                <>{SaveFormPK(SaveForm, modeWork === "edit")}</>
              ) : (
                <Box sx={styleFormPK05}>
                  "Перетяните" курсором нужные элементы из одного окна в другое
                </Box>
              )}
            </>
          )}
        </Grid>
        <Grid item xs={1.1}>
          {boards[1].items.length > 0 && (
            <Button
              sx={styleFormPK06}
              onMouseEnter={handleMouseEnterRight}
              onClick={() => MoveRightWind()}
              onMouseLeave={handleMouseLeave}
            >
              🢠
            </Button>
          )}
        </Grid>
      </Grid>
    );
  };
  //=== обработка Esc ======================================
  const escFunction = React.useCallback((event) => {
    if (event.keyCode === 27) {
      EscClinch = true;
      event.preventDefault();
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener("keydown", escFunction);
    return () => document.removeEventListener("keydown", escFunction);
  }, [escFunction]);
  //========================================================
  return (
    <>
      {badExit && <>{BadExit(badExit, handleCloseBadExit)}</>}
      <Box sx={MakeStyleFormPK00(696, PLANER)}>
        {ExitCross(handleCloseBad)}
        {HeaderFormPK()}
        {boards.map((board: any) => (
          <Box
            key={board.ID}
            sx={MakeStyleFormPK022(board.ID)}
            onDragOver={(e) => dragOverHandler(e, board)}
            onDrop={(e) => dropCardHandler(e, board)}
          >
            {board.items.map((item: any) => (
              <Box
                key={item.id}
                sx={styleFormPK04}
                onDragOver={(e) => dragOverHandler(e, board)}
                onDragLeave={(e) => dragLeaveHandler(e)}
                onDragStart={(e) => dragStartHandler(e, board, item)}
                onDrop={(e) => dropHandler(e, board, item)}
                draggable={true}
              >
                {board.ID === 1 && (
                  <Box sx={{ display: "flex", justifyContent: "left" }}>
                    {ExitArrow(board, item.id, massroute)}
                    {InputArrow(board, item.id, massroute)}
                  </Box>
                )}
                <Box sx={styleSpisPK07}>
                  {item.id} - {item.name}
                </Box>
              </Box>
            ))}
          </Box>
        ))}
        {FooterFormPK(arrow)}
      </Box>
      {setupPlan && (
        <MapSetupPK
          close={setSetupPlan}
          plan={NewCoordPlan}
          setplan={SetPlan}
        />
      )}
      {openSetErr && (
        <MapPointDataError
          sErr={soobErr}
          setOpen={setOpenSetErr}
          fromCross={0}
          toCross={0}
          update={0}
          setSvg={{}}
        />
      )}
    </>
  );
};

export default MapCreatePK;
