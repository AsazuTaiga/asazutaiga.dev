export const TWITTER_EMBED_LANGUAGE = 'twitter';

const TWITTER_STATUS_ID_PATTERN = /^\d+$/;
const TWITTER_STATUS_URL_PATTERN =
  /https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/[^/\s]+\/status\/(\d+)/i;

const isObject = (value) => typeof value === 'object' && value !== null;

export const parseTwitterStatusId = (value) => {
  const input = value.trim();
  if (TWITTER_STATUS_ID_PATTERN.test(input)) {
    return input;
  }

  const match = input.match(TWITTER_STATUS_URL_PATTERN);
  return match?.[1] ?? null;
};

export const renderTwitterEmbedHtml = (statusId) => {
  if (!TWITTER_STATUS_ID_PATTERN.test(statusId)) {
    throw new Error(`Invalid twitter status id: "${statusId}"`);
  }

  const statusUrl = `https://twitter.com/i/web/status/${statusId}`;
  return `<blockquote class="twitter-tweet"><a href="${statusUrl}">${statusUrl}</a></blockquote>`;
};

export const transformTwitterCodeBlock = (node) => {
  if (!isObject(node)) {
    return null;
  }
  if (node.type !== 'code' || node.lang !== TWITTER_EMBED_LANGUAGE || typeof node.value !== 'string') {
    return null;
  }

  const statusId = parseTwitterStatusId(node.value);
  if (!statusId) {
    throw new Error(`Invalid twitter embed body: "${node.value}"`);
  }

  const transformed = {
    type: 'html',
    value: renderTwitterEmbedHtml(statusId),
  };

  if ('position' in node) {
    transformed.position = node.position;
  }

  return transformed;
};
