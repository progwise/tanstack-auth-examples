import { useEffect, useState } from "react";
import {
  getGithubAccessToken,
  getGithubLoginUrl,
  getGithubUserData,
  GithubAccessToken,
} from "./login-github-server";
import { useNavigate, useSearch } from "@tanstack/react-router";

const LoginGithub = () => {
  const [accessToken, setAccessToken] = useState<GithubAccessToken | null>(
    null
  );
  const [userInformation, setUserInformation] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const search = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });

  useEffect(() => {
    const github_access_token = localStorage.getItem("github_access_token");
    if (github_access_token) {
      setAccessToken(JSON.parse(github_access_token));
    }
    const github_login_progress = localStorage.getItem("github_login_progress");
    if (github_login_progress !== "1") {
      // In case of some other login (e.g. google) we don't want to interfere
      return;
    }
    localStorage.removeItem("github_login_progress");

    const code = search["code"];
    if (code) {
      getGithubAccessToken({ data: code }).then((response) => {
        localStorage.setItem("github_access_token", JSON.stringify(response));
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
      getGithubUserData({ data: accessToken }).then((response) => {
        if (response.error) {
          setError(response.error);
        } else {
          setUserInformation(response);
        }
      });
    }
  }, [accessToken]);

  const login = async () => {
    localStorage.setItem("github_login_progress", "1");
    window.location.href = await getGithubLoginUrl();
  };

  const logout = async () => {
    setAccessToken(null);
    setUserInformation(null);
    localStorage.removeItem("github_access_token");
    // @ts-ignore
    navigate({ search: ({ code, ...prev }) => ({ ...prev }) });
  };

  return (
    <>
      <ol>
        <li>click the button</li>
        <li>
          Server-Side function getGithubLoginUrl retrieves the login link
          <pre>
            https://github.com/login/oauth/authorize?client_id=
            <b>GITHUB_CLIENT_ID</b>&redirect_uri=http://localhost:3000
          </pre>
        </li>
        <li>
          After redirected back it reads the auth code and exchanges the code
          for the token using{" "}
          <pre>
            https://github.com/login/oauth/access_token?client_id=
            <b>GITHUB_CLIENT_ID</b>&client_secret=<b>GITHUB_CLIENT_SECRET</b>
            &code=<b>context.data</b>
          </pre>
        </li>
        <li>
          Then it fetches the user information using the token from{" "}
          <pre>https://api.github.com/user</pre>
          using the Authentication header <pre>Authorization: BEARER token</pre>
        </li>
      </ol>
      {error && <div>{error}</div>}
      {!accessToken?.access_token ? (
        <button onClick={login}>Login with github</button>
      ) : (
        <button onClick={logout}>Logout from github</button>
      )}

      {accessToken && <pre>{JSON.stringify(accessToken, undefined, 2)}</pre>}
      {userInformation && (
        <pre>{JSON.stringify(userInformation, undefined, 2)}</pre>
      )}
    </>
  );
};

export default LoginGithub;
