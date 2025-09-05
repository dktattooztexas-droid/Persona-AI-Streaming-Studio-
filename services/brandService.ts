import { BrandKit, Creator } from '../types';

// NOTE: This is a MOCK service for demonstration.

/**
 * MOCK: Fetches the brand kit for a given creator.
 */
export const getBrandKit = (creator: Creator): Promise<BrandKit> => {
    console.log(`[BrandService] Fetching brand kit for ${creator.creatorName}`);
    return new Promise((resolve) => {
        setTimeout(() => {
            const kit: BrandKit = {
                colors: {
                    primary: '#f59e0b', // amber-500
                    secondary: '#38bdf8', // sky-400
                    accent: '#f472b6', // pink-400
                    text: '#f3f4f6', // gray-100
                },
                logos: [
                    `https://picsum.photos/seed/${creator.id}-logo1/200/200`,
                    `https://picsum.photos/seed/${creator.id}-logo2/200/200`,
                ],
                fonts: {
                    heading: 'Orbitron, sans-serif',
                    body: 'Roboto, sans-serif',
                },
                slogan: 'Riding the vaporwave into digital sunsets.'
            };
            resolve(kit);
        }, 800);
    });
};

/**
 * MOCK: Generates new brand elements using an AI model.
 */
export const generateBrandAsset = (prompt: string): Promise<string[]> => {
    console.log(`[BrandService] Generating brand asset for prompt: "${prompt}"`);
    return new Promise((resolve) => {
        setTimeout(() => {
            // In a real app, this would call Gemini to generate colors, fonts, etc.
            const newColors = ['#8b5cf6', '#ec4899', '#10b981', '#eab308'];
            resolve(newColors);
        }, 1200);
    });
};
