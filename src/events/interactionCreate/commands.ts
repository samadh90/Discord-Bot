import commands from "../../commands";
import { Command } from "../../types";
import { EditReply, event, Reply } from "../../utils";

const allCommands = commands.map(({ commands }) => commands).flat();
const allCommandsMap = new Map<string, Command>(allCommands.map((command) => [command.meta.name, command]));
export default event("interactionCreate", async ({ log, client }, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    try {
        const commandName = interaction.commandName;
        const command = allCommandsMap.get(commandName);
        if (!command) {
            throw new Error(`Command ${commandName} not found.`);
        }

        await command.exec({
            client,
            interaction,
            log(...args) {
                log(`[${command.meta.name}]`, ...args);
            },
        });
    } catch (error) {
        if (interaction.deferred) {
            return interaction.editReply(EditReply.error("An error occurred while executing the command."));
        }

        return interaction.reply(Reply.error("An error occurred while executing the command."));
    }
});
