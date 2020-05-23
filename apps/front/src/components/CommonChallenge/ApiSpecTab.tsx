import { Loader } from 'src/components/Loader';
import * as Rx from 'src/rx';
import { createModule, useActions } from 'typeless';
import React from 'react';
import { ApiSpecSymbol } from './symbol';
import styled from 'styled-components';
import { BUNDLE_BASE_URL } from 'src/config';
import { handleAppError } from 'src/common/helper';
import { SwaggerViewer } from 'src/components/Swagger/SwaggerViewer';

export const [handle, ApiSpecActions, getApiSpecState] = createModule(
  ApiSpecSymbol
)
  .withActions({
    $init: null,
    load: (swaggerKey: string) => ({ payload: { swaggerKey } }),
    loaded: (spec: any) => ({ payload: { spec } }),
  })
  .withState<ApiSpecState>();

interface ApiSpecState {
  isLoaded: boolean;
  spec: any;
}

// --- Epic ---
handle.epic().on(ApiSpecActions.load, ({ swaggerKey }) => {
  return Rx.defer(async () => {
    const res = await fetch(BUNDLE_BASE_URL + swaggerKey + '.json');
    return res.json();
  }).pipe(
    Rx.map(spec => ApiSpecActions.loaded(spec)),
    handleAppError()
  );
});

// --- Reducer ---
const initialState: ApiSpecState = {
  isLoaded: false,
  spec: null,
};

handle
  .reducer(initialState)
  .on(ApiSpecActions.$init, state => {
    Object.assign(state, initialState);
  })
  .on(ApiSpecActions.loaded, (state, { spec }) => {
    state.spec = spec;
    state.isLoaded = true;
  });

const LoaderWrapper = styled.div`
  padding: 120px 0;
  text-align: center;
`;

interface ApiSpecTabProps {
  swaggerKey: string;
}

export function ApiSpecTab(props: ApiSpecTabProps) {
  const { swaggerKey } = props;
  const { isLoaded, spec } = getApiSpecState.useState();
  const { load } = useActions(ApiSpecActions);
  React.useEffect(() => {
    if (!isLoaded) {
      load(swaggerKey);
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <LoaderWrapper>
        <Loader />
      </LoaderWrapper>
    );
  }

  return (
    <div>
      <SwaggerViewer spec={spec} />
    </div>
  );
}

// --- Module ---
export function useApiSpecModule() {
  handle();
}
