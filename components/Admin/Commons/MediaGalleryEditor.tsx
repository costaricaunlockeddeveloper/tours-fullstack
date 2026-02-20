import { useState, useRef } from "react";
import Image from "next/image";
import { AssetMeta, PlaceImages } from "@/services/api-service";
import { extractVideoThumbnail } from "@/lib/video-thumbnail";
import ThreeSixtyViewer from "@/client/sections/shared/common/ThreeSixtyViewer";

interface MediaGalleryEditorProps {
    images: PlaceImages;
    onChange: (images: PlaceImages) => void;
    folderName: string;
    slug: string;
}

const MEDIA_TYPE_OPTIONS: { value: 'standard' | '360' | 'video'; label: string; icon: string; accept: string; description: string }[] = [
    { value: 'standard', label: 'Imagen Estándar', icon: '🖼️', accept: 'image/*', description: 'Imagen normal para la galería' },
    { value: '360',      label: 'Foto 360°',      icon: '🌐', accept: 'image/*', description: 'Foto panorámica 360°' },
    { value: 'video',    label: 'Video',            icon: '🎬', accept: 'video/*', description: 'Video para reproducir' },
];

export default function MediaGalleryEditor({ images, onChange, folderName, slug }: MediaGalleryEditorProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [showTypeModal, setShowTypeModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [pendingMediaType, setPendingMediaType] = useState<'standard' | '360' | 'video'>('standard');
    const pendingMediaTypeRef = useRef<'standard' | '360' | 'video'>('standard');
    const [previewAsset, setPreviewAsset] = useState<AssetMeta | null>(null);

    const handleHeroUpload = async (file: File) => {
        setIsUploading(true);
        try {
            const payload = new FormData();
            payload.append("file", file);
            payload.append("slug", slug);
            payload.append("folder", folderName);
            const res = await fetch("/api/upload", { method: "POST", body: payload });
            const data = await res.json();
            if (!data.success) throw new Error(data.message);
            const heroAsset: AssetMeta = { path: data.url, size: file.size, typefile: file.type };
            onChange({ ...images, heroImage: heroAsset });
        } catch (err) {
            console.error(err);
            alert("Error subiendo Hero Image");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSecondaryUpload = async (files: FileList, mediaType: 'standard' | '360' | 'video') => {
        setIsUploading(true);
        try {
            const newAssets: AssetMeta[] = [];
            for (const file of Array.from(files)) {
                // Upload the main file
                const payload = new FormData();
                payload.append("file", file);
                payload.append("slug", slug);
                payload.append("folder", folderName);
                const res = await fetch("/api/upload", { method: "POST", body: payload });
                const data = await res.json();
                if (!data.success) throw new Error(data.message);

                let thumbnailPath: string | undefined;

                // If it's a video, extract and upload a thumbnail
                if (mediaType === 'video') {
                    try {
                        const thumbFile = await extractVideoThumbnail(file);
                        const thumbPayload = new FormData();
                        thumbPayload.append("file", thumbFile);
                        thumbPayload.append("slug", slug);
                        thumbPayload.append("folder", folderName);
                        const thumbRes = await fetch("/api/upload", { method: "POST", body: thumbPayload });
                        const thumbData = await thumbRes.json();
                        if (thumbData.success) {
                            thumbnailPath = thumbData.url;
                        } else {
                            console.warn("No se pudo subir el thumbnail del video al servidor:", thumbData.message);
                        }
                    } catch (thumbErr) {
                        console.warn("No se pudo generar thumbnail del video:", thumbErr);
                    }
                }

                newAssets.push({
                    path: data.url,
                    size: file.size,
                    typefile: file.type,
                    mediaType,
                    ...(thumbnailPath ? { thumbnailPath } : {}),
                });
            }
            onChange({
                ...images,
                secondaryAssets: [...(images.secondaryAssets || []), ...newAssets],
            });
        } catch (err) {
            console.error(err);
            alert("Error subiendo archivos");
        } finally {
            setIsUploading(false);
        }
    };

    const removeSecondaryAsset = (idx: number) => {
        onChange({
            ...images,
            secondaryAssets: (images.secondaryAssets || []).filter((_, i) => i !== idx),
        });
    };

    const updateAssetMediaType = (idx: number, newType: 'standard' | '360' | 'video') => {
        const updated = [...(images.secondaryAssets || [])];
        updated[idx] = { ...updated[idx], mediaType: newType };
        onChange({ ...images, secondaryAssets: updated });
    };

    const getMediaTypeBadge = (type?: string) => {
        switch (type) {
            case '360': return { label: '360°', color: 'bg-purple-500' };
            case 'video': return { label: 'Video', color: 'bg-red-500' };
            default: return { label: 'Std', color: 'bg-blue-500' };
        }
    };

    // Click upload area -> show type modal first
    const handleUploadAreaClick = () => {
        setShowTypeModal(true);
    };

    // User picked a type -> open file picker
    const handleTypeSelected = (type: 'standard' | '360' | 'video') => {
        setPendingMediaType(type);
        pendingMediaTypeRef.current = type; // Sync ref immediately — avoids stale closure
        setShowTypeModal(false);
        setTimeout(() => {
            if (fileInputRef.current) {
                const opt = MEDIA_TYPE_OPTIONS.find(o => o.value === type)!;
                fileInputRef.current.accept = opt.accept;
                fileInputRef.current.click();
            }
        }, 100);
    };

    return (
        <div className="space-y-6">
            {/* Hero Image */}
            <div>
                <label className="block font-medium text-dark dark:text-white mb-2 text-sm">Hero Image</label>
                <div className="relative border-2 border-dashed border-stroke dark:border-dark-3 rounded-lg p-4 text-center hover:bg-gray-50 dark:hover:bg-dark-2 transition-all cursor-pointer mb-3">
                    <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleHeroUpload(file);
                            e.target.value = "";
                        }}
                        disabled={isUploading}
                    />
                    <div className="flex items-center justify-center gap-2 text-sm text-dark dark:text-white">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {isUploading ? "Subiendo..." : "Cambiar Hero Image"}
                    </div>
                </div>
                {images.heroImage?.path && (
                    <div className="relative w-full h-40 rounded-lg overflow-hidden border border-stroke">
                        <Image src={images.heroImage.path} alt="Hero" fill className="object-cover" />
                        <span className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                            {((images.heroImage.size || 0) / 1024).toFixed(0)} KB · {images.heroImage.typefile}
                        </span>
                    </div>
                )}
            </div>

            {/* Secondary Assets */}
            <div>
                <label className="block font-medium text-dark dark:text-white mb-1 text-sm">
                    Assets Secundarios (Imágenes, 360, Videos)
                </label>
                <p className="text-xs text-gray-400 mb-3">
                    Haz clic para seleccionar el tipo de media y luego subir archivos.
                </p>

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                            handleSecondaryUpload(files, pendingMediaTypeRef.current);
                        }
                        e.target.value = "";
                    }}
                    disabled={isUploading}
                />

                {/* Upload area - click opens type modal */}
                <div
                    onClick={handleUploadAreaClick}
                    className="relative border-2 border-dashed border-stroke dark:border-dark-3 rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-dark-2 transition-all cursor-pointer mb-3"
                >
                    <div className="flex flex-col items-center justify-center gap-2 text-sm text-dark dark:text-white">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        {isUploading ? "Subiendo..." : "Clic o arrastra archivos (múltiples)"}
                    </div>
                </div>

                {/* Media Type Selection Modal */}
                {showTypeModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowTypeModal(false)}>
                        <div className="bg-white dark:bg-gray-dark rounded-xl shadow-2xl p-6 w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
                            <h4 className="text-lg font-bold text-dark dark:text-white mb-2">
                                Seleccionar Tipo de Media
                            </h4>
                            <p className="text-xs text-gray-400 mb-4">
                                ¿Qué tipo de archivo vas a subir?
                            </p>
                            <div className="space-y-2">
                                {MEDIA_TYPE_OPTIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => handleTypeSelected(opt.value)}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-stroke dark:border-dark-3 hover:border-primary hover:bg-primary/5 transition-all text-left"
                                    >
                                        <span className="text-2xl">{opt.icon}</span>
                                        <div>
                                            <span className="block text-sm font-semibold text-dark dark:text-white">{opt.label}</span>
                                            <span className="block text-xs text-gray-400">{opt.description}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowTypeModal(false)}
                                className="mt-4 w-full text-center text-sm text-gray-400 hover:text-dark dark:hover:text-white transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}

                {/* Preview Modal for Assets */}
                {previewAsset && (
                    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999]" onClick={() => setPreviewAsset(null)}>
                        <button className="absolute top-4 right-4 text-white hover:text-gray-300 z-10000" onClick={(e) => { e.stopPropagation(); setPreviewAsset(null); }}>
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <div className="relative w-[90%] h-[80vh] flex items-center justify-center bg-black/50 rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                            {(previewAsset.typefile?.startsWith("video/") || previewAsset.mediaType === 'video') ? (
                                <video src={previewAsset.path} controls autoPlay className="w-full h-full object-contain" />
                            ) : previewAsset.mediaType === '360' ? (
                                <div className="absolute inset-0">
                                    <ThreeSixtyViewer imageUrl={previewAsset.path} onClose={() => setPreviewAsset(null)} />
                                </div>
                            ) : (
                                <div className="relative w-full h-full">
                                    <Image src={previewAsset.path} alt="Preview" fill className="object-contain" />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Preview of uploaded secondary assets */}
                {(images.secondaryAssets || []).length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {images.secondaryAssets!.map((asset, idx) => {
                            const badge = getMediaTypeBadge(asset.mediaType);
                            return (
                                <div 
                                    key={idx} 
                                    className="relative group rounded-lg overflow-hidden border border-stroke shadow-sm cursor-pointer"
                                    onClick={() => setPreviewAsset(asset)}
                                >
                                    { (asset.typefile?.startsWith("video/") || asset.mediaType === 'video') ? (
                                        <div className="relative w-full h-28">
                                            {asset.thumbnailPath ? (
                                                <Image src={asset.thumbnailPath} alt={`Video thumbnail ${idx + 1}`} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                                    <span className="text-white text-2xl">🎬</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <span className="text-white text-xl">▶</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative w-full h-28">
                                            <Image src={asset.path} alt={`Asset ${idx + 1}`} fill className="object-cover" />
                                        </div>
                                    )}

                                    {/* Media Type Badge */}
                                    <span className={`absolute top-1 left-1 ${badge.color} text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm`}>
                                        {badge.label}
                                    </span>

                                    {/* Bottom info bar */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs px-2 py-1.5 flex justify-between items-center pointer-events-none">
                                        <span>{(asset.size ? (asset.size / 1024).toFixed(0) : '0')} KB</span>
                                        <span className="truncate max-w-[90px] text-right opacity-80" title={asset.typefile}>{asset.typefile || 'unknown'}</span>
                                    </div>

                                    {/* Delete button */}
                                    <button
                                        type="button"
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md z-10"
                                        onClick={(e) => { e.stopPropagation(); removeSecondaryAsset(idx); }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
