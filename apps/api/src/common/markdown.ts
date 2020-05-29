import marked from 'marked';
import escapeHtml from 'escape-html';

export function markdown(text: string) {
  return marked(escapeHtml(text), { gfm: true, breaks: true });
}
