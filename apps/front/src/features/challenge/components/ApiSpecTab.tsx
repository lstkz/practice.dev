import { Loader } from 'src/components/Loader';
import * as Rx from 'src/rx';
import { createModule, useActions } from 'typeless';
import React from 'react';
import { ApiSpecSymbol } from '../symbol';
import styled from 'styled-components';
import { BUNDLE_BASE_URL } from 'src/config';
import { getChallengeState } from '../interface';
import { handleAppError } from 'src/common/helper';
import { SwaggerViewer } from 'src/components/Swagger/SwaggerViewer';
import { exampleSwagger1 } from 'src/components/Swagger/examples';

export const [handle, ApiSpecActions, getApiSpecState] = createModule(
  ApiSpecSymbol
)
  .withActions({
    $init: null,
    load: null,
    loaded: (spec: any) => ({ payload: { spec } }),
  })
  .withState<ApiSpecState>();

interface ApiSpecState {
  isLoaded: boolean;
  spec: any;
}

// --- Epic ---
handle.epic().on(ApiSpecActions.load, () => {
  const { challenge } = getChallengeState();
  return Rx.defer(async () => {
    const res = await fetch(
      BUNDLE_BASE_URL + challenge.assets!.swagger + '.json'
    );
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

export function ApiSpecTab() {
  const { isLoaded } = getApiSpecState.useState();
  const { load } = useActions(ApiSpecActions);
  React.useEffect(() => {
    if (!isLoaded) {
      load();
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
      <SwaggerViewer spec={exampleSwagger1} />
    </div>
  );
}

// --- Module ---
export function useApiSpecModule() {
  handle();
}
