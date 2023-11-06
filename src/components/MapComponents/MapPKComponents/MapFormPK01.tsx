import * as React from 'react';
import { useSelector } from 'react-redux';
//import { massplanCreate, statsaveCreate } from './../../../redux/actions';

//import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

//import { BadExit } from "../../MapServiceFunctions";

//import { AREA } from "../../MainMapGl";

import { styleModalEnd } from '../../MainMapStyle';
import { styleFormPK01 } from '../../MainMapStyle';
//import { StylSpisPK02, styleSpisPK03, StylSpisPK022 } from '../../MainMapStyle';
import { styleSpisPK05 } from '../../MainMapStyle';

//let HAVE = 0;
//let flagDel = 0;
//let makeDel = false;
//let soobErr = '';
//let IDX = 0;

//let massSpis: Array<any> = [];

const MapFormPK01 = (props: {
  view: boolean;
  //idx: number;
  handleClose: Function;
}) => {
  //== Piece of Redux =======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map;
  });
  let massplan = useSelector((state: any) => {
    const { massplanReducer } = state;
    return massplanReducer.massplan;
  });
  //console.log('###massplan:', massplan);
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  //console.log('massplan:', massplan, massSpis);
  //const dispatch = useDispatch();
  //===========================================================
  let plan = massplan.plans[datestat.idxMenu];
  let nameArea = '';
  for (let i = 0; i < map.dateMap.tflight.length; i++) {
    let num = Number(map.dateMap.tflight[i].area.num);
    if (num === plan.areaPK) {
      nameArea = map.dateMap.tflight[i].area.nameArea;
      break;
    }
  }
  //const [openSetErr, setOpenSetErr] = React.useState(false);
  //const [trigger, setTrigger] = React.useState(false);
  //const [view, setView] = React.useState(false);
  //=== инициализация ======================================
  //if (massplan.plans.length !== massSpis.length || datestat.needMakeSpisPK) {
  // if (makeDel) {
  //   makeDel = false;
  // } else {
  console.log('INIC');
  // if (massplan.plans.length !== massSpis.length) IDX = 0;
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
  // dispatch(statsaveCreate(datestat));
  console.log('£££:', datestat.needMenuForm);
  //}
  //========================================================
  const handleClose = () => {
    props.handleClose(false);
  };

  const CloseEnd = (event: any, reason: string) => {
    if (reason === 'escapeKeyDown') handleClose();
  };

  // const CloseEnd = React.useCallback(() => {
  //   props.setOpen(false); // полный выход
  // }, [props]);

  // const CloseEnd = () => {
  //   datestat.needMenuForm = false; //  не выдавать меню форм
  //   dispatch(statsaveCreate(datestat));
  //   props.setOpen(false); // полный выход
  // };

  // const handleCloseBad = React.useCallback(() => {
  //   CloseEnd(); // выход без сохранения
  // }, [CloseEnd]);

  // const handleCloseBadExit = (mode: boolean) => {
  //   //setBadExit(false);
  //   mode && CloseEnd(); // выход без сохранения
  // };
  //=== Функции - обработчики ==============================

  //========================================================

  //=== обработка Esc ======================================
  // const escFunction = React.useCallback(
  //   (event) => {
  //     if (event.keyCode === 27) {
  //       props.setOpen(false); // полный выход
  //       event.preventDefault();
  //     }
  //   },
  //   [props],
  // );

  // React.useEffect(() => {
  //   document.addEventListener('keydown', escFunction);
  //   return () => document.removeEventListener('keydown', escFunction);
  // }, [escFunction]);
  //========================================================

  const stylePKForm01 = {
    outline: 'none',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '96%',
    // maxHeight: "80%",
    // minHeight: "80%",
    bgcolor: 'background.paper',
    border: '1px solid #FFFFFF',
    borderRadius: 1,
    boxShadow: 24,
    textAlign: 'center',
    p: 1.5,
  };

  return (
    <Modal open={props.view} onClose={CloseEnd} hideBackdrop={false}>
      <Box sx={stylePKForm01}>
        <Button sx={styleModalEnd} onClick={() => handleClose()}>
          <b>&#10006;</b>
        </Button>
        <Box sx={styleFormPK01}>
          <b>Данные о перекрёстках ПК №{plan.nomPK}</b>
        </Box>
        <Box sx={styleSpisPK05}>
          <Box sx={{}}>
            <b>Название ПК:</b>&nbsp;&nbsp;
          </Box>
          <Box sx={{ fontSize: 15 }}>
            <em>{plan.namePK.slice(0, 53)}</em>
          </Box>
        </Box>
        <Box sx={styleSpisPK05}>
          <Box sx={{}}>
            <b>Pайон: {plan.areaPK}</b> &nbsp;
          </Box>
          <Box sx={{ fontSize: 15 }}>
            <em>{nameArea}</em>
          </Box>
        </Box>
        {/* <Box sx={MakeStylSpisPK06()}>{StrokaPK()}</Box> */}
      </Box>
    </Modal>
  );
};

export default MapFormPK01;
