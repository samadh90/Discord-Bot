import {
    EmbedBuilder,
    InteractionReplyOptions,
    StringSelectMenuOptionBuilder,
    StringSelectMenuBuilder,
    ActionRowBuilder,
    APIEmbedField,
    ButtonBuilder,
    ButtonStyle,
} from "discord.js";
import CategoryRoot from "../commands";
import { chunk, createId, readId } from "../utils";

// Namespaces we will use
export const Namespaces = {
    root: "help_category_root",
    select: "help_category_select",
    action: "help_category_action",
};

export const Actions = {
    next: "+",
    back: "-",
};

const N = Namespaces;
const A = Actions;

// Generate the root and help paginator
export function getCategoryRoot(ephemeral?: boolean): InteractionReplyOptions {
    // Map the categories
    const mappedCategories = CategoryRoot.map(
        ({ name, description, emoji }) =>
            new StringSelectMenuOptionBuilder({
                label: name,
                description,
                emoji: emoji ? { name: emoji } : undefined,
                value: name,
            })
    );

    const embed = new EmbedBuilder().setTitle("Help menu").setDescription("Browse through all commands");

    const selectId = createId(N.select);

    console.log(selectId);

    const select = new StringSelectMenuBuilder()
        .setCustomId(selectId)
        .setPlaceholder("Select a category")
        .setMaxValues(1)
        .addOptions(mappedCategories);

    const component = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);

    return {
        embeds: [embed],
        components: [component],
        ephemeral,
    };
}

export function getCategoryPage(interactionId: string): InteractionReplyOptions {
    // Read the interactionId into its parts
    const [_namespace, categoryName, action, currentOffset] = readId(interactionId);

    // Map over the CategoryRoot to create a new array of chunks
    const categoryChunks = CategoryRoot.map((c) => {
        const commands: APIEmbedField[] = c.commands.map((c) => ({
            name: c.meta.name,
            value: c.meta.description,
        }));

        // Create a new array of chunks for each category
        return {
            ...c,
            commands: chunk(commands, 10),
        };
    });

    // Find the category that matches the category name
    const category = categoryChunks.find(({ name }) => name === categoryName);
    if (!category) throw new Error("Invalid interactionId; Failed to find corresponding category page!");

    // Parse the current offset into a number
    // let offset = typeof currentOffset === 'string' ? parseInt(currentOffset) : 0;
    let offset = parseInt(currentOffset as string);
    // Check if the offset is not a number
    if (isNaN(offset)) offset = 0;
    // Check if the action is the next action, and increase the offset
    if (action === A.next) offset++;
    // Check if the action is the back action, and decrease the offset
    else if (action === A.back) offset--;
    // If the offset is less than 0, set the offset to 0
    if (offset < 0) offset = 0;

    // If the category has an emoji, add it to the start of the description.
    const emoji = category.emoji ? `${category.emoji} ` : "";

    // If the category has no emoji, set the description to a default value.
    const defaultDescription = `Browse through ${category.commands.flat().length} commands in ${emoji}${category.name}`;

    // Create the embed
    const embed = new EmbedBuilder()
        .setTitle(`${emoji}${category.name} Commands`) // Set the title to the category name, with an emoji in front
        .setDescription(category.description ?? defaultDescription) // Set the description to the category description, or the default description
        .setFields(category.commands[offset]) // Set the fields to the commands in the category
        .setFooter({ text: `${offset + 1} / ${category.commands.length}` }); // Set the footer to the current page, and the total number of pages

    // Back button
    const backId = createId(N.action, category.name, A.back, offset);

    // First, we make a new instance of the ButtonBuilder class. This class
    // is used to create a new button.
    const backButton = new ButtonBuilder()
        // Next, we set the customId for the button. This is a unique
        // identifier that will be used to identify the button later.
        .setCustomId(backId)
        // Next, we set the label text for the button. This is what will be
        // shown on the button itself.
        .setLabel("Back")
        // Next, we set the style of the button. This is the color of the
        // button, as well as the emoji that will be shown on the button.
        .setStyle(ButtonStyle.Danger)
        // Finally, we set the disabled property of the button. If this
        // is set to true, the button will be disabled and will not be
        // clickable.
        .setDisabled(offset <= 0);

    // Return to root
    const rootId = createId(N.root);

    // Create a root button with the rootId as its custom ID.
    const rootButton = new ButtonBuilder()
        .setCustomId(rootId) // Set the custom ID to the root category ID
        .setLabel("Categories") // Set the label to "Categories"
        .setStyle(ButtonStyle.Secondary); // Set the style to secondary

    // Next button
    const nextId = createId(N.action, category.name, A.next, offset);

    const nextButton = new ButtonBuilder() // Create a new button builder
        .setCustomId(nextId) // Set the custom ID of the button
        .setLabel("Next") // Set the label of the button
        .setStyle(ButtonStyle.Success) // Set the style of the button
        .setDisabled(offset >= 0); // Set the disabled state of the button

    // Create a new ActionRowBuilder and assign it to the variable named "component"
    const component = new ActionRowBuilder<ButtonBuilder>()
        // Add the back, root, and next buttons to the ActionRowBuilder
        .addComponents(backButton, rootButton, nextButton);

    return {
        embeds: [embed],
        components: [component],
    };
}
