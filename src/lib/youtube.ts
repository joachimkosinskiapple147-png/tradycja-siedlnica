/**
 * Wyodrębnia i waliduje 11-znakowe ID filmu YouTube z dowolnego formatu linku:
 * youtube.com/watch?v=…, youtu.be/…, YouTube Shorts (/shorts/…), /embed/…,
 * lub gdy podano samo ID.
 */
export function extractYouTubeId(input: string): string | null {
  const value = input.trim();
  if (!value) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=)([A-Za-z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
    /(?:youtube\.com\/live\/)([A-Za-z0-9_-]{11})/,
    /(?:youtu\.be\/)([A-Za-z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = value.match(re);
    if (m) return m[1];
  }
  if (/^[A-Za-z0-9_-]{11}$/.test(value)) return value;
  return null;
}
