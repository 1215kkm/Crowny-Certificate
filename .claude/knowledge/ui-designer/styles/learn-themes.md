# 「따라하며 코딩 배우기」(/learn) 색 테마 — 추가 5종

> 작성: 강디 (designer). 출처 = CEO 제공 레퍼런스 이미지 5장(`.pt-images/`).
> 기존 확정 5종(크라운 리파인·말랑 하늘·미드나잇 코더·민트 자몽·또렷 고대비)과 계열이 겹치지 않게 잡았고,
> 커머스 랜딩의 고채도 원색을 그대로 쓰지 않고 **장시간 코드를 읽는 화면** 기준으로 채도·명도를 내렸다.
> 모든 값은 실제 WCAG 대비 계산으로 검증함 (foreground vs surface / vs workface 모두 4.5:1 이상).

---

## 테마 ID: terracotta-stone
- 이름: 테라코타 스톤
- 출처: 가구/인테리어 커머스 — 차콜 그레이 지배면 + 코랄 소파 쿠션 강조
- 컨셉: 성인 직장인 재교육 · 사무실 조명에서도 눈이 편한 차분한 웜 뉴트럴
- 다크여부: no
- primary: #B84E33
- primaryDark: #933C26
- primaryLight: #DD7B5C
- primary50: #FBF1ED
- primary100: #F6E1D9
- primary200: #EBC3B4
- primary800: #6E2C19
- secondary: #4A5A6A
- background: #F4F2EF
- surface: #FFFFFF
- workface: #E7EAEE
- workfaceHead: #D5DAE1
- workfaceBorder: #C2C9D2
- foreground: #22282E
- muted: #EFEDEA
- mutedForeground: #5B6672
- border: #DDD9D4
- success: #2F7D57
- danger: #B93B2E
- accent: #E8896A
- radiusBtn: 12
- radiusCard: 18
- 한줄평: 배경은 웜 베이지, 작업면은 쿨 그레이 — 온도차로 1칸과 2·3칸이 색상환 반대편에서 갈라져 명도만으로 구분하는 테마보다 경계가 또렷하다. 하루 종일 켜두는 기본값 후보.
- 리스크: accent(#E8896A)는 대비 2.56이라 글자색으로 쓰면 안 됨 — 칩 배경·테두리·하이라이트 면으로만. 글자엔 primary 사용.

## 테마 ID: vermilion-ink
- 이름: 버밀리언 잉크
- 출처: WATCH PRO 제품 페이지 — 잉크 블랙 초대형 타이포 + 버밀리언 레드 알약 버튼
- 컨셉: 중고등~성인 초심자 · "지금 여기를 보라"가 한눈에 꽂히는 고대비 대담 톤
- 다크여부: no
- primary: #D0360F
- primaryDark: #A32A0B
- primaryLight: #F35C30
- primary50: #FDF0EC
- primary100: #FBDDD4
- primary200: #F5BBA9
- primary800: #7A1F08
- secondary: #17181C
- background: #F5F4F1
- surface: #FFFFFF
- workface: #E9E7E2
- workfaceHead: #D6D3CC
- workfaceBorder: #C4C0B8
- foreground: #17181C
- muted: #EFEDE9
- mutedForeground: #5E5C57
- border: #DEDBD5
- success: #2E7D4F
- danger: #9B1C1C
- accent: #FF8A3D
- radiusBtn: 24
- radiusCard: 20
- 한줄평: 본문 대비 17.7:1로 이 5종 중 가장 또렷 — 저시력·노안 사용자, 그리고 프로젝터로 띄워 단체 수업할 때. 알약 버튼(24px)이 "다음" 위치를 멀리서도 잡아준다.
- 리스크: primary(주황빨강)와 danger(진홍)가 같은 난색이라 에러 배지가 CTA로 오해될 수 있음 — danger는 반드시 아이콘(x-circle) 동반, 배경은 primary50 대신 흰 면 위 테두리로 낼 것.

## 테마 ID: forest-cream
- 이름: 포레스트 크림
- 출처: 스타벅스풍 페이지 — 딥 포레스트 그린 지배면 + 크림 종이 + 원두 브라운
- 컨셉: 카페에서 노트북 펴고 혼자 배우는 성인 · 종이 질감의 저자극 롱세션 톤
- 다크여부: no
- primary: #1E6A4C
- primaryDark: #14513A
- primaryLight: #2F8B65
- primary50: #EFF5F1
- primary100: #DBEAE1
- primary200: #B4D2C3
- primary800: #0E3D2B
- secondary: #9A6B3F
- background: #F3F1E8
- surface: #FFFFFF
- workface: #E7EBE0
- workfaceHead: #D5DCCB
- workfaceBorder: #C3CCB7
- foreground: #1E2A24
- muted: #EDEDE4
- mutedForeground: #56635B
- border: #DCDACE
- success: #2B8055
- danger: #C0392B
- accent: #C89B4A
- radiusBtn: 20
- radiusCard: 16
- 한줄평: 크림 배경이 순백보다 휘도가 낮아 형광등 아래 장시간 코드 읽을 때 눈부심이 가장 적다. 민트 자몽(#17A98E)보다 채도·명도를 크게 내려 청록이 아닌 짙은 숲색이라 계열이 겹치지 않음.
- 리스크: primary(숲 그린)와 success(#2B8055)가 같은 그린 계열 — "정답입니다" 피드백이 일반 강조와 섞일 수 있으므로 success는 반드시 check 아이콘 + primary100 배경 조합으로 분리해서 낼 것.

## 테마 ID: charcoal-sushi
- 이름: 먹빛 살몬
- 출처: 스시 레스토랑 페이지 — 먹빛 차콜 배경 + 연어 오렌지 강조 + 흰 카드
- 컨셉: 야간 학습·집중 다크 · 미드나잇 코더가 차가운 보라라면 이쪽은 따뜻한 먹빛
- 다크여부: yes
- primary: #FF7A45
- primaryDark: #E85F28
- primaryLight: #FF9B70
- primary50: #2A1A12
- primary100: #3A2318
- primary200: #4E2F1E
- primary800: #FFC4A3
- secondary: #7FB069
- background: #101216
- surface: #1B1E24
- workface: #282D36
- workfaceHead: #333A45
- workfaceBorder: #3E4550
- foreground: #ECE7E1
- muted: #191C21
- mutedForeground: #A2A9B3
- border: #2A2F37
- success: #57C08A
- danger: #FF6B5E
- accent: #FFB07C
- radiusBtn: 10
- radiusCard: 14
- 한줄평: 다크에서는 명암 방향을 뒤집어 **작업면(2·3칸)을 1칸보다 밝게** 올렸다 — 코드가 얹힌 면이 앞으로 떠올라 "지금 만지는 곳"이 상시 보인다(CEO UX 원칙 1). 웜 그레이 계열이라 순수 회색 다크보다 장시간 눈 피로가 낮음.
- 리스크: 다크 테마라 primary50/100/200은 **밝은 틴트가 아니라 어두운 틴트**, primary800은 반대로 가장 밝은 톤으로 역전되어 있음 — 라이트 테마와 같은 규칙으로 쓰면 색이 사라짐. 또한 흰 글자를 primary(#FF7A45) 위에 올리면 2.59:1이라 반드시 잉크(#141619) 글자를 얹을 것.

## 테마 ID: amber-sand
- 이름: 앰버 샌드
- 출처: 푸드/레스토랑 옐로우 페이지 — 노른자 옐로우 카드 + 흰 배경 + 채소 그린
- 컨셉: 초등 고학년~중학생 · 밝고 기분 좋되 파스텔(말랑 하늘)보다 한 톤 단단한 데이라이트
- 다크여부: no
- primary: #A26706
- primaryDark: #7E4F04
- primaryLight: #E0A020
- primary50: #FDF6E7
- primary100: #FAEBCB
- primary200: #F2D794
- primary800: #603B03
- secondary: #3E7A55
- background: #FBF7EE
- surface: #FFFFFF
- workface: #F0E7D4
- workfaceHead: #E2D3B4
- workfaceBorder: #D2C09C
- foreground: #2A2417
- muted: #F4EEE1
- mutedForeground: #6A5D45
- border: #E3DACA
- success: #2E7D4F
- danger: #C0392B
- accent: #F5C518
- radiusBtn: 14
- radiusCard: 20
- 한줄평: 밝은 노랑은 accent(#F5C518)에만 남기고 글자·버튼용 primary는 앰버로 눌러 흰 글자 4.69:1을 확보 — "노란 화면인데 글자가 안 읽힌다"는 옐로우 테마의 고질병을 처음부터 잘라냄. 작업면은 모래빛이라 흰 1칸과 확실히 갈라진다.
- 리스크: accent(#F5C518)는 흰 배경 대비 1.63이라 글자·아이콘 단독 사용 금지 — 진행 바·형광펜 하이라이트 등 **면**으로만 쓰고 그 위 글자는 foreground(#2A2417, 9.45:1)로. 또렷 고대비의 연노랑 작업면(#FFF4D6)과 인상이 가까우니 셀렉트 목록에서는 두 항목을 붙여 놓지 말 것.

---

## 검증 로그 (실측 대비, foreground 기준)

| 테마 | fg/surface | fg/workface | fg/workfaceHead | mutedFg/workface | 흰글자/primary |
|---|---|---|---|---|---|
| terracotta-stone | 14.88 | 12.33 | 10.59 | 4.85 | 5.03 |
| vermilion-ink | 17.74 | 14.35 | 11.87 | 5.40 | 4.98 |
| forest-cream | 14.87 | 12.29 | 10.57 | 5.21 | 6.52 |
| charcoal-sushi | 13.58 | 11.25 | 9.33 | 5.83 | 잉크 글자 7.01 |
| amber-sand | 15.41 | 12.53 | 10.42 | 5.23 | 4.69 |

surface ↔ workface 면 대비: 1.21 / 1.24 / 1.21 / 1.21 / 1.23 — 5종 모두 동일 수준으로 맞춰
어느 테마를 골라도 "1칸과 2·3칸이 갈라지는 정도"가 똑같이 느껴지게 했다.
