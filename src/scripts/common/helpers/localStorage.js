export const setLocalStorage = (key, items) =>
    localStorage.setItem(key, JSON.stringify(items));

export const getLocalStorage = (key) => {
    const storageItems = localStorage.getItem(key);

    if (storageItems) return JSON.parse(storageItems);

    return null;
};

export const clearLocalStorage = (key) => {
    localStorage.removeItem(key);
};

export const setCookie=()=>{

}
