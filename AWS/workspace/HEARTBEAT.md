# HEARTBEAT.md

## Routine Checks
Run these checks every time the heartbeat triggers.

### 1. Time & Briefing Check
- Get current time in KST (Asia/Seoul).
- Read `memory/heartbeat-state.json` to check `lastMorningBriefing`, `lastEveningBriefing`, and `lastInsightBriefing`.

- **Morning Briefing (09:00 ~ 09:59 KST):**
  - If today's briefing not sent yet:
    - Query Notion `Beyond_Tasks` for today's tasks.
    - Post a plain text message: "☀️ [아침 브리핑] 오늘 예정된 일정입니다:\n(List of tasks with times)"
    - Update `lastMorningBriefing` to today's date in `memory/heartbeat-state.json`.

- **Insight Briefing (10:00 ~ 10:59 KST):**
  - If today's insight briefing not sent yet:
    - Query Insight Sub-Databases for pages created since yesterday:
      - AI: 241003c7-f7be-800f-8f07-f95918c3a072
      - Design: 241003c7-f7be-804f-a021-fc24777ca9ad
      - Branding: 247003c7-f7be-803a-83f5-fd9494d24d62
      - Build: 247003c7-f7be-8074-a583-e1638fd3cfed
      - Marketing: 247003c7-f7be-8035-83f4-d39480d66503
    - Summarize new items.
    - Post a plain text message: "🧠 [인사이트 브리핑] 어제부터 등록된 신규 콘텐츠입니다.\n(Summary by category)"
    - Update `lastInsightBriefing` to today's date in `memory/heartbeat-state.json`.

- **Evening Briefing (21:00 ~ 21:59 KST):**
  - If today's briefing not sent yet:
    - Query Notion `Beyond_Tasks` for today's tasks.
    - Separate into 'Completed' and 'Not Started/In Progress'.
    - Post a plain text message: "🌙 [저녁 회고] 오늘 하루 정리입니다.\n✅ 완료: (List)\n⬜ 미완료: (List)"
    - Update `lastEveningBriefing` to today's date in `memory/heartbeat-state.json`.

### 2. Event Reminders
- Query Notion `Beyond_Tasks` for upcoming tasks today.
- For each task, check the `Time` property (if set).
- Calculate time difference from now.
- If difference is near **3 hours**, **1 hour**, **30 mins**, or **10 mins**:
  - Check `memory/heartbeat-state.json` -> `reminders` to ensure not already sent for this specific trigger.
  - If not sent, post: "🔔 [리마인더] '(Task Name)' 시작 (Time left) 전입니다."
  - Update `reminders` list with task ID and trigger type (e.g., "id_3h").

### 3. Idle
- If no briefings or reminders are needed, reply: `HEARTBEAT_OK`
