/**
 * Generates a URL-safe slug from text.
 * Normalizes unicode (accents), lowercases, replaces spaces with hyphens,
 * and strips non-alphanumeric characters.
 */
export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ /g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}
