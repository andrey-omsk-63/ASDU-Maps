import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { massplanCreate, statsaveCreate } from "../../../redux/actions";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import MapPointDataError from "../MapPointDataError";
import MapViewPK from "./MapViewPK";

import { KnopProps } from "../../MapServiceFunctions";

import { MASSPK, PLANER } from "../../MainMapGl";

import { styleModalEnd, MakeStyleFormPK00 } from "../../MainMapStyle";
import { styleFormPK01, MakeStylSpisPK01 } from "../../MainMapStyle";
import { StylSpisPK02, styleSpisPK03, StylSpisPK022 } from "../../MainMapStyle";
//import { styleSpisPK04 } from "../../MainMapStyle";

let flagDel = 0;
let soobErr = "";
let IDX = 0;
let massPkId: Array<any> = [];
let massSpis: Array<any> = [];
let spisPK: Array<number> = [];

const MapSpisPK = (props: {
  setOpen: any;
  setMode: Function; // запуск редактирования ПК
  SetMass: Function; // массив "подсвечиваемых" перекрёстков
}) => {
  //== Piece of Redux =======================================
  let massplan = useSelector((state: any) => {
    const { massplanReducer } = state;
    return massplanReducer.massplan;
  });
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  //console.log('massplan:', massplan, massSpis);
  const dispatch = useDispatch();
  //===========================================================
  const [openSetErr, setOpenSetErr] = React.useState(false);
  const [trigger, setTrigger] = React.useState(false);
  const [view, setView] = React.useState(false);

  const ChangeIDX = (idx: number) => {
    if (idx !== IDX) {
      IDX = idx;
      datestat.idxMenu = idx; //  активная строка списка ПК
      dispatch(statsaveCreate(datestat));
      massPkId = [];
      // создание списка перекрёстков выбранного плана
      if (massplan.plans.length) {
        for (let i = 0; i < massplan.plans[idx].coordPlan.length; i++)
          massPkId.push(massplan.plans[idx].coordPlan[i].id);
      }
      massPkId.length &&
        props.SetMass(massPkId, massplan.plans[idx].subareaPK, 1);
    }
  };
  //=== инициализация ======================================
  massPkId = MASSPK;
  flagDel = 0;
  let massSp = [];
  for (let i = 0; i < massplan.plans.length; i++) {
    let mask = {
      nom: massplan.plans[i].nomPK,
      name: massplan.plans[i].namePK,
      del: false,
    };
    let have = false;
    for (let j = 0; j < massSpis.length; j++) {
      if (massSpis[j].nom === massplan.plans[i].nomPK) {
        massSpis[j].name = massplan.plans[i].namePK;
        if (massSpis[j].del) flagDel++;
        massSp.push({ ...massSpis[j] });
        have = true;
      }
    }
    !have && massSp.push(mask);
  }
  massSpis = [];
  massSpis = massSp;
  spisPK = [];
  for (let i = 0; i < massSpis.length; i++) spisPK.push(massSpis[i].nom);
  IDX = spisPK.indexOf(PLANER);
  ChangeIDX(IDX < 0 ? 0 : IDX);
  if (datestat.needMakeSpisPK) datestat.needMakeSpisPK = false;
  datestat.needMenuForm = true; // выдавать меню форм
  datestat.lockUp = true; // блокировка/разблокировка меню районов и меню режимов
  dispatch(statsaveCreate(datestat));
  //========================================================
  const CloseEnd = React.useCallback(() => {
    datestat.needMenuForm = false; //  не выдавать меню форм
    let nomMenu = massplan.plans.length ? massplan.plans[IDX].nomPK : -1;
    let have = -1;
    for (let i = 0; i < massSpis.length; i++) if (!massSpis[i].del) have++;
    nomMenu = have < 0 ? -1 : nomMenu; // есть ПК не помеченные к удалению
    datestat.nomMenu = nomMenu; // номер активного плана ПК
    dispatch(statsaveCreate(datestat));
    let subarea = massplan.plans.length ? massplan.plans[IDX].subareaPK : -1;
    props.SetMass(massPkId, subarea, 0);
    if (nomMenu < 0) massPkId = [];
    props.setOpen(datestat.nomMenu, massPkId); // полный выход
  }, [datestat, dispatch, props, massplan.plans]);
  //=== Функции - обработчики ==============================
  const MarkSpis = (idx: number) => {
    massSpis[idx].del = !massSpis[idx].del;
    if (massSpis[idx].del) {
      flagDel++;
    } else flagDel--;
    if (!massSpis[idx].del) ChangeIDX(idx);
    if (idx === IDX && massSpis[idx].del) {
      for (let i = 0; i < massSpis.length; i++) {
        if (!massSpis[i].del) {
          ChangeIDX(i);
          break;
        }
      }
    }
    setTrigger(!trigger); // ререндер
  };

  const EditPlan = (idx: number) => {
    if (idx !== IDX) ChangeIDX(idx);
    props.setMode(idx); // запуск редактирования ПК
  };

  const ViewPlan = (idx: number) => {
    ChangeIDX(idx);
    setView(true);
  };

  const MarkPlan = (idx: number) => {
    if (massSpis[idx].del) {
      soobErr =
        "План координации № " + massSpis[idx].nom + " помечен на удаление";
      setOpenSetErr(true);
    } else {
      if (IDX !== idx) {
        ChangeIDX(idx);
        setTrigger(!trigger); // ререндер
      } else CloseEnd(); // повторное нажатие
    }
  };

  const DelSpis = () => {
    let massplanPlans = [];
    for (let i = 0; i < massSpis.length; i++) {
      if (!massSpis[i].del) massplanPlans.push({ ...massplan.plans[i] });
    }
    massplan.plans = [];
    massplan.plans = massplanPlans;
    dispatch(massplanCreate(massplan));
    ChangeIDX(0);
    setTrigger(!trigger); // ререндер
  };
  //========================================================
  const StrokaSpisPlan = () => {
    let resStr = [];
    for (let i = 0; i < massSpis.length; i++) {
      let del = massSpis[i].del;
      let fl = false;
      let titleDel = del ? "Восстановить" : "Удалить";
      let illum = i === IDX ? true : false;
      resStr.push(
        <Grid key={i} container>
          <Grid item xs={7} sx={{ border: 0 }}>
            <Button sx={StylSpisPK022(del, illum)} onClick={() => MarkPlan(i)}>
              {massSpis[i].nom < 10 && <Box>&nbsp;&nbsp;</Box>}
              <Box sx={{ color: "#5B1080" }}>{massSpis[i].nom}.</Box>
              <Box>&nbsp;</Box>
              <Box>
                <b>{massSpis[i].name.slice(0, 45)}</b>
              </Box>
            </Button>
          </Grid>
          <Grid item xs={1.5} sx={{ border: 0 }}>
            {!del && (
              <>{KnopProps(StylSpisPK02(fl, fl), ViewPlan, "Просмотр", i)}</>
            )}
          </Grid>
          <Grid item xs={1.5} sx={{ border: 0 }}>
            {!del && (
              <>{KnopProps(StylSpisPK02(fl, fl), EditPlan, "Изменить", i)}</>
            )}
          </Grid>
          <Grid item xs>
            {KnopProps(StylSpisPK02(del, fl), MarkSpis, titleDel, i)}
          </Grid>
        </Grid>
      );
    }
    return resStr;
  };
  //=== обработка Esc ======================================
  const escFunction = React.useCallback(
    (event) => {
      if (event.keyCode === 27) {
        datestat.lockUp = false; // разблокировка меню районов и меню режимов
        CloseEnd();
        event.preventDefault();
      }
    },
    [datestat, CloseEnd]
  );

  React.useEffect(() => {
    document.addEventListener("keydown", escFunction);
    return () => document.removeEventListener("keydown", escFunction);
  }, [escFunction]);
  //========================================================
  return (
    <>
      <Box sx={MakeStyleFormPK00(696, PLANER)}>
        <Button sx={styleModalEnd} onClick={() => CloseEnd()}>
          <b>&#10006;</b>
        </Button>
        <Box sx={styleFormPK01}>
          <b>Выбор плана координации</b>
        </Box>
        <Box sx={MakeStylSpisPK01()}>{StrokaSpisPlan()}</Box>
        {flagDel > 0 && (
          <Box sx={{ marginTop: 1, textAlign: "center" }}>
            <Button sx={styleSpisPK03} onClick={() => DelSpis()}>
              Удалить отмеченные
            </Button>
          </Box>
        )}
      </Box>
      {view && <MapViewPK view={view} idx={IDX} handleClose={setView} />}
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

export default MapSpisPK;
