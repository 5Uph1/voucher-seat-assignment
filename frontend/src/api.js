const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export function toIsoDate(ddmmyyyy) {
    const [day, month, year] = ddmmyyyy.split('-');
    return `${year}-${month}-${day}`;
}

async function request(path, body) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const error = new Error(data.message || 'Request failed');
        error.status = response.status;
        error.errors = data.errors;
        throw error;
    }

    return data;
}

export function checkVoucher({ flightNumber, date }) {
    return request('/check', { flightNumber, date });
}

export function generateVoucher({ name, id, flightNumber, date, aircraft }) {
    return request('/generate', { name, id, flightNumber, date, aircraft });
}
