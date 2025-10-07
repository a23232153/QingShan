// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event, {
    transformPageChunk: ({ html }) =>
      html.replace(/<html lang="[^"]*"/, '<html lang="zh-Hant-TW"')
  });
  return response;
};
