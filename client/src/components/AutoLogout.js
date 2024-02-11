import { useIsAuthenticated, useAuthHeader, useSignOut } from "react-auth-kit";
import React, { useEffect } from "react";

export default function AutoLogout() {
  const auth = useAuthHeader();
  const isAuthenticated = useIsAuthenticated();
  const logout = useSignOut();
  //   console.log("entered auto logout");
  //   console.log(isAuthenticated());
  //   console.log(getTokenExpirationDate(auth()));
  //   console.log(Date.now());

  //   console.log(logout());
  useEffect(() => {
    let timer;

    if (isAuthenticated() && getTokenExpirationDate(auth())) {
      //   console.log("inside auto logout");

      const timeUntilExpiration =
        getTokenExpirationDate(auth()) - Date.now() / 1000;
      timer = setTimeout(() => {
        // Log the user out when their token expires

        if (timeUntilExpiration < 0) {
          console.log("autologout", timeUntilExpiration);

          logout();
        }
      }, timeUntilExpiration);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isAuthenticated, getTokenExpirationDate(auth()), logout]);

  return null;
}

function getTokenExpirationDate(token) {
  if (!token) {
    return null;
  }

  const tokenParts = token.split(".");

  if (tokenParts.length < 2) {
    return null;
  }

  const payload = JSON.parse(atob(tokenParts[1]));

  if (!payload.exp) {
    return null;
  }

  // const expirationDate = new Date(payload.exp * 1000);

  return payload.exp;
}
