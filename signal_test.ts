import {
  assertSpyCall,
  assertSpyCalls,
  spy,
} from "https://deno.land/std@0.181.0/testing/mock.ts";
import { assertEquals } from "https://deno.land/std@0.181.0/testing/asserts.ts";
import { createEffect, createSignal } from "./signal.mjs";

Deno.test("createSignal should return a tuple with a read function", () => {
  const [count] = createSignal(0);
  assertEquals(count(), 0);
});

Deno.test("createSignal should return a tuple with a write function", () => {
  const [count, setCount] = createSignal(0);
  setCount(1);
  assertEquals(count(), 1);
  setCount(2);
  assertEquals(count(), 2);
});

Deno.test("createEffect should call the callback function", () => {
  const mockCallback = spy(() => {});
  createEffect(mockCallback);

  assertSpyCall(mockCallback, 0, {
    args: [],
    returned: undefined,
  });
  assertSpyCalls(mockCallback, 1);
});

Deno.test("createSignal should update value and notify subscribers", () => {
  const [count, setCount] = createSignal(0);
  const mockSubscriber = spy(() => {});
  createEffect(() => {
    mockSubscriber();
    count();
  });
  setCount(1);
  assertEquals(count(), 1);
  assertSpyCalls(mockSubscriber, 2);
});
