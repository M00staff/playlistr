var Sequelize = require("sequelize");
var sequelize = new Sequelize("postgres:///playlistr_db");
//required for linux migration
// var sequelize = new Sequelize('postgres://sequelize_user:sequelize_password@localhost:5432/playlistr_db');


if (process.env.DATABASE_URL) {
  // the application is executed on Heroku ... use the postgres database
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect:  'postgres',
    protocol: 'postgres',
    logging:  true //false
  });
} else {
  // the application is executed on the local machine
  sequelize = new Sequelize("postgres:///playlistr_db");
}

var User = sequelize.import("../models/user");
var Playlist = sequelize.import("../models/playlist");

Playlist.belongsTo(User);
User.hasMany(Playlist);

module.exports = {
  Sequelize: Sequelize,
  sequelize: sequelize,
  models: {
    User: User,
    Playlist: Playlist
  }
}
