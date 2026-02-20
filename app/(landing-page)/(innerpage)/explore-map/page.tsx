"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import BreadCumb from '@/client/sections/shared/common/BreadCumb';

const InteractiveMap = dynamic(
    () => import('@/components/Landing/InteractiveMap').then(mod => ({ default: mod.InteractiveMap })),
    { ssr: false, loading: () => <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontSize: '16px', color: '#64748b' }}>Loading 3D map...</div> }
);

const ExploreMapPage = () => {
    return (
        <div>
            <BreadCumb
                bgimg="/assets/img/breadcrumb/destination.jpg"
                Title="Explore Costa Rica"
            />
            <section style={{ padding: '0', margin: '0' }}>
                <div style={{ height: '80vh' }}>
                    <InteractiveMap />
                </div>
            </section>
        </div>
    );
};

export default ExploreMapPage;
