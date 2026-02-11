import React from 'react';
import Header1 from '../../../client/sections/shared/header/Header1';
import Footer1 from '../../../client/sections/shared/footer/Footer1';
import FloatingWhatsAppButton from "@/client/sections/shared/common/FloatingWhatsAppButton";

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <div className='main-page-area'>
                <Header1></Header1>
                {children}
                <Footer1></Footer1>
            </div>
            <FloatingWhatsAppButton phoneNumber="50660625364" />
        </>
    );
};

export default layout;