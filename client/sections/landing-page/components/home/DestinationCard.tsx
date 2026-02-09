import Link from 'next/link';
import React from 'react';

const DestinationCard = ({img,title,content}: {img: string; title: string; content: string}) => {
    return (
        <div className="new-top-desti-thumb">
        <img src={img} alt="img" />
        <Link href="/destination" className="icon img-popup2">
        <i className="bi bi-plus-lg"></i>
        </Link>
        <div className="content">
            <h4><Link href="/destination">{title}</Link></h4>
            <p>{content}</p>
        </div>
    </div>
    );
};

export default DestinationCard;