import { Tester } from '../Tester';

describe('test serialization', () => {
  let tester: Tester;
  beforeEach(() => {
    tester = new Tester();
  });

  it('one test', () => {
    tester.test('foo', () => {
      tester.click('#foo');
    });
    expect(tester.tests).toMatchInlineSnapshot(`
                        Array [
                          Object {
                            "id": 1,
                            "name": "foo",
                            "result": "pending",
                            "steps": Array [
                              Object {
                                "exec": [Function],
                                "id": 1,
                                "name": "Click on \\"#foo\\"",
                                "result": "pending",
                              },
                            ],
                          },
                        ]
                `);
  });
  it('two tests', () => {
    tester.test('foo', () => {
      tester.click('#foo');
    });
    tester.test('bar', () => {
      tester.click('#bar');
    });
    expect(tester.tests).toMatchInlineSnapshot(`
                  Array [
                    Object {
                      "id": 1,
                      "name": "foo",
                      "result": "pending",
                      "steps": Array [
                        Object {
                          "exec": [Function],
                          "id": 1,
                          "name": "Click on \\"#foo\\"",
                          "result": "pending",
                        },
                      ],
                    },
                    Object {
                      "id": 2,
                      "name": "bar",
                      "result": "pending",
                      "steps": Array [
                        Object {
                          "exec": [Function],
                          "id": 1,
                          "name": "Click on \\"#bar\\"",
                          "result": "pending",
                        },
                      ],
                    },
                  ]
            `);
  });

  test('click', () => {
    tester.test('example', () => {
      tester.click('#foo');
    });
    expect(tester.tests[0].steps[0].name).toMatchInlineSnapshot(
      `"Click on \\"#foo\\""`
    );
  });

  test('navigate', () => {
    tester.test('example', () => {
      tester.navigate('http://example.com');
    });
    expect(tester.tests[0].steps[0].name).toMatchInlineSnapshot(
      `"Navigate to \\"http://example.com\\""`
    );
  });

  test('expectToBeVisible', () => {
    tester.test('example', () => {
      tester.expectToBeVisible('#foo');
    });
    expect(tester.tests[0].steps[0].name).toMatchInlineSnapshot(
      `"Expect \\"#foo\\" to be visible"`
    );
  });

  test('expectToMatch', () => {
    tester.test('example', () => {
      tester.expectToMatch('#foo', 'text', false);
    });
    expect(tester.tests[0].steps[0].name).toMatchInlineSnapshot(
      `"Expect \\"#foo\\" to equal \\"text\\""`
    );
  });

  test('expectToMatch (exact)', () => {
    tester.test('example', () => {
      tester.expectToMatch('#foo', 'text', true);
    });
    expect(tester.tests[0].steps[0].name).toMatchInlineSnapshot(
      `"Expect \\"#foo\\" to equal \\"text\\""`
    );
  });
});
