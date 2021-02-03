import { createElement as ce, render } from '../.';

const Hello = () => {
  return ce(
    'div', 
    {
      onClick: () => {
        console.log('Hello');
      },
    }, 
    `hello world`,
    ce(Foo)
  );
}

const Foo = () => {
  console.log('render: Foo');
  return 'foo';
}

const App = () => {
  console.log('render: App');
  return ce(
    'div', {}, 
    ce(Hello),
    ce(Foo),
  );
}

render(
  ce(App),
  document.getElementById('root')
);
