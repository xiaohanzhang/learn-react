import { createElement as ce, render, useState, useRef } from '../.';

const Hello = ({ counterRef }) => {
  return ce(
    'div', 
    {
      onClick: () => {
        console.log('Hello');
      },
    }, 
    `hello world ${counterRef.current}`,
    ce(Foo)
  );
}

const Foo = () => {
  console.log('render: Foo');
  return 'foo';
}

const App = () => {
  const [counter, setCounter] = useState(0);
  const ref = useRef(0);
  
  console.log('render: App');
  return ce(
    'div', null, 
    ce('div', {
      onClick: () => {
        setCounter(counter + 1);
        ref.current = counter + 1;
      }
    }, `App clicked: ${counter}`),
    ce(Hello, {counterRef: ref}),
    ce(Foo),
  );
}

render(
  ce(App),
  document.getElementById('root')
);
