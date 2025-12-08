import dataSource from "./data-source";

async function runMigrations() {
    try {
        await dataSource.initialize();
        console.log("Data source initialized");

        await dataSource.runMigrations();
        console.log("Migrations executed successfully");

        await dataSource.destroy();
    } catch (error) {
        console.error("Error during migration run:", error);
        process.exit(1);
    }
}

runMigrations();
