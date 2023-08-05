import { Configuration, OpenAIApi } from 'openai-edge';
import LanguageDetect from 'languagedetect';
import { verifyJwt } from '@/lib/jwt';
import { NextResponse } from 'next/server';

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);
const languageDetect = new LanguageDetect();

export const runtime = 'edge';

export async function POST(req, res) {
    const accessToken = await req.headers.get('accessToken');
    const body = await req.json();
    const { context } = body; // Message context

    const isVerified = await verifyJwt(accessToken);

    if (!accessToken || !isVerified) {
        return new NextResponse('Unauthorised', { status: 401 });
    }

    if (!context) {
        return new NextResponse('Context is required', { status: 400 });
    }

    // Detecting language
    const detectLanguage = languageDetect.detect(context, 1);
    const language = detectLanguage[0][0];

    try {
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            stream: false,
            messages: [
                {
                    role: 'system',
                    content: `You are my ghostwriter on Linkedin. Generate a valuable and relevant personal comment for a LinkedIn post with your opinion. Write the comment in ${language} language. Avoid using hashtags, links, emojis. Do not repeat the words used in a post or rephrase the post. Do not thank the author for sharing the post or tell them that the post is good or interesting. Follow these principles: 
                    1. Acknowledge the original poster and their message to provide context for what you’re saying.
                    2. Add your own insight and opinion to provide a fresh perspective or additional information.
                    3. Rather than "selling", add value.
                    4. Don’t be a salesy douche.
                    5. Make paragraphs 2–3 sentences long and use double breaks (\r\n\) for line breaks.
                    6. Keep it on topic.`,
                },
                {
                    role: 'user',
                    content: `Here is the post: ${context}`,
                },
            ],
            max_tokens: 400,
            frequency_penalty: 2,
            temperature: 1.2,
        });

        const res = response.body;

        return new NextResponse(res, { status: 200 });
    } catch (error) {
        return new NextResponse('Internal error', { status: 500 });
    }
}
