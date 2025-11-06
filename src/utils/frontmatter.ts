export const AUTO_SYNC_DATABASE_KEY = "aytosync-database";

function toCandidateList(value: unknown): string[] {
    if (Array.isArray(value)) {
        return value.map(item => String(item ?? "").trim());
    }

    if (typeof value === "string") {
        if (value.includes(",")) {
            return value.split(",").map(item => item.trim());
        }
        return [value.trim()];
    }

    return [];
}

export function parseAutoSyncDatabaseList(value: unknown): string[] {
    const candidates = toCandidateList(value)
        .map(name => name.replace(/^\[|\]$/g, "").trim()) // strip stray brackets
        .filter(Boolean);

    const seen = new Map<string, string>();
    for (const name of candidates) {
        const key = name.toLowerCase();
        if (!seen.has(key)) {
            seen.set(key, name);
        }
    }

    return Array.from(seen.values());
}

export function ensureAutoSyncDatabaseEntry(value: unknown, abName: string): string[] {
    const current = parseAutoSyncDatabaseList(value);
    const lower = abName.toLowerCase();

    let contains = false;
    const updated = current.map(name => {
        if (name.toLowerCase() === lower) {
            contains = true;
            return abName;
        }
        return name;
    });

    if (!contains) {
        updated.push(abName);
    }

    return updated;
}
