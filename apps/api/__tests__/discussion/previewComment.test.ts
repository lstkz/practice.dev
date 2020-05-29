import { previewComment } from '../../src/contracts/discussion/previewComment';

it('should preview comment', async () => {
  const ret = await previewComment(
    `**foo**
test
<script>a</script>
`
  );

  expect(ret).toMatchInlineSnapshot(`
    "<p><strong>foo</strong><br>test<br>&lt;script&gt;a&lt;/script&gt;</p>
    "
  `);
});
