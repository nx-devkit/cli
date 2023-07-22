# Publish nx packages in a hybrid mode

By default nx recommends to use [@jscutlery/semver](https://github.com/jscutlery/semver#jscutlerysemver) package to publish your workspace packages.
In that plugin two modes are introduced:
- [Independent mode](https://github.com/jscutlery/semver#independent-mode) when you control versions independently per package
- [Synced mode](https://github.com/jscutlery/semver#synced-mode-1) when you publish all packages with same version

The current package introduces principally different approach which is kind of a hybrid mode:
- we issue a new version for a root package with `npm patch` command on a local machine, so we're able to control `patch|minor|major` levels
- by use of preversion hooks we sync the root package version only to those packages which are affected by the change

In this approach we do not republish all packages with a new version, but we only publish affected ones. From the other side the package version is always linked to release of the same version.

## How to use

- install with  `npm i -D nx-publisher` command
- adjust your workspace package.json file with following commands
```
  "scripts": {    
    "preversion": "nx affected --target=version --base=v${npm_old_version} ${npm_new_version} --workspaces-update=false",
    "version": "npm install --silent --ignore-scripts --package-lock-only --fund=false --audit=false && git add -A",
    "nx:publish": "nx run-many --target=publish --projects=$(get-projects-to-publish)"
  },
  "workspaces": [
    "packages/*"
  ]
```
- to make project publishable add following two new targets to every project.json
```
    "version": {
      "executor": "nx:run-commands",
      "options": {
        "command": "npm version",
        "cwd": "packages/publisher"
      }
    },
    "publish": {
      "executor": "nx:run-commands",
      "options": {
        "command": "npm publish",
        "cwd": "dist/packages/publisher"
      },
      "dependsOn": [
        "build"
      ]
    }
```
- notice that we rely on standard `npm version` functionality which tags the current repo with a new `v*.*.*` tag
- `get-projects-to-publish` - is exactly what current module delivers - a command, building list of projects to publish
- usage of workspaces here is recommended (not tested for packages outside of workspaces)

## Publish

The idea of this package - is that we do not depend on the current head and base. This analysis has happened during version release. The current script will analyse the registry and if the version is not yet there - it will propose it to publish
```shell
npx nx run-many --target=publish --projects=$(get-projects-to-publish)
```

### Github actions

Here is a simple example how to publish from Github
```yaml
name: Publish Package to npmjs
on:
  release:
    types: [created]
jobs:
  npm-publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      # Setup .npmrc file to publish to npm
      - uses: actions/setup-node@v3
        with:
          node-version: '20.x'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run nx:publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

```
