# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod

### Notion Databases

- **Beyond_Tasks (일정/할일)**
  - ID: `242003c7-f7be-804a-9d6e-f76d5d0347b4`
  - Props: `Entry name` (Title), `Date` (Date), `Status` (Status), `Deadline` (Formula), `Category` (Select)
  - URL: https://www.notion.so/242003c7f7be804a9d6ef76d5d0347b4

- **Parent Task (대분류/프로젝트)**
  - ID: `242003c7-f7be-806b-a177-e8372eaa64a4`
  - Props: `Entry name` (Title), `Deadline` (Date), `Status` (Status)

- **타임라인 (가계부/Finance)**
  - ID: `28f003c7-f7be-8080-85b4-d73efe3cb896`
  - Props: `Entry` (Title), `Amount` (Number), `Type` (Select: 수입/지출), `\bDate` (Date), `Memo` (Text)

- **Insights (지식/자료 저장소)**
  - Main ID: `241003c7-f7be-800b-b71c-df3acddc5bb8`
  - **Sub-Databases:**
    - **AI:** `241003c7-f7be-800f-8f07-f95918c3a072`
    - **Claude Code:** `2fd003c7-f7be-80cb-90d3-dbecc15c507f`
    - **Scrap (Slack to Notion):** `247003c7-f7be-80c0-a9f4-cddbcd337415`
    - **Design:** `241003c7-f7be-804f-a021-fc24777ca9ad`
    - **Branding:** `247003c7-f7be-803a-83f5-fd9494d24d62`
    - **Build:** `247003c7-f7be-8074-a583-e1638fd3cfed`
    - **Marketing:** `247003c7-f7be-8035-83f4-d39480d66503`

- **Works (노트/웍스)**
  - ID: `241003c7-f7be-8011-8ba4-cecf131df2a0`
  - Props: `Entry name` (Title), `Memo` (Rich Text), `Start` (Date), `Skill` (Multi-select), `Tool` (Multi-select)

```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.
