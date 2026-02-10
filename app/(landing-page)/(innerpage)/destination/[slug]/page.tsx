import React from 'react';
import DestinationDetailsView from '../../../../../client/sections/catalog/views/destination-details-view';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const page = async ({ params }: Props) => {
  const { slug } = await params;
  return (
    <DestinationDetailsView slug={slug} />
  );
};

export default page;