import { StringSelectMenuInteraction } from "discord.js";
import { getCategoryPage, getCategoryRoot, Namespaces } from "../../pages/help";
import { createId, EditReply, event, readId, Reply } from "../../utils";

export default event("interactionCreate", async ({ log }, interaction) => {
    if (!interaction.isButton() && !interaction.isStringSelectMenu()) return;
    
    const [namespace] = readId(interaction.customId);

    // If namespace not in help pages stop
    if (!Object.values(Namespaces).includes(namespace)) return;

    try {
        // Defer update
        await interaction.deferUpdate();

        switch (namespace) {
            case Namespaces.root:
                return await interaction.editReply(getCategoryRoot());
            case Namespaces.select:
                // Get the ID of the selected option
                const value = (interaction as StringSelectMenuInteraction).values[0];
                // Create a new ID from the option ID
                const newId = createId(Namespaces.select, value);
                // Get the category page for the new ID
                return await interaction.editReply(getCategoryPage(newId));
            case Namespaces.action:
                return await interaction.editReply(getCategoryPage(interaction.customId));

            default:
                throw new Error("Invalid namespace reached...");
        }
    } catch (error) {
        log("[Help Error]", error);

        if (interaction.deferred) return interaction.editReply(EditReply.error("Something went wrong :("));

        return interaction.reply(Reply.error("Something went wrong :("));
    }
});
