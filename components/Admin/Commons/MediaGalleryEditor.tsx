"use client";

import { useState } from "react";
import Image from "next/image";
import { AssetMeta, PlaceImages } from "@/services/api-service";

interface MediaGalleryEditorProps {
    images: PlaceImages;
    onChange: (images: PlaceImages) => void;
    folderName: string;   // "destino" | "tours"
    slug: string;         // Para nombrar archivos subidos
}

export default function MediaGalleryEditor({ images, onChange, folderName, slug }: MediaGalleryEditorProps) {
    const [isUploading, setIsUploading] = useState(false);

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

    const handleSecondaryUpload = async (files: FileList) => {
        setIsUploading(true);
        try {
            const newAssets: AssetMeta[] = [];
            for (const file of Array.from(files)) {
                const payload = new FormData();
                payload.append("file", file);
                payload.append("slug", slug);
                payload.append("folder", folderName);
                const res = await fetch("/api/upload", { method: "POST", body: payload });
                const data = await res.json();
                if (!data.success) throw new Error(data.message);
                newAssets.push({ path: data.url, size: file.size, typefile: file.type });
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
                            {(images.heroImage.size / 1024).toFixed(0)} KB · {images.heroImage.typefile}
                        </span>
                    </div>
                )}
            </div>

            {/* Secondary Assets */}
            <div>
                <label className="block font-medium text-dark dark:text-white mb-2 text-sm">Assets Secundarios</label>
                <div className="relative border-2 border-dashed border-stroke dark:border-dark-3 rounded-lg p-4 text-center hover:bg-gray-50 dark:hover:bg-dark-2 transition-all cursor-pointer mb-3">
                    <input
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={(e) => {
                            const files = e.target.files;
                            if (files && files.length > 0) handleSecondaryUpload(files);
                            e.target.value = "";
                        }}
                        disabled={isUploading}
                    />
                    <div className="flex items-center justify-center gap-2 text-sm text-dark dark:text-white">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        {isUploading ? "Subiendo..." : "Agregar imágenes / videos"}
                    </div>
                </div>
                {(images.secondaryAssets || []).length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {images.secondaryAssets!.map((asset, idx) => (
                            <div key={idx} className="relative group rounded-lg overflow-hidden border border-stroke shadow-sm">
                                {asset.typefile.startsWith("video/") ? (
                                    <video src={asset.path} className="w-full h-28 object-cover" muted />
                                ) : (
                                    <div className="relative w-full h-28">
                                        <Image src={asset.path} alt={`Asset ${idx + 1}`} fill className="object-cover" />
                                    </div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-0.5 flex justify-between">
                                    <span>{(asset.size / 1024).toFixed(0)} KB</span>
                                    <span>{asset.typefile.split("/")[1]}</span>
                                </div>
                                <button
                                    type="button"
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeSecondaryAsset(idx)}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
