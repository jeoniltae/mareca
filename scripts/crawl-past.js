// @ts-check
// 기독일보 과거 기사 일회성 수집 스크립트
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('SUPABASE_URL 또는 SUPABASE_SERVICE_KEY 환경변수가 없습니다.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const SEARCH_KEYWORDS = [
  '마스터스개혁파총회',
  '마스터스개혁파',
  '마스터스총회',
  '최더함',
  '바로선개혁교회',
];

const SOURCE_NAME = '기독일보';
const BASE_URL = 'http://christiandaily.co.kr';
const DELAY_MS = 1000;

/** @param {number} ms */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * @param {string} src
 * @returns {string}
 */
function cleanImageUrl(src) {
  // 사이즈 파라미터 제거하고 원본 이미지 URL 반환
  return src.split('?')[0];
}

/**
 * @param {string} keyword
 * @param {number} page
 * @returns {Promise<Array<{url:string, og_title:string|null, og_image:string|null, og_description:string|null}>>}
 */
async function fetchPage(keyword, page) {
  const searchUrl = `${BASE_URL}/search?q=${encodeURIComponent(keyword)}&page=${page}`;
  console.log(`  [${keyword}] 페이지 ${page} 요청: ${searchUrl}`);

  let html;
  try {
    const res = await fetch(searchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; mareca-bot/1.0)' },
      signal: AbortSignal.timeout(10000),
    });
    html = await res.text();
  } catch (err) {
    console.error(`  요청 실패:`, err.message);
    return [];
  }

  const $ = cheerio.load(html);
  const articles = [];

  // div.article-item 또는 검색결과 li 모두 처리
  const items = $('div.article-item, .search-result li, .list-wrap li').toArray();

  for (const el of items) {
    const titleEl = $(el).find('h5 > a, h6 > a').first();
    const title = titleEl.text().trim();
    let href = titleEl.attr('href') ?? $(el).find('a').first().attr('href') ?? '';

    if (!href) continue;
    if (!href.startsWith('http')) href = BASE_URL + href;

    const imgSrc = $(el).find('img').first().attr('src') ?? null;
    const description = $(el).find('p').first().text().trim() || null;

    articles.push({
      url: href,
      og_title: title || null,
      og_image: imgSrc ? cleanImageUrl(imgSrc) : null,
      og_description: description,
    });
  }

  return articles;
}

/**
 * @param {string} keyword
 * @returns {Promise<Array>}
 */
async function crawlKeyword(keyword) {
  const collected = [];
  let page = 1;

  while (page <= 20) { // 최대 20페이지
    const items = await fetchPage(keyword, page);
    if (items.length === 0) break;

    collected.push(...items);
    console.log(`  → ${items.length}건 수집 (누적 ${collected.length}건)`);
    page++;
    await sleep(DELAY_MS);
  }

  return collected;
}

async function main() {
  const allMap = new Map(); // url 기준 중복 제거

  for (const keyword of SEARCH_KEYWORDS) {
    console.log(`\n[${keyword}] 크롤링 시작`);
    const items = await crawlKeyword(keyword);
    for (const item of items) {
      if (!allMap.has(item.url)) {
        allMap.set(item.url, { ...item, source_name: SOURCE_NAME, published_at: null });
      }
    }
  }

  const articles = Array.from(allMap.values());
  console.log(`\n총 ${articles.length}건 수집 완료 (중복 제거 후)`);

  if (articles.length === 0) {
    console.log('저장할 기사 없음');
    return;
  }

  // 50건씩 나눠서 upsert
  const CHUNK = 50;
  for (let i = 0; i < articles.length; i += CHUNK) {
    const chunk = articles.slice(i, i + CHUNK);
    const { error } = await supabase
      .from('press_articles')
      .upsert(chunk, { onConflict: 'url', ignoreDuplicates: true });

    if (error) {
      console.error(`upsert 실패 (${i}~${i + CHUNK}):`, error.message);
    } else {
      console.log(`upsert 완료: ${i + 1}~${Math.min(i + CHUNK, articles.length)}번째`);
    }
  }

  console.log('\n완료');
}

main().catch((err) => {
  console.error('치명적 오류:', err);
  process.exit(1);
});
