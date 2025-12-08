const { defineConfig } = require("prisma/config");
const config = require("../src/config/config");

module.exports = defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
    },
    engine: "classic",
    datasource: {
        adapter: {
            provider: "mongodb",
            url: config.database_url,
        },
    },
});
