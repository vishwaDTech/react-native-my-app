const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const name = 'Super Admin';
        const email = 'superadmin@travel.com';
        const password = 'superadmin123';
        const role = 'superadmin';

        const userExists = await User.findOne({ email });

        if (userExists) {
            console.log('Super Admin already exists');
            process.exit();
        }

        await User.create({
            name,
            email,
            password,
            role
        });

        console.log('Super Admin created successfully!');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        
        process.exit();
    } catch (error) {
        console.error('Error creating Super Admin:', error.message);
        process.exit(1);
    }
};

createSuperAdmin();
