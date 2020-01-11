export function checkHasSelectorMatches(
  document: Document,
  input: string,
  text: string | RegExp,
  exact: boolean
) {
  const elements = document.querySelectorAll(input);
  if (elements.length !== 1) {
    return false;
  }
  const element = elements[0];
  const textContent: string =
    element.tagName.toLowerCase() === 'input'
      ? (element as HTMLInputElement).value
      : element.textContent || '';
  if (typeof text === 'string') {
    return exact ? textContent === text : textContent.includes(text);
  }
  return text.test(textContent);
}

export function getSelectorMatchResult(document: Document, input: string) {
  const elements = document.querySelectorAll(input);
  if (elements.length !== 1) {
    return { error: 'multiple' as 'multiple', count: elements.length };
  }
  const element = elements[0];
  return element.tagName.toLowerCase() === 'input'
    ? (element as HTMLInputElement).value
    : element.textContent || '';
}
