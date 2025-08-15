import { test, expect } from "bun:test";
import { sum } from "./sum";

test("sum adds", () => {
  expect(sum(2, 3)).toBe(5);
});
