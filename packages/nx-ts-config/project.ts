import { ProjectConfiguration } from '@nx/devkit';

export default {
  targets: {
    'noop-target': {
      executor: 'nx:noop',
    },
  },
} as Partial<ProjectConfiguration>;
