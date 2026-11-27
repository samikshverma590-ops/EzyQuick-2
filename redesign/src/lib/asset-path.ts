export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function assetPath(path: string): string {
  if (!path) return BASE_PATH;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}
