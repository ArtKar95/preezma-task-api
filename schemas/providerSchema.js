const { Schema, model } = require('mongoose');

const ProviderSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
});

module.exports = model('Provider', ProviderSchema);
