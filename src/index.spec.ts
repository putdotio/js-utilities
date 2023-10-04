import * as lib from '.';

describe('lib', () => {
  it('exports the known interface', () => {
    expect(lib).toMatchInlineSnapshot(`
      {
        "ExtendableError": [Function],
        "LocalizedError": [Function],
        "SuspenseError": [Function],
        "createLocalizeError": [Function],
        "isErrorLocalizer": [Function],
        "toHumanFileSize": [Function],
        "toTimeAgo": [Function],
      }
    `);
  });
});
