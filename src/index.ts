import Container, { FC, MyChildren, MyElement, replaceChildren } from './Container';

export const createElement = <P extends {}>(
  type: FC | string, 
  props: {key?: string | number} & P | null = null, 
  ...children: MyChildren[]
): MyElement => {
  const { key, ...rest } = props || {};
  return {
    type,
    key: key !== undefined ? '' + key : null,
    props: rest,
    children,
  };
}

export const render = (current: MyElement, element: Element | null) => {
  if (element === null) {
    return;
  }
  // @ts-ignore 
  let container: Container = element.__learnRoot;
  if (!container) {
    // @ts-ignore 
    container = element.__learnRoot = new Container(current);
    while (element.lastChild) {
      element.removeChild(element.lastChild);
    }
    replaceChildren(element, container.render());
  } else {
    replaceChildren(element, container.render(current));
  }
}
