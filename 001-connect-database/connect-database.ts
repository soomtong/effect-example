import { SqlClient } from '@effect/sql';
import { MysqlClient } from '@effect/sql-mysql2';
import { Duration, Effect, Schedule } from 'effect';
import { grapMysqlConfig } from '../shared/common-util';

/**
 * 환경변수에서 제공 받은 데이터베이스 접속 정보를 바탕으로
 * 데이터베이스 연결을 시도하고, 연결 성공 시 데이터베이스 서비스 객체를 반환하는 Effect를 생성합니다.
 * 연결 실패 시 지수 백오프 전략을 사용하여 최대 3번 재시도합니다.
 * 재시도 시도 횟수와 대기 시간을 출력하고, 최종 연결 성공 시 데이터베이스 서비스 객체를 반환합니다.
 * 데이터베이스 연결 성공 시 단순한 쿼리를 전송하고 결과를 받아 화면에 출력합니다.
 */

// 접속 정보는 비동기로 받을 수 있음
const initMysqlConnection = async () => {
  const config = grapMysqlConfig(process.env as Record<string, string>);
  const MySqlLive = MysqlClient.layer(config);
  return MySqlLive;
}
// Effect 의존성 정보를 가진 레이어를 반환한다.
// console.log(await initMysqlConnection());

// 1. 데이터베이스 연결
const databaseConnection = Effect.gen(function* () {
  yield* Effect.log('데이터베이스 연결을 시도합니다...');
  // 외부 의존성이 있는 서비스
  // Effect.Effect<SqlClient.SqlClient, never, SqlClient.SqlClient>
  const sql = yield* SqlClient.SqlClient;
  yield* Effect.log('데이터베이스 연결이 성공했습니다!');
  return sql;
});

// program 은 설계도이고, 이 설계도를 바탕으로 실제 실행되는 것은 Effect.runPromise 입니다.
// Effect-ts 는 Class 생성자 의존성 주입과 다르게 의존성을 관리합니다.
// Effect.provide 를 사용하여 의존성을 주입할 수 있음
const _main1 = databaseConnection.pipe(Effect.provide(await initMysqlConnection()));

// Effect.runPromise(main1);

// 지수 백오프 스케줄 정의 (3회 재시도, 10초, 20초, 40초 대기)
const exponentialBackoffSchedule = Schedule.exponential(
  // 초기 지연 시간: 3초; 2 배수 정책을 사용 (3초 -> 6초 -> 12초)
  Duration.seconds(3), 2
).pipe(
  Schedule.compose(Schedule.recurs(5)), // 최대 5번 재시도 (총 6번 시도)
  Schedule.tapOutput((attempt) => Effect.log(`재시도 시도 ${attempt}번째`))
);

const MySqlLive = await initMysqlConnection();
const _main2 = databaseConnection.pipe(
  Effect.provide(MySqlLive),
  Effect.retry(exponentialBackoffSchedule),
  Effect.catchAll((error) => {
    console.error('데이터베이스 연결 실패:', error);
    return Effect.fail(error);
  })
);

// Effect.runPromise(main2);

// 2. 쿼리 실행 Effect (SQL 클라이언트를 받아서 사용)
const executeQuery = (sql: SqlClient.SqlClient) =>
  Effect.gen(function* () {
    yield* Effect.log('쿼리를 실행합니다...');

    const mysqlResult = yield* sql<{ timestamp: Date }>`SELECT now() as timestamp`;

    yield* Effect.log(`쿼리 실행 완료: ${mysqlResult.length}개 결과`);
    return mysqlResult;
  });

// 3. 두 개의 이펙트를 결합하여 프로그램을 선언
const composedProgram = Effect.gen(function* () {
  // 단계별로 실행하고 결과를 다음 단계로 전달
  const sql = yield* databaseConnection;
  const rawData = yield* executeQuery(sql);

  if (rawData.length > 0 && rawData[0]) {
    // timestamp 는 Date 타입으로 추론됨
    yield* Effect.log(`쿼리 실행 완료: ${rawData[0].timestamp.toISOString()}`);
  } else {
    yield* Effect.log('쿼리 실행 결과가 없습니다.');
  }

  return rawData;
});

const main3 = composedProgram.pipe(
  Effect.provide(MySqlLive),
  Effect.retry(exponentialBackoffSchedule),
  Effect.catchAll((error) => {
    console.error('쿼리 실행 실패:', error);
    return Effect.fail(error);
  })
);

Effect.runPromise(main3);
