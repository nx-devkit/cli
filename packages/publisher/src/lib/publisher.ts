import * as nx from '@nx/devkit';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { PackageJson } from 'nx/src/utils/package-json.js';

export async function getNotPublishedProjects() {
  const { $ } = await import('execa');

  const graph = nx.readCachedProjectGraph();

  const projects = [] as Array<nx.ProjectGraphProjectNode>;

  for (const project of Object.values(graph.nodes)) {
    // we are only interested in publishable libraries
    if (!project?.data?.targets?.['publish']) {
      continue;
    }
    // read project's package.json
    const pkg = await readProjectPackageJson(project);
    const { name, version } = pkg;
    // read current package
    try {
      await $`npm view ${name}@${version} --json`;
    } catch (error) {
      // not published
      projects.push(project);
    }
  }

  return projects;
}

async function readProjectPackageJson(project: nx.ProjectGraphProjectNode) {
  const pkg_json_path = resolve(
    nx.workspaceRoot,
    project.data.root,
    'package.json'
  );
  const pkg_json = await readFile(pkg_json_path);
  const pkg = JSON.parse(pkg_json.toString());
  return pkg as PackageJson;
}

export async function printProjectsToPublish() {
  const projects = await getNotPublishedProjects();
  console.log(projects.map(({ name }) => name).join(','));
}
