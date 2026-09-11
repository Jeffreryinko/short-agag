import type { Post, Source } from "./types";

// 임시 목업 데이터. 실제 서비스에서는 여기가 API(유튜브/DB 등) 호출로 바뀐다.
// 지금은 프로토타입(reference/short-agag.html)의 데이터를 그대로 옮겨온 상태.

export const SRC: Record<string, Source> = {
  clien: { n: "클리앙", c: "#4A7BC8" },
  oyu: { n: "오유", c: "#5BA87A" },
  slr: { n: "SLR", c: "#7C8CC4" },
  ppomppu: { n: "뽐뿌", c: "#5BA0A8" },
  cook82: { n: "82쿡", c: "#D48AAE" },
  mlbpark: { n: "엠팍", c: "#C1893F" },
  bobae: { n: "보배드림", c: "#8C74C4" },
  inven: { n: "인벤", c: "#4FA3A8" },
  ruli: { n: "루리웹", c: "#E0913A" },
  utda: { n: "웃대", c: "#B08C5A" },
  ddanzi: { n: "딴지일보", c: "#C4694F" },
  fmk: { n: "펨코", c: "#D45B6A" },
};

export const SRC_ORDER = [
  "clien",
  "oyu",
  "slr",
  "ppomppu",
  "cook82",
  "mlbpark",
  "bobae",
  "inven",
  "ruli",
  "utda",
  "ddanzi",
  "fmk",
];

export const BG = [
  "#2E3440",
  "#3A2E38",
  "#2B3A34",
  "#3B352A",
  "#2F3244",
  "#3A2F2B",
  "#283A3C",
  "#37303F",
];

export const CATS = ["추천", "실시간", "유머", "이슈", "움짤"];

export const POSTS: Post[] = [
  { t: "clip", src: "ruli", time: "7분 전", title: "택배 상자 뜯다가 현타 온 고양이", emoji: "🐱", likes: 3820, cmt: 214, also: 2, cat: ["추천", "유머", "움짤"] },
  {
    t: "story", src: "clien", time: "22분 전", title: "신입이 전체 메일 잘못 보내서 오늘 회사 뒤집어짐",
    sum: "신입사원이 팀 내부 공유용 문서를 전사 메일로 발송. 문서 안에 부서별 평가 초안이 그대로 들어 있었고, 30분 만에 각 팀에서 문의가 쏟아짐. 팀장이 긴급 회의를 소집했고 작성자는 중간에서 수습 중이라는 내용. 댓글에서는 메일 발신 취소 정책과 권한 설정을 두고 의견이 갈림.",
    likes: 1247, cmt: 83, also: 4, cat: ["추천", "실시간", "이슈"],
  },
  {
    t: "link", src: "ppomppu", time: "1시간 전", title: "무선 이어폰 89,000원 / 무료배송",
    sum: "역대 최저가 갱신. 카드 즉시할인과 쿠폰 중복 적용 가능.", emoji: "🎧", likes: 642, cmt: 57, also: 0, cat: ["추천", "실시간"],
  },
  { t: "clip", src: "fmk", time: "14분 전", title: "헬스장에서 거울 보고 30분째 서 있는 사람", emoji: "💪", likes: 2910, cmt: 176, also: 3, cat: ["추천", "유머", "움짤"] },
  {
    t: "story", src: "bobae", time: "38분 전", title: "주차장에서 문콕하고 그냥 간 차, CCTV로 찾았습니다",
    sum: "지하주차장에서 조수석 문에 흠집 발견. 관리사무소 협조로 CCTV 확인해 차량 특정. 상대 차주는 처음엔 부인했으나 영상 확인 후 수리비 부담에 합의. 작성자는 블랙박스 주차 모드 설정을 권하며 후기 공유.",
    likes: 1893, cmt: 312, also: 5, cat: ["추천", "이슈"],
  },
  { t: "clip", src: "oyu", time: "5분 전", title: "강아지가 처음 눈 봤을 때 반응", emoji: "🐶", likes: 5120, cmt: 401, also: 6, cat: ["추천", "유머", "움짤"] },
  {
    t: "link", src: "ppomppu", time: "2시간 전", title: "삼겹살 1kg 12,900원 (새벽배송)",
    sum: "앱 전용가. 첫 구매 쿠폰 적용 시 추가 할인.", emoji: "🥩", likes: 388, cmt: 29, also: 0, cat: ["추천", "실시간"],
  },
  {
    t: "story", src: "mlbpark", time: "51분 전", title: "10년 다닌 회사 그만두고 나온 지 3개월째 후기",
    sum: "퇴사 후 3개월간의 생활 변화를 정리한 글. 초반 한 달은 해방감이 컸으나 이후 생활 리듬이 무너졌다고 언급. 고정 지출 점검과 하루 일정 고정이 도움이 됐다는 내용. 댓글에서는 퇴사 전 준비 기간을 두라는 조언이 다수.",
    likes: 2204, cmt: 288, also: 3, cat: ["추천", "이슈"],
  },
  { t: "clip", src: "inven", time: "19분 전", title: "보스 잡기 직전에 전원 나간 사람", emoji: "🎮", likes: 1740, cmt: 98, also: 1, cat: ["추천", "유머", "움짤"] },
  {
    t: "story", src: "clien", time: "1시간 전", title: "인터넷 요금 3년째 그대로 내고 있던 걸 오늘 알았습니다",
    sum: "약정 만료 후 자동 연장되며 할인 없이 정가로 청구되고 있던 사례. 고객센터 문의로 재약정 진행해 월 요금 인하. 댓글에서는 약정 만료일 캘린더 등록과 타사 전환 비교를 권하는 의견이 이어짐.",
    likes: 3410, cmt: 194, also: 7, cat: ["추천", "실시간", "이슈"],
  },
  { t: "clip", src: "ruli", time: "31분 전", title: "편의점 알바가 만든 역대급 삼각김밥 진열", emoji: "🍙", likes: 1120, cmt: 64, also: 2, cat: ["추천", "유머", "움짤"] },
  {
    t: "link", src: "ppomppu", time: "3시간 전", title: "로봇청소기 219,000원 (카드할인가)",
    sum: "물걸레 겸용 모델. 리퍼 아님, 정품 새제품.", emoji: "🤖", likes: 511, cmt: 73, also: 0, cat: ["추천", "실시간"],
  },
  { t: "clip", src: "fmk", time: "44분 전", title: "비 오는 날 우산 안 쓰고 뛰어가는 사람들 모음", emoji: "☔", likes: 2050, cmt: 112, also: 4, cat: ["추천", "유머", "움짤"] },
  {
    t: "story", src: "cook82", time: "2시간 전", title: "자취 5년차가 정리한, 진짜 안 쓰게 되는 주방용품",
    sum: "구매 후 사용 빈도가 낮았던 품목을 정리한 글. 다용도 기기보다 단일 기능 도구의 사용률이 높았다는 결론. 수납 공간 대비 효용을 기준으로 판단하라는 조언. 댓글에서는 품목별로 의견이 엇갈림.",
    likes: 1650, cmt: 241, also: 3, cat: ["추천", "이슈"],
  },
  { t: "clip", src: "inven", time: "12분 전", title: "랜덤박스 200번 깐 결과", emoji: "🎁", likes: 890, cmt: 156, also: 1, cat: ["추천", "유머", "움짤"] },
  {
    t: "story", src: "bobae", time: "4시간 전", title: "중고차 살 때 이것만 확인해도 사고차 90% 걸러집니다",
    sum: "차량 이력 조회와 실차 확인 순서를 정리한 글. 도장 두께, 볼트 자국, 실내 냄새 등 현장 체크 항목 중심. 성능점검기록부만 믿지 말라는 취지. 댓글에서 정비소 동행 점검을 추천하는 의견이 다수.",
    likes: 4120, cmt: 367, also: 8, cat: ["추천", "이슈"],
  },
  { t: "clip", src: "mlbpark", time: "26분 전", title: "경기 끝나고 관중석에 혼자 남은 사람", emoji: "⚾", likes: 1380, cmt: 87, also: 2, cat: ["추천", "유머", "움짤"] },
  {
    t: "link", src: "ppomppu", time: "5시간 전", title: "캡슐커피 100개 29,900원",
    sum: "호환 캡슐. 유통기한 넉넉한 신상품.", emoji: "☕", likes: 297, cmt: 41, also: 0, cat: ["추천", "실시간"],
  },
  { t: "clip", src: "slr", time: "9분 전", title: "아기가 레몬 처음 먹었을 때", emoji: "🍋", likes: 6340, cmt: 288, also: 5, cat: ["추천", "유머", "움짤"] },
  {
    t: "story", src: "clien", time: "6시간 전", title: "부모님 스마트폰 원격으로 도와드리는 법 정리",
    sum: "화면 공유 앱 설정과 원격 지원 기능 사용법을 단계별로 정리. 통화하면서 화면을 같이 보는 방식이 설명보다 빠르다는 요지. 보안 관련 주의사항도 함께 안내. 댓글에 기기별 설정 경로가 보완됨.",
    likes: 2870, cmt: 132, also: 6, cat: ["추천", "이슈"],
  },
  { t: "clip", src: "utda", time: "16분 전", title: "엘리베이터에서 거울 보다 딱 걸린 사람", emoji: "🪞", likes: 1560, cmt: 91, also: 2, cat: ["추천", "유머", "움짤"] },
  {
    t: "story", src: "ddanzi", time: "3시간 전", title: "동네 상권 10년 지켜본 자영업자가 보는 요즘 분위기",
    sum: "임대료와 배달 수수료 부담이 커지면서 소규모 매장의 체감 경기가 예전과 다르다는 내용. 단골 확보 방식이 온라인 중심으로 바뀌었다는 진단. 댓글에서는 업종별로 체감 차이가 크다는 반응이 이어짐.",
    likes: 1980, cmt: 203, also: 2, cat: ["추천", "이슈"],
  },
];
