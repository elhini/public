import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('Russian prepositions stay attached in the hero, experience and expanded details', async () => {
  const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
  for (const phrase of ['От\u00a0корпоративных', 'на\u00a0TypeScript', 'и\u00a0React', 'для\u00a0B2B-клиентов', 'Обо\u00a0мне']) {
    assert.ok(html.includes(phrase), `Missing nonbreaking phrase: ${phrase}`);
  }
});

for (const [locale, file] of [['ru', 'index.html'], ['en', 'en/index.html']]) {
  test(`${locale}: deployable hero page with local favicon and no runtime JS`, async () => {
    const html = await readFile(new URL(`../dist/${file}`, import.meta.url), 'utf8');
    assert.match(html, /class="profile-json"/);
    assert.match(html, /class="hero"/);
    assert.match(html, new RegExp(`<html lang="${locale}"`));
    assert.match(html, /href="\/favicon.svg"/);
    assert.match(html, /https:\/\/t.me\/elhini/);
    assert.match(html, /https:\/\/github.com\/elhini/);
    assert.doesNotMatch(html, /<script\b|\/archive|budgetItem|Личный архив/);
    const icon = await readFile(new URL('../dist/favicon.svg', import.meta.url), 'utf8');
    assert.match(icon, /#d5f392/);
  });

  test(`${locale}: experience and skills expand, education and languages stay visible`, async () => {
    const html = (await readFile(new URL(`../dist/${file}`, import.meta.url), 'utf8')).replaceAll('\u00a0', ' ');
    const disclosures = [...html.matchAll(/<details\b([^>]*)>([\s\S]*?)<\/details>/g)];
    assert.equal(disclosures.length, 4, 'Three experience rows and one skills row');
    assert.ok(disclosures.every(([, attributes, body]) => !/\bopen(?:\s|=|$)/.test(attributes) && body.includes('<summary') && body.includes('disclosure-icon')));
    for (const id of ['experience-pay', 'experience-tripleten', 'experience-earlier', 'about-skills']) {
      assert.ok(disclosures.some(([, attributes]) => attributes.includes(`id="${id}"`)), `Missing ${id}`);
    }
    const earlier = disclosures.find(([, attributes]) => attributes.includes('experience-earlier'))[2];
    assert.match(earlier, /Wildberries/);
    assert.match(earlier, locale === 'ru' ? /Дизайн-студия КО/ : /Design studio KO/);
    assert.equal((earlier.match(/class="resume-job"/g) ?? []).length, 7);
    assert.match(html, locale === 'ru' ? /03 \/ Обо мне/ : /03 \/ About me/);
    assert.match(html, locale === 'ru' ? /Запуск скидок на товары/ : /Launched product-level discounts/);
    assert.match(html, locale === 'ru' ? /Система мониторинга/ : /monitoring, assigning/);
    const alwaysVisible = html.replace(/<details\b[^>]*>[\s\S]*?<\/details>/g, '');
    assert.match(alwaysVisible, locale === 'ru' ? /Информационные технологии в дизайне/ : /Information Technologies in Design/);
    assert.match(alwaysVisible, locale === 'ru' ? /Английский: B2/ : /English: B2/);
  });
}
