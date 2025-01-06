# There are many examples out there but non with
- tanstack Start (https://tanstack.com/start/latest)
- using 2 different identity providers like google and github (https://oauth.net/2/grant-types/authorization-code/)

## Content

This is an example of using tanstack Service-Side funtions to implement a code flow login to oAuth providers. It is written in Typescript and demoes some handling of redirects and obtaining access-tokens without the use of some seperate express servers.

## Run it

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
