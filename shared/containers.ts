import * as Mysql from "@effect/sql-mysql2"
import type { StartedMySqlContainer } from "@testcontainers/mysql"
import { MySqlContainer } from "@testcontainers/mysql"
import { Context, Effect, Layer, Redacted } from "effect"

export class MysqlContainer extends Context.Tag("test/MysqlContainer")<
  MysqlContainer,
  StartedMySqlContainer
>() {
  static Live = Layer.scoped(
    this,
    Effect.acquireRelease(
      Effect.promise(() => new MySqlContainer("mysql:lts").start()),
      (container) => Effect.promise(() => container.stop())
    )
  )

  static ClientLive = Layer.unwrapEffect(
    Effect.gen(function*() {
      const container = yield* MysqlContainer
      return Mysql.MysqlClient.layer({
        url: Redacted.make(container.getConnectionUri())
      })
    })
  ).pipe(Layer.provide(this.Live))
}
