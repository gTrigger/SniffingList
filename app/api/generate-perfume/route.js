import { NextResponse } from 'next/server';
import { i18n } from "@/i18n";
import { fetchWithRetry } from '@/api/fetchWithRetry';
import {
    FALLBACK_LOCALE,
    FALLBACK_HOST,
    SERVER_STATUSES,
    OPENROUTER_URL,
    DEFAULT_MODEL,
    SYSTEM_PROMPT,
} from '@/api/constants';

export const dynamic = 'force-dynamic';

/**
 * Handles incoming POST requests to fetch and parse perfume details via OpenRouter LLMs.
 *
 * @param {import('next/server').NextRequest} request - The incoming HTTP request.
 * @returns {Promise<NextResponse>} JSON response containing parsed perfume data or an error payload.
 */
export async function POST(request) {
    const locale = request.headers.get('accept-language') || FALLBACK_LOCALE;

    const host = request.headers.get('host') || FALLBACK_HOST;
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const origin = request.headers.get('origin') || `${protocol}://${host}`;

    const API_KEY = process.env.OPENROUTER_API_KEY;

    try {
        const { perfumeName, id } = await request.json();

        if (!API_KEY) {
            return NextResponse.json({ error: i18n[locale]?.apiKeyMissingError }, { status: SERVER_STATUSES.InternalServerError });
        }


        const response = await fetchWithRetry(OPENROUTER_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": origin,
                "X-Title": "My Perfume App"
            },
            body: JSON.stringify({
                model: DEFAULT_MODEL,
                temperature: 0.1,
                top_p: 0.1,
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: `Find the perfume data: ${perfumeName}` }
                ]
            })
        });

        const data = await response.json();

        if (!response.ok || data.error) {
            const apiError = data.error?.message;

            if (response.status === SERVER_STATUSES.TooManyRequests || apiError.includes("ResourceExhausted") || apiError.includes("limit reached")) {
                return NextResponse.json({ error: i18n[locale]?.serviceOverloadedError }, { status: SERVER_STATUSES.TooManyRequests });
            }

            return NextResponse.json({ error: `${i18n[locale]?.serverError}: ${apiError}` }, { status: response.status });
        }

        const rawContent = data.choices?.[0]?.message?.content?.trim();

        if (!rawContent) {
            return NextResponse.json({ error: i18n[locale]?.jsonWrongFormatError }, { status: SERVER_STATUSES.InternalServerError });
        }

        const cleanJsonString = rawContent.replace(/^```json\s*/i, '').replace(/```$/, '').trim();

        try {
            const parsedData = JSON.parse(cleanJsonString);

            if (parsedData.error === 'not_found') {
                return NextResponse.json({ error: i18n[locale]?.perfumeNotFoundError }, { status: SERVER_STATUSES.NotFound });
            }

            parsedData.id = id;

            return NextResponse.json(parsedData);
        } catch (parseError) {
            return NextResponse.json({ error: `${i18n[locale]?.jsonWrongFormatError}: ${parseError}`  }, { status: SERVER_STATUSES.InternalServerError });
        }

    } catch (error) {
        return NextResponse.json({ error: `${i18n[locale]?.getPerfumeDataError}: ${error.message}` }, { status: SERVER_STATUSES.InternalServerError });
    }
}