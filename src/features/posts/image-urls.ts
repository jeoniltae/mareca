// 게시글 본문 HTML에서 <img>의 src 목록을 뽑는 유틸 (고아 이미지 정리에 사용)

// 큰따옴표·작은따옴표를 모두 받되 여는 따옴표를 역참조(\1)해 짝을 맞춘다.
// `[^>]*?`를 게으르게 두고 src 앞에 공백을 요구하는 이유 — 탐욕적으로 두면 태그 안의
// 마지막 src=로 역추적해서 title="src='x.png'" 같은 속성값에 낚인다.
// 에디터를 거친 본문은 항상 큰따옴표지만 이관된 글과 외부 유입 콘텐츠는 그렇지 않다.
//
// 이 정규식은 세 번 고쳐졌다. 바꾸기 전에 image-urls.test.ts를 먼저 볼 것.
const IMG_SRC_REGEX = /<img[^>]*?\ssrc=(["'])(.*?)\1/g

/** 본문 HTML에 들어 있는 모든 <img> src 값을 순서대로 돌려준다. */
export function extractImageUrls(html: string): string[] {
  // matchAll은 정규식을 복제하므로 모듈 레벨 상수를 써도 lastIndex가 오염되지 않는다
  return [...html.matchAll(IMG_SRC_REGEX)].map((m) => m[2])
}
