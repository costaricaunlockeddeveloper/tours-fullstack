/**
 * Extracts a thumbnail frame from a video file using a hidden <video> + <canvas>.
 * Runs entirely in the browser before upload.
 *
 * @param videoFile - The video File object
 * @param seekTime - The time in seconds to capture the frame (default: 1)
 * @returns A JPEG File ready to be uploaded
 */
export function extractVideoThumbnail(
    videoFile: File,
    seekTime: number = 1
): Promise<File> {
    return new Promise((resolve, reject) => {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.muted = true;
        video.playsInline = true;

        const objectUrl = URL.createObjectURL(videoFile);
        video.src = objectUrl;

        let isCleanedUp = false;

        const cleanup = () => {
            if (isCleanedUp) return;
            isCleanedUp = true;
            clearTimeout(timeoutId);
            URL.revokeObjectURL(objectUrl);
            video.remove();
        };

        const timeoutId = setTimeout(() => {
            cleanup();
            reject(new Error("Timeout generating thumbnail"));
        }, 10000); // 10s timeout

        video.addEventListener("loadedmetadata", () => {
            const duration = video.duration && isFinite(video.duration) ? video.duration : 10;
            const safeTime = Math.min(seekTime, duration * 0.5);
            video.currentTime = safeTime;
        });

        video.addEventListener("seeked", () => {
            try {
                if (!video.videoWidth || !video.videoHeight) {
                    cleanup();
                    reject(new Error("Video dimensions are 0"));
                    return;
                }

                // Scale down if too large to avoid massive thumbnail payload
                const MAX_WIDTH = 1280;
                let finalWidth = video.videoWidth;
                let finalHeight = video.videoHeight;
                if (finalWidth > MAX_WIDTH) {
                    const ratio = MAX_WIDTH / finalWidth;
                    finalWidth = MAX_WIDTH;
                    finalHeight = Math.floor(finalHeight * ratio);
                }

                const canvas = document.createElement("canvas");
                canvas.width = finalWidth;
                canvas.height = finalHeight;

                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    cleanup();
                    reject(new Error("Could not get canvas 2D context"));
                    return;
                }

                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                canvas.toBlob(
                    (blob) => {
                        cleanup();
                        if (!blob) {
                            reject(new Error("Canvas toBlob returned null"));
                            return;
                        }
                        const baseName = videoFile.name.replace(/\.[^/.]+$/, "");
                        const thumbFile = new File(
                            [blob],
                            `${baseName}_thumb.jpg`,
                            { type: "image/jpeg" }
                        );
                        resolve(thumbFile);
                    },
                    "image/jpeg",
                    0.85
                );
            } catch (err) {
                cleanup();
                reject(err);
            }
        });

        video.addEventListener("error", (e) => {
            cleanup();
            reject(new Error(`Failed to load video for thumbnail extraction: ${e.message}`));
        });

        // Force load for some browsers
        video.load();
    });
}
