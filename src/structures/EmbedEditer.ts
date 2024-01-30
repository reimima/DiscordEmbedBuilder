import type {
    APIEmbedField,
    ChatInputCommandInteraction,
    InteractionResponse,
    Message,
} from 'discord.js';
import {
    ActionRowBuilder,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    StringSelectMenuBuilder,
} from 'discord.js';

export const officialUrl = 'https://discord.com';

const attachmentUrl = 'attachment://officialIcon.png';

const inlineFieldData: APIEmbedField = {
        name: 'Inline field title',
        value: 'Inline field value',
        inline: true,
    },
    fields: APIEmbedField[] = [
        {
            name: 'Regular field title',
            value: 'Regular field value',
        },
        { ...inlineFieldData },
        { ...inlineFieldData },
    ];

const defaultEmbed = new EmbedBuilder()
    .setColor('Default')
    .setTitle('Some title')
    .setURL(officialUrl)
    .setAuthor({ name: 'Some name', iconURL: attachmentUrl, url: officialUrl })
    .setDescription('Some description')
    .setThumbnail(attachmentUrl)
    .setImage(attachmentUrl)
    .setTimestamp()
    .setFooter({ text: 'Some text', iconURL: attachmentUrl });

export class EmbedEditer extends EmbedBuilder {
    public readonly fields: APIEmbedField[] = fields;

    public constructor(
        public readonly interaction: ChatInputCommandInteraction,
        raw = defaultEmbed.addFields(fields),
    ) {
        super(raw.toJSON());
    }

    public readonly init = async (
        override: EmbedBuilder | this | undefined = undefined,
        options = {
            components: true,
            files: true,
        },
    ): Promise<InteractionResponse | Message> =>
        await this.interaction[override ? 'editReply' : 'reply']({
            embeds: [override ? override : this],
            components: options.components ? this.buildComponents() : [],
            files: options.files
                ? [
                      new AttachmentBuilder('./src/images/officialIcon.png', {
                          name: 'officialIcon.png',
                      }),
                  ]
                : [],
        });

    public readonly buildComponents = (): [
        ActionRowBuilder<StringSelectMenuBuilder>,
        ActionRowBuilder<ButtonBuilder>,
    ] => [
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('select')
                .setPlaceholder('Build options')
                .setOptions(
                    { label: 'color', description: 'Set the color. (HEX)', value: 'color' },
                    { label: 'title', description: 'Set the title.', value: 'title' },
                    { label: 'titleURL', description: 'Set the title URL.', value: 'titleURL' },
                    {
                        label: 'author',
                        description: 'Set the author. (3 options)',
                        value: 'author',
                    },
                    {
                        label: 'description',
                        description: 'Set the description.',
                        value: 'description',
                    },
                    { label: 'thumbnail', description: 'Set the thumbnail.', value: 'thumbnail' },
                    { label: 'fields', description: 'Set the fields.', value: 'fields' },
                    { label: 'image', description: 'Set the image.', value: 'image' },
                    { label: 'timestamp', description: 'Toggle timestamp.', value: 'timestamp' },
                    {
                        label: 'footer',
                        description: 'Set the footer. (2 options)',
                        value: 'footer',
                    },
                ),
        ),
        new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId('submit')
                .setLabel('✅ Submit')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('cancel')
                .setLabel('🗑️ Cancel')
                .setStyle(ButtonStyle.Danger),
        ),
    ];
}
