import React from 'react';
import CheckmarkIcon from './CheckmarkIcon';

interface ChecklistItemProps {
    text: string;
    iconColor?: string;
    iconSize?: number;
}

const ChecklistItem = ({ text, iconColor, iconSize }: ChecklistItemProps) => {
    return (
        <li>
            <CheckmarkIcon color={iconColor} size={iconSize} />
            {text}
        </li>
    );
};

export default ChecklistItem;
