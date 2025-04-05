import { readdir } from 'fs/promises';
import { join } from 'path';
import type { PageServerLoad } from './$types';
import type { GalleryImage, PageData } from '$lib/types';

export const load = (async () => {
    try {
        // Update this path to match your project structure
        // This should point to your public/static folder where images are stored
        const galleryPath = join(process.cwd(), 'static', 'gallery');

        // Get all files in the gallery directory
        const files = await readdir(galleryPath);

        // Filter for image files only
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
        const imageFiles = files.filter(file => {
            const ext = file.substring(file.lastIndexOf('.')).toLowerCase();
            return imageExtensions.includes(ext);
        });

        // Create image objects with paths and alt text
        const images: GalleryImage[] = imageFiles.map(file => {
            const src = `/gallery/${file}`;
            const alt = file.split('.')[0].replace(/-/g, ' ');
            return { src, alt };
        });

        return {
            images
        } satisfies PageData;
    } catch (error) {
        console.error('Error loading gallery images:', error);
        return {
            images: []
        } satisfies PageData;
    }
}) satisfies PageServerLoad;