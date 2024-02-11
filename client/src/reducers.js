const initialState = {
  isLoggedIn: false,
  token: "",
  cardID: "",
};

const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT";
const UPDATE_CARDID = "UPDATE_CARDID";

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isLoggedIn: true,
        token: action.payload.token,
      };
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        token: "",
      };
    case UPDATE_CARDID:
      return {
        ...state,
        cardID: action.payload.cardID,
      };
    default:
      return state;
  }
}

export default rootReducer;
