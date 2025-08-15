# effect-example (Bun + TypeScript + Effect v3)

Effect SQL과 MySQL을 사용한 데이터베이스 연결 예제 프로젝트입니다.

## Setup

```bash
bun install
```

## Scripts

- `bun run dev`: start with hot reloading
- `bun run start`: run the entry once
- `bun test`: run tests
- `bun run typecheck`: run TypeScript type checking

## 데이터베이스 연결 프로그램

### 환경 변수 설정

MySQL 데이터베이스 연결을 위해 다음 환경 변수를 설정하세요:

```bash
export DB_HOST=localhost
export DB_PORT=3306
export DB_USER=root
export DB_PASSWORD=your_password
export DB_NAME=your_database
```

또는 `.env` 파일을 생성하여 설정할 수 있습니다:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database
```

### 실행 방법

```bash
# 데이터베이스 연결 프로그램 실행
bun run src/run-database.ts

# 또는 직접 실행
bun run src/001-connect-database.ts
```

### 주요 기능

- **데이터베이스 연결**: Effect SQL과 MySQL2를 사용한 안전한 데이터베이스 연결
- **지수 백오프 재시도**: 네트워크 문제나 서버 준비되지 않은 경우 3회 재시도 (10초, 20초, 40초 대기)
- **연결 상태 모니터링**: 실시간 연결 상태 확인 및 자동 복구
- **타임스탬프 확인**: 데이터베이스 서버 시간 확인
- **에러 처리**: Effect의 강력한 에러 처리 기능 활용
- **레이어 시스템**: Effect의 레이어 시스템을 통한 의존성 관리

### 지수 백오프 설정

프로그램은 네트워크 불안정이나 데이터베이스 서버 준비되지 않은 상황을 대비하여 지수 백오프 전략을 사용합니다:

- **재시도 횟수**: 최대 3회 재시도 (총 4번 시도)
- **대기 시간**: 10초 → 20초 → 40초 (2배씩 증가)
- **적용 범위**: 
  - 초기 데이터베이스 연결
  - 연결 상태 테스트
  - 연결 모니터링

### 파일 구조

- `src/001-connect-database.ts`: 메인 데이터베이스 연결 프로그램
- `src/run-database.ts`: 실행 스크립트

## Run

```bash
bun run index.ts
```

The entry uses `effect@^3` to run a small program. Bun v1.2.20.
