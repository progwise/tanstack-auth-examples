# There are many examples out there but non with
- Tanstack Start (https://tanstack.com/start/latest)
- using 2 different identity providers like google and github (https://oauth.net/2/grant-types/authorization-code/)

## Content

This is an example of using Tanstack Server-Side funtions to implement a code flow login to oAuth providers. It is written in Typescript and demoes some handling of redirects and obtaining access-tokens without the use of some seperate express servers.

## Obtain client-id's and secrets

To run this example app you need 2 sets of clientid/secrets from google and/or github

```sh
# First read: https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/registering-a-github-app
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
# First read: https://support.google.com/cloud/answer/6158849?hl=en#
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Feel free to implement other providers....

## as usual

```
git clone git@github.com:progwise/tanstack-auth-examples.git
```

and

```
npm i
```

and finally

```
npm run dev
```

## Known issues

I used a lot of ```useEffect``` calls. I just started learning tanstack Router/Query/Start and therefore expect these calls to disappear in some future version.
