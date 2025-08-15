import { Duration, Effect, Schedule } from "effect";

// 지수 백오프 스케줄 정의 (5회 재시도, 2초, 4초, 8초, 16초, 32초 대기)
export const exponentialBackoffSchedule = Schedule.exponential(
    // 초기 지연 시간: 2초; 2 배수 정책을 사용 (2초 -> 4초 -> 8초)
    Duration.seconds(2), 2
  ).pipe(
    Schedule.compose(Schedule.recurs(2)), // 최대 3번 재시도 (총 4번 시도)
    Schedule.tapOutput((attempt) => Effect.log(`재시도 시도 ${attempt}번째`))
  );
  