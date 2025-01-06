import { createServerFn } from "@tanstack/start";
import { z } from "vinxi";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

export const getGithubLoginUrl = createServerFn({
  method: "GET",
}).handler(() => {
  return `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=http://localhost:3000`;
});

export type GithubAccessToken = {
  access_token?: string;
  token_type?: string;
  error?: string;
};

export const getGithubAccessToken = createServerFn({
  method: "POST",
})
  .validator((access_code: string) => z.string().nonempty().parse(access_code))
  .handler(async (context) => {
    const params = `?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${context.data}`;
    const data = await fetch(
      `https://github.com/login/oauth/access_token${params}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      }
    ).then((response) => {
      if (response.ok) {
        return response.json();
      }
      return { error: response.statusText };
    });
    return {
      ...data,
      token_type: data.token_type.toUpperCase(),
    } as GithubAccessToken;
  });

export const getGithubUserData = createServerFn({
  method: "POST",
})
  .validator((data: unknown) =>
    z
      .object({
        access_token: z.string().nonempty(),
        token_type: z.enum(["BEARER"]),
      })
      .parse(data)
  )
  .handler(async ({ data }) => {
    const user_data = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: data.token_type + " " + data.access_token,
      },
    }).then((res) => res.json());
    console.log(user_data);
    return user_data;
  });
