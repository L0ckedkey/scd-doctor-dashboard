// utils/api.js
export const API_BASE = process.env.NEXT_PUBLIC_API_URL; // biar gampang ganti env

export async function apiFetch(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;

    const defaultHeaders = {
        "Content-Type": "application/json",
    };

    const res = await fetch(url, {
        ...options,
        headers: { ...defaultHeaders, ...options.headers },
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Something went wrong");
    }

    return res.json();
}
