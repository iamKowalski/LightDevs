const { Schema } = require('mongoose')

module.exports = {
  // User Schema
  User: new Schema({
    _id: String,
    lastRep: { type: Number, default: 0 },
    rep: { type: Number, default: 0 }
  }),

  // Guild Schema
  Guild: new Schema({
    _id: String,
    prefix: { type: String, default: process.env.PREFIX }
  })
}