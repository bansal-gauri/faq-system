/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./schema/ts",
    dialect: 'postgresql',
    dbCredentials: {
        url: 'postgresql://neondb_owner:npg_XYa9tKjPDU0w@ep-gentle-pond-a8aja0d7-pooler.eastus2.azure.neon.tech/faq_system?sslmode=require'
    }
};