/**
 * 存储当前正在监听响应式值变化的函数
 * @type {(() => void) | undefined}
 */
let currentListener = undefined;

/**
 * @template T
 * @typedef {() => T} ReadSignal
 * @typedef {(newValue: T) => void} WriteSignal
 * @typedef {[ReadSignal<T>, WriteSignal<T>]} Signal
 */

/**
 * `createSignal` 用于读取和设置响应式的值。
 *
 * 示例用法：
 *
 * ```ts
 * const [count, setCount] = createSignal(0);
 * ```
 *
 * @param {T} initialValue - 初始化的值
 * @returns {Signal<T>} - 返回读写响应式值的函数组成的数组
 */
export function createSignal(initialValue) {
  let value = initialValue;

  /**
   * 存储 createEffect 中传入的函数，这些函数会在值变化时被调用
   * @type {Set<() => void>}
   */
  const subscribers = new Set();

  // 定义读取函数，如果当前正在监听，则将监听器函数存入 subscribers 中
  const read = () => {
    if (currentListener !== undefined) {
      subscribers.add(currentListener);
    }
    return value;
  };

  /**
   * @param {T} newValue - 要设置的新值
   */
  const write = (newValue) => {
    value = newValue;
    // 值变化后，遍历 subscribers 调用每个监听器函数
    subscribers.forEach((fn) => fn());
  };

  return [read, write];
}

/**
 * `createEffect` 用于在响应式值发生变化时执行副作用。
 *
 * 每当响应式值变化时，它都会运行传入的回调函数。
 *
 * 示例用法：
 *
 * ```ts
 * createEffect(() => {
 * 	 console.log(someSignal());
 * });
 * ```
 *
 * @param {() => void} callback - 要执行的回调函数
 */
export function createEffect(callback) {
  currentListener = callback; // 记录当前正在运行的监听器函数
  callback(); // 在当前监听器函数下执行回调函数
  currentListener = undefined; // 在不需要监听器函数时避免将其添加到订阅者集合中
}
