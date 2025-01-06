import { useEffect, useState } from "react";
import {
  getGoogleAccessToken,
  getGoogleLoginUrl,
  getGoogleUserData,
  GoogleAccessToken,
} from "./login-google-server";
import { useNavigate, useSearch } from "@tanstack/react-router";

const LoginGoogle = () => {
  const [accessToken, setAccessToken] = useState<GoogleAccessToken | null>(
    null
  );
  const [userInformation, setUserInformation] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const search = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });

  useEffect(() => {
    const google_access_token = localStorage.getItem("google_access_token");
    if (google_access_token) {
      setAccessToken(JSON.parse(google_access_token));
    }
    const google_login_progress = localStorage.getItem("google_login_progress");
    if (google_login_progress !== "1") {
      // In case of some other login (e.g. github) we don't want to interfere
      return;
    }
    localStorage.removeItem("google_login_progress");

    const code = search["code"];
    if (code) {
      getGoogleAccessToken({ data: code }).then((response) => {
        localStorage.setItem("google_access_token", JSON.stringify(response));
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
      navigate({
        // @ts-ignore
        search: ({ code, scope, authuser, hd, prompt, ...prev }) => ({
          ...prev,
        }),
      });
      getGoogleUserData({ data: accessToken }).then((response) => {
        if (response.error) {
          setError(response.error);
        } else {
          setUserInformation(response);
        }
      });
    }
  }, [accessToken]);

  const login = async () => {
    localStorage.setItem("google_login_progress", "1");
    const url = await getGoogleLoginUrl();
    window.location.href = url;
  };

  const logout = async () => {
    setAccessToken(null);
    setUserInformation(null);

    localStorage.removeItem("google_access_token");
    navigate({
      // @ts-ignore
      search: ({ code, scope, authuser, hd, prompt, ...prev }) => ({ ...prev }),
    });
  };

  return (
    <div>
      <ol>
        <li>click the button</li>
        <li>
          Server-Side function getGoogleLoginUrl retrieves the login link
          <pre>
            https://accounts.google.com/o/oauth2/v2/auth?client_id=
            <b>GOOGLE_CLIENT_ID</b>
            &redirect_uri=http://localhost:3000&response_type=code&scope=openid%20email%20profile
          </pre>
        </li>
        <li>
          After redirected back it reads the auth code and exchanges the code
          for the token using{" "}
          <pre>
            https://oauth2.googleapis.com/token?client_id=
            <b>GOOGLE_CLIENT_ID</b>
            &client_secret=<b>GOOGLE_CLIENT_SECRET</b>
            &code=<b>context.data</b>
            &grant_type=authorization_code&redirect_uri=http://localhost:3000
          </pre>
        </li>
        <li>
          Then it fetches the user information using the token from{" "}
          <pre>https://www.googleapis.com/oauth2/v1/userinfo?alt=json</pre>
          using the Authentication header <pre>Authorization: BEARER token</pre>
        </li>
      </ol>
      {error && <div>{error}</div>}
      {!accessToken?.access_token ? (
        <button onClick={login}>Login with Google</button>
      ) : (
        <button onClick={logout}>Logout from Google</button>
      )}

      {accessToken && <pre>{JSON.stringify(accessToken, undefined, 2)}</pre>}
      {userInformation && (
        <pre>{JSON.stringify(userInformation, undefined, 2)}</pre>
      )}
    </div>
  );
};

export default LoginGoogle;
