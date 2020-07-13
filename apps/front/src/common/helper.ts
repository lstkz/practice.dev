import { getValidateResult, AnySchema } from 'schema';
import * as Rx from 'src/rx';
import { GlobalActions } from 'src/features/global/interface';
import { ActionLike } from 'typeless';
import { AsyncResult } from 'react-select-async-paginate';
import { api } from 'src/services/api';
import { AuthData } from 'shared';
import { RouterActions } from 'typeless-router';
import { BUNDLE_BASE_URL } from 'src/config';

export class UnreachableCaseError extends Error {
  constructor(val: never) {
    super(
      `Unreachable case: ${typeof val === 'string' ? val : JSON.stringify(val)}`
    );
  }
}

function fixErrorMessage(message: string) {
  if (message === 'is required') {
    return 'This field is required';
  }

  return message[0].toUpperCase() + message.slice(1);
}

export function validate(
  errors: any,
  values: any,
  schema: AnySchema<any, any>
) {
  getValidateResult(values, schema).errors.reduce((ret, err) => {
    ret[err.path[0]] = fixErrorMessage(err.message);
    return ret;
  }, errors as any);
}

export function getErrorMessage(e: any) {
  if (e?.status === 0) {
    return 'Cannot connect to API';
  }
  const message = e?.response?.error || e.message;
  return message.replace('ContractError: ', '');
}

export const handleAppError = () =>
  Rx.catchLog<ActionLike, Rx.Observable<ActionLike>>((e: any) => {
    return Rx.of(GlobalActions.showAppError(getErrorMessage(e)));
  });

export function searchSolutionTags(
  challengeId: number,
  keyword: string,
  cursor: string | null,
  resolve: (
    result: AsyncResult<{
      label: string;
      value: string;
    }>
  ) => void
) {
  return api
    .solutionTags_searchSolutionTags({
      challengeId,
      cursor,
      keyword,
    })
    .pipe(
      Rx.mergeMap(ret => {
        const options = ret.items.map(x => ({
          label: `${x.name} (${x.count})`,
          value: x.name,
        }));
        resolve({
          options,
          hasMore: !!ret.cursor,
          additional: ret.cursor,
        });
        return Rx.empty();
      }),
      Rx.catchLog(() => {
        return Rx.empty();
      })
    );
}

interface HandleAuthOptions {
  authData: AuthData;
  isModalOpen: boolean;
  hideModal: () => any;
  reset: () => any;
  action$: Rx.Observable<any>;
}

export function handleAuth(options: HandleAuthOptions) {
  const { authData, isModalOpen, hideModal, reset, action$ } = options;
  return Rx.mergeObs(
    Rx.defer(() => {
      if (isModalOpen) {
        return Rx.of(reset());
      } else {
        return action$.pipe(
          Rx.waitForType(RouterActions.locationChange),
          Rx.map(() => reset())
        );
      }
    }).pipe(Rx.delay(1000)),
    Rx.defer(() => {
      if (isModalOpen) {
        return [GlobalActions.auth(authData, true), hideModal()];
      }
      return [GlobalActions.auth(authData)];
    })
  );
}

export function getSolutionsSortCriteria(
  sortOrder: 'likes' | 'newest' | 'oldest'
) {
  return sortOrder === 'newest'
    ? {
        sortBy: 'date' as const,
        sortDesc: true,
      }
    : sortOrder === 'oldest'
    ? {
        sortBy: 'date' as const,
        sortDesc: false,
      }
    : {
        sortBy: 'likes' as const,
        sortDesc: true,
      };
}

export function getAvatarUrl(
  avatarUrl: string | null,
  size: 'sm' | 'lg' = 'sm'
) {
  if (!avatarUrl) {
    return null;
  }
  return (
    BUNDLE_BASE_URL +
    `avatars/${avatarUrl}-${size == 'sm' ? '80x80' : '280x280'}.png`
  );
}

export function countryListItemToOption({
  code,
  name,
  emoji,
}: {
  code: string;
  name: string;
  emoji: string;
}) {
  return {
    value: code,
    label: `${emoji} ${name}`,
  };
}

export function parseFilterValue(str: string, allowed?: string[]) {
  const value = (str || '').trim().toLowerCase();
  if (!allowed || allowed.includes(value)) {
    return value;
  } else {
    return null;
  }
}

export function parseFilterValues(str: string, allowed?: string[]) {
  const values = (str || '')
    .split(',')
    .map(x => parseFilterValue(x, allowed))
    .filter(x => x) as string[];
  return values;
}

export function parseFilterMap(str: string, allowed?: string[]) {
  const values = parseFilterValues(str, allowed);
  return values.reduce((ret, value) => {
    ret[value] = value;
    return ret;
  }, {} as any);
}

export function capitalize(str: string) {
  return str[0].toUpperCase() + str.substr(1);
}

export function toggleMapValue<
  T extends Record<string, string | undefined>,
  K extends string
>(map: T, value: K): T {
  let copy = { ...map };
  if (copy[value]) {
    delete copy[value];
  } else {
    (copy as any)[value] = value;
  }
  return copy;
}

const BUNDLE_ID = 'CHALLENGE_BUNDLE_SCRIPT';

function removeBundle() {
  const existing = document.getElementById(BUNDLE_ID);
  if (existing) {
    existing.remove();
  }
}

export function loadBundle(detailsBundleS3Key: string) {
  return new Rx.Observable<any>(subscriber => {
    removeBundle();
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = BUNDLE_BASE_URL + detailsBundleS3Key;
    script.setAttribute('id', BUNDLE_ID);
    (window as any).ChallengeJSONP = (module: any) => {
      subscriber.next(module.Details);
      subscriber.complete();
    };
    document.body.appendChild(script);
    return () => {
      removeBundle();
    };
  });
}

export function opacityHex(hex: string, opacity: number) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error('Invalid hex: ' + hex);
  }

  const parts = [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
    opacity,
  ];
  return `rgba(${parts.join(', ')})`;
}

export function isMenuHighlighted(
  pathname: string,
  menu: 'challenges' | 'projects' | 'contents' | 'settings'
) {
  switch (menu) {
    case 'challenges':
      return pathname === '/' || pathname.startsWith('/challenges');
    case 'projects':
      return pathname.startsWith('/projects');
    case 'contents':
      return pathname.startsWith('/contests');
    case 'settings':
      return pathname.startsWith('/settings');
    default:
      throw new UnreachableCaseError(menu);
  }
}
