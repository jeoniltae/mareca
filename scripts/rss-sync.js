// @ts-check
const RSSParser = require('rss-parser');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('SUPABASE_URL 또는 SUPABASE_SERVICE_KEY 환경변수가 없습니다.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const RSS_FEEDS = [
  // 기독일보 RSS는 본문 앞 200자 안팎만 보내므로 뒷부분의 키워드는 기사 페이지에서 찾는다
  { url: 'http://christiandaily.co.kr/rss', source_name: '기독일보', checkBody: true },
  { url: 'https://www.christiantoday.co.kr/rss', source_name: '크리스천투데이' },
];

const parser = new RSSParser({
  timeout: 10000,
  headers: { 'User-Agent': 'Mozilla/5.0 (compatible; mareca-rss-bot/1.0)' },
});

const KEYWORDS = [
  '마스터스개혁파총회',
  '마스터스개혁파',
  '마스터스총회',
  '마스터스세미너리',
  '최더함',
  '바로선개혁교회',
  'Masters Reformed Church Assembly',
];

// 기사 페이지를 한 번에 받는 개수 (언론사 서버 부담 제한)
const BODY_FETCH_BATCH = 5;

/**
 * @param {string | null | undefined} text
 * @returns {boolean}
 */
function matchesKeyword(text) {
  if (!text) return false;
  const normalized = text.replace(/\s+/g, '');
  return KEYWORDS.some((kw) => normalized.includes(kw.replace(/\s+/g, '')));
}

/**
 * @param {string | null | undefined} dateStr
 * @returns {string | null}
 */
function parseDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().split('T')[0];
}

/**
 * @param {object} item
 * @returns {string | null}
 */
function extractImageFromRSS(item) {
  if (item.enclosure?.url) return item.enclosure.url;
  if (item['media:content']?.['$']?.url) return item['media:content']['$'].url;
  if (item['media:thumbnail']?.['$']?.url) return item['media:thumbnail']['$'].url;
  const match = typeof item.content === 'string'
    ? item.content.match(/<img[^>]+src=["']([^"']+)["']/)
    : null;
  return match ? match[1] : null;
}

/**
 * 기사 URL에서 og:image 메타태그를 파싱해 반환
 * @param {string} articleUrl
 * @returns {Promise<string | null>}
 */
async function fetchOgImage(articleUrl) {
  try {
    const res = await fetch(articleUrl, {
      signal: AbortSignal.timeout(8000),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; mareca-rss-bot/1.0)' },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * 기독일보 기사 페이지에서 본문 HTML만 잘라 반환
 * 페이지 하단의 다른 기사 목록에 걸리지 않도록 본문 구간으로 한정한다
 * @param {string} articleUrl
 * @returns {Promise<string | null>}
 */
async function fetchArticleBody(articleUrl) {
  try {
    const res = await fetch(articleUrl, {
      signal: AbortSignal.timeout(8000),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; mareca-rss-bot/1.0)' },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const match = html.match(/itemprop="articleBody"[^>]*>([\s\S]*?)<div class="sns-go"/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * 제목·요약에서 걸러진 항목 중 기사 본문에 키워드가 있는 항목을 반환
 * @template {{ url: string, og_title: string | null }} T
 * @param {T[]} articles
 * @returns {Promise<T[]>}
 */
async function filterByBody(articles) {
  /** @type {T[]} */
  const matched = [];
  for (let i = 0; i < articles.length; i += BODY_FETCH_BATCH) {
    const batch = articles.slice(i, i + BODY_FETCH_BATCH);
    const bodies = await Promise.all(batch.map((a) => fetchArticleBody(a.url)));
    batch.forEach((a, j) => {
      if (!matchesKeyword(bodies[j])) return;
      console.log(`  [본문] ${a.og_title}`);
      matched.push(a);
    });
  }
  return matched;
}

/**
 * @param {{ url: string, source_name: string, checkBody?: boolean }} feed
 */
async function syncFeed({ url, source_name, checkBody }) {
  console.log(`[${source_name}] 파싱 시작: ${url}`);
  let feed;
  try {
    feed = await parser.parseURL(url);
  } catch (err) {
    console.error(`[${source_name}] RSS 파싱 실패:`, err.message);
    return { success: false, count: 0 };
  }

  const items = feed.items
    .map((item) => ({
      url: item.link ?? item.guid ?? '',
      og_title: item.title ?? null,
      og_image: extractImageFromRSS(item),
      og_description: item.contentSnippet ?? item.summary ?? null,
      source_name,
      published_at: parseDate(item.pubDate ?? item.isoDate ?? item.date) ?? new Date().toISOString().split('T')[0],
    }))
    .filter((a) => a.url);

  const filtered = items.filter((a) => matchesKeyword(a.og_title) || matchesKeyword(a.og_description));
  if (checkBody) {
    const unmatched = items.filter((a) => !filtered.includes(a));
    filtered.push(...(await filterByBody(unmatched)));
  }

  // RSS에서 이미지를 못 가져온 항목만 OG 파싱
  const articles = await Promise.all(
    filtered.map(async (a) => {
      if (a.og_image || !a.url) return a;
      const ogImage = await fetchOgImage(a.url);
      if (ogImage) console.log(`  [OG] ${a.og_title} → ${ogImage}`);
      return { ...a, og_image: ogImage };
    })
  );

  if (articles.length === 0) {
    console.log(`[${source_name}] 항목 없음`);
    return { success: true, count: 0 };
  }

  const { error } = await supabase
    .from('press_articles')
    // RSS 본문은 언론사가 사이트에서 고쳐도 갱신되지 않아, 덮어쓰면 수동 정정이 옛 문구로 되돌아간다
    .upsert(articles, { onConflict: 'url', ignoreDuplicates: true });

  if (error) {
    console.error(`[${source_name}] Supabase upsert 실패:`, error.message);
    return { success: false, count: 0 };
  }

  console.log(`[${source_name}] ${articles.length}건 upsert 완료`);
  return { success: true, count: articles.length };
}

async function main() {
  let total = 0;
  const failed = [];

  for (const feed of RSS_FEEDS) {
    const { success, count } = await syncFeed(feed);
    if (!success) failed.push(feed.source_name);
    total += count;
  }

  console.log(`\n전체 완료: ${total}건 처리됨`);

  // syncFeed가 예외를 잡아 정상 반환하므로, 여기서 종료 코드를 올리지 않으면
  // 언론사 RSS가 죽어도 Actions가 초록불로 표시되어 장애를 놓친다.
  if (failed.length > 0) {
    console.error(`처리 실패한 피드: ${failed.join(', ')}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('치명적 오류:', err);
  process.exit(1);
});
