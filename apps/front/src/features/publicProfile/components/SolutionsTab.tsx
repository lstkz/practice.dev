import { createModule, useActions } from 'typeless';
import { Solution } from 'shared';
import { SolutionsTabSymbol } from '../symbol';



export const [handle, SolutionsTabActions, getSolutionsTabState] = createModule(
  SolutionsTabSymbol
)
.withActions({
  $init: null,