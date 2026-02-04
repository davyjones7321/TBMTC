const mongoose = require('mongoose');
const ContactQuery = require('./models/ContactQuery');
const dotenv = require('dotenv');

dotenv.config();

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        // Update all documents that are missing 'subject'
        const result = await ContactQuery.updateMany(
            { subject: { $exists: false } },
            { $set: { subject: 'general' } }
        );

        console.log(`Migrated ${result.modifiedCount} documents.`);

        // Also fix status if missing
        const result2 = await ContactQuery.updateMany(
            { status: { $exists: false } },
            { $set: { status: 'new' } }
        );
        console.log(`Fixed status for ${result2.modifiedCount} documents.`);

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

migrate();
