import type { SqlError } from "@effect/sql"
import { Console, Context, Effect } from "effect"
import { KyselyLive, type MysqlDB } from "./connect-kysely"
import { findUsers } from "./find-users"
import type { UserEntity } from "./kysely-schema"

// 유저 서비스 스펙 정의
class UserService extends Context.Tag("UserService")<
    UserService,
    { readonly find: (username: string) => Effect.Effect<readonly UserEntity[], SqlError.SqlError, MysqlDB> }
>() { }

const program = Effect.gen(function* () {
    const userService = yield* UserService
    const users = yield* userService.find('soomtong')
    yield* Console.log(users)
})

// 의존성 주입
const runnable = program.pipe(
    Effect.provideService(UserService, { find: findUsers }),
    Effect.provide(KyselyLive)
)

Effect.runPromise(runnable).catch(console.error)