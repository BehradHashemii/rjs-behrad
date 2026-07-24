import e2p from "./persianNumber";

/**
 * Calculates estimated read time in minutes for a given text or HTML string.
 * Average reading speed: ~200 words per minute.
 *
 * @param {string} content - HTML string or plain text content
 * @param {number} wpm - Words per minute (default 200)
 * @returns {number} Estimated read time in minutes
 */
export function getReadTimeMinutes(content, wpm = 200) {
  if (!content) return 1;

  // Remove HTML tags
  const plainText = content.replace(/<[^>]*>?/gm, " ").trim();

  // Split by whitespace and count words
  const words = plainText.split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;

  // Minimum 1 minute
  const minutes = Math.max(1, Math.ceil(wordCount / wpm));
  return minutes;
}

/**
 * Returns formatted read time string in Persian, e.g. "۳ دقیقه"
 *
 * @param {string} content - HTML string or plain text content
 * @param {number} wpm - Words per minute (default 200)
 * @returns {string} Formatted read time string
 */
export function formatReadTime(content, wpm = 200) {
  const minutes = getReadTimeMinutes(content, wpm);
  return `${e2p(minutes)} دقیقه`;
}

export default formatReadTime;
