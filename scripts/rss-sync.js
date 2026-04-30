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

/**
 * @param {string} dateStr
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
function extractImage(item) {
  if (item.enclosure?.url) return item.enclosure.url;
  if (item['media:content']?.['$']?.url) return item['media:content']['$'].url;
  if (item['media:thumbnail']?.['$']?.url) return item['media:thumbnail']['$'].url;
  const match = typeof item.content === 'string'
    ? item.content.match(/<img[^>]+src=["']([^"']+)["']/)
    : null;
  return match ? match[1] : null;
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

  const articles = feed.items.map((item) => ({
    url: item.link ?? item.guid,
    og_title: item.title ?? null,
    og_image: extractImage(item),
    og_description: item.contentSnippet ?? item.summary ?? null,
    source_name,
    published_at: parseDate(item.pubDate ?? item.isoDate),
  })).filter((a) => !!a.url);

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
