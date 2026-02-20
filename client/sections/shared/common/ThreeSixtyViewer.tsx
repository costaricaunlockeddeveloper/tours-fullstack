"use client"
import React, { useEffect, useRef, useState } from 'react';

interface ThreeSixtyViewerProps {
    imageUrl: string;
    onClose?: () => void;
}

const ThreeSixtyViewer: React.FC<ThreeSixtyViewerProps> = ({ imageUrl, onClose }) => {
    const viewerRef = useRef<HTMLDivElement>(null);
    const viewerInstance = useRef<any>(null);
    const isReadyRef = useRef(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!viewerRef.current) return;

        // Cleanup existing instance
        if (viewerInstance.current) {
            try { viewerInstance.current.destroy(); } catch {}
            viewerInstance.current = null;
        }

        isReadyRef.current = false;
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setIsLoading(true);
        setError(null);

        // Use requestAnimationFrame to ensure the container has been painted
        // and has real dimensions before initializing the viewer.
        const rafId = requestAnimationFrame(() => {
            const container = viewerRef.current;
            if (!container) return;

            // Double-check we have real dimensions
            const { clientWidth, clientHeight } = container;
            if (clientWidth === 0 || clientHeight === 0) {
                console.warn('360 Viewer: container has zero dimensions, retrying...');
                // Retry after a small delay
                const retryTimeout = setTimeout(() => initViewer(), 200);
                return () => clearTimeout(retryTimeout);
            }

            initViewer();
        });

        async function initViewer() {
            try {
                // Dynamic import to avoid SSR issues
                const { Viewer } = await import('@photo-sphere-viewer/core');
                await import('@photo-sphere-viewer/core/index.css');

                if (!viewerRef.current) return;

                const viewer = new Viewer({
                    container: viewerRef.current,
                    panorama: imageUrl,
                    caption: '360° View',
                    mousewheelCtrlKey: true,
                    defaultYaw: 0,
                    defaultPitch: 0,
                    loadingTxt: 'Cargando vista 360°...',
                    navbar: [
                        'zoom',
                        'move',
                        'caption',
                        'fullscreen',
                    ],
                });

                viewerInstance.current = viewer;

                viewer.addEventListener('ready', () => {
                    isReadyRef.current = true;
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                        timeoutRef.current = null;
                    }
                    setIsLoading(false);
                });

                // Fallback timeout — uses ref to avoid stale closure
                timeoutRef.current = setTimeout(() => {
                    if (!isReadyRef.current) {
                        setIsLoading(false);
                        setError('La imagen tardó demasiado en cargar. Verifica que sea una imagen panorámica 360° válida.');
                    }
                }, 15000);
            } catch (err) {
                console.error('360 Viewer init error:', err);
                setIsLoading(false);
                setError('Error al inicializar el visor 360°. Verifica que la imagen sea válida.');
            }
        }

        return () => {
            cancelAnimationFrame(rafId);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            if (viewerInstance.current) {
                try { viewerInstance.current.destroy(); } catch {}
                viewerInstance.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imageUrl]);

    return (
        <div className="three-sixty-container">
            <style jsx>{`
                .three-sixty-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    z-index: 10000;
                    background: #000;
                }
                .viewer-wrapper {
                    width: 100%;
                    height: 100%;
                }
                .close-btn {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    z-index: 10001;
                    background: rgba(0,0,0,0.5);
                    color: white;
                    border: 1px solid white;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background 0.3s;
                }
                .close-btn:hover {
                    background: rgba(255,255,255,0.2);
                }
                .viewer-status {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 10001;
                    color: white;
                    text-align: center;
                    pointer-events: none;
                }
                .viewer-spinner {
                    width: 48px;
                    height: 48px;
                    border: 4px solid rgba(255,255,255,0.2);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                    margin: 0 auto 16px;
                }
                .viewer-error {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 10001;
                    color: white;
                    text-align: center;
                    max-width: 400px;
                    padding: 24px;
                }
                .viewer-error i {
                    font-size: 48px;
                    color: #ef4444;
                    margin-bottom: 16px;
                    display: block;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
            
            <div ref={viewerRef} className="viewer-wrapper"></div>

            {/* Loading indicator */}
            {isLoading && !error && (
                <div className="viewer-status">
                    <div className="viewer-spinner"></div>
                    <p style={{ fontSize: '14px', opacity: 0.8 }}>Cargando vista 360°...</p>
                </div>
            )}

            {/* Error state */}
            {error && (
                <div className="viewer-error">
                    <i className="bi bi-exclamation-triangle-fill"></i>
                    <p style={{ fontSize: '14px', marginBottom: '16px' }}>{error}</p>
                    {onClose && (
                        <button 
                            onClick={onClose}
                            style={{
                                background: 'rgba(255,255,255,0.15)',
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.3)',
                                padding: '8px 24px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                pointerEvents: 'auto'
                            }}
                        >
                            Cerrar
                        </button>
                    )}
                </div>
            )}
            
            {onClose && (
                <button className="close-btn" onClick={onClose}>
                    <i className="bi bi-x-lg"></i>
                </button>
            )}
        </div>
    );
};

export default ThreeSixtyViewer;
