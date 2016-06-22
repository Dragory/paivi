module.exports = {
	/**
	 * Gets the "best" available name for the user, with the following priority:
	 * 1. Full name (<first> <last>)
	 * 2. First name only
	 * 3. Last name only
	 * 4. Username
	 * 5. ID
	 * @param  {object} user See https://core.telegram.org/bots/api#user
	 * @return {string}      The best available name
	 */
	get(user) {
		if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`;
		return user.first_name || user.last_name || user.username || (user.id ? user.id.toString() : null) || '???';
	},

	// Returns the first word from the full name
	// E.g. John Doe -> John
	short(user) {
		let fullNick = this.get(user).trim();
		return fullNick.split(/\s+/g)[0];
	},

	// Returns the user's username, @pinged, falling back to their full name otherwise
	// E.g. @John
	informative(user) {
		if (user.username) return '@' + user.username;
		return this.get(user);
	},

	// Returns a name directed at the user's username, falling back to their short name otherwise
	// E.g. @John:
	directed(user) {
		if (user.username) return '@' + user.username + ':';
		return this.short(user) + ':';
	}
};
