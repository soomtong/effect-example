import { Effect } from 'effect';
import { KyselyLive, MysqlDB } from './connect-kysely';

const findQuery = (username: string) =>
    Effect.gen(function* () {
        const db = yield* MysqlDB;
        return yield* db
            .selectFrom('user')
            .select(['id', 'site', 'username'])
            .where('username', 'like', `${username}%`)
            .orderBy('id', 'asc');
    });

const userServiceProgram = findQuery('soomtong').pipe(
    Effect.provide(KyselyLive),
    Effect.tap((result) => Effect.log(result)),
    Effect.tap(() => Effect.log('쿼리 실행 완료!'))
);

Effect.runPromise(userServiceProgram).catch(console.error);
