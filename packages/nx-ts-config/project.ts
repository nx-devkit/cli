import { ProjectConfiguration } from '@nx/devkit';

export default {
  targets: {
    noop: {
      executor: 'nx:noop',
    },
  },
} as Partial<ProjectConfiguration>;
