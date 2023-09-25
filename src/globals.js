const config = {
    user: 'Gathering2334', // better stored in an app setting such as process.env.DB_USER
    password: 'Qv4phQsvG5STeCGwyiLQ', // better stored in an app setting such as process.env.DB_PASSWORD
    server: 'volunteerindex.database.windows.net', // better stored in an app setting such as process.env.DB_SERVER
    port: 1433, // optional, defaults to 1433, better stored in an app setting such as process.env.DB_PORT
    database: 'VolunteerIndex', // better stored in an app setting such as process.env.DB_NAME
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
}

global.config = config;