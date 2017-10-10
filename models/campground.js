var mongoose = require("mongoose");


var campgroundSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    location: String,
    lat: Number,
    lng: Number,
    description: String,
    web: String,
    createdAt: { type: Date, default: Date.now },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            rel: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Campground", campgroundSchema);