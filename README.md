# Semtle project

1. 작성한 라우터 파일은 router라는 폴더
2. 작성한 함수 파일은 js라는 폴더
3. 스키마들은 schemas 폴더
4. 작성한 미들웨어는 router/middlewares -> 또는 그냥 올려도 제가 바꾸겠습니당.
## set up
```
npm install
```

## 실행
```
node app.js
```

## HTTP Method

| Verb   | Action   | Path                  | function                                  | active |
| ------ | -------- | --------------------- | ----------------------------------------- | ------ |
| GET    | index    | /question             | 모든 질문 조회                            | ok     |
| GET    | index    | /question/:questionid | 특정 질문 조회                            | ok     |
| GET    | retrieve | /answer/:questionid   | 특정 질문에 달린 모든 응답 조회           |        |
| POST   | create   | /question             | 신규 질문 작성                            | ok     |
| POST   | create   | /answer/:questionid   | 특정  질문에 신규 응답 작성               |
| PUT    | replace  | /question/:questionid | 특정 질문 수정                            | ok     |
| PUT    | replace  | /answer/:answerid     | 특정 응답 수정                            |
| DELETE | delete   | /question/:questionid | 특정 질문 삭제 (관련 응답 또한 모두 삭제) | ok     |
| DELETE | delete   | /answer/:answerid     | 특정 응답 삭제                            |        |