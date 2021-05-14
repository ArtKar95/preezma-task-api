const { Schema, model, Types } = require('mongoose');

const ClientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  providers: [
    {
      type: Types.ObjectId,
      uniqueItems: true,
      ref: 'Provider',
    },
  ],
});

module.exports = model('Client', ClientSchema);
