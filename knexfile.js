// Update with your config settings.
const sharedCofig = {
  migrations:{
    directory:"./data/migrations"
  },
  seeds:{
    directory:"./data/seeds"
  },
}
const sqliteConfig = {
  client: 'sqlite3',
  useNullAsDefault: true,
  pool: {
    afterCreate: (conn, done) => {
      // runs after a connection is made to the sqlite engine
      conn.run('PRAGMA foreign_keys = ON', done); // turn on FK enforcement
    }
  }
}
module.exports = {

  development: {
    ...sharedCofig,
    ...sqliteConfig,
    connection: {
      filename: './data/recipes-db.db3'
    },
  },
  testing:{
    ...sharedCofig,
    ...sqliteConfig,
    connection:{
      filename:"./data/testing.db3"
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
