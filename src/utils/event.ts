import { Event, EventExec, EventKeys } from "../types";
import { Client } from "discord.js";

export function event<T extends EventKeys>(id: T, exec: EventExec<T>): Event<T> {
    return {
        id,
        exec,
    };
}

export function registerEvents(client: Client, events: Event<any>[]) {
    for (const event of events) {
        client.on(event.id, async (...args) => {
            // Create Props
            const props = {
                client,
                log: (...args: unknown[]) => console.log(`[Event: ${event.id}]`, ...args),
            };

            // catch uncaught errors
            try {
                await event.exec(props, ...args);
            } catch (err) {
                console.error(`[Uncaught Error]`, err);
            }
        });
    }
}
