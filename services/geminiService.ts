
import { GoogleGenAI, Chat } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateColoringPages = async (theme: string): Promise<string[]> => {
    const prompt = `A simple, black and white coloring book page for a child. The art should have very thick, bold, clean black outlines and no shading or color. The scene should be a friendly, cute ${theme}.`;
    
    try {
        // The 'imagen-4.0-generate-001' model supports a maximum of 4 images per request.
        // To generate 5 pages, we make two parallel API calls.
        const imagePromises = [
            ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: prompt,
                config: {
                    numberOfImages: 4,
                    outputMimeType: 'image/jpeg',
                    aspectRatio: '4:3',
                },
            }),
            ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: prompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/jpeg',
                    aspectRatio: '4:3',
                },
            })
        ];

        const responses = await Promise.all(imagePromises);

        const allImages = responses.flatMap(
            response => response.generatedImages?.map(img => img.image.imageBytes) || []
        );

        if (allImages.length > 0) {
            return allImages;
        }
        
        return [];
    } catch (error) {
        console.error("Error generating images:", error);
        throw new Error("Boyama sayfaları oluşturulamadı. Lütfen tekrar deneyin.");
    }
};

let chatInstance: Chat | null = null;

const getChatInstance = (): Chat => {
    if (!chatInstance) {
        chatInstance = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: 'Sen çocuklar için arkadaş canlısı, hevesli ve sabırlı bir sohbet robotusun. Adın Sparkle. Bilimden peri masallarına kadar her konuda soruları yanıtlamayı seviyorsun. Cevaplarını basit, eğlenceli ve nispeten kısa tut. Etkileşimi artırmak için emojiler kullan!',
            },
        });
    }
    return chatInstance;
};


export const sendChatMessage = async (message: string): Promise<string> => {
    try {
        const chat = getChatInstance();
        const response = await chat.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error sending chat message:", error);
        throw new Error("Sparkle şu an biraz yorgun. Lütfen bir dakika içinde tekrar deneyin!");
    }
}