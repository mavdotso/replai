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

    if (!accessToken || !verifyJwt(accessToken)) {
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
                    content: `You are my ghostwriter on Linkedin. Generate a short, valuable and relevant personal comment for a LinkedIn post with your opinion. Write the comment in ${language} language. Avoid using hashtags, links, emojis. Do not repeat the words used in a post or rephrase the post. Do not thank the author for sharing the post or tell them that the post is good or interesting.`,
                },
                {
                    role: 'assistant',
                    content: `I am your ghostwriter and I will help you to generate a short and valuable personal comment in ${language} language. I will share my opinion on the topic. I will not rephrase the post or use the words used in the post, I will answer creatively. I will not use hashtags, links, emojis. I will not thank the author for sharing the post or tell them that the post is good or interesting.`,
                },
                {
                    role: 'user',
                    content: `Here is the post: ${context}`,
                },
            ],
            max_tokens: 200,
            frequency_penalty: 2,
            temperature: 1.2,
        });

        const res = response.body;

        return new NextResponse(res, { status: 200 });
    } catch (error) {
        return new NextResponse('Internal error', { status: 500 });
    }
}
