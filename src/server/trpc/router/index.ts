import { productRouter } from './product';
import { t } from '../trpc';

export const appRouter = t.router({
  product: productRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
