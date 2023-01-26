import { SlashCommandBuilder } from "discord.js";
import { command } from "../../utils";
import { Configuration, OpenAIApi } from "openai";
import constants from "../../constants";

const meta = new SlashCommandBuilder()
    .setName("question")
    .setDescription("Ask the bot")
    .addStringOption((option) =>
        option
            .setName("message")
            .setDescription("Message to send back")
            .setMinLength(1)
            .setMaxLength(2000)
            .setRequired(true)
    );

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default command(meta, async ({ interaction }) => {
    try {
        const message = interaction.options.getString("message");

        const response = await openai.createCompletion({
            model: constants.openaiModels.curie,
            prompt: message,
            temperature: 0,
            max_tokens: 2000,
        });

        // get the response message from the API
        console.log(response.data.choices[0].text);

        return interaction.reply({
            ephemeral: true,
            content: response.data.choices[0].text,
        });
    } catch (error) {
        console.error(error);
        return interaction.reply({
            ephemeral: true,
            content: "Something went wrong, please try again later.",
        });
    }
});
