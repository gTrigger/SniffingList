export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { i18n } from "@/i18n";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "openrouter/auto";
const FALLBACK_LOCALE = "en";

export async function POST(request) {
    const locale = request.headers.get('accept-language') || FALLBACK_LOCALE;
    const API_KEY = process.env.OPENROUTER_API_KEY;

    try {
        const { perfumeName, id } = await request.json();

        if (!API_KEY) {
            return NextResponse.json({ error: i18n[locale]?.apiKeyMissingError }, { status: 500 });
        }

        const systemPrompt = `
            You are a strict perfume database assistant pulling data EXCLUSIVELY from Fragrantica's olfactory pyramids.
            Your task is to recall exact notes and groups, and return STRICTLY one valid JSON object.
            Do not write any greetings, do not use markdown formatting. Return only raw JSON.
            
            CRITICAL RULES:
            1. "brand" field must contain ONLY the brand name.
            2. "name" field must contain ONLY the perfume name WITHOUT the brand.
            3. "group" must perfectly reflect Fragrantica. For groups use not more than 3 first entries, capitalized. 
            4. "notes" must perfectly reflect Fragrantica. For notes use not more than 6 first entries, capitalized. 
            
            EXAMPLE OF EXPECTED OUTPUT:
            {
              "brand": "Creed",
              "name": "Aventus",
              "rating": 0,
              "group": [
                {"id": "chypre", "ru": "Шипровые", "en": "Chypre", "de": "Chypre"},
                {"id": "fruity", "ru": "Фруктовые", "en": "Fruity", "de": "Fruchtig"}
              ],
              "notes": [
                {"id": "pineapple", "ru": "Ананас", "en": "Pineapple", "de": "Ananas"},
                {"id": "birch", "ru": "Береза", "en": "Birch", "de": "Birke"},
                {"id": "musk", "ru": "Мускус", "en": "Musk", "de": "Moschus"}
              ]
            }`;

        const siteOrigin = request.headers.get('origin') || "http://localhost:3000";

        const response = await fetch(OPENROUTER_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": siteOrigin,
                "X-Title": "My Perfume App"
            },
            body: JSON.stringify({
                model: DEFAULT_MODEL,
                temperature: 0,
                top_p: 0.1,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Find the perfume data: ${perfumeName}` }
                ]
            })
        });

        const data = await response.json();

        if (!response.ok || data.error) {
            const apiError = data.error?.message || "Unknown OpenRouter Error";
            return NextResponse.json({ error: `${i18n[locale]?.serverError}: ${apiError}` }, { status: response.status });
        }

        const rawContent = data.choices?.[0]?.message?.content?.trim();

        if (!rawContent) {
            return NextResponse.json({ error: i18n[locale]?.jsonWrongFormatError }, { status: 500 });
        }

        const cleanJsonString = rawContent.replace(/^```json\s*/i, '').replace(/```$/, '').trim();

        try {
            const parsedData = JSON.parse(cleanJsonString);

            parsedData.id = id;

            return NextResponse.json(parsedData);
        } catch (parseError) {
            return NextResponse.json({ error: `${i18n[locale]?.jsonWrongFormatError}: ${parseError}`  }, { status: 500 });
        }

    } catch (error) {
        return NextResponse.json({ error: `${i18n[locale]?.getPerfumeDataError}: ${error.message}` }, { status: 500 });
    }
}