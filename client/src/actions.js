const login = (token) => {
  return {
    type: "LOGIN",
    payload: {
      token,
    },
  };
};

const logout = () => {
  return {
    type: "LOGOUT",
  };
};

const updateCardID = (cardID) => {
  return {
    type: "UPDATE_CARDID",
    payload: {
      cardID,
    },
  };
};

export { login, logout, updateCardID };
