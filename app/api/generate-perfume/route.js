import { NextResponse } from 'next/server';
import { i18n } from "@/i18n";

export async function POST(request) {
    try {
        const { perfumeName, id, locale } = await request.json();

        if (!process.env.NEXT_PUBLIC_OPENROUTER_API_KEY) {
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
            User: Creed Aventus
            {
              "id": 99432,
              "brand": "Creed",
              "name": "Aventus",
              "rating": 0,
              "group": [
                {"id": "chypre", "ru": "Шипровые", "en": "Chypre"},
                {"id": "fruity", "ru": "Фруктовые", "en": "Fruity"}
              ],
              "notes": [
                {"id": "pineapple", "ru": "Ананас", "en": "Pineapple"},
                {"id": "birch", "ru": "Береза", "en": "Birch"},
                {"id": "musk", "ru": "Мускус", "en": "Musk"}
              ]
            }
            
            Now, do exactly this for the query. Return ONLY valid JSON.`;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "My Perfume App"
            },
            body: JSON.stringify({
                model: "openrouter/auto",
                temperature: 0,
                top_p: 0.1,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Find the perfume data: ${perfumeName}, id: ${id}` }
                ]
            })
        });

        const data = await response.json();

        if (!response.ok || data.error) {
            return NextResponse.json({ error: `${i18n[locale]?.serverError}: ${data.error?.message}` }, { status: 500 });
        }

        let jsonString = data.choices[0].message.content.trim();

        const jsonMatch = jsonString.match(/\{[\s\S]*/);

        if (!jsonMatch) {
            return NextResponse.json({ error: i18n[locale]?.jsonWrongFormatError }, { status: 500 });
        }

        const parsedData = JSON.parse(jsonMatch[0]);

        return NextResponse.json(parsedData);
    } catch (error) {
        return NextResponse.json({ error: `${i18n[locale]?.getPerfumeDataError}: ${error.message}` }, { status: 500 });
    }
}