# Support project.ts in addition to project.json

By default nx supports [project configuration](https://nx.dev/reference/project-configuration) only in json format. However sometimes we might want to build it programmatically in the same way as other tools support.

## Usage

- Install the package

```sh
npm i -D nx-ts-config @nx/devkit
```

- declare plugin usage in nx.json

```json
{
  "plugins": ["nx-ts-config"]
}
```

- now you can use project.ts in addition to project.json

```ts
import { ProjectConfiguration } from '@nx/devkit';

export default {
  targets: {
    noop: {
      executor: 'nx:noop',
    },
  },
} as Partial<ProjectConfiguration>;

```

## Limitations

Currently this plugin only extends the existing projects in a graph and doesn't add new nodes. It means that in addition to project.ts you need to make your package an nx project.
You can do this in one of the following ways
- create an empty project.json
- add nx: {} section to your package.json

