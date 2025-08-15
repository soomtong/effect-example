import { SqlClient, type SqlError } from "@effect/sql";
import { MysqlClient } from "@effect/sql-mysql2";
import { Effect } from "effect";
import { grapMysqlConfig } from "../shared/common-util";

// 접속 정보는 비동기로 받을 수 있음
export const initMysqlConnection = async () => {
    const config = grapMysqlConfig(process.env as Record<string, string>);
    const MySqlLive = MysqlClient.layer(config);
    return MySqlLive;
  }

export const databaseConnection: Effect.Effect<SqlClient.SqlClient, SqlError.SqlError, SqlClient.SqlClient> = Effect.gen(function* () {
    yield* Effect.log('데이터베이스 연결을 시도합니다...');
  
    const sql = yield* SqlClient.SqlClient;
    yield* Effect.log('데이터베이스 연결이 성공했습니다!');
    return sql;
  });
  