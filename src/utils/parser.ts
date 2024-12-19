export interface TranslationEntry {
    key: string
    contents: string[]
}

export function parse(content: string) {
    const lines = content.split(/[\r\n]+/).slice(1, -1);
    const entries: TranslationEntry[] = []
    for (const line of lines) {
        try {
            const rawLine = line.trim();
            if (!rawLine || rawLine.startsWith("--")) {
                continue;
            }
            if (rawLine.startsWith('"')) {
                entries[entries.length - 1].contents.push(rawLine.slice(1).replace(/\"\s*[.,]*$/, ''));
            } else if (rawLine.includes('=')) {
                const [key, value] = rawLine.split('=').map(x => x.trim());
                entries.push({key: key, contents: [value.slice(1).replace(/\"\s*[.,]*$/, '')]});
            }
        } catch (e) {
            console.log(e, entries.length)
        }
    }
    return entries;
}

export function save(filename: string, entries: TranslationEntry[]): string {
    const varName = filename.slice(0, filename.lastIndexOf('.'));
    let fileContent = varName + ` = {\n`
    for (const entry of entries) {
        fileContent += `${entry.key} = "${entry.contents.join('"..\n"')}",\n`
    }
    fileContent += `}\n`
    return fileContent
}