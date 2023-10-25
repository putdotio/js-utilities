import * as lib from '.';

describe('lib', () => {
  it('exports the known interface', () => {
    expect(lib).toMatchInlineSnapshot(`
      {
        "ExtendableError": [Function],
        "LocalizedError": [Function],
        "SuspenseError": [Function],
        "createLocalizeError": [Function],
        "daysDiff": [Function],
        "ensureUTC": [Function],
        "formatDate": [Function],
        "getUnixTimestamp": [Function],
        "isErrorLocalizer": [Function],
        "secondsToDuration": [Function],
        "secondsToReadableDuration": [Function],
        "toHumanFileSize": [Function],
        "toTimeAgo": [Function],
      }
    `);
  });
});
