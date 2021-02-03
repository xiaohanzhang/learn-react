import { isEqual, debounce } from './utils';

interface Props {
  key?: string,
}

export interface MyElement<P = {}> {
  type: string | FC,
  key: string | null,
  props: Props & P,
  children: MyChildren[],
}

type MyNode = string | number | boolean | null | undefined | MyElement;
export type MyChildren = MyNode | Array<MyNode | MyChildren>;
export type FC<P = {}> = (props: P & Props & {children?: any}, context?: any) => MyChildren;

const notNull = <T,>(value: T|null): value is T => {
  return value !== null;
}

interface HTMLProps {
  onClick?: (e: MouseEvent) => any
}
const updateHtmlElement = (element: HTMLElement, { onClick }: Props & HTMLProps): HTMLElement => {
  if (onClick) {
    element.onclick = onClick;
  }
  return element;
}

const createHtmlElement = (tag: string, props: Props & HTMLProps) => {
  const element = document.createElement(tag);
  return updateHtmlElement(element, props)
}

export const replaceChildren = (parent: Node, children: Node[]) => {
  console.log(parent, children);
  if (children.length > 0) {
    children.forEach((child) => {
      parent.appendChild(child);
    });
    while (parent.firstChild !== null && parent.firstChild !== children[0]) {
      parent.removeChild(parent.firstChild);
    }
  }
  return parent;
}

const isText = (value: any): value is Text => {
  return value instanceof Node && value.nodeType === Node.TEXT_NODE;
}

class Container {
  static instance: Container | null = null;
  static getInstance() {
    return this.instance as Container;
  }

  element: HTMLElement | null = null;
  hookStates: any[] = [];
  hookStateIndex = 0;
  children: {[key: string]: Container|Text} = {};

  constructor(
    private prev: MyElement
  ) {}

  debounceRender = debounce((...args) => {
    return this.render(...args);
  })

  shouldRender(current: MyElement) {
    const { prev } = this;
    if (prev.type !== current.type) {
      this.destroy();
    }
    return !isEqual(prev.props, current.props);
  }

  destroy() {
    const { element } = this;
    if (element !== null) {
      element.remove();
      this.element = null;
    } else {
      Object.keys(this.children).forEach((key) => {
        this.destroyChild(key);
      });
    }
    this.children = {};
  }

  destroyChild(key: string) {
    if (key in this.children) {
      const child = this.children[key];
      if (isText(child)) {
        child.remove();
      } else {
        child.destroy();
      }
      delete this.children[key];
    }
  }

  getDirectNodes(): Node[] {
    if (this.element !== null) {
      return [this.element];
    }
    return Object.values(this.children).map((child) => {
      return isText(child) ? child : child.getDirectNodes();
    }).flat();
  }

  renderChildren(children: MyChildren[]): Node[] {
    const newChildren: {[key: string]: Container|Text} = {};
    const addChild = (key: string, child: Container|Text, destory: boolean) => {
      newChildren[key] = child;
      if (key in this.children) {
        delete this.children[key];
      }
      if (destory) {
        this.destroyChild(key);
      }
      return child;
    }
    const results = children.flat(Infinity)
      .map((child: MyNode, i) => {
        const key = `__learn_${i}`;
        // ignore boolean, null, undefined
        if (typeof child === 'string' || typeof child === 'number') {
          const node = document.createTextNode('' + child);
          addChild(key, node, true);
          return node;
        } else if (child && typeof child === 'object') {
          if (child.key === null) {
            child.key = key;
          }
          let container = this.children[child.key];
          let current: MyElement | null = child;
          if (!container || isText(container)) {
            container = new Container(child);
            current = null;
          }
          addChild(child.key, container, !current);
          return container.render(current);
        }
        return null;
      })
      .flat()
      .filter(notNull)
    ;
    Object.keys(this.children).forEach((key) => {
      this.destroyChild(key);
    });
    this.children = newChildren;
    return results;
  }

  render(current?: MyElement | null) {
    console.log(current);
    if (!current) {
      current = this.prev;
    } else if (!this.shouldRender(current)) {
      return this.getDirectNodes();
    }
    const { type, props, children } = current;
    if (typeof type === 'string') {
      if (this.element === null) {
        this.element = createHtmlElement(type, props);
      } else {
        this.element = updateHtmlElement(this.element, props);
      }
      console.log(children);
      return [replaceChildren(this.element, this.renderChildren(children))];
    } else {
      Container.instance = this;
      this.hookStateIndex = 0;
      const newChildren = [type({...props, children})];
      return this.renderChildren(newChildren);
    }
  }
}

export default Container;
