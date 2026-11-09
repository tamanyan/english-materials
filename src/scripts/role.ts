export type ReaderRole = 'student' | 'teacher';

export const roleCookieName = 'business_english_role';

export function isReaderRole(value: unknown): value is ReaderRole {
  return value === 'student' || value === 'teacher';
}

export function resolveRole(search: string, cookie: string): ReaderRole {
  const queryRole = new URLSearchParams(search).get('role');
  if (isReaderRole(queryRole)) return queryRole;
  const saved = cookie.split(';').map(part => part.trim()).find(part => part.startsWith(`${roleCookieName}=`));
  const cookieRole = saved?.slice(roleCookieName.length + 1);
  return isReaderRole(cookieRole) ? cookieRole : 'student';
}

export function roleCookie(role: ReaderRole, secure: boolean): string {
  return `${roleCookieName}=${role}; Path=/; Max-Age=31536000; SameSite=Lax${secure ? '; Secure' : ''}`;
}

export function shareUrl(href: string, role: ReaderRole): string {
  const url = new URL(href);
  url.searchParams.set('role', role);
  url.hash = '';
  return url.href;
}
