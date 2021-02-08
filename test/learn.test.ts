import { render, createElement as ce } from '../src';

describe('leart-react', () => {
  it('renders single div', () => {
    const div = document.createElement('div');
    expect(render(ce('div', null, 'hello world'), div)).toMatchSnapshot();
  });
});
