import { EmbedBuilder } from 'discord.js';
import type { ButtonInteraction, InteractionResponse, Message } from 'discord.js';

import type { EmbedEditer } from '../structures';
import { NoticeMessages, Structure } from '../structures';

export class ButtonManager extends Structure {
    private readonly switcher = {
        submit: async (): Promise<InteractionResponse | Message> =>
            await this.embed.init(this.embed, {
                components: false,
                files: false,
                fields: false,
            }),

        cancel: async (): Promise<Message> => await this.interaction.message.delete(),

        increment: async (): Promise<InteractionResponse | Message> => {
            if (this.embed.fields.length >= 25)
                return this.noticeMessages.createInvaild(
                    this.interaction,
                    {
                        title: 'Impossible operation',
                        description: 'The number of fields must be 25 or less.',
                    },
                    true,
                );

            await this.interaction.update({ content: null });
            this.embed.fields.push({
                name: 'Regular field title',
                value: 'Regular field value',
            });
            this.embed.setFields(this.embed.fields);

            return await this.embed.init(this.embed, {
                components: true,
                files: true,
                fields: true,
            });
        },

        decrement: async () => {
            if (this.embed.fields.length <= 1)
                return this.noticeMessages.createInvaild(
                    this.interaction,
                    {
                        title: 'Impossible operation',
                        description: 'The number of fields must be 1 or more.',
                    },
                    true,
                );

            await this.interaction.update({ content: null });
            this.embed.fields.pop();
            this.embed.setFields(this.embed.fields);

            return await this.embed.init(this.embed, {
                components: true,
                files: true,
                fields: true,
            });
        },

        back: async (): Promise<void> => {
            await this.interaction.update({ content: null });
            await this.embed.init(this.embed);
        },
    };

    private readonly noticeMessages: NoticeMessages;

    public constructor(
        private readonly interaction: ButtonInteraction,
        private readonly embed: EmbedEditer,
    ) {
        super('ButtonManager');

        this.noticeMessages = new NoticeMessages(embed);
    }

    public readonly init = async (): Promise<void> => {
        try {
            await this.switcher[this.interaction.customId as keyof typeof this.switcher]();
        } catch (e) {
            this.logger.error(e);

            await this.embed.init(
                new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('An unexpected error has occurred')
                    .setDescription('Please retry.'),
                { components: false, files: false, fields: false },
            );
        }
    };
}
