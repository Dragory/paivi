let locale = 'en-US';

module.exports = {
	setLocale(newLocale) {
		locale = locale;
	},

	getLocale() {
		return locale;
	},

	formatNum(num, decimals = -1) {
		if (typeof num !== 'number') num = parseFloat(num, 10);

		let opts = {};
		if (decimals !== -1) {
			opts.minimumFractionDigits = decimals;
			opts.maximumFractionDigits = decimals;
		}

		return num.toLocaleString(locale, opts);
	}
};