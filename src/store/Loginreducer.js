// project imports

// action - state management
import * as actionTypes from "./actions";

export const initialState = {
  Login: false,
  token: "",
  Loginuser: {},
  userlist: [],
  userEditId: "",
  blacklistedvendorlist: [],
  role: "",
  blacklistedvendorlistId: "",
};

// ==============================|| CUSTOMIZATION REDUCER ||============================== //

const Loginreducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN:
      return {
        ...state,
        Login: true,
        Loginuser: action.payload,
      };
    case actionTypes.USERLIST:
      return {
        ...state,
        userlist: action.payload,
      };
    case actionTypes.GETUSEREDITID:
      return {
        ...state,
        userEditId: action.payload,
      };
    case actionTypes.SETBLACKLISTEDVENDORLIST:
      return {
        ...state,
        blacklistedvendorlist: action.payload,
      };
    case actionTypes.SETBLACKLISTEDVENDOREDITID:
      return {
        ...state,
        blacklistedvendorlistId: action.payload,
      };

    default:
      return state;
  }
};

export default Loginreducer;
