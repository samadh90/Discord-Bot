import { CommandCategoryExtra } from "./../types/commands";
import { Command, CommandCategory, CommandExec, CommandMeta } from "../types";

export function command(meta: CommandMeta, exec: CommandExec): Command {
    return {
        meta,
        exec,
    };
}

export function category(name: string, commands: Command[], extra: CommandCategoryExtra = {}): CommandCategory {
    return {
        name,
        commands,
        ...extra,
    };
}
