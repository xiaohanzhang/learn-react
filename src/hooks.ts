import Container from './Container';

export const useRef = <T,>(initial: T): {current: T} => {
  return Container.getInstance().useRef(initial);
};

export const useState = <T,>(initial: T) => {
  return Container.getInstance().useState(initial);
};

export const useReducer = () => {
  throw new Error('not implemented');
};

export const useContext = () => {
  throw new Error('not implemented');
}
