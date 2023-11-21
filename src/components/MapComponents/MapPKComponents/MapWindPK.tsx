import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
// import {
//   //massplanCreate,
//   statsaveCreate,
// } from "./../../../redux/actions";

//import Grid from '@mui/material/Grid';
import Box from "@mui/material/Box";
//import Button from '@mui/material/Button';

//import MapPointDataError from './../MapPointDataError';
//import MapViewPK from './MapViewPK';

//import { BadExit } from "../../MapServiceFunctions";

//import { AREA } from "../../MainMapGl";

import { styleFormPK01, MakeStyleFormPK00 } from "../../MainMapStyle";
// import //MakeStylSpisPK01
// "../../MainMapStyle";
//import { StylSpisPK02, styleSpisPK03, StylSpisPK022 } from '../../MainMapStyle';
//import { styleSpisPK04 } from "../../MainMapStyle";

//let HAVE = 0;
//let flagDel = 0;
//let makeDel = false;
//let soobErr = '';
//let IDX = 0;

//let massSpis: Array<any> = [];

const MapWindPK = (props: {
  setOpen: any;
  setMode: Function; // запуск редактирования ПК
  SetMass: Function; // массив "подсвечиваемых" перекрёстков
}) => {
  //== Piece of Redux =======================================
  let massplan = useSelector((state: any) => {
    const { massplanReducer } = state;
    return massplanReducer.massplan;
  });
  console.log("###massplan:", massplan);
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  //console.log('massplan:', massplan, massSpis);
  const dispatch = useDispatch();
  //===========================================================
  //const [openSetErr, setOpenSetErr] = React.useState(false);
  //const [trigger, setTrigger] = React.useState(false);
  //const [view, setView] = React.useState(false);

  // const ChangeIDX = (idx: number) => {
  //   IDX = idx;
  //   datestat.idxMenu = idx; //  активная строка списка ПК
  //   dispatch(statsaveCreate(datestat));
  //   let massPkId: any = [];
  //   // создание списка перекрёстков выбранного плана
  //   for (let i = 0; i < massplan.plans[idx].coordPlan.length; i++)
  //     massPkId.push(massplan.plans[idx].coordPlan[i].id);
  //   massPkId.length && props.SetMass(massPkId, massplan.plans[idx].areaPK);
  // };
  //=== инициализация ======================================
  //if (massplan.plans.length !== massSpis.length || datestat.needMakeSpisPK) {
  // if (makeDel) {
  //   makeDel = false;
  // } else {
  // if (!massplan.plans.length) ChangeIDX(-1);
  // if (massplan.plans.length !== massSpis.length) ChangeIDX(0);
  // if (datestat.nomMenu > 0) {
  //   //console.log('Нужно перестроение', datestat.nomMenu);
  //   let idx = 0;
  //   for (let i = 0; i < massplan.plans.length; i++) {
  //     if (massplan.plans[i].nomPK === datestat.nomMenu) {
  //       idx = i;
  //     }
  //   }
  //   console.log('Нужно перестроение', datestat.nomMenu, idx);
  //   ChangeIDX(idx);
  //   datestat.nomMenu = -1; //  активная строка списка ПК
  //   dispatch(statsaveCreate(datestat));
  // }
  // flagDel = 0;
  // let massSp = [];
  // for (let i = 0; i < massplan.plans.length; i++) {
  //   let mask = {
  //     nom: massplan.plans[i].nomPK,
  //     name: massplan.plans[i].namePK,
  //     del: false,
  //   };
  //   let have = false;
  //   for (let j = 0; j < massSpis.length; j++) {
  //     if (massSpis[j].nom === massplan.plans[i].nomPK) {
  //       massSpis[j].name = massplan.plans[i].namePK;
  //       if (massSpis[j].del) flagDel++;
  //       //if (massSpis[j].del) massSpis[j].del = false; // снятие отметки на удаление
  //       massSp.push({ ...massSpis[j] });
  //       have = true;
  //     }
  //   }
  //   !have && massSp.push(mask);
  // }
  // massSpis = [];
  // massSpis = massSp;
  // if (datestat.needMakeSpisPK) datestat.needMakeSpisPK = false;
  // datestat.needMenuForm = true; // выдавать меню форм
  // datestat.lockUp = true; // блокировка/разблокировка меню районов и меню режимов
  // dispatch(statsaveCreate(datestat));
  //}
  //========================================================
  // const CloseEnd = React.useCallback(() => {
  //   props.setOpen(false); // полный выход
  // }, [props]);

  // const CloseEnd = React.useCallback(() => {
  //   datestat.needMenuForm = false; //  не выдавать меню форм
  //   dispatch(statsaveCreate(datestat));
  //   props.setOpen(false); // полный выход
  // }, [datestat, dispatch, props]);

  // const handleCloseBad = React.useCallback(() => {
  //   CloseEnd(); // выход без сохранения
  // }, [CloseEnd]);

  // const handleCloseBadExit = (mode: boolean) => {
  //   //setBadExit(false);
  //   mode && CloseEnd(); // выход без сохранения
  // };
  //=== Функции - обработчики ==============================
  // const MarkSpis = (idx: number) => {
  //   massSpis[idx].del = !massSpis[idx].del;
  //   if (massSpis[idx].del) {
  //     flagDel++;
  //   } else {
  //     flagDel--;
  //   }
  //   if (idx === IDX) {
  //     ChangeIDX(0);
  //     if (!idx) ChangeIDX(-1);
  //   }
  //   setTrigger(!trigger); // ререндер
  // };

  // const EditPlan = (idx: number) => {
  //   if (idx !== IDX) ChangeIDX(idx);
  //   props.setMode(idx); // запуск редактирования ПК
  // };

  // const ViewPlan = (idx: number) => {
  //   ChangeIDX(idx);
  //   setView(true);
  // };

  // const MarkPlan = (idx: number) => {
  //   if (massSpis[idx].del) {
  //     soobErr = 'План координации № ' + massSpis[idx].nom + ' помечен на удаление';
  //     setOpenSetErr(true);
  //   } else {
  //     ChangeIDX(idx);
  //     setTrigger(!trigger); // ререндер
  //   }
  // };

  // const DelSpis = () => {
  //   let massplanPlans = [];
  //   for (let i = 0; i < massSpis.length; i++) {
  //     if (!massSpis[i].del) massplanPlans.push({ ...massplan.plans[i] });
  //   }
  //   massplan.plans = [];
  //   massplan.plans = massplanPlans;
  //   dispatch(massplanCreate(massplan));
  //   ChangeIDX(massplanPlans.length ? 0 : -1);
  //   setTrigger(!trigger); // ререндер
  // };
  //========================================================
  // const StrokaSpisPlan = () => {
  //   let resStr = [];
  //   for (let i = 0; i < massSpis.length; i++) {
  //     let del = massSpis[i].del;
  //     let fl = false;
  //     let titleDel = del ? 'Восстановить' : 'Удалить';
  //     let illum = i === IDX ? true : false;
  //     resStr.push(
  //       <Grid key={i} container>
  //         <Grid item xs={7} sx={{ border: 0 }}>
  //           <Button sx={StylSpisPK022(del, illum)} onClick={() => MarkPlan(i)}>
  //             {massSpis[i].nom < 10 && <Box>&nbsp;&nbsp;</Box>}
  //             <Box sx={{ color: '#5B1080' }}>{massSpis[i].nom}.</Box>
  //             <Box>&nbsp;</Box>
  //             <Box>
  //               <b>{massSpis[i].name.slice(0, 45)}</b>
  //             </Box>
  //           </Button>
  //         </Grid>
  //         <Grid item xs={1.5} sx={{ border: 0 }}>
  //           {!del && (
  //             <Button sx={StylSpisPK02(fl, fl)} onClick={() => ViewPlan(i)}>
  //               Просмотр
  //             </Button>
  //           )}
  //         </Grid>
  //         <Grid item xs={1.5} sx={{ border: 0 }}>
  //           {!del && (
  //             <Button sx={StylSpisPK02(fl, fl)} onClick={() => EditPlan(i)}>
  //               Изменить
  //             </Button>
  //           )}
  //         </Grid>
  //         <Grid item xs sx={{ border: 0 }}>
  //           <Button sx={StylSpisPK02(del, fl)} onClick={() => MarkSpis(i)}>
  //             {titleDel}
  //           </Button>
  //         </Grid>
  //       </Grid>,
  //     );
  //   }
  //   return resStr;
  // };
  //=== обработка Esc ======================================
  // const escFunction = React.useCallback(
  //   (event) => {
  //     if (event.keyCode === 27) {
  //       datestat.lockUp = false; // разблокировка меню районов и меню режимов
  //       CloseEnd();
  //       event.preventDefault();
  //     }
  //   },
  //   [datestat, CloseEnd]
  // );

  // React.useEffect(() => {
  //   document.addEventListener("keydown", escFunction);
  //   return () => document.removeEventListener("keydown", escFunction);
  // }, [escFunction]);
  //========================================================

  const styleFormPK00 = {
    outline: "none",
    position: "relative",
    marginTop: "-92.5vh",
    marginLeft: "auto",
    marginRight: "9px",
    width: 199,
    height: 250,
    bgcolor: "#F3F3F3",
    border: "1px solid #F3F3F3",
    //borderColor: 'primary.main',
    borderRadius: 1,
    boxShadow: 24,
    p: 1.5,
  };

  // const styleFormPK01 = {
  //   fontSize: 18,
  //   textAlign: "center",
  //   color: "#5B1080",
  //   textShadow: "2px 2px 3px rgba(0,0,0,0.3)",
  // };

  const MakeStyleFormPK00 = (wdth: number) => {
    const styleFormPK00 = {
      outline: "none",
      position: "relative",
      marginTop: "-96.5vh",
      marginLeft: "auto",
      marginRight: "9px",
      width: wdth,
      height: window.innerHeight * 0.3,
      bgcolor: "background.paper",
      border: "1px solid #FFFFFF",
      //borderColor: 'primary.main',
      borderRadius: 1,
      boxShadow: 24,
      p: 1.5,
    };
    return styleFormPK00;
  };

  return (
    <>
      <Box sx={MakeStyleFormPK00(199)}>
       
        <Box sx={styleFormPK01}>
          <b>Общая информация</b>
        </Box>
        
      </Box>
      
    </>
  );
};

export default MapWindPK;
