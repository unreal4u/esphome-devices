# AGENTS.md

ESPHome device configuration repo — see README.md for context.

## Deployment model

This repo does not run locally. It runs on a dedicated server that holds
`config/secrets.yaml` (gitignored, never committed). Any checkout you're
working in — including this one — will not have that file, or will have an
incomplete/stub version of it. Do not assume secrets are present, do not
invent placeholder secret values in configs, and never write real secret
values into tracked files.

## Validate before proposing changes

Before proposing a diff to any `config/*.yaml`, validate it against ESPHome:

```sh
docker compose run --rm esphome config /config/<file>.yaml
```

Use `compile` instead of `config` if you need to confirm it actually builds,
not just that the YAML/schema is valid:

```sh
docker compose run --rm esphome compile /config/<file>.yaml
```

If the current environment has no Docker/ESPHome available (e.g. a sandboxed
session), say so explicitly and flag that validation still needs to happen
on the server before the change is applied — don't present an unvalidated
config change as ready to merge.
