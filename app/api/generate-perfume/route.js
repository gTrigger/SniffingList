export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { i18n } from "@/i18n";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "nvidia/nemotron-3-ultra-550b-a55b:free";
const BACKUP_MODEL = "openrouter/free";
const FALLBACK_LOCALE = "en";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url, options, retries = 3) {
    const modelsQueue = [DEFAULT_MODEL, BACKUP_MODEL];

    for (const model of modelsQueue) {
        const currentOptions = {
            ...options,
            body: JSON.stringify({
                ...JSON.parse(options.body),
                model: model
            })
        };

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const response = await fetch(url, currentOptions);

                if ([429, 502, 503, 504].includes(response.status)) {
                    if (attempt < retries) {
                        await sleep(1500);
                        continue;
                    }
                    break;
                }

                return response;
            } catch {
                if (attempt === retries) break;
                await sleep(1500);
            }
        }
    }

    return null;
}

export async function POST(request) {
    const locale = request.headers.get('accept-language') || FALLBACK_LOCALE;
    const API_KEY = process.env.OPENROUTER_API_KEY;

    try {
        const { perfumeName, id } = await request.json();

        if (!API_KEY) {
            return NextResponse.json({ error: i18n[locale]?.apiKeyMissingError }, { status: 500 });
        }

        const systemPrompt = `
            You are a strict perfume expert assistant. Your primary goal is accuracy, not helpfulness.
            Do not write any greetings, do not use markdown formatting. Return only raw JSON.
            
            CRITICAL RULES:
            1. KNOWLEDGE BASE: You are an expert. For globally famous, iconic fragrances (like Creed Aventus, Jo Malone Wood Sage & Sea Salt, Chanel No 5), you ARE expected to provide accurate naming, groups and notes from your internal knowledge. 
            2. PARTIAL & EXACT NAME MATCH: You must return a perfume whose name contains the keywords provided by the user (even if the user typed only a part of the name, like "pear and freesia" for "English Pear & Freesia").
                - STRICT KEYWORD BINDING: If the user specifies both a brand (e.g. "Heretic") and a unique query term (e.g. "Nosferatu"), the returned perfume MUST match BOTH. If the brand has no perfume matching that specific query term, you are FORBIDDEN from substituting it with a random or most popular perfume by that brand (e.g., do not return "Dirty Mango" if the user searched for "Nosferatu"). In this case, return {"error": "not_found"}.
                - CANONICAL NAME: Return the full, official name and brand. 
                - NO VIBE SEARCH: NEVER return a perfume based on its "vibe", "mood", "theme" (e.g., "gothic", "vampire", "dark") if the name does not match.
                - NO HALLUCINATING: DO NOT combine different brand names or invent collaboration perfumes (e.g. never mix "Black Phoenix Alchemy Lab" or "BPAL" with "Heretic" unless it is an officially verified, real product).
                - If you are not certain of the exact brand and name, return {"error": "not_found"}.
            3. DATA INTEGRITY:
                - BRAND and NAME: Extract strictly.
                - GROUP and NOTES: Extract ONLY if you are certain of their presence on Fragrantica.
                    - NEVER invent or hallucinate notes or groups based on the name's meaning.
                    - Only return empty arrays for truly obscure, unknown, or ambiguous fragrances or when data is not explicitly known.
                    - If you are not sure, if you are guessing or inferring from the "vibe" of the name you MUST leave the array EMPTY [].
            4. WHEN TO REJECT: If you cannot find a perfume that matches the user's input by name, return exactly: {"error": "not_found"}.
            
            EXAMPLE OF EXPECTED OUTPUT FOR VALID PERFUME:
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
                    {"id": "musk", "ru": "Мускус", "en": "Musk", "de": "Moschus"},
                    {"id": "oakmoss", "ru": "Дубовый мох", "en": "Oakmoss", "de": "Eichenmoos"}
                ]
            }
            
            EXAMPLE OF EXPECTED OUTPUT FOR VALID PERFUME IF YOU DON'T REMEMBER THE EXACT GROUPS/NOTES:
            {
                "brand": "Fantôme",
                "name": "Baba Yaga",
                "group": [],
                "notes": [],
            }
        
            EXAMPLE OF EXPECTED OUTPUT FOR INVALID INPUT:
            {"error": "not_found"}
        `;


        const siteOrigin = request.headers.get('origin') || "http://localhost:3000";

        const response = await fetchWithRetry(OPENROUTER_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": siteOrigin,
                "X-Title": "My Perfume App"
            },
            body: JSON.stringify({
                model: DEFAULT_MODEL,
                temperature: 0.1,
                top_p: 0.1,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Find the perfume data: ${perfumeName}` }
                ]
            })
        });

        const data = await response.json();

        if (!response.ok || data.error) {
            const apiError = data.error?.message;

            if (response.status === 429 || apiError.includes("ResourceExhausted") || apiError.includes("limit reached")) {
                return NextResponse.json({ error: i18n[locale]?.serviceOverloadedError }, { status: 429 });
            }

            return NextResponse.json({ error: `${i18n[locale]?.serverError}: ${apiError}` }, { status: response.status });
        }

        const rawContent = data.choices?.[0]?.message?.content?.trim();

        if (!rawContent) {
            return NextResponse.json({ error: i18n[locale]?.jsonWrongFormatError }, { status: 500 });
        }

        const cleanJsonString = rawContent.replace(/^```json\s*/i, '').replace(/```$/, '').trim();

        try {
            const parsedData = JSON.parse(cleanJsonString);

            if (parsedData.error === 'not_found') {
                return NextResponse.json({ error: i18n[locale]?.perfumeNotFoundError }, { status: 404 });
            }

            parsedData.id = id;

            return NextResponse.json(parsedData);
        } catch (parseError) {
            return NextResponse.json({ error: `${i18n[locale]?.jsonWrongFormatError}: ${parseError}`  }, { status: 500 });
        }

    } catch (error) {
        return NextResponse.json({ error: `${i18n[locale]?.getPerfumeDataError}: ${error.message}` }, { status: 500 });
    }
}