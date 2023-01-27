// Takes an array for item and chunk items into matrix
// Useful for offset based pagination

export function chunk<T>(items: T[], chunk: number): T[][] {
    const chunks: T[][] = [];

    for (let index = 0; index < items.length; index += chunk) {
        chunks.push(items.slice(index, index + chunk));
    }
    return chunks;
}
