import { isReaderRole, resolveRole, roleCookie, shareUrl, type ReaderRole } from './role';

const root = document.documentElement;
const switcher = document.querySelector<HTMLFieldSetElement>('.role-switch');
const inputs = document.querySelectorAll<HTMLInputElement>('input[name="reading-role"]');
const copyButton = document.querySelector<HTMLButtonElement>('.copy-link');
const copyLabel = document.querySelector<HTMLElement>('[data-copy-label]');
const status = document.querySelector<HTMLElement>('[data-copy-status]');
const fallback = document.querySelector<HTMLElement>('.copy-fallback');
const shareInput = document.querySelector<HTMLInputElement>('#share-url');
let role: ReaderRole = isReaderRole(root.dataset.role) ? root.dataset.role : 'student';
let copyAttempt = 0;
let resetTimer: ReturnType<typeof setTimeout> | undefined;

function readCookie(): string {
  try { return document.cookie; } catch { return ''; }
}

function applyRole(nextRole: ReaderRole, reflectUrl = false) {
  role = nextRole;
  root.dataset.role = role;
  inputs.forEach(input => { input.checked = input.value === role; });
  try { document.cookie = roleCookie(role, location.protocol === 'https:'); } catch { /* URL-based views still work without storage. */ }

  // Keep the chosen view through normal page navigation, even if cookies are blocked.
  document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(link => {
    if (link.getAttribute('href')?.startsWith('#')) return;
    const url = new URL(link.href);
    if (url.origin !== location.origin) return;
    url.searchParams.set('role', role);
    link.href = url.href;
  });

  const url = new URL(location.href);
  let hiddenAnchor = false;
  try {
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    const owner = target?.closest<HTMLElement>('[data-for-role]');
    hiddenAnchor = !!owner && owner.dataset.forRole !== role;
  } catch { /* Ignore malformed fragments. */ }
  if (hiddenAnchor) url.hash = '';
  if (reflectUrl) url.searchParams.set('role', role);
  if (reflectUrl || hiddenAnchor) history.replaceState(null, '', url);

  // Hide and reset any feedback from an earlier copy or the other role.
  copyAttempt++;
  clearTimeout(resetTimer);
  if (copyLabel) copyLabel.textContent = `Copy ${role} link`;
  if (copyButton) copyButton.disabled = false;
  if (status) status.textContent = '';
  if (fallback) fallback.hidden = true;
  if (shareInput) shareInput.value = '';
}

applyRole(role);
if (switcher) switcher.disabled = false;

inputs.forEach(input => input.addEventListener('change', () => {
  if (input.checked && isReaderRole(input.value)) applyRole(input.value, true);
}));

// Restore the URL's explicit view on back/forward navigation and bfcache restores.
function restoreRole() { applyRole(resolveRole(location.search, readCookie())); }
window.addEventListener('popstate', restoreRole);
window.addEventListener('pageshow', restoreRole);

copyButton?.addEventListener('click', async () => {
  const url = shareUrl(location.href, role);
  const attempt = ++copyAttempt;
  copyButton.disabled = true;
  if (fallback) fallback.hidden = true;
  try {
    await navigator.clipboard.writeText(url);
    if (attempt !== copyAttempt) return;
    if (copyLabel) copyLabel.textContent = 'Copied!';
    if (status) status.textContent = `${role === 'teacher' ? 'Teacher' : 'Student'} link copied.`;
    resetTimer = setTimeout(() => {
      if (attempt === copyAttempt && copyLabel) copyLabel.textContent = `Copy ${role} link`;
    }, 2500);
  } catch {
    if (attempt !== copyAttempt) return;
    if (shareInput && fallback) {
      shareInput.value = url;
      fallback.hidden = false;
      shareInput.focus();
      shareInput.select();
    }
    if (status) status.textContent = 'Automatic copying is unavailable. Select and copy the displayed link.';
  } finally {
    if (attempt === copyAttempt) copyButton.disabled = false;
  }
});
