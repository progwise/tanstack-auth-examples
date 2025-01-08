import { useEffect, useState } from "react";
import {
  getKeycloakAccessToken,
  getKeycloakLoginUrl,
  getKeycloakUserData,
  KeycloakAccessToken,
} from "./login-keycloak-server";
import { useNavigate, useSearch } from "@tanstack/react-router";

const LoginKeycloak = () => {
  const [accessToken, setAccessToken] = useState<KeycloakAccessToken | null>(
    null
  );
  const [userInformation, setUserInformation] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const search = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });

  useEffect(() => {
    const keycloak_access_token = localStorage.getItem("keycloak_access_token");
    if (keycloak_access_token) {
      setAccessToken(JSON.parse(keycloak_access_token));
    }
    const keycloak_login_progress = localStorage.getItem(
      "keycloak_login_progress"
    );
    if (keycloak_login_progress !== "1") {
      // In case of some other login (e.g. google) we don't want to interfere
      return;
    }
    localStorage.removeItem("keycloak_login_progress");

    const code = search["code"];
    if (code) {
      getKeycloakAccessToken({ data: code }).then((response) => {
        localStorage.setItem("keycloak_access_token", JSON.stringify(response));
        setAccessToken(response);
      });
    }
  }, []);

  useEffect(() => {
    if (accessToken?.error) {
      setError(accessToken.error);
    } else {
      setError(null);
    }

    if (accessToken?.access_token) {
      // @ts-ignore
      navigate({ search: ({ code, ...prev }) => ({ ...prev }) });
      getKeycloakUserData({ data: accessToken }).then((response) => {
        if (response.error) {
          setError(response.error);
        } else {
          setUserInformation(response);
        }
      });
    }
  }, [accessToken]);

  const login = async () => {
    localStorage.setItem("keycloak_login_progress", "1");
    window.location.href = await getKeycloakLoginUrl();
  };

  const logout = async () => {
    setAccessToken(null);
    setUserInformation(null);
    localStorage.removeItem("keycloak_access_token");
    // @ts-ignore
    navigate({ search: ({ code, ...prev }) => ({ ...prev }) });
  };

  return (
    <>
      {error && <div>{error}</div>}
      {!accessToken?.access_token ? (
        <button onClick={login}>Login with keycloak</button>
      ) : (
        <button onClick={logout}>Logout from keycloak</button>
      )}

      {accessToken && <pre>{JSON.stringify(accessToken, undefined, 2)}</pre>}
      {userInformation && (
        <pre>{JSON.stringify(userInformation, undefined, 2)}</pre>
      )}
    </>
  );
};

export default LoginKeycloak;
