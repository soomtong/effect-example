import type { MysqlClient } from "@effect/sql-mysql2";
import * as Redacted from "effect/Redacted";

// 환경 변수 설정 (실제 사용 시에는 .env 같은 환경 변수 파일을 사용하세요)
export const grapMysqlConfig = (env: Record<string, string>): MysqlClient.MysqlClientConfig => {
    // console.log(env);
    return {
        host: env.DB_HOST ?? '',
        port: Number(env.DB_PORT ?? 3306),
        username: env.DB_USER ?? '',
        password: Redacted.make(env.DB_PASSWORD ?? ''),
        database: env.DB_DATABASE ?? '',
    }
}

// 현재 시간을 포맷팅하는 함수
export const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('ko-KR', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};