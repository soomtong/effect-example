import type { SqlClient } from '@effect/sql';
import { Effect, pipe, Schema } from 'effect';
import { databaseConnection, initMysqlConnection } from './connection';
import { exponentialBackoffSchedule } from './retry-policy';

/**
 * 데이터베이스 연결 후 쿼리 실행
 */

// 조인된 결과를 위한 스키마
class CustomerWithUser extends Schema.Class<CustomerWithUser>('CustomerWithUser')({
  id: Schema.Number,
  site: Schema.String,
  name: Schema.NullOr(Schema.String),
  username: Schema.NullOr(Schema.String),
}) { }

const MySqlLive = await initMysqlConnection();

// 2. 쿼리 실행 Effect
const executeQuery = (sql: SqlClient.SqlClient, username: string) =>
  Effect.gen(function* () {
    yield* Effect.log('쿼리를 실행합니다...');

    const customerTable = 'customer';
    const userTable = 'user';
    const limit = 10;
    const fields = ['c.id as id', 'c.site as site', 'c.name as name', 'u.username as username'];

    const rawCustomers = yield* sql<CustomerWithUser>`
        SELECT ${sql.unsafe(fields.join(', '))}
        FROM ${sql(customerTable)} as c left join ${sql(userTable)} as u on c.user_id = u.id 
        WHERE u.username like '${sql.unsafe(username)}%' limit ${sql.unsafe(limit.toString())}`;

    yield* Effect.log(`쿼리 실행 완료: ${rawCustomers.length}개 결과`);
    return rawCustomers;
  });

const makeCustomerService = (sql: SqlClient.SqlClient) =>
  Effect.gen(function* () {
    return {
      getCustomers: (username: string) => executeQuery(sql, username)
    };
  });

// 3. 결과 출력 Effect
const displayResults = (validatedCustomers: ReadonlyArray<CustomerWithUser>) =>
  Effect.gen(function* () {
    yield* Effect.log(`최종 결과: ${validatedCustomers.length}개 고객 데이터`);

    yield* Effect.forEach(validatedCustomers, (customer, index) =>
      Effect.log(
        `고객 ${index + 1}: ID=${customer.id}, 사이트=${customer.site}, 이름=${customer.name}, 사용자명=${customer.username}`
      )
    );
  });

// 4. 이펙트를 결합하여 프로그램을 선언
const composedProgram = Effect.gen(function* () {
  const sql = yield* databaseConnection;
  const customerService = yield* makeCustomerService(sql);
  const rawData = yield* customerService.getCustomers('soomtong');
  yield* displayResults(rawData);

  return rawData;
});

// 5. pipe를 사용한 함수형 프로그래밍 방식
const functionalComposedProgram = pipe(
  databaseConnection,
  // 단계별로 실행하고 결과를 다음 단계로 전달
  Effect.flatMap(makeCustomerService),
  Effect.flatMap((customerService) => customerService.getCustomers('soomtong')),
  Effect.flatMap(displayResults),
  Effect.map(() => '모든 작업이 완료되었습니다!')
);

const main = composedProgram.pipe(
  Effect.provide(MySqlLive),
  Effect.retry(exponentialBackoffSchedule),
);

Effect.runPromise(main).catch(console.error)
  // Effect.catchTags({
  //   SqlError: (error) => {
  //     Effect.log('쿼리 실행 오류:', error.message, error.cause);
  //     return Effect.fail(error);
  //   },
  //   DatabaseConnectionError: (error) => {
  //     Effect.log('데이터베이스 연결 오류:', error.message, error.cause);
  //     return Effect.fail(error);
  //   }
  // }));
