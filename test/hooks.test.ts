import { createElement as ce, useState } from '../src';
import Container from '../src/Container';

describe('hooks', () => {
  it('components render correct times', () => {
    const counter: {[key: string]: number} = {};
    const count = (componentName: string) => {
      if (!(componentName in counter)) {
        counter[componentName] = 0;
      }
      counter[componentName] += 1;
    }
    const scope: {[key: string]: any} = {};

    const NoHook = () => {
      count('NoHook');
      return ce('div');
    }

    const State = () => {
      const [state, setState] = useState(0);
      scope.State = {state, setState};
      count('State');
      return ce('div', null, [state]);
    }

    const App = () => {
      count('App');
      return ce('div', null, [
        ce(NoHook),
        ce(State),
      ]);
    }
    
    const container = new Container(ce(App));
    expect(container.render()).toMatchSnapshot();
    expect(counter).toEqual({
      App: 1, NoHook: 1, State: 1
    });
    container.render(ce(App));
    expect(counter).toEqual({
      App: 1, NoHook: 1, State: 1
    });
    container.render(ce(App, {foo: 'bar'}));
    expect(counter).toEqual({
      App: 2, NoHook: 1, State: 1
    });
    expect(scope.State.state).toBe(0);
    expect(scope.State.setState(scope.State.state + 1)).toBe(1);
    expect(scope.State.state).toBe(0);
    expect(counter).toEqual({
      App: 2, NoHook: 1, State: 1
    });
    // TODO: test async debounceRender
  });
});
