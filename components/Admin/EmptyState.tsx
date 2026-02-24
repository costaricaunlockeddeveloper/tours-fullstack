import React from "react";

interface EmptyStateProps {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    title = "No se encontraron resultados",
    description = "Intenta con otra búsqueda o agrega un nuevo elemento.",
    icon
}) => {
    return (
        <div className="col-span-full py-20 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-2">
                {icon ? icon : (
                    <i className="bi bi-search text-3xl text-dark-5 dark:text-dark-6"></i>
                )}
            </div>
            <h3 className="text-lg font-medium text-dark dark:text-white">{title}</h3>
            <p className="text-dark-6">{description}</p>
        </div>
    );
};
