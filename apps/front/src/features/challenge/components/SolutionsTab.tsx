import { createModule } from 'typeless';
import { Solution } from 'shared';
import { SolutionsTabSymbol } from '../symbol';
import { SelectOption } from 'src/types';

export const [handle, SolutionsTabActions, getSolutionsTabState] = createModule(
  SolutionsTabSymbol
)
  .withActions({})
  .withState<SolutionsTabState>();

export interface SolutionsTabState {
  isLoaded: boolean;
  solutions: Solution[];
  lastKey: string | null;
  filter: {
    tags: SelectOption[];
    author: SelectOption[];
  };
  sortOrder: SelectOption;
}
