const argv = process.argv;
const Umzug = require('umzug');
const DB = require('./db');

const umzug = new Umzug({
	storage: 'sequelize',
	sequelize: DB
});

const action = argv[2];

if (action === 'up') {
	umzug.pending().then(migrations => {
		umzug.execute({migrations: migrations, method: 'up'}).then(result => {
			console.log(`Migrated ${result.length} migrations`);
		});
	});
}