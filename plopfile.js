const path = require('path');

module.exports = function generate(plop) {
  plop.setGenerator('feature', {
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'choose feature name in camelCase (e.g. myFeature)',
        basePath: '.',
      },
    ],
    actions: [
      {
        type: 'addMany',
        destination: path.join(__dirname, 'apps/front/src/features'),
        base: '.blueprints/feature',
        templateFiles: '.blueprints/feature/**/**',
      },
    ],
  });
  plop.setGenerator('collection', {
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'choose feature name in PascalCase (e.g. SolutionVote)',
        basePath: '.',
      },
    ],
    actions: [
      {
        type: 'addMany',
        destination: path.join(__dirname, 'apps/api/src/collections'),
        base: '.blueprints/collection',
        templateFiles: '.blueprints/collection/**/**',
      },
    ],
  });
};
