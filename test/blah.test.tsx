import { render, createElement as ce } from '../src';

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    render(ce('div'), div);
  });
});
