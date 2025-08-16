# effect-example (Bun + TypeScript + Effect-ts)

Effect SQL과 MySQL을 사용한 데이터베이스 연결 및 쿼리 실행 예제입니다.

## Setup

```bash
bun install
```

## 실행

### 001-connect-database: 기본 데이터베이스 연결
```bash
bun run 001-connect-database/connect-database.ts
```

### 002-query-database: 단순 쿼리 실행
```bash
bun run 002-query-database/query-data.ts
```

### 003-kysely-mysql-database: Kysely ORM 사용
```bash
bun run 003-kysely-mysql-database/select-query.ts
bun run 003-kysely-mysql-database/user-service.ts
```

## 주요 기능

### 001-connect-database
- **데이터베이스 연결**: Effect SQL과 MySQL2를 사용한 안전한 연결
- **지수 백오프 재시도**: 최대 5번 재시도 (3초 → 6초 → 12초 → 24초 → 48초)
- **타임스탬프 쿼리**: `SELECT now()` 쿼리 실행 및 결과 출력
- **에러 처리**: Effect의 강력한 에러 처리 기능 활용

### 002-query-database
- **모듈화된 구조**: 연결, 쿼리, 재시도 정책을 별도 파일로 분리
- **JOIN 쿼리**: customer와 user 테이블 조인 쿼리 실행
- **서비스 패턴**: 데이터베이스 서비스 객체 패턴 구현
- **함수형 프로그래밍**: pipe를 사용한 함수형 컴포지션

### 003-kysely-mysql-database
- **Kysely ORM**: 타입 안전한 SQL 쿼리 빌더 사용
- **스키마 정의**: TypeScript 인터페이스로 데이터베이스 스키마 정의
- **Context 패턴**: Effect의 Context를 활용한 의존성 주입
- **서비스 레이어**: 비즈니스 로직과 데이터 접근 계층 분리
- **타입 추론**: 컴파일 타임에 SQL 쿼리 타입 검증

## 환경 변수

MySQL 연결을 위한 환경 변수를 설정하세요:

```bash
export DB_HOST=localhost
export DB_PORT=3306
export DB_USER=root
export DB_PASSWORD=your_password
export DB_NAME=your_database
```

## 프로젝트 구조

```
effect-example/
├── 001-connect-database/
│   └── connect-database.ts    # 기본 연결 및 쿼리 예제
├── 002-query-database/
│   ├── connection.ts          # 데이터베이스 연결 모듈
│   ├── query-data.ts          # 고급 쿼리 실행 예제
│   └── retry-policy.ts        # 재시도 정책 정의
├── 003-kysely-mysql-database/
│   ├── connect-kysely.ts      # Kysely 연결 설정
│   ├── kysely-schema.ts       # 데이터베이스 스키마 정의
│   ├── find-users.ts          # 사용자 조회 함수
│   ├── select-query.ts        # Kysely 쿼리 실행 예제
│   └── user-service.ts        # 사용자 서비스 레이어
└── shared/
    └── common-util.ts         # 공통 유틸리티 함수
```
