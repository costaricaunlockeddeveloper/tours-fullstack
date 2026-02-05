"use client"
import React, { useState } from 'react';
import { PurchaseStatus, PurchaseType } from './PurchaseCard';

interface FilterOptions {
    status?: PurchaseStatus | 'all';
    type?: PurchaseType | 'all';
    sortBy?: 'date-asc' | 'date-desc' | 'price-asc' | 'price-desc';
}

interface PurchaseFiltersProps {
    onFilterChange: (filters: FilterOptions) => void;
    activeFilters: FilterOptions;
}

const PurchaseFilters: React.FC<PurchaseFiltersProps> = ({ onFilterChange, activeFilters }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleStatusChange = (status: PurchaseStatus | 'all') => {
        onFilterChange({ ...activeFilters, status });
    };

    const handleTypeChange = (type: PurchaseType | 'all') => {
        onFilterChange({ ...activeFilters, type });
    };

    const handleSortChange = (sortBy: FilterOptions['sortBy']) => {
        onFilterChange({ ...activeFilters, sortBy });
    };

    const resetFilters = () => {
        onFilterChange({ status: 'all', type: 'all', sortBy: 'date-desc' });
    };

    return (
        <>
            <style jsx>{`
                .filters-container {
                    background: white;
                    border-radius: 16px;
                    padding: 20px 24px;
                    margin-bottom: 32px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
                }

                .filters-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                }

                .filters-title {
                    font-size: 16px;
                    font-weight: 700;
                    color: #1a1a1a;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .toggle-icon {
                    transition: transform 0.3s ease;
                }

                .toggle-icon.expanded {
                    transform: rotate(180deg);
                }

                .filters-content {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease;
                }

                .filters-content.expanded {
                    max-height: 500px;
                    margin-top: 20px;
                }

                .filters-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                }

                .filter-group {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .filter-label {
                    font-size: 13px;
                    font-weight: 600;
                    color: #666;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .filter-options {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }

                .filter-chip {
                    padding: 8px 16px;
                    border-radius: 10px;
                    font-size: 13px;
                    font-weight: 600;
                    border: 2px solid #e0e0e0;
                    background: white;
                    color: #666;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .filter-chip:hover {
                    border-color: #1f4d85;
                    color: #1f4d85;
                }

                .filter-chip.active {
                    background: #1f4d85;
                    border-color: #1f4d85;
                    color: white;
                }

                .filter-select {
                    padding: 10px 14px;
                    border-radius: 10px;
                    border: 2px solid #e0e0e0;
                    font-size: 14px;
                    font-weight: 500;
                    color: #1a1a1a;
                    background: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .filter-select:hover,
                .filter-select:focus {
                    border-color: #1f4d85;
                    outline: none;
                }

                .reset-button {
                    padding: 8px 16px;
                    border-radius: 10px;
                    font-size: 13px;
                    font-weight: 600;
                    border: none;
                    background: #f0f0f0;
                    color: #666;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .reset-button:hover {
                    background: #e0e0e0;
                    color: #1a1a1a;
                }

                @media (max-width: 768px) {
                    .filters-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

            <div className="filters-container">
                <div className="filters-header" onClick={() => setIsExpanded(!isExpanded)}>
                    <div className="filters-title">
                        <i className="bi bi-sliders"></i>
                        Filters & Sorting
                    </div>
                    <i className={`bi bi-chevron-down toggle-icon ${isExpanded ? 'expanded' : ''}`}></i>
                </div>

                <div className={`filters-content ${isExpanded ? 'expanded' : ''}`}>
                    <div className="filters-grid">
                        <div className="filter-group">
                            <label className="filter-label">Status</label>
                            <div className="filter-options">
                                <button
                                    className={`filter-chip ${activeFilters.status === 'all' ? 'active' : ''}`}
                                    onClick={() => handleStatusChange('all')}
                                >
                                    All
                                </button>
                                <button
                                    className={`filter-chip ${activeFilters.status === 'confirmed' ? 'active' : ''}`}
                                    onClick={() => handleStatusChange('confirmed')}
                                >
                                    Confirmed
                                </button>
                                <button
                                    className={`filter-chip ${activeFilters.status === 'pending' ? 'active' : ''}`}
                                    onClick={() => handleStatusChange('pending')}
                                >
                                    Pending
                                </button>
                            </div>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Type</label>
                            <div className="filter-options">
                                <button
                                    className={`filter-chip ${activeFilters.type === 'all' ? 'active' : ''}`}
                                    onClick={() => handleTypeChange('all')}
                                >
                                    All
                                </button>
                                <button
                                    className={`filter-chip ${activeFilters.type === 'tour' ? 'active' : ''}`}
                                    onClick={() => handleTypeChange('tour')}
                                >
                                    Tours
                                </button>
                                <button
                                    className={`filter-chip ${activeFilters.type === 'tour_package' ? 'active' : ''}`}
                                    onClick={() => handleTypeChange('tour_package')}
                                >
                                    Packages
                                </button>
                            </div>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Sort By</label>
                            <select
                                className="filter-select"
                                value={activeFilters.sortBy || 'date-desc'}
                                onChange={(e) => handleSortChange(e.target.value as FilterOptions['sortBy'])}
                            >
                                <option value="date-desc">Newest First</option>
                                <option value="date-asc">Oldest First</option>
                                <option value="price-desc">Highest Price</option>
                                <option value="price-asc">Lowest Price</option>
                            </select>
                        </div>

                        <div className="filter-group" style={{ justifyContent: 'flex-end' }}>
                            <button className="reset-button" onClick={resetFilters}>
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PurchaseFilters;
