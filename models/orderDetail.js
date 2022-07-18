const mongoose = require("mongoose");

const OrderDerailSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        brand: { type: String, required: true },
        desc: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: Object, required: true },
    },
    { timestamps: true }
);

const OrderDetail = mongoose.model("OrderDetail", OrderDerailSchema);

exports.Product = OrderDetail;
