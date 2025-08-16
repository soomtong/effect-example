import { Effect } from "effect"
import { MysqlDB } from "./connect-kysely"

export const findUsers = (username: string) => Effect.gen(function* () {
    const db = yield* MysqlDB
    return yield* db.selectFrom('user')
        .select(['id', 'site', 'username'])
        .where('username', 'like', `${username}%`)
        .orderBy('id', 'asc')
})