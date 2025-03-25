# 문제 4

아래의 요구조건에 맞는 설계를 진행하고, 이유를 설명해주세요

작은 스타트업에서 BO 서비스에서 통계 서비스를 개발하여 합니다

1. 각 콘텐츠의 유저의 클릭수, 좋아요수를 보여주는 그래프를 그려야 합니다
2. 클릭과 좋아요 수는 BO의 대시보드에서 확인이 가능하며, 새로고침 버튼을 눌러서 갱신 가능합니다
3. 그래프는 일일 단위로 합계로 표시됩니다

---

### 💡 추가질문 1. - 실제로 구현해본 경험이 있다면, 해당 구현 경험을 서술해주세요

### 💡 추가질문 2. - 유저가 클릭을 조작하기위해 빠르게 연타를 한다면, 어떻게 방지할수 있을까요?

---

### ↘️ ANSWER 1. 요구조건에 맞는 설계를 진행하고, 이유를 설명해주세요

프론트에서 클릭이나 좋아요 발생 시 비동기 방식으로 요청을 처리해야 할 것 같습니다. 계속 실시간으로 카운팅하려고 업데이트 쿼리를 남발하면 규모가 조금만 커져도 병목이 생겨 속도저하가 극심할것으로 예상됩니다. 처리할 데이터들은 각 포스트에 대한 클릭(click)와 좋아요(like) 이며 content_event_logs 등의 이벤트 로그 테이블에 먼저 모아둡니다.

이후 자정이나 서비스 이용자가 적은 시간을 파악하여 해당 시간에 배치 스케줄을 등록하여 이벤트 로그 테이블에서 일 단위 통계 테이블(daily_contents_stats)로 데이터를 집계하여 입력합니다. 쿼리는 아래와 비슷한 형태이리라 생각됩니다.

```sql
INSERT INTO daily_content_stats (content_id, stat_date, click_count, like_count)
SELECT
  content_id,
  DATE(created_at) AS stat_date,
  COUNT(CASE WHEN event_type = 'click' THEN 1 END) AS click_count,
  COUNT(CASE WHEN event_type = 'like' THEN 1 END) AS like_count
FROM content_event_logs
WHERE created_at >= NOW() - INTERVAL 1 DAY
GROUP BY content_id, DATE(created_at)
ON DUPLICATE KEY UPDATE
  click_count = VALUES(click_count),
  like_count = VALUES(like_count);
```

조회 시에는 daily_content_stats 테이블에서 바로 읽어오며 실시간으로 입력되고있는 content_event_logs 테이블과는 분리되어있는 테이블이기에 상대적으로 부담이 적을 것이라 생각됩니다.

### ↘️ ANSWER 2. 추가 질문 - 실제로 구현해본 경험이 있다면, 해당 구현 경험을 서술해주세요

#### [ 짧은 시간 내 다중 클릭으로 인한 이슈 ]

이전에 담당하던 WebRTC와 Socket을 사용하는 선생님-학생 간의 화상수업 솔루션에 선생님 측에서 학생에게 화상수업 요청 버튼을 누르면 WebRTC 연결을 수립하기 위해 room을 생성하여 학생측에게 push알림을 보내주는 로직이 있었습니다. 여기서 의도치 않은 더블 클릭이나 모바일 환경의 좋지 않은 인터넷 신호 등의 이유로 굉장히 짧은 시간 안에 화상수업 요청이 여러 번 입력되게 되면 학생 측에서 받는 room 정보가 올바르지 않아 연결되지 않는 문제가 있었습니다.

선생님의 의도치 않은 다중 클릭은 클라이언트단에 throttling을 적용하여 다중 클릭을 방지하였고, 인터넷 상태로 인한 다중 요청이 서버로 들어올 경우 현재 진행중인 수업들의 room 정보를 담은 redis를 두어 이미 동일한 참가자가 있는 데이터가 있을 시 무시되도록 하여 한 개의 room 정보만 학생에게 넘어가도록 처리한 경험이 있습니다.

### ↘️ ANSWER 3. 추가 질문 - 유저가 클릭을 조작하기위해 빠르게 연타를 한다면, 어떻게 방지할수 있을까요?

클라이언트 측에는 debouncing/throttling을 적용하여 1차적으로 서버에 무리한 요청이 가지 않도록 방지합니다.

서버 측에는 redis 등의 속도가 빠른 저장소에 특정 유저의 클릭 이벤트에 타임스탬프를 부여하고 일정 간격 내에 발생한 이벤트는 하나로만 처리하도록 하며 Rate Limiting을 사용자 별로 두어 일정 시간 내에 허용하는 최대 클릭 횟수를 제한하여 과도한 요청은 로그에 기록하거나 하지 않고 무시하도록 처리합니다.

이외에 외부의 툴이나 솔루션을 사용한다면 reCaptcha 정도가 있을 것 같습니다.
