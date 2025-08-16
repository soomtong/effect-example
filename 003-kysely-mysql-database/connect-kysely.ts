import * as MysqlKysely from '@effect/sql-kysely/Mysql';
import { MysqlClient } from '@effect/sql-mysql2';
import { Context, Layer } from 'effect';
import { grapMysqlConfig } from '../shared/common-util';
import type { DatabaseSchema } from './kysely-schema';

// 접속 정보는 비동기로 받을 수 있음
export const initMysqlConnection = async () => {
    const config = grapMysqlConfig(process.env as Record<string, string>);
    const MySqlLive = MysqlClient.layer(config);
    return MySqlLive;
};

export class MysqlDB extends Context.Tag('MysqlDB')<
    MysqlDB,
    MysqlKysely.EffectKysely<DatabaseSchema>
>() {}

const MySqlLive = await initMysqlConnection();

export const KyselyLive = Layer.effect(MysqlDB, MysqlKysely.make<DatabaseSchema>()).pipe(
    Layer.provide(MySqlLive)
);
