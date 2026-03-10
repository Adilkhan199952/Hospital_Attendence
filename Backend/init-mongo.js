// MongoDB initialization script for Docker
db = db.getSiblingDB('hospital_attendance');

// Create collections
db.createCollection('users');
db.createCollection('attendances');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.attendances.createIndex({ "userId": 1, "date": 1 }, { unique: true });
db.attendances.createIndex({ "date": 1 });
db.attendances.createIndex({ "status": 1 });

print('Database initialized successfully!');