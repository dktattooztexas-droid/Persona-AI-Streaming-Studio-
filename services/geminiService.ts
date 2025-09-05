import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Creator } from "../types";

// NOTE: This is a MOCK service for demonstration.
// The GoogleGenAI SDK is not used here to avoid API key requirements in this context.
// The `generateBio` function shows a real implementation example.

/**
 * Generates a new bio for a creator based on their profile.
 * This is a real implementation example.
 */
export const generateBio = async (creator: Creator, tone: string, length: string): Promise<string> => {
    // This is a placeholder as API key is not available in the environment.
    if (!process.env.API_KEY) {
        console.warn("API_KEY environment variable not set. Using mock bio generation.");
        return `A new ${tone}, ${length} bio for ${creator.creatorName}.`;
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const modelName = 'gemini-2.5-flash';
    
    const prompt = `
        You are an expert copywriter specializing in creating engaging and professional bios for online content creators.
        Based on the following creator profile, write a new bio.

        Creator Profile:
        - Name: ${creator.creatorName}
        - Specialty: ${creator.specialty}
        - Current Bio: "${creator.bio}"
        - Follower Count: ${creator.followerCount}

        Instructions:
        - The new bio should be written in a ${tone} tone.
        - It should be approximately ${length} in length.
        - Highlight their specialty and unique appeal.
        - Do not use hashtags.
        - Return only the text for the new bio, with no extra formatting or labels.
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
        });
        const newBio = response.text;
        if (!newBio) throw new Error('API returned an empty response.');
        return newBio.trim();
    } catch (error) {
        console.error("Error generating bio with Gemini API:", error);
        return "Sorry, I couldn't generate a bio right now. Please try again later.";
    }
};


// --- Mock Functions for Image & Video Generation ---

const MOCK_FAIL_RATE = 0.3; // 30% chance to fail to test fallback

/**
 * MOCK: Simulates generating an image asset.
 * Randomly fails to demonstrate fallback mechanism.
 */
export const generateImageAsset = (prompt: string): Promise<string> => {
    console.log(`[Gemini] Attempting to generate image for prompt: "${prompt}"`);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < MOCK_FAIL_RATE) {
                console.error("[Gemini] Mock API call failed.");
                reject(new Error("Mock Gemini API failed to generate image."));
            } else {
                const seed = encodeURIComponent(prompt.slice(0, 20));
                const imageUrl = `https://picsum.photos/seed/${seed}/512/512`;
                console.log(`[Gemini] Successfully generated image: ${imageUrl}`);
                resolve(imageUrl);
            }
        }, 1500);
    });
};

/**
 * MOCK: Simulates editing an existing image asset based on a prompt.
 */
export const editImageAsset = (originalImageUrl: string, prompt: string): Promise<string> => {
    console.log(`[Gemini] Editing image "${originalImageUrl}" with prompt: "${prompt}"`);
    return new Promise((resolve) => {
        setTimeout(() => {
            // Use a new seed based on the edit prompt to get a "different" image
            const seed = encodeURIComponent(prompt.slice(0, 20) + 'edited');
            const newImageUrl = `https://picsum.photos/seed/${seed}/512/512`;
            console.log(`[Gemini] Successfully edited image. New URL: ${newImageUrl}`);
            resolve(newImageUrl);
        }, 1500);
    });
};

/**
 * MOCK: Simulates generating a video asset. This takes longer.
 */
export const generateVideo = (prompt: string): Promise<string> => {
    console.log(`[Gemini] Starting video generation for prompt: "${prompt}"`);
    return new Promise((resolve) => {
        setTimeout(() => {
            // Placeholder video URL
            const videoUrl = 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
            console.log(`[Gemini] Successfully generated video: ${videoUrl}`);
            resolve(videoUrl);
        }, 8000); // 8 seconds to simulate a longer process
    });
};

/**
 * MOCK: Simulates generating a video from a series of images.
 */
export const generateVideoFromImages = (imageUrls: string[]): Promise<string> => {
    console.log(`[Gemini] Starting video generation from ${imageUrls.length} images.`);
    return new Promise((resolve) => {
        setTimeout(() => {
             const videoUrl = 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
             console.log(`[Gemini] Successfully generated video from images: ${videoUrl}`);
             resolve(videoUrl);
        }, 6000);
    });
};