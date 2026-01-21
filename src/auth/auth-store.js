const STORAGE_KEY = "ollo:auth";
const EVENT_NAME = "auth:change";

const safeJsonParse = (value) => {
    if(!value) return null;
    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
};

const dispatchAuthChange = (user) => {
    const detail = {detail: { user: user || null}};
    window.dispatchEvent(new CustomEvent(EVENT_NAME, detail));

    if(window.parent && window.parent !== window) {
        try {
            window.parent.dispatchEvent(new CustomEvent(EVENT_NAME, detail));
        } catch {
        }
    }
};

export const getAuthState = () => {
    return safeJsonParse(localStorage.getItem(STORAGE_KEY));
}

export const setAuthState = (user) => {
    const userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        label: user.label,
        route: user.route,
        LoggedInAt: user.LoggedInAt || Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    dispatchAuthChange(userData);
};

export const clearAuthState = async () => {
    try{
        await fetch("http://localhost:3000/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });
    } catch (error) {
        console.error("Logout error:", error);
    }

    localStorage.removeItem(STORAGE_KEY);
    dispatchAuthChange(null);
};

window.addEventListener("storage", (event) => {
    if(event.key !== STORAGE_KEY) return;
    dispatchAuthChange(safeJsonParse(event.newValue));
})