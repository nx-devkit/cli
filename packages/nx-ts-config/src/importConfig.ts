import { registerPluginTSTranspiler } from 'nx/src/utils/nx-plugin';
import path = require('path');

registerPluginTSTranspiler();

export default async function (projectRoot: string) {
  const relativePathToProject = path.relative(
    module.path,
    path.resolve(projectRoot)
  );

  const config = await import(path.join(relativePathToProject, 'project.ts'));
  return config.default;
}
