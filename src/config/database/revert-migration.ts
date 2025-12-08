import dataSource from "./data-source";

async function revertMigration() {
    try {
        await dataSource.initialize();
        console.log("Data source initialized");

        await dataSource.undoLastMigration();
        console.log("Migration reverted successfully");

        await dataSource.destroy();
    } catch (error) {
        console.error("Error during migration revert:", error);
        process.exit(1);
    }
}

revertMigration();
