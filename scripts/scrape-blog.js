const https = require('https');
const fs = require('fs');
const path = require('path');

const RSS_URL = 'https://www.fain-avocats.fr/actualites/category/Droit+de+la+famille?format=rss';
const OUTPUT_DIR = path.join(__dirname, '../content/blog');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function htmlToMarkdown(html) {
  if (!html) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, '')
    .replace(/<img[^>]*>/gi, '')
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n# $1\n')
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n')
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n')
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, inner) => {
      const clean = inner.replace(/<\/?p[^>]*>/gi, '').trim();
      return '\n> ' + clean.split('\n').join('\n> ') + '\n';
    })
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n')
    .replace(/<\/?[uo]l[^>]*>/gi, '\n')
    .replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
    .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*')
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<hr\s*\/?>/gi, '\n---\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»')
    .replace(/&eacute;/g, 'é')
    .replace(/&egrave;/g, 'è')
    .replace(/&agrave;/g, 'à')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();
}

function createSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80);
}

function escapeYaml(str) {
  return str.replace(/"/g, '\\"').replace(/\n/g, ' ').trim();
}

function fetchURL(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml',
      },
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function parseRSSManually(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];

    const get = (tag) => {
      const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
      return m ? m[1].trim() : '';
    };

    const getCDATA = (tag) => {
      const m = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`));
      return m ? m[1].trim() : get(tag);
    };

    const category = get('category') || 'Droit de la famille';

    const imageMatch = block.match(/<media:content[^>]*url="([^"]*)"[^>]*/);

    items.push({
      title: get('title'),
      category,
      author: get('dc:creator') || 'Fain Avocats',
      pubDate: get('pubDate'),
      link: get('link'),
      description: getCDATA('description'),
      content: getCDATA('content:encoded'),
      image: imageMatch ? imageMatch[1] : '',
    });
  }
  return items;
}

async function main() {
  console.log('Téléchargement du flux RSS...');
  const rssData = await fetchURL(RSS_URL);

  console.log('Parsing des articles...');
  const items = parseRSSManually(rssData);
  console.log(`${items.length} articles "Droit de la famille" trouvés\n`);

  items.forEach((item, index) => {
    const slug = createSlug(item.title);
    const date = new Date(item.pubDate).toISOString().split('T')[0];
    const markdown = htmlToMarkdown(item.content);

    const mdx = `---
title: "${escapeYaml(item.title)}"
date: "${date}"
category: "Droit de la famille"
author: "${escapeYaml(item.author)}"
description: "${escapeYaml(item.description)}"
image: "${item.image}"
slug: "${slug}"
---

${markdown}
`;

    const filepath = path.join(OUTPUT_DIR, `${slug}.mdx`);
    fs.writeFileSync(filepath, mdx, 'utf8');
    console.log(`[${index + 1}/${items.length}] ${slug}.mdx`);
  });

  console.log(`\nTerminé ! ${items.length} articles créés dans content/blog/`);
}

main().catch(console.error);
