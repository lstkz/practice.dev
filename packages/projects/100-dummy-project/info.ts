import { ProjectInfo } from '../_common/types';

export const info: ProjectInfo = {
  id: 100,
  title: 'Dummy project',
  description: 'This is a dummy project only for testing',
  domain: 'frontend',
  challenges: [
    {
      id: 1,
      title: 'Display static text',
      description: 'Display static text without any interactions.',
    },
    {
      id: 2,
      title: 'Change static text',
      description: 'Change the text created in the previous challenges.',
    },
    {
      id: 3,
      title: 'Change static text again',
      description: 'Change the text created in the previous challenges.',
    },
  ],
};
