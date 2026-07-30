#!/usr/bin/env bash
# pull-team.sh — 어느 레포에서나 "강팀 불러와" 한 문장으로 실행되는 본체.
# GitHub의 Ai_Team 레포에서 최신 강팀을 받아 현재 레포 + 전역(~/.claude/)에 설치.
#
# 사용:
#   bash pull-team.sh                           # 현재 디렉토리에 강팀 박기
#   bash pull-team.sh --no-local                # 전역만 (이 레포엔 .claude 안 박음)
#   bash pull-team.sh --repo OWNER/NAME         # 다른 강팀 포크에서 불러올 때
#   bash pull-team.sh --branch BRANCH           # 특정 브랜치
#
# 강팀 본체가 *비공개* 레포여도 받아올 수 있다 — 공개로 둘 필요 없다.
#   · 사람이 쓰는 PC:  gh auth login  한 번 (그 뒤로는 계속 됨)
#   · 자동화·웹 환경:  AI_TEAM_TOKEN=<토큰> bash pull-team.sh
# 비공개일 때 'curl … | bash' 한 줄 방식만 안 된다 (raw 주소가 404).
# 그때는 로그인 후 이렇게:
#   bash <(gh api repos/1215kkm/Ai_Team/contents/scripts/pull-team.sh -q .content | base64 -d)
#
# 원격 한 줄 실행 (강팀이 아직 이 PC/컨테이너에 없을 때):
#   curl -fsSL https://raw.githubusercontent.com/1215kkm/Ai_Team/main/scripts/pull-team.sh | bash

set -euo pipefail

REPO="1215kkm/Ai_Team"
BRANCH="main"
LOCAL=1

while [[ $# -gt 0 ]]; do
  case "$1" in
    --no-local) LOCAL=0; shift ;;
    --repo) REPO="$2"; shift 2 ;;
    --branch) BRANCH="$2"; shift 2 ;;
    -h|--help) sed -n '2,/^set -e/p' "$0" | sed 's/^# \{0,1\}//;/^set -e/d'; exit 0 ;;
    *) echo "알 수 없는 인자: $1" >&2; exit 1 ;;
  esac
done

CWD="$(pwd)"
TMP="$(mktemp -d -t kangteam-XXXXXX)"
trap 'rm -rf "$TMP"' EXIT

echo "강팀 불러오는 중 — $REPO@$BRANCH"

# 강팀 본체는 *비공개* 레포다. 그래서 인증 없이는 clone 이 안 된다.
# 예전에는 clone 결과를 확인하지 않고 곧바로 "✓ 완료" 를 찍어서,
# 아무것도 못 받아왔는데 성공한 것처럼 보였다 (그 상태로 몇 달을 지나기도 했다).
# 이제는 gh 인증을 먼저 쓰고, 실패하면 이유를 말하고 멈춘다.
CLONE_LOG="$TMP/clone.log"
CLONED=0

# 받아오는 방법을 순서대로 시도한다. 비공개 레포라도 1·2번이면 받아진다.
#   1. 토큰 (AI_TEAM_TOKEN / GH_TOKEN) — 깃허브 액션·자동화·웹 환경용
#   2. gh 로그인 — 사람이 쓰는 PC 용 (gh auth login 한 번이면 끝)
#   3. 인증 없는 clone — 공개 레포일 때만 됨
#
# ⚠️ 토큰을 URL 이나 명령 인자에 넣지 않는다 (ps 목록·오류 메시지로 새어나간다).
#    GIT_ASKPASS 로 git 이 물어볼 때만 건네준다.
TOKEN="${AI_TEAM_TOKEN:-${GH_TOKEN:-}}"
if [[ -n "$TOKEN" ]]; then
  ASKPASS="$TMP/askpass.sh"
  printf '#!/bin/sh\ncase "$1" in *Username*) echo x-access-token ;; *) cat "%s" ;; esac\n' \
    "$TMP/token" > "$ASKPASS"
  printf '%s' "$TOKEN" > "$TMP/token"
  chmod 700 "$ASKPASS" "$TMP/token"
  if GIT_ASKPASS="$ASKPASS" GIT_TERMINAL_PROMPT=0 \
     git clone --depth=1 --branch "$BRANCH" \
       "https://github.com/$REPO.git" "$TMP/ai_team" >>"$CLONE_LOG" 2>&1; then
    CLONED=1
    echo "  (토큰으로 받았습니다)"
  fi
  rm -f "$TMP/token" "$ASKPASS"
fi

if [[ $CLONED -eq 0 ]] && command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  if gh repo clone "$REPO" "$TMP/ai_team" -- --depth=1 --branch "$BRANCH" >>"$CLONE_LOG" 2>&1; then
    CLONED=1
    echo "  (깃허브 로그인으로 받았습니다)"
  fi
fi

if [[ $CLONED -eq 0 ]]; then
  if git clone --depth=1 --branch "$BRANCH" \
       "https://github.com/$REPO.git" "$TMP/ai_team" >>"$CLONE_LOG" 2>&1; then
    CLONED=1
  fi
fi

if [[ $CLONED -eq 0 || ! -f "$TMP/ai_team/scripts/install-global.sh" ]]; then
  echo "❌ 강팀을 받아오지 못했어요 — $REPO@$BRANCH" >&2
  echo "" >&2
  echo "   강팀 본체가 비공개 레포라면 로그인이나 토큰 없이는 받아올 수 없어요." >&2
  echo "   (비공개일 때 'curl … | bash' 한 줄 방식은 404 가 납니다.)" >&2
  echo "" >&2
  echo "   해결 방법 두 가지 — 편한 쪽으로:" >&2
  echo "" >&2
  echo "   ① 사람이 쓰는 PC — 깃허브에 한 번 로그인하면 그 뒤로는 계속 됩니다:" >&2
  echo "        gh auth login        (gh 가 없으면 https://cli.github.com)" >&2
  echo "" >&2
  echo "   ② 자동화·깃허브 액션·웹 환경 — 토큰을 환경변수로 주세요:" >&2
  echo "        AI_TEAM_TOKEN=<개인 액세스 토큰> bash pull-team.sh" >&2
  echo "        토큰 만들기: 깃허브 Settings → Developer settings →" >&2
  echo "        Personal access tokens → Fine-grained → 이 레포에 Contents: Read 권한" >&2
  echo "" >&2
  echo "   그 다음 이 명령을 다시 실행하세요." >&2
  echo "" >&2
  echo "   git 이 남긴 실제 오류:" >&2
  sed 's/^/     /' "$CLONE_LOG" >&2
  exit 1
fi

echo "[1/2] 전역 설치 (~/.claude/)"
if ! bash "$TMP/ai_team/scripts/install-global.sh" --force >/dev/null; then
  echo "❌ 전역 설치가 실패했어요. 위 오류를 확인해 주세요." >&2
  exit 1
fi
echo "  ✓ agents · commands · knowledge · templates · scripts · workflows"

if [[ $LOCAL -eq 1 ]]; then
  echo "[2/2] 현재 레포에 .claude/ 박는 중 — $CWD"
  cd "$CWD"
  mkdir -p .claude templates scripts
  for sub in agents commands knowledge hooks; do
    if [[ -d "$TMP/ai_team/.claude/$sub" ]]; then
      mkdir -p ".claude/$sub"
      cp -r "$TMP/ai_team/.claude/$sub/." ".claude/$sub/"
    fi
  done
  # settings.json 은 *덮어쓰지 않음* — 사용자 커스터마이즈 보호. 없을 때만 복사.
  if [[ ! -f .claude/settings.json && -f "$TMP/ai_team/.claude/settings.json" ]]; then
    cp "$TMP/ai_team/.claude/settings.json" .claude/settings.json
  fi
  cp -r "$TMP/ai_team/templates/." templates/ 2>/dev/null || true
  cp "$TMP/ai_team/scripts/"*.sh scripts/ 2>/dev/null || true
  cp "$TMP/ai_team/scripts/"*.ps1 scripts/ 2>/dev/null || true
  # 파이썬 도우미도 같이 — voice.sh / voice.ps1 이 voice-record.py 와
  # voice-upgrade.py 를 호출한다. 예전에는 .sh 와 .ps1 만 복사해서
  # 다른 레포에서 목소리 녹음이 "파일 없음" 으로 죽었다.
  cp "$TMP/ai_team/scripts/"*.py scripts/ 2>/dev/null || true
  chmod +x scripts/*.sh .claude/hooks/*.sh 2>/dev/null || true

  # 강팀 본체 버전 SHA 기록 — SessionStart 훅이 이걸로 업데이트 알림
  KANG_SHA="$(cd "$TMP/ai_team" && git rev-parse HEAD 2>/dev/null || echo "")"
  if [[ -n "$KANG_SHA" ]]; then
    echo "$KANG_SHA" > .claude/.kang-version
  fi

  if [[ ! -f CLAUDE.md ]]; then
    cat > CLAUDE.md <<'EOF'
# 강팀 작업 룰

이 레포는 강팀 (5명짜리 AI 팀)이 운영합니다.

## 발언 규칙 (절대)
강팀 닉네임(강팀장·강디·강개발·강체크·아뱅)으로
발언해야 할 때는 메인 클로드가 시늉하지 말고 *반드시* `Agent` 툴로 해당
서브에이전트(`pm`, `designer`, `developer`, `qa`, `marketer`)를 호출한다.

## 빠른 시작
```bash
/회의시작                 # 강팀장이 안건 자동 생성 → 회의 → 텔레그램 발송
/회의시작 "결제 전환율"   # 주제 지정
/진행                     # 다음 단계 자동 진행
```

## 디자인 베이스
활성 디자인 스타일 카탈로그 — `.claude/knowledge/ui-designer/styles/`
기본 #1 Crowny Class (보라→분홍 그라데이션, Pretendard, radius 10/16, Lucide)
EOF
    echo "  ✓ CLAUDE.md 새로 생성 (기존 룰이 있으면 안 덮어씀)"
  else
    echo "  - CLAUDE.md 이미 있음 — 건드리지 않음"
  fi
else
  echo "[2/2] --no-local 플래그 — 현재 레포는 건드리지 않음"
fi

echo
echo "✅ 강팀 도착. 이제 가능:"
echo "  /회의시작              # 회의 시작"
echo "  /진행                  # 다음 단계 진행"
[[ ! -f "$HOME/.claude/team-config/telegram.env" ]] && \
  echo "  bash ~/.claude/bin/setup-telegram.sh   # 텔레그램 1회 셋업 (선택)"
