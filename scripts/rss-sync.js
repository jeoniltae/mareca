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
  { url: 'http://christiandaily.co.kr/rss', source_name: '기독일보' },
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
  '최더함',
  '바로선개혁교회',
  'Masters Reformed Church Assembly',
];

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

async function syncFeed({ url, source_name }) {
  console.log(`[${source_name}] 파싱 시작: ${url}`);
  let feed;
  try {
    feed = await parser.parseURL(url);
  } catch (err) {
    console.error(`[${source_name}] RSS 파싱 실패:`, err.message);
    return { success: false, count: 0 };
  }

  const filtered = feed.items
    .map((item) => ({
      url: item.link ?? item.guid,
      og_title: item.title ?? null,
      og_image: extractImageFromRSS(item),
      og_description: item.contentSnippet ?? item.summary ?? null,
      source_name,
      published_at: parseDate(item.pubDate ?? item.isoDate),
    }))
    .filter((a) => {
      if (!a.url) return false;
      return matchesKeyword(a.og_title) || matchesKeyword(a.og_description);
    });

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
    .upsert(articles, { onConflict: 'url', ignoreDuplicates: false });

  if (error) {
    console.error(`[${source_name}] Supabase upsert 실패:`, error.message);
    return { success: false, count: 0 };
  }

  console.log(`[${source_name}] ${articles.length}건 upsert 완료`);
  return { success: true, count: articles.length };
}

async function main() {
  let total = 0;
  for (const feed of RSS_FEEDS) {
    const { count } = await syncFeed(feed);
    total += count;
  }
  console.log(`\n전체 완료: ${total}건 처리됨`);
}

main().catch((err) => {
  console.error('치명적 오류:', err);
  process.exit(1);
});
