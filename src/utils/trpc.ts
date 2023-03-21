// src/utils/trpc.ts
import { createTRPCNext } from '@trpc/next';
import { httpBatchLink, httpLink, loggerLink, splitLink } from '@trpc/client';
import superjson from 'superjson';
import type { AppRouter } from '../server/trpc/router';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: opts =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        splitLink({
          condition(op) {
            // check for context property `skipBatch`
            return op.context.skipBatch === true;
          },
          // when condition is true, use normal request
          true: httpLink({
            url: `${getBaseUrl()}/api/trpc`,
          }),
          // when condition is false, use batching
          false: httpBatchLink({
            url: `${getBaseUrl()}/api/trpc`,
          }),
        }),
      ],
    };
  },
  ssr: false,
  // unstable_overrides: {
  //   useMutation: {
  //     /**
  //      * This function is called whenever a `.useMutation` succeeds
  //      **/
  //     async onSuccess(opts) {
  //       /**
  //        * @note that order here matters:
  //        * The order here allows route changes in `onSuccess` without
  //        * having a flash of content change whilst redirecting.
  //        **/
  //       // Calls the `onSuccess` defined in the `useQuery()`-options:
  //       await opts.originalFn();
  //       // Invalidate all queries in the react-query cache:
  //       await opts.queryClient.invalidateQueries();
  //     },
  //   },
  // },
});
