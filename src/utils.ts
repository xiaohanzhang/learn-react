export function debounce<T extends (...args: any) => any>(func: T, wait: number = 0) {
  let timeout: any;
  let result: any;

  return function debounced(this: any, ...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      result = func.apply(this, args);
    }, wait);
    return result;
  };
}

const isEqualArrays = (src: any[], target: any[]) => {
  return src === target || (
    src.length === target.length && src.every((v, i) => v === target[i])
  );
};

const isEqualObjects = (src: Object, target: Object) => {
  if (src === target) {
    return true;
  }
  const srcKeys = Object.keys(src);
  const targetKeys = Object.keys(target);
  // @ts-ignore
  return srcKeys.length === targetKeys.length && srcKeys.every((k) => src[k] === target[k]);
}

export const isEqual = (src: any, target: any) => {
  if (src === target || (Number.isNaN(src) && Number.isNaN(target))) {
    return true;
  }
  const srcTag = Object.prototype.toString.call(src);
  const targetTag = Object.prototype.toString.call(target);
  return srcTag === targetTag && (
    (Array.isArray(src) && isEqualArrays(src, target)) ||
    (srcTag === '[object Array]' && isEqualObjects(src, target))
  )
}
