import { InteractionReplyOptions, WebhookEditMessageOptions } from "discord.js";

export const Colors = {
    error: 0xf54242,
};

export const Reply = {
    error(message: string): InteractionReplyOptions {
        return {
            ephemeral: true,
            embeds: [
                {
                    color: Colors.error,
                    description: message,
                },
            ],
        };
    },
};

export const EditReply = {
    error(message: string): WebhookEditMessageOptions {
        return {
            embeds: [
                {
                    color: Colors.error,
                    description: message,
                },
            ],
        };
    },
};
