export function createId(namespace: string, ...args: unknown[]): string {
    return `${namespace}:${args.join(";")}`;
}

//help_commands;1;increment
export function readId(id:string): [namespace: string, ...args: unknown[]] {
    const [namespace, ...args] = id.split(";");
    return [namespace, ...args];
}