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
# Run keycloak with realm and configured client for code/token auth. E.g. for the KEYCLOAK_URL=http://localhost:8180/realms/george-ai/. See also https://www.keycloak.org/docs/latest/server_admin/#assembly-managing-clients_server_administration_guide .
KEYCLOAK_URL=
KEYCLOAK_CLIENT_ID=
KEYCLOAK_CLIENT_SECRET=
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

### useEffect instead of tanStack

I used a lot of `useEffect` calls. I just started learning tanstack Router/Query/Start and therefore expect these calls to disappear in some future version.

### keycloak configuration

If you try out keycloak there is an example realm included in this Repo which is from my dev-computer, you can try the settings by importing it into your machine.

Example docker-compose for Keycloak:

```yml
version: '3.8'

services:

    keycloak-db:
        image: postgres:16
        container_name: keycloak-db
        restart: unless-stopped
        environment:
        POSTGRES_DB: keycloak
        POSTGRES_USER: keycloak
        POSTGRES_PASSWORD: password
        ports: - '5433:5432'
        volumes: - ../.postgres-data-keycloak:/var/lib/postgresql/data

    keycloak:
        image: quay.io/keycloak/keycloak:26.0.7
        container_name: keycloak
        environment:
        KC_DB: postgres
        KC_DB_URL: jdbc:postgresql://keycloak-db:5432/keycloak
        KC_DB_USERNAME: keycloak
        KC_DB_PASSWORD: password
        KC_HOSTNAME: localhost
        KC_HOSTNAME_STRICT: false
        KC_HOSTNAME_STRICT_HTTPS: false
        KC_LOG_LEVEL: info
        KC_METRICS_ENABLED: true
        KC_HEALTH_ENABLED: true
        KEYCLOAK_ADMIN: admin
        KEYCLOAK_ADMIN_PASSWORD: admin
    command: start-dev
    depends_on:
        - db
    ports:
        - 8180:8080

```
