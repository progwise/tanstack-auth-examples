import { createServerFn } from "@tanstack/start";
import { z } from "vinxi";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export const getGoogleLoginUrl = createServerFn({
  method: "GET",
}).handler(() => {
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=http://localhost:3000&response_type=code&scope=openid%20email%20profile`;
});

export type GoogleAccessToken = {
  access_token?: string;
  token_type?: string;
  error?: string;
};

export const getGoogleAccessToken = createServerFn({
  method: "POST",
})
  .validator((access_code: string) => z.string().nonempty().parse(access_code))
  .handler(async (context) => {
    const params = `?client_id=${GOOGLE_CLIENT_ID}&client_secret=${GOOGLE_CLIENT_SECRET}&code=${context.data}&grant_type=authorization_code&redirect_uri=http://localhost:3000`;
    const data = await fetch(`https://oauth2.googleapis.com/token${params}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      return { error: response.statusText };
    });
    console.log(data);
    return {
      ...data,
      //token_type: data.token_type.toUpperCase(),
    } as GoogleAccessToken;
  });
export const getGoogleUserData = createServerFn({
  method: "POST",
})
  .validator((data: unknown) =>
    z
      .object({
        access_token: z.string().nonempty(),
        token_type: z.enum(["BEARER", "Bearer"]),
      })
      .parse(data)
  )
  .handler(async ({ data }) => {
    const user_data = await fetch(
      "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
      {
        headers: {
          Authorization: data.token_type + " " + data.access_token,
        },
      }
    ).then((res) => res.json());
    console.log(user_data);
    return user_data;
  });
