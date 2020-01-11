import { checkHasSelectorMatches, getSelectorMatchResult } from '../dom-helper';

function getDocument(result: any[]) {
  return ({
    querySelectorAll: () => result,
  } as unknown) as Document;
}

describe('checkHasSelectorMatches', () => {
  it('return false if no matches', () => {
    const result = checkHasSelectorMatches(
      getDocument([]),
      'selector',
      'text',
      true
    );
    expect(result).toBe(false);
  });

  it('return false if multiple matches', () => {
    const result = checkHasSelectorMatches(
      getDocument([
        { tagName: 'div', textContent: 'text' },
        { tagName: 'div', textContent: 'text' },
      ]),
      'selector',
      'text',
      true
    );
    expect(result).toBe(false);
  });

  test.each([
    [
      {
        tagName: 'div',
        textContent: 'foo',
      },
      'text',
      true,
      false,
    ],
    [
      {
        tagName: 'div',
        textContent: 'text',
      },
      'text',
      true,
      true,
    ],
    [
      {
        tagName: 'div',
        textContent: 'foo',
      },
      'text',
      false,
      false,
    ],
    [
      {
        tagName: 'div',
        textContent: 'text',
      },
      'te',
      false,
      true,
    ],
    [
      {
        tagName: 'div',
        textContent: 'foo',
      },
      /te/,
      false,
      false,
    ],
    [
      {
        tagName: 'div',
        textContent: 'text',
      },
      /te/,
      false,
      true,
    ],
    [
      {
        tagName: 'input',
        value: 'foo',
      },
      'text',
      true,
      false,
    ],
    [
      {
        tagName: 'input',
        value: 'text',
      },
      'text',
      true,
      true,
    ],
  ] as any)(
    '(%p) match: %s, partial: %s -> %s`',
    async (tag, text, partial, expected) => {
      const result = checkHasSelectorMatches(
        getDocument([tag]),
        'selector',
        text,
        partial
      );
      expect(result).toBe(expected);
    }
  );
});

describe('getSelectorMatchResult', () => {
  it('multiple results', () => {
    expect(
      getSelectorMatchResult(
        getDocument([
          { tagName: 'div', textContent: 'text' },
          { tagName: 'div', textContent: 'text' },
        ]),
        'input'
      )
    ).toEqual({
      error: 'multiple',
      count: 2,
    });
  });

  it('1 result (div)', () => {
    expect(
      getSelectorMatchResult(
        getDocument([{ tagName: 'div', textContent: 'text' }]),
        'input'
      )
    ).toEqual('text');
  });

  it('1 result (input)', () => {
    expect(
      getSelectorMatchResult(
        getDocument([{ tagName: 'input', value: 'text' }]),
        'input'
      )
    ).toEqual('text');
  });
});
