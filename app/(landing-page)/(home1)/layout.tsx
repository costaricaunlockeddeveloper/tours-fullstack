import React from 'react';
import Header1 from '../../../client/sections/shared/header/Header1';
import Footer1 from '../../../client/sections/shared/footer/Footer1';

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='main-page-area3'>
           <Header1></Header1>
            {children}
            <Footer1></Footer1>
        </div>
    );
};

export default layout;