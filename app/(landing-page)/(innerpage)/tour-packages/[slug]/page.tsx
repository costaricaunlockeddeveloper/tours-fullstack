import React from 'react';
import TourPackagesDetailsView from '../../../../../client/sections/catalog/views/tour-packages-details-view';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const page = async ({ params }: Props) => {
  const { slug } = await params;
  return (
    <TourPackagesDetailsView slug={slug} />
  );
};

export default page;
