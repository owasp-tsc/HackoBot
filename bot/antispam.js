const Discord = require('discord.js');
const { EventEmitter } = require('events');
class AntiSpamClient extends EventEmitter {
	constructor(options) {
		super();
		this.options = {

			warnThreshold: options.warnThreshold || 3,
			kickThreshold: options.kickThreshold || 5,
			banThreshold: options.banThreshold || 7,

			maxInterval: options.maxInterval || 5000,
			maxDuplicatesInterval: options.maxDuplicatesInterval || 5000,

			maxDuplicatesWarn: options.maxDuplicatesWarn || 4,
			maxDuplicatesKick: options.maxDuplicatesKick || 6,
			maxDuplicatesBan: options.maxDuplicatesBan || 8,

			warnMessage: options.warnMessage || '{@user}, Please stop spamming.',
			kickMessage: options.kickMessage || '**{user_tag}** has been kicked for spamming.',
			banMessage: options.banMessage || '**{user_tag}** has been banned for spamming.',

			errorMessages: options.errorMessages || true,
			kickErrorMessage: options.kickErrorMessage || 'Could not kick **{user_tag}** because of improper permissions.',
			banErrorMessage: options.banErrorMessage || 'Could not ban **{user_tag}** because of improper permissions.',

			ignoredMembers: options.ignoredMembers || [],
			ignoredRoles: options.ignoredRoles || [],
			ignoredChannels: options.ignoredChannels || [],
			ignoredPermissions: options.ignoredPermissions || [],
			ignoreBots: options.ignoreBots || true,

			warnEnabled: options.warnEnabled || true,
			kickEnabled: options.kickEnabled || true,
			banEnabled: options.banEnabled || true,

			deleteMessagesAfterBanForPastDays: options.deleteMessagesAfterBanForPastDays || 1,
			verbose: options.verbose || false,
			debug: options.debug || false,
			removeMessages: options.removeMessages || true,
		};

		this.cache = {
			messages: [],
			warnedUsers: [],
			kickedUsers: [],
			mutedUsers: [],
			bannedUsers: [],
		};
	}

	format(string, message) {
		if (typeof string === 'string') {
			return string
				.replace(/{@user}/g, message.author.toString())
				.replace(/{user_tag}/g, message.author.tag)
				.replace(/{server_name}/g, message.guild.name);
		}
		else {
			const embed = new Discord.MessageEmbed(string);
			if (embed.description) embed.setDescription(this.format(embed.description, message));
			if (embed.title) embed.setTitle(this.format(embed.title, message));
			if (embed.footer && embed.footer.text) embed.footer.text = this.format(embed.footer.text, message);
			if (embed.author && embed.author.name) embed.author.name = this.format(embed.author.name, message);
			return embed;
		}
	}

	async clearSpamMessages(messages, client) {
		console.log('clearing');
		messages.forEach((message) => {
			const channel = client.channels.cache.get(message.channelID);
			if (channel) {
				const msg = channel.messages.cache.get(message.messageID);
				console.log(msg.deletable);
				if (msg && msg.deletable) msg.delete();
			}
		});
	}

	async banUser(message, member, spamMessages) {
		if (this.options.removeMessages && spamMessages) {
			this.clearSpamMessages(spamMessages, message.client);
		}
		this.cache.messages = this.cache.messages.filter((u) => u.authorID !== message.author.id);
		this.cache.bannedUsers.push(message.author.id);
		if (!member.bannable) {
			if (this.options.verbose) {
				console.log(`DAntiSpam (banUser#userNotBannable): ${message.author.tag} (ID: ${message.author.id}) could not be banned, insufficient permissions`);
			}
			if (this.options.errorMessages) {
				message.channel.send(this.format(this.options.banErrorMessage, message)).catch((e) => {
					if (this.options.verbose) {
						console.error(`DAntiSpam (banUser#sendMissingPermMessage): ${e.message}`);
					}
				});
			}
			return false;
		}
		else {
			await message.member.ban({
				reason: 'Spamming!',
				days: this.options.deleteMessagesAfterBanForPastDays,
			});
			if (this.options.errorMessages) {
				message.channel.send(this.format(this.options.banErrorMessage, message)).catch((e) => {
					if (this.options.verbose) {
						console.error(`DAntiSpam (banUser#sendSuccessMessage): ${e.message}`);
					}
				});
			}
			this.emit('banAdd', member);
			return true;
		}
	}

	async kickUser(message, member, spamMessages) {
		if (this.options.removeMessages && spamMessages) {
			this.clearSpamMessages(spamMessages, message.client);
		}
		this.cache.messages = this.cache.messages.filter((u) => u.authorID !== message.author.id);
		this.cache.kickedUsers.push(message.author.id);
		if (!member.kickable) {
			if (this.options.verbose) {
				console.log(`DAntiSpam (kickUser#userNotKickable): ${message.author.tag} (ID: ${message.author.id}) could not be kicked, insufficient permissions`);
			}
			if (this.options.errorMessages) {
				message.channel.send(this.format(this.options.kickErrorMessage, message)).catch((e) => {
					if (this.options.verbose) {
						console.error(`DAntiSpam (kickUser#sendMissingPermMessage): ${e.message}`);
					}
				});
			}
			return false;
		}
		else {
			await message.member.kick('Spamming!');
			if (this.options.kickMessage) {
				message.channel.send(this.format(this.options.kickMessage, message)).catch((e) => {
					if (this.options.verbose) {
						console.error(`DAntiSpam (kickUser#sendSuccessMessage): ${e.message}`);
					}
				});
			}
			this.emit('kickAdd', member);
			return true;
		}
	}

	async warnUser(message, member, spamMessages) {
		if (this.options.removeMessages && spamMessages) {
			this.clearSpamMessages(spamMessages, message.client);
		}
		this.cache.warnedUsers.push(message.author.id);
		if (this.options.warnMessage) {
			message.channel.send(this.format(this.options.warnMessage, message)).catch((e) => {
				if (this.options.verbose) {
					console.error(`DAntiSpam (warnUser#sendSuccessMessage): ${e.message}`);
				}
			});
		}
		this.emit('warnAdd', member);
		return true;
	}

	/**
	 * Checks a message.
	 * @param {Discord.Message} message The message to check.
	 * @returns {Promise<boolean>} Whether the message has triggered a threshold.
	 * @example
	 * client.on('message', (msg) => {
	 * 	antiSpam.message(msg);
	 * });
	 */
	async message(message) {
		const { options } = this;
		if (
			!message.guild ||
			message.author.id === message.client.user.id ||
			(message.guild.ownerID === message.author.id && !options.debug) ||
			(options.ignoreBots && message.author.bot)
		) {
			return false;
		}

		const isMemberIgnored = typeof options.ignoredMembers === 'function' ? options.ignoredMembers(message.member) : options.ignoredMembers.includes(message.author.id);
		if (isMemberIgnored) return false;

		const isChannelIgnored = typeof options.ignoredChannels === 'function' ? options.ignoredChannels(message.channel) : options.ignoredChannels.includes(message.channel.id);
		if (isChannelIgnored) return false;

		const member = message.member || await message.guild.members.fetch(message.author);

		const memberHasIgnoredRoles = typeof options.ignoredRoles === 'function'
			? options.ignoredRoles(member.roles.cache)
			: options.ignoredRoles.some((r) => member.roles.cache.has(r));
		if (memberHasIgnoredRoles) return false;

		if (options.ignoredPermissions.some((permission) => member.hasPermission(permission))) return false;

		const currentMessage = {
			messageID: message.id,
			guildID: message.guild.id,
			authorID: message.author.id,
			channelID: message.channel.id,
			content: message.content,
			sentTimestamp: message.createdTimestamp,
		};
		this.cache.messages.push(currentMessage);

		const cachedMessages = this.cache.messages.filter((m) => m.authorID === message.author.id && m.guildID === message.guild.id);

		const duplicateMatches = cachedMessages.filter((m) => m.content === message.content && (m.sentTimestamp > (currentMessage.sentTimestamp - options.maxDuplicatesInterval)));
		const spamOtherDuplicates = [];
		if (duplicateMatches.length > 0) {
			let rowBroken = false;
			cachedMessages.sort((a, b) => b.sentTimestamp - a.sentTimestamp).forEach(element => {
				if (rowBroken) return;
				if (element.content !== duplicateMatches[0].content) rowBroken = true;
				else spamOtherDuplicates.push(element);
			});
		}

		const spamMatches = cachedMessages.filter((m) => m.sentTimestamp > (Date.now() - options.maxInterval));

		let sanctioned = false;
		const userCanBeBanned = options.banEnabled && !this.cache.bannedUsers.includes(message.author.id) && !sanctioned;
		if (userCanBeBanned && (spamMatches.length >= options.banThreshold)) {
			// message.channel.send(`${message.author.username},You are Banned`);
			this.banUser(message, member, spamMatches);
			sanctioned = true;
		}
		else if (userCanBeBanned && (duplicateMatches.length >= options.maxDuplicatesBan)) {
			// message.channel.send(`${message.author.username},You are Banned`);
			this.banUser(message, member, [...duplicateMatches, ...spamOtherDuplicates]);
			sanctioned = true;
		}

		const userCanBeKicked = options.kickEnabled && !this.cache.kickedUsers.includes(message.author.id) && !sanctioned;
		if (userCanBeKicked && (spamMatches.length >= options.kickThreshold)) {
			// message.channel.send(`${message.author.username},You are Kicked`);
			this.kickUser(message, member, spamMatches);
			sanctioned = true;
		}
		else if (userCanBeKicked && (duplicateMatches.length >= options.maxDuplicatesKick)) {
			// message.channel.send(`${message.author.username},You are Kicked`);
			this.kickUser(message, member, [...duplicateMatches, ...spamOtherDuplicates]);
			sanctioned = true;
		}

		const userCanBeWarned = options.warnEnabled && !this.cache.warnedUsers.includes(message.author.id) && !sanctioned;
		if (userCanBeWarned && (spamMatches.length >= options.warnThreshold)) {
			this.warnUser(message, member, spamMatches);
			sanctioned = true;
		}
		else if (userCanBeWarned && (duplicateMatches.length >= options.maxDuplicatesWarn)) {
			this.warnUser(message, member, [...duplicateMatches, ...spamOtherDuplicates]);
			sanctioned = true;
		}

		return sanctioned;
	}

	reset() {
		this.cache = {
			messages: [],
			warnedUsers: [],
			kickedUsers: [],
			mutedUsers: [],
			bannedUsers: [],
		};
	}
}

module.exports = AntiSpamClient;