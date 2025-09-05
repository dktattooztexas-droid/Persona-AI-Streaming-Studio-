// This is a MOCK service to simulate using the Hugging Face API
// as a fallback for image generation.

/**
 * MOCK: Simulates generating an image with a Hugging Face model.
 * This is designed to be a reliable fallback.
 */
export const generateImageAsset = (prompt: string): Promise<string> => {
    console.log(`[HuggingFace] Generating image with fallback model for prompt: "${prompt}"`);
    return new Promise((resolve) => {
        setTimeout(() => {
            // Use a different service's URL pattern to show it's a fallback
            const seed = encodeURIComponent('hf-' + prompt.slice(0, 20));
            const imageUrl = `https://picsum.photos/seed/${seed}/512/512`;
            console.log(`[HuggingFace] Successfully generated fallback image: ${imageUrl}`);
            resolve(imageUrl);
        }, 2000);
    });
};