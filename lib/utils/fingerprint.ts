export const getFingerprint = (): string => {
    if (typeof window === 'undefined') {
        return 'server-side-fingerprint';
    }

    const STORAGE_KEY = 'device_fingerprint';
    const COOKIE_NAME = 'device_fingerprint';

    let fingerprint = localStorage.getItem(STORAGE_KEY);

    if (!fingerprint) {
        // Check cookie first if local storage is empty
        const match = document.cookie.match(new RegExp('(^| )' + COOKIE_NAME + '=([^;]+)'));
        if (match) {
            fingerprint = match[2];
            localStorage.setItem(STORAGE_KEY, fingerprint);
        } else {
            // Generate a simple UUID-like string
            fingerprint = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                const r = (Math.random() * 16) | 0;
                const v = c === 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            });
            localStorage.setItem(STORAGE_KEY, fingerprint);
        }
    }

    // Always ensure cookie is synced with current fingerprint
    // Set cookie for 1 year
    document.cookie = `${COOKIE_NAME}=${fingerprint}; path=/; max-age=31536000; SameSite=Lax`;

    return fingerprint;
};
