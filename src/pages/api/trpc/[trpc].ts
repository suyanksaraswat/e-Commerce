// src/pages/api/trpc/[trpc].ts
import { appRouter } from '../../../server/trpc/router';
import { createContext } from '../../../server/trpc/context';
import { createNextApiHandler } from '@trpc/server/adapters/next';

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createContext,
});
