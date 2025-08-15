# effect-example (Bun + TypeScript + Effect-ts)

Effect SQL과 MySQL을 사용한 데이터베이스 연결 예제입니다.

## Setup

```bash
bun install
```

## 실행

```bash
bun run 001-connect-database/connect-database.ts
```

## 주요 기능

- **데이터베이스 연결**: Effect SQL과 MySQL2를 사용한 안전한 연결
- **지수 백오프 재시도**: 최대 5번 재시도 (3초 → 6초 → 12초 → 24초 → 48초)
- **타임스탬프 쿼리**: `SELECT now()` 쿼리 실행 및 결과 출력
- **에러 처리**: Effect의 강력한 에러 처리 기능 활용

## 환경 변수

MySQL 연결을 위한 환경 변수를 설정하세요:

```bash
export DB_HOST=localhost
export DB_PORT=3306
export DB_USER=root
export DB_PASSWORD=your_password
export DB_NAME=your_database
```
