import * as lib from '.';

describe('lib', () => {
  it('exports the known interface', () => {
    expect(lib).toMatchInlineSnapshot(`
      {
        "ExtendableError": [Function],
        "FileURLProvider": [Function],
        "LocalizedError": [Function],
        "createLocalizeError": [Function],
        "daysDiff": [Function],
        "daysDiffFromNow": [Function],
        "dotsToSpaces": [Function],
        "ensureUTC": [Function],
        "formatDate": [Function],
        "getFileRenderType": [Function],
        "getUnixTimestamp": [Function],
        "isErrorLocalizer": [Function],
        "secondsToDuration": [Function],
        "secondsToReadableDuration": [Function],
        "toHumanFileSize": [Function],
        "toTimeAgo": [Function],
        "truncate": [Function],
        "truncateMiddle": [Function],
      }
    `);
  });
});
