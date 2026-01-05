import React from 'react';
import Footer1 from '../../../Components/Footer/Footer1';
import Header3 from '../../../Components/Header/Header3';

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='main-page-area2'>
            <Header3></Header3>
            {children}
            <Footer1></Footer1>
        </div>
    );
};

export default layout;