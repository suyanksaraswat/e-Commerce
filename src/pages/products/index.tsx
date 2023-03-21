import type { GetStaticPathsResult, GetStaticProps } from 'next';
import { ReactElement, useEffect, useMemo } from 'react';
import type { NextPageWithLayout } from '../_app';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  Navigation,
  Pagination,
  PrimaryLayout,
  ProductsList,
} from 'components';
import { useRouter } from 'next/router';
import { trpc } from 'utils/trpc';

export const getStaticProps: GetStaticProps = async context => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale as string)),
    },
  };
};

const Products: NextPageWithLayout = () => {
  const router = useRouter();

  const { data, isLoading, isPreviousData } =
    trpc.product.fetchProducts.useQuery(undefined);

  console.log('## products-', data);

  const { page = 1 } = router.query as {
    slug: string[] | undefined;
    rate: number | undefined;
    page: number | undefined;
    price: string | undefined;
    sizes: string | string[] | undefined;
    colors: string | string[] | undefined;
  };

  const pageSize = 12;

  return (
    <div className="mx-auto items-center p-4 xl:container">
      <div className="flex gap-5">
        <div className="hidden flex-1 md:block">
          <Navigation />
        </div>
        <div className="flex-[5] rounded-lg bg-white">
          <ProductsList products={data} isLoading={isLoading} />
          <div className="flex justify-center py-5">
            <Pagination
              totalCount={data?.length}
              currentPage={Number(page)}
              pageSize={pageSize}
              onPageChange={page =>
                router.push({ query: { ...router.query, page } }, undefined, {
                  shallow: true,
                  scroll: true,
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

Products.getLayout = function getLayout(page: ReactElement) {
  return (
    <PrimaryLayout
      title="Products | Kara Shop"
      description="Products page of Kara Shop"
    >
      {page}
    </PrimaryLayout>
  );
};

export default Products;
