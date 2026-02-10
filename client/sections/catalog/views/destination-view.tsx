import React from 'react';
import BreadCumb from '../../shared/common/BreadCumb';
import Destination1 from '../components/Destination/Destination1';

const DestinationView = () => {
    return (
        <div>
           <BreadCumb
                bgimg="/assets/img/breadcrumb/destination.jpg"
                Title="Destination"
            ></BreadCumb>      
            <Destination1></Destination1> 
        </div>
    );
};

export default DestinationView;
