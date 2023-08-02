import {
  ProjectGraph,
  ProjectGraphBuilder,
  ProjectGraphProcessorContext,
} from '@nx/devkit';
import path = require('path');

import { deepmerge } from 'deepmerge-ts';
import importConfig from './importConfig';

export async function processProjectGraph(
  graph: ProjectGraph,
  context: ProjectGraphProcessorContext
): Promise<ProjectGraph> {
  for (const project of Object.values(graph.nodes)) {
    //check if it has project.ts
    const getFilePath = (file: string) =>
      project.data.root === '.' ? file : path.join(project.data.root, file);

    const projectTs = getFilePath('project.ts');

    if (context.fileMap[project.name].some(({ file }) => file === projectTs)) {
      //import project ts
      try {
        const config = await importConfig(project.data.root);
        Object.assign(project, {
          data: deepmerge(project.data, config),
        });
      } catch (error) {
        console.error(error);
      }
    }
  }

  const builder = new ProjectGraphBuilder(graph);
  // We will see how this is used below.
  return builder.getUpdatedProjectGraph();
}
