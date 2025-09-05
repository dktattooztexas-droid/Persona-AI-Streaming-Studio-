import { AITool } from '../types';

// This is a MOCK service to simulate an intelligent command parsing layer.
// In a real app, this could be a call to a model like Gemini with system instructions.

interface GrokResponse {
    action: 'CHAT' | 'ENHANCE_PROMPT' | 'GENERATE_IMAGE' | 'EDIT_IMAGE' | 'GENERATE_VIDEO' | 'GENERATE_VIDEO_FROM_IMAGES' | 'ERROR';
    payload?: any;
}

const enhancePrompt = (prompt: string): string => {
    return `cinematic, high detail, 8k, photorealistic, professional color grading, sharp focus, of a ${prompt}`;
};

export const processCommand = (prompt: string, activeTool: AITool, context?: any): Promise<GrokResponse> => {
    console.log(`[GrokService] Processing command: "${prompt}" with tool: ${activeTool}`);
    return new Promise(resolve => {
        setTimeout(() => {
            let response: GrokResponse;
            switch (activeTool) {
                case AITool.PROMPT_ENHANCER:
                    response = {
                        action: 'ENHANCE_PROMPT',
                        payload: enhancePrompt(prompt)
                    };
                    break;
                
                case AITool.IMAGE_EDITOR:
                    if (context?.lastImageUrl) {
                        response = { action: 'EDIT_IMAGE', payload: { prompt, imageUrl: context.lastImageUrl }};
                    } else {
                        response = { action: 'ERROR', payload: "Please generate an image before trying to edit it." };
                    }
                    break;
                
                case AITool.VIDEO_GENERATION:
                    response = { action: 'GENERATE_VIDEO', payload: prompt };
                    break;

                case AITool.PHOTO_TO_VIDEO:
                    const match = prompt.match(/(\d+)/); // Find a number in the prompt
                    const count = match ? parseInt(match[1], 10) : 0;
                    if (count > 0) {
                        response = { action: 'GENERATE_VIDEO_FROM_IMAGES', payload: { count } };
                    } else {
                        response = { action: 'ERROR', payload: "Please specify the number of recent images to use (e.g., 'create a video from the last 3 images')." };
                    }
                    break;
                
                case AITool.CHAT:
                default:
                    // In chat mode, if a user just asks to create something, we can infer it.
                    if (prompt.toLowerCase().includes('image') || prompt.toLowerCase().includes('logo') || prompt.toLowerCase().includes('photo')) {
                       response = { action: 'GENERATE_IMAGE', payload: prompt };
                    } else if (prompt.toLowerCase().includes('video')) {
                        response = { action: 'GENERATE_VIDEO', payload: prompt };
                    }
                    else {
                        response = {
                            action: 'CHAT',
                            payload: `This is a mock AI response to your message: "${prompt}". In a real app, I would provide a helpful answer.`
                        };
                    }
                    break;
            }
            console.log(`[GrokService] Responding with action:`, response);
            resolve(response);
        }, 500);
    });
};
