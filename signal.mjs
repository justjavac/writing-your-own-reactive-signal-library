let currentListener = undefined;

/**
 * @template T
 * @typedef {() => T} ReadSignal
 * @typedef {(newValue: T) => void} WriteSignal
 * @typedef {[ReadSignal<T>, WriteSignal<T>]} Signal
 */

/**
 * `createSignal` will be used to read and set a reactive value.
 *
 * Example usage
 *
 * ```ts
 * const [count, setCount] = createSignal(0);
 * ```
 *
 * @param {T} initialValue
 * @returns {Signal<T>}
 */
export function createSignal(initialValue) {
  let value = initialValue;

  /**
   * a set of callback functions, from createEffect
   * @type {Set<() => void>}
   */
  const subscribers = new Set();

  const read = () => {
    if (currentListener !== undefined) {
      // before returning, track the current listener
      subscribers.add(currentListener);
    }
    return value;
  };

  /**
   * @param {T} newValue
   */
  const write = (newValue) => {
    value = newValue;
    // after setting the value, run any subscriber, aka effect, functions
    subscribers.forEach((fn) => fn());
  };

  return [read, write];
}

/**
 * `createEffect` will be used to run side effects whenever that value changes.
 *
 * It will run the callback function whenever the value changes.
 *
 * Example usage
 *
 * ```ts
 * createEffect(() => {
 * 	 console.log(someSignal());
 * });
 * ```
 *
 * @param {() => void} callback
 */
export function createEffect(callback) {
  currentListener = callback;
  callback();
  currentListener = undefined;
}
