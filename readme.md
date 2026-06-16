# app template

template repository for next.js apps.

## how to run

prerequisites:

- [node.js v22](https://nodejs.org/en/download)
- [pnpm v10](https://pnpm.io/installation)

> [!TIP]
>
> you can use `pnpm` to install the required node.js version with `pnpm env use 22 --global`

set required environment variables in `.env.local`:

```bash
cp .env.local.example .env.local
```

also, set environment variables required by [validation](./.github/workflows/validate.yml) and
[deployment](./.github/workflows/build-deploy.yml) github actions. use
["variables"](https://github.com/acdh-oeaw/template-app-next/settings/variables/actions) for every
environment variable prefixed with `NEXT_PUBLIC_`, and
["secrets"](https://github.com/acdh-oeaw/template-app-next/settings/secrets/actions) for all others.

the default template accepts the following variables:

- `NEXT_PUBLIC_REDMINE_ID` (required): service issue for this application in the acdh-ch
  [redmine](https://redmine.acdh.oeaw.ac.at) issue tracker.
- `NEXT_PUBLIC_APP_BASE_URL` (required): the base url for this application. the default of
  "http://localhost:3000" should be fine for local development.
- `NEXT_PUBLIC_IMPRINT_SERVICE_BASE_URL` (required): the base url for the acdh-ch imprint service,
  which uses `NEXT_PUBLIC_REDMINE_ID` to fetch the imprint text.
- `NEXT_PUBLIC_BOTS` (required): whether this website can be indexed by web crawlers like the google
  bot. supported values are "disabled" and "enabled", defaults to "disabled".
- `NEXT_PUBLIC_MATOMO_BASE_URL` and `NEXT_PUBLIC_MATOMO_ID` (optional): set these to support
  client-side analytics with matomo.
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (optional): set this to verify site ownership for google
  search console.
- `ENV_VALIDATION` (optional): whether to validate environment variables. supported values are
  "disabled", "enabled", and "public". defaults to "enabled". "public" only validates build-args
  prefixed with `NEXT_PUBLIC_`, which can make sense in a docker build context.

when adding new environment variables, don't forget to add them to
[`.env.local.example`](./.env.local.example) and [`config/env.config.ts`](./config/env.config.ts) as
well.

install dependencies:

```bash
pnpm install
```

run a development server on [http://localhost:3000](http://localhost:3000):

```bash
pnpm run dev
```

> [!TI P]
>
> this template supports developing in containers. when opening the project in your editor, you
> should be prompted to re-open it in a devcontainer.

## lessons learned

`resources` and `[services]` of the Releven pipeline:

```
                            pathbuilder XML
                                   |
model view specifications ---> [wisskas]
                                   |
                                   v
                       SPARQL + pydantic models
                                   |
                              [rdfproxy] ----------> [GraphDB]
                                   |
                                   v
                            REST endpoints
                                   |
                                   v
                          [client generation]
                                   |
                                   v
                    types & consumers for frontend
```

- the central pipeline -- from a complex reified model specification through `wisskas` as a model
  view generation tool whose output is then instantiated by `rdfproxy` which accesses a triple store
  and provides REST endpoints with OpenAPI specifications which are fed to a frontend client
  generation -- risks having too many moving parts, so that any change or new requirement anywhere
  in the chain requires corresponding changes and adaptations in all related tools. while the
  strength of the newly developed tooling is customization, unnecessary complexity can be avoided by
  sticking to established standards such as LinkML and/or SHACL
- SPARQL queries for retrieving entities with more than 1-to-many relation among its (nested)
  properties can generate outputs which quickly become intractable in size. every such relation is
  better implemented as a dedicated endpoint, leading to several (but much smaller) queries from the
  frontend for each view of an entity.
