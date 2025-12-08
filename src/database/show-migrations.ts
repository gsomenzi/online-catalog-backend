import dataSource from "./data-source";

async function showMigrations() {
    try {
        await dataSource.initialize();
        console.log("Data source initialized");

        const migrations = await dataSource.showMigrations();
        console.log("Pending migrations:", migrations);

        await dataSource.destroy();
    } catch (error) {
        console.error("Error during migration show:", error);
        process.exit(1);
    }
}

showMigrations();
