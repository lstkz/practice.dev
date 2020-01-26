import { Registry, Action } from 'typeless';
import { Subject } from 'rxjs';

export const registry = new Registry();

export function getOutputStream(): Subject<Action> {
  return (registry as any).input$;
}
