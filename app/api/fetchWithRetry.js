import {
    BASE_DELAY,
    JITTER_RANGE,
    MAX_RETRIES,
    SERVER_STATUSES_TO_RETRY,
    MODELS_QUEUE,
} from './constants';

/**
 * Generates an asynchronous delay.
 *
 * @param {number} ms - Delay duration in milliseconds.
 * @returns {Promise<void>}
 */
export const sleep = (ms= BASE_DELAY) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Executes a fetch request with fallback model (if target model is not accessible) and exponential delay with jitter.
 *
 * @param {string} url - The target API endpoint URL.
 * @param {RequestInit} options - The fetch configuration options.
 * @param {number} maxRetries - Maximum number of retry attempts per model.
 * @param {number} baseDelay - Base delay in milliseconds for backoff calculations.
 * @returns {Promise<Response | null>} - Returns fetch Response object if successful, otherwise null.
 */
export async function fetchWithRetry(
    url,
    options,
    maxRetries = MAX_RETRIES,
    baseDelay = BASE_DELAY
) {
    let baseRequestBody;

    try {
        baseRequestBody = JSON.parse(options.body);
    } catch (err) {
        throw new Error(err.message, { cause: err });
    }

    for (const model of MODELS_QUEUE) {
        const currentOptions = {
            ...options,
            body: JSON.stringify({ ...baseRequestBody, model })
        };

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            const retryDelay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * JITTER_RANGE;

            try {
                const response = await fetch(url, currentOptions);

                if (SERVER_STATUSES_TO_RETRY.includes(response.status)) {
                    if (attempt < maxRetries) {
                        await sleep(retryDelay);
                        continue;
                    }

                    break;
                }

                return response;
            } catch {
                if (attempt === maxRetries) break;

                await sleep(retryDelay);
            }
        }
    }

    return null;
}