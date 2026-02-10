import React from 'react';
import TourDetailsView from '../../../../../client/sections/catalog/views/tour-details-view';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const page = async ({ params }: Props) => {
  const { slug } = await params;
  return (
    <TourDetailsView slug={slug} />
  );
};

export default page;