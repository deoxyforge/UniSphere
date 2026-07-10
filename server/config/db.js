const mongoose = require('mongoose');

const connect = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not defined in the environment config (.env).');
  }
  await mongoose.connect(uri);
  console.log('MongoDB Atlas connected successfully.');
};

const disconnect = async () => {
  await mongoose.disconnect();
};

module.exports = {
  connect,
  disconnect,
  Schema: mongoose.Schema,
  model: mongoose.model.bind(mongoose),
  Types: mongoose.Types,
  useMongo: true
};
