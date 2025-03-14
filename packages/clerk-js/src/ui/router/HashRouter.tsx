import React from 'react';
import { stripOrigin } from 'utils';

import { BaseRouter } from './BaseRouter';

export const hashRouterBase = 'CLERK-ROUTER/HASH';

interface HashRouterProps {
  preservedParams?: string[];
  children: React.ReactNode;
}

export const HashRouter = ({ preservedParams, children }: HashRouterProps): JSX.Element => {
  const internalNavigate = (toURL: URL): Promise<void> => {
    window.location.hash = stripOrigin(toURL).substring(1 + hashRouterBase.length);
    return Promise.resolve();
  };

  const fakeUrl = (): URL => {
    // Create a URL object with the contents of the hash
    // Use the origin because you can't create a url object without protocol and host
    if (window.location.hash.startsWith('#/')) {
      return new URL(window.location.origin + window.location.hash.substring(1));
    } else {
      return new URL(window.location.origin);
    }
  };

  const getPath = (): string => {
    return fakeUrl().pathname === '/' ? '/' + hashRouterBase : '/' + hashRouterBase + fakeUrl().pathname;
  };

  const getQueryString = (): string => {
    return fakeUrl().search;
  };

  return (
    <BaseRouter
      getPath={getPath}
      basePath={hashRouterBase}
      getQueryString={getQueryString}
      internalNavigate={internalNavigate}
      refreshEvents={['popstate', 'hashchange']}
      preservedParams={preservedParams}
    >
      {children}
    </BaseRouter>
  );
};
