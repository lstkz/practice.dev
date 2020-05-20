import { render } from '../../../_common/makeDemo';
import { Details } from './index';

render(Details);

if (module.hot) {
  module.hot.accept('./index', () => {
    render(require('./index').Details);
  });
}
