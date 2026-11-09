import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { resolveRole, roleCookie, shareUrl } from '../src/scripts/role.ts';

const cases = [
  ['first visit', '', '', 'student'],
  ['remember teacher', '', 'business_english_role=teacher', 'teacher'],
  ['remember student', '', 'other=1; business_english_role=student; next=2', 'student'],
  ['teacher query wins', '?role=teacher', 'business_english_role=student', 'teacher'],
  ['student query wins', '?role=student', 'business_english_role=teacher', 'student'],
  ['invalid query uses cookie', '?role=admin', 'business_english_role=teacher', 'teacher'],
  ['empty query uses cookie', '?role=', 'business_english_role=teacher', 'teacher'],
  ['invalid cookie uses default', '', 'business_english_role=admin', 'student'],
  ['unrelated cookie is ignored', '', 'other_business_english_role=teacher', 'student'],
  ['encoded query', '?role=%74eacher', '', 'teacher'],
  ['other parameters retained', '?source=lesson&role=teacher', '', 'teacher'],
];

const layout = readFileSync(new URL('../src/layouts/BaseLayout.astro', import.meta.url), 'utf8');
const bootstrap = layout.match(/<script is:inline>([\s\S]*?)<\/script>/)?.[1];
assert.ok(bootstrap, 'The pre-paint role initialization must exist');

for (const [name, search, cookie, expected] of cases) {
  test(`role precedence and first paint: ${name}`, () => {
    assert.equal(resolveRole(search, cookie), expected);
    const document = { cookie, documentElement: { dataset: { role: 'student' } } };
    runInNewContext(bootstrap, { document, location: { search }, URLSearchParams });
    assert.equal(document.documentElement.dataset.role, expected);
  });
}

test('a teacher query works before paint when reading cookies is blocked', () => {
  const document = { documentElement: { dataset: { role: 'student' } } };
  Object.defineProperty(document, 'cookie', { get() { throw new Error('Storage blocked'); } });
  runInNewContext(bootstrap, { document, location: { search: '?role=teacher' }, URLSearchParams });
  assert.equal(document.documentElement.dataset.role, 'teacher');
});

test('copying uses the current role and starts at the top of the same page', () => {
  assert.equal(
    shareUrl('https://example.com/lessons/01/?role=student&source=lesson#teacher-opening', 'teacher'),
    'https://example.com/lessons/01/?role=teacher&source=lesson',
  );
  assert.equal(shareUrl('https://example.com/lessons/01/', 'student'), 'https://example.com/lessons/01/?role=student');
});

test('a copied link has one unambiguous role parameter', () => {
  const url = new URL(shareUrl('https://example.com/?role=teacher&role=student', 'student'));
  assert.deepEqual(url.searchParams.getAll('role'), ['student']);
});

test('preference is scoped to the site, lasts one year, and is secure in production', () => {
  assert.equal(roleCookie('teacher', true), 'business_english_role=teacher; Path=/; Max-Age=31536000; SameSite=Lax; Secure');
  assert.equal(roleCookie('student', false), 'business_english_role=student; Path=/; Max-Age=31536000; SameSite=Lax');
});
