import React from "react";
import AnimatedButton from "@/components/ui/AnimatedButton";

interface AdminHeaderProps {
    title: string;
    description: string;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchPlaceholder?: string;
    actionLabel?: string;
    actionHref?: string;
    onActionClick?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
    title,
    description,
    searchQuery,
    setSearchQuery,
    searchPlaceholder = "Buscar...",
    actionLabel,
    actionHref,
    onActionClick
}) => {
    return (
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
                <h2 className="text-2xl font-bold text-dark dark:text-white">{title}</h2>
                <p className="text-sm text-dark-6">{description}</p>
            </div>

            <div className="relative w-full sm:w-64 md:w-80">
                <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-stroke bg-white py-2 pl-10 pr-4 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                />
                <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>

            {(actionLabel && (actionHref || onActionClick)) && (
                <div className="shrink-0">
                    {actionHref ? (
                        <AnimatedButton href={actionHref} className="flex items-center gap-2">
                            <i className="bi bi-plus-lg"></i>
                            {actionLabel}
                        </AnimatedButton>
                    ) : (
                        <button
                            onClick={onActionClick}
                            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-2.5 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                        >
                            <i className="bi bi-plus-lg"></i>
                            {actionLabel}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
