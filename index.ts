import { Console, Effect } from "effect";

// A tiny Effect program that reads an env var, falls back, and logs
const program = Effect.gen(function* () {
  const name = process.env.USER ?? "world";
  yield* Console.log(`Hello, ${name}! from Effect on Bun`);
});

// Provide default runtime and run the effect
await Effect.runPromise(program);
