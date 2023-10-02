export const styleModalMenuErr = {
  marginTop: 0.5,
  maxHeight: "21px",
  minHeight: "21px",
  backgroundColor: "#E6F5D6",
  textTransform: "unset !important",
  color: "black",
  boxShadow: 6,
};

export const styleSetArea = {
  width: "55px",
  maxHeight: "3px",
  minHeight: "3px",
  marginTop: "3px",
  bgcolor: "#FFFBE5",
  boxShadow: 6,
  textAlign: "center",
  p: 1,
};

export const styleBoxFormArea = {
  "& > :not(style)": {
    marginTop: "-9px",
    marginLeft: "-10px",
    width: "73px",
  },
};

export const styleSetNapr = {
  width: "12px",
  maxHeight: "3px",
  minHeight: "3px",
  bgcolor: "#FFFBE5",
  boxShadow: 3,
  p: 1.5,
};

export const styleBoxFormNapr = {
  "& > :not(style)": {
    marginTop: "-10px",
    marginLeft: "-12px",
    width: "36px",
  },
};

export const styleModalEditBind = {
  fontSize: 15,
  maxHeight: "21px",
  minHeight: "21px",
  backgroundColor: "#E6F5D6",
  color: "black",
  marginLeft: 0.6,
  textTransform: "unset !important",
  textAlign: "center",
  boxShadow: 3,
};

export const styleHeadError = {
  color: "#5B1080",
  textAlign: "center",
};

export const styleFooterError = {
  fontSize: 12.5,
  color: "#5B1080",
  marginLeft: 1.5,
  marginTop: 1.5,
};

export const styleModalEndErr = (colorEnd: string) => {
  const styleModalEnd = {
    position: "absolute",
    top: "0%",
    left: "auto",
    right: "-0%",
    height: "21px",
    maxWidth: "2%",
    minWidth: "2%",
    color: colorEnd,
  };
  return styleModalEnd;
};

export const styleSetInfErr = (colorBorder: string) => {
  const styleSetInf = {
    outline: "none",
    position: "absolute",
    // marginTop: "18vh",
    // marginLeft: "27vh",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: 430,
    bgcolor: "background.paper",
    border: "1px solid #000",
    borderColor: colorBorder,
    borderRadius: 1,
    boxShadow: 24,
    p: 1.5,
  };
  return styleSetInf;
};
