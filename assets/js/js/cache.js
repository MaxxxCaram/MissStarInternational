class CacheSystem {
    constructor() {
        this.cache = new Map();
    }

    set(key, value, ttl = 3600000) { // 1 hora por defecto
        this.cache.set(key, {
            value,
            expiry: Date.now() + ttl
        });
    }

    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;
        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return null;
        }
        return item.value;
    }

    clear() {
        this.cache.clear();
    }
}

export default new CacheSystem(); 