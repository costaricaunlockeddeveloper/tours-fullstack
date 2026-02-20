import React from 'react';

interface EmptyStateProps {
    title?: string;
    message?: string;
    icon?: string;
}

const EmptyState = ({ 
    title = "No results found", 
    message = "We couldn't find any items matching your criteria. Try adjusting your filters or check back later.", 
    icon = "bi-search" 
}: EmptyStateProps) => {
    return (
        <div className="col-12 text-center py-5 wow fadeInUp" data-wow-delay=".2s">
            <div 
                className="empty-state-wrapper" 
                style={{
                    padding: '80px 20px',
                    backgroundColor: 'rgba(0,0,0,0.02)',
                    borderRadius: '16px',
                    border: '2px dashed rgba(0,0,0,0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '300px'
                }}
            >
                <div 
                    className="icon-wrapper" 
                    style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '24px'
                    }}
                >
                    <i className={`bi ${icon}`} style={{ fontSize: '36px', color: 'var(--brand-blue, #64748b)' }}></i>
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '12px' }}>
                    {title}
                </h3>
                <p style={{ color: '#64748b', fontSize: '16px', maxWidth: '400px', margin: '0 auto', lineHeight: '1.6' }}>
                    {message}
                </p>
            </div>
        </div>
    );
};

export default EmptyState;
