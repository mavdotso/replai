import { Configuration, OpenAIApi } from 'openai-edge';
import LanguageDetect from 'languagedetect';
import { verifyJwt } from '@/lib/jwt';
import { NextResponse } from 'next/server';

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);
const languageDetect = new LanguageDetect();

interface RequestBody {
    context: string;
}

export async function POST(req: Request): Promise<Response> {
    try {
        const accessToken = req.headers.get('accessToken');
        const body: RequestBody = await req.json();
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

        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            stream: false,
            messages: [
                {
                    role: 'system',
                    content: `As a LinkedIn ghostwriter, compose a comment that adds value and a fresh perspective to the LinkedIn post without repeating, summarizing, or rephrasing the original message.
                    Follow these guidelines: 
                    1. Begin by acknowledging the author's expertise or experience in the topic discussed.
                    2. Share your own insights, experiences, or perspectives related to the subject matter.
                    3. Avoid using hashtags, links, or emojis.
                    4. Maintain a professional and non-promotional tone, refraining from overt self-promotion. 
                    5. Structure your comment in paragraphs of 2-3 sentences each.
                    6. Keep the comment focused and relevant to the topic of the post.
                    7. Reply in ${language} language`,
                },
                {
                    role: 'user',
                    content: `Here is the post: ${context}`,
                },
            ],
            max_tokens: 300,
            frequency_penalty: 2,
            temperature: 1.2,
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let result = '';

        while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            result += decoder.decode(value);
        }

        const res = JSON.parse(result);

        return new NextResponse(JSON.stringify(res), { status: 200 });
    } catch (error) {
        console.error('Internal error:', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}
