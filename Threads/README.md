# 🧵 Threads MCP Server

Meta Threads API를 Claude Code / Cowork에서 사용할 수 있는 MCP 서버.

## 제공 도구 (12개)

| 카테고리 | 도구 | 설명 |
|---------|------|------|
| **발행** | `threads_create_post` | 텍스트/이미지/비디오 게시물 작성·발행 |
| | `threads_reply` | 기존 스레드에 대댓글 작성 |
| **조회** | `threads_get_my_posts` | 내 최근 게시물 목록 |
| | `threads_get_post` | 특정 게시물 상세 조회 |
| | `threads_search` | 키워드로 공개 게시물 검색 |
| | `threads_delete_post` | 게시물 삭제 |
| **댓글** | `threads_get_replies` | 게시물의 댓글 목록 조회 |
| | `threads_hide_reply` | 댓글 숨기기/보이기 |
| **분석** | `threads_get_post_insights` | 게시물별 조회수/좋아요/리포스트 등 |
| | `threads_get_account_insights` | 계정 전체 분석 데이터 |
| | `threads_get_publishing_limit` | 발행 쿼터 사용량 확인 |
| **프로필** | `threads_get_profile` | 내 Threads 프로필 정보 |

## 사전 준비

### 1. Meta Developer App 생성
1. [developers.facebook.com](https://developers.facebook.com) 접속
2. 새 앱 생성 → "Threads API" 제품 추가
3. 필요 권한(scopes) 요청:
   - `threads_basic`
   - `threads_content_publish`
   - `threads_manage_insights`
   - `threads_read_replies`
   - `threads_manage_replies`

### 2. OAuth Access Token 발급
1. Meta App에서 OAuth 플로우 완료
2. Short-lived token → Long-lived token으로 교환
3. 환경변수에 설정: `THREADS_ACCESS_TOKEN=your_token_here`

## 설치 및 실행

```bash
# 프로젝트 클론/복사 후
npm install
npm run build

# 실행 테스트
THREADS_ACCESS_TOKEN=your_token node dist/index.js
```

## Claude Code / Cowork 설정

`~/.claude/claude_desktop_config.json` 또는 프로젝트의 `.mcp.json`에 추가:

```json
{
  "mcpServers": {
    "threads": {
      "command": "node",
      "args": ["/path/to/threads-mcp-server/dist/index.js"],
      "env": {
        "THREADS_ACCESS_TOKEN": "your_long_lived_token"
      }
    }
  }
}
```

## API 제한사항

- 게시물: 24시간당 최대 250개
- 댓글: 24시간당 최대 1,000개
- 텍스트: 게시물당 최대 500자
- 이미지: JPEG, PNG
- 비디오: 최대 5분

## 사용 예시

```
"내 최근 게시물 10개 보여줘"
→ threads_get_my_posts({ limit: 10 })

"AI 자동화에 대해 포스팅해줘"
→ threads_create_post({ text: "AI 자동화로 업무 효율을 10배 올리는 방법..." })

"이 게시물의 댓글에 답글 달아줘"
→ threads_get_replies({ thread_id: "123" })
→ threads_reply({ thread_id: "456", text: "감사합니다!" })
```
