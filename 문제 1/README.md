# 문제 1

NestJS 기반의 백엔드 서비스에서 **사용자 등록 API**를 구현하세요.

이 API는 새로운 사용자를 등록하고, 비밀번호를 안전하게 저장해야 합니다.

## 요구사항

**1. API 엔드포인트 -** POST /users

요청 바디 예시

```jsx
{
"name": "John Doe",
"email": "[john@example.com](mailto:john@example.com)",
"password": "securePassword123"
}
```

성공시 응답

```jsx
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2025-01-21T07:33:37.696Z"
}
```

실패시 응답

```jsx
{
  "statusCode": 409,
  "message": "Email already exists"
}
```

```jsx
{
  "statusCode": 400,
  "message": "Password must be at least 8 characters long"
}
```

**유효성 검사**

- name 필드는 최소 2자 이상, 최대 50자 이내여야 합니다.
- email 필드는 올바른 이메일 형식이어야 합니다.
- password는 최소 8자 이상이어야 하며, 숫자와 문자가 포함되어야 합니다.

**이메일 중복 검사**

- 이미 존재하는 이메일로 회원가입을 시도하면 409 Conflict 응답을 반환해야 합니다.

**비밀번호 해싱**

- 비밀번호를 암호화 하여 안전하게 저장해야 합니다.

**에러 핸들링**

- 입력값이 올바르지 않을 경우 400 Bad Request를 반환해야 합니다.

**데이터베이스 연동 (TypeORM 사용)**

- MySQL을 사용하며, **TypeORM 엔터티**를 정의하여 데이터를 저장해야 합니다.

---

### 💡 추가질문 - 비밀번호 해싱처리는 왜 하는걸까요?

---

### ↘️ ANSWER

- 서버 해킹 등의 이유로 데이터베이스 자체가 노출되거나 사용자 부주의로 인한 악성코드 감염 등으로 인해 HTTP통신 중 비밀번호에 해당하는 해시값이 노출되어도 해시는 단방향 암호화이므로 해시값 자체만으로는 원본값을 알 수 없어 보안에 이점이 있습니다.
- 추가적으로 SALT값을 첨가하면 동일한 비밀번호라도 해시값이 달라져 미리 계산된 해시값을 이용한 공격인 레인보우 테이블 공격을 방어할 수 있는 이점이 있습니다.
