import * as React from 'react';
import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

import { styleModalEnd, styleSetInf, styleSetImg } from './../MainMapStyle';

let massBind = [0, 0];
let OldIdxA = 0;
let OldIdxB = 0;

const MapRouteBind = (props: {
  debug: boolean;
  setOpen: any;
  svg: any;
  setSvg: any;
  idxA: number;
  idxB: number;
}) => {
  //== Piece of Redux ======================================
  // let massdk = useSelector((state: any) => {
  //   const { massdkReducer } = state;
  //   return massdkReducer.massdk;
  // });
  let massroute = useSelector((state: any) => {
    const { massrouteReducer } = state;
    return massrouteReducer.massroute;
  });
  // const map = useSelector((state: any) => {
  //   const { mapReducer } = state;
  //   return mapReducer.map;
  // });
  //const dispatch = useDispatch();
  //========================================================
  const [openSetBind, setOpenSetBind] = React.useState(true);
  let masSvg = ['', ''];
  let otlOrKosyk = props.debug;
  if (!props.svg) otlOrKosyk = true;

  console.log('Props.svg:', props.svg, otlOrKosyk);
  let heightImg = window.innerWidth / 3.333;
  let widthHeight = heightImg.toString();

  if (OldIdxA !== props.idxA || OldIdxB !== props.idxB) {
    massBind = [0, 0];
    OldIdxA = props.idxA;
    OldIdxB = props.idxB;
  }

  const ReplaceInSvg = (idx: number) => {
    let ch = '';
    let svgPipa = props.svg[idx];
    let vxod = props.svg[idx].indexOf('width=');
    for (let i = 0; i < 100; i++) {
      if (isNaN(Number(svgPipa[vxod + 7 + i]))) break;
      ch = ch + svgPipa[vxod + 7 + i];
    }
    for (let i = 0; i < 6; i++) {
      svgPipa = svgPipa.replace(ch, widthHeight);
    }
    //console.log("svgPipa:", svgPipa);
    return svgPipa;
  };

  const handleCloseSetEndBind = () => {
    props.setOpen(false);
    setOpenSetBind(false);
    props.setSvg(null);
  };

  const ExampleComponent = (idx: number) => {
    return (
      <div>
        <div dangerouslySetInnerHTML={{ __html: masSvg[idx] }} />
      </div>
    );
  };

  function AppIconAsdu() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={heightImg - 10}
        height={heightImg - 10}
        // width={heightImg}
        // height={heightImg}
        version="1"
        viewBox="0 0 91 54">
        <path
          d="M425 513C81 440-106 190 91 68 266-41 640 15 819 176c154 139 110 292-98 341-73 17-208 15-296-4zm270-14c208-38 257-178 108-308C676 79 413 8 240 40 29 78-30 199 100 329c131 131 396 207 595 170z"
          transform="matrix(.1 0 0 -.1 0 54)"></path>
        <path
          d="M425 451c-11-18-5-20 74-30 108-14 157-56 154-133-2-52-41-120-73-129-44-12-110-10-110 4 1 6 7 62 14 122 7 61 12 113 10 117-4 6-150 1-191-8-45-9-61-40-74-150-10-90-14-104-30-104-12 0-19-7-19-20 0-11 7-20 15-20s15-7 15-15c0-11 11-15 35-15 22 0 38 6 41 15 4 9 19 15 35 15 22 0 29 5 29 20s-7 20-25 20c-29 0-31 10-14 127 12 82 31 113 71 113 18 0 20-5 15-42-4-24-9-74-12-113-3-38-8-87-11-107l-6-38h46c34 0 46 4 46 15s12 15 48 15c97 0 195 47 227 110 59 115-44 225-223 237-56 4-81 2-87-6z"
          transform="matrix(.1 0 0 -.1 0 54)"></path>
      </svg>
    );
  }

  if (!otlOrKosyk) {
    masSvg[0] = ReplaceInSvg(0);
    masSvg[1] = ReplaceInSvg(1);
  }

  const styleSetArea = {
    width: '17px',
    maxHeight: '3px',
    minHeight: '3px',
    bgcolor: '#FAFAFA',
    boxShadow: 3,
    marginLeft: 'auto',
    p: 1.5,
  };
  const styleBoxFormArea = {
    '& > :not(style)': {
      marginTop: '-8px',
      marginLeft: '-8px',
      width: '40px',
    },
  };
  //========================================================

  const InputNapr = (mode: number) => {
    const handleKey = (event: any) => {
      if (event.key === 'Enter') event.preventDefault();
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setCurrency(event.target.value);
      if (mode) {
        massBind[1] = massDat[Number(event.target.value)];
        //console.log('!!!!!!', massDat[Number(event.target.value)]);
      } else {
        massBind[0] = massDat[Number(event.target.value)];
      }
    };

    let dat = massroute.vertexes[props.idxA].lout;
    if (mode) dat = massroute.vertexes[props.idxB].lin;
    let massKey = [];
    let massDat: any[] = [];
    const currencies: any = [];
    for (let key in dat) {
      massKey.push(key);
      massDat.push(dat[key]);
    }
    for (let i = 0; i < massKey.length; i++) {
      let maskCurrencies = {
        value: '',
        label: '',
      };
      maskCurrencies.value = massKey[i];
      maskCurrencies.label = massDat[i];
      currencies.push(maskCurrencies);
    }

    const [currency, setCurrency] = React.useState(massKey[0]);

    return (
      <Box sx={styleSetArea}>
        <Box component="form" sx={styleBoxFormArea} noValidate autoComplete="off">
          <TextField
            select
            size="small"
            onKeyPress={handleKey} //отключение Enter
            value={currency}
            onChange={handleChange}
            InputProps={{ style: { fontSize: 14 } }}
            variant="standard"
            //helperText="Введите район"
            color="secondary">
            {currencies.map((option: any) => (
              <MenuItem key={option.value} value={option.value} sx={{ fontSize: 14 }}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>
    );
  };

  console.log(' massBind:', massBind);

  const styleApp01 = {
    fontSize: 14,
    border: '2px solid #000',
    bgcolor: 'background.paper',
    width: 120,
    maxHeight: '24px',
    minHeight: '24px',
    borderColor: 'primary.main',
    borderRadius: 2,
    color: 'black',
    textTransform: 'unset !important',
  };

  return (
    <Modal open={openSetBind} onClose={handleCloseSetEndBind} disableEnforceFocus hideBackdrop>
      <>
        {/* <Box sx={styleSetInf}>
          <Button sx={styleModalEnd} onClick={handleCloseSetEndBind}>
            <b>&#10006;</b>
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <br />
            <br />
            <b>Здесь будет привязка направления</b>
            <br /> <br />
            <br />
          </Box>
        </Box> */}

        <Grid container sx={{ marginTop: '33vh', height: 24, width: '100%' }}>
          <Grid item xs={0.25}></Grid>
          <Grid item xs={3.5} sx={{ bgcolor: '#FAFAFA', opacity: 0.7, textAlign: 'right' }}>
            <b>№ исходящего направления:</b>
          </Grid>
          <Grid item xs={0.5}>
            {InputNapr(0)}
          </Grid>

          <Grid item xs={3.5} sx={{ border: 0 }}>
            {massBind[0] && massBind[1] && (
              <Box sx={{ textAlign: 'center' }}>
                <Button variant="contained" sx={styleApp01} onClick={handleCloseSetEndBind}>
                  <b>Привязываем</b>
                </Button>
              </Box>
            )}
          </Grid>

          <Grid item xs={3.5} sx={{ bgcolor: '#FAFAFA', opacity: 0.7, textAlign: 'right' }}>
            <b>№ входящего направления:</b>
          </Grid>
          <Grid item xs={0.5}>
            {InputNapr(1)}
          </Grid>
        </Grid>

        <Grid container sx={{ marginTop: '1vh', height: heightImg }}>
          <Grid item xs={0.25} sx={{ border: 0 }}></Grid>
          <Grid item xs={4} sx={styleSetImg}>
            {otlOrKosyk && <>{AppIconAsdu()}</>}
            {!otlOrKosyk && <>{ExampleComponent(0)}</>}
          </Grid>
          <Grid item xs={3.5} sx={{ border: 0 }}></Grid>
          <Grid item xs={4} sx={styleSetImg}>
            {otlOrKosyk && <>{AppIconAsdu()}</>}
            {!otlOrKosyk && <>{ExampleComponent(1)}</>}
          </Grid>
          <Grid item xs={0.25} sx={{ border: 0 }}></Grid>
        </Grid>
      </>
    </Modal>
  );
};

export default MapRouteBind;
