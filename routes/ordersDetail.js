const { OrderDetail } = require("../models/orderDetail");
const { auth, isUser, isAdmin } = require("../middleware/auth");
const cloudinary = require("../utils/cloudinary");

const router = require("express").Router();

//CREATE

router.post("/", isAdmin, async (req, res) => {
    const { name, brand, desc, price, image } = req.body;

    try {
        if (image) {
            const uploadedResponse = await cloudinary.uploader.upload(image, {
                upload_preset: "online-shop",
            });

            if (uploadedResponse) {
                const orderDetail = new OrderDetail({
                    name,
                    brand,
                    desc,
                    price,
                    image: uploadedResponse,
                });

                const savedOrderDetail = await orderDetail.save();
                res.status(200).send(savedOrderDetail);
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

//DELETE

router.delete("/:id", isAdmin, async (req, res) => {
    try {
        const orderDetail = await OrderDetail.findById(req.params.id);

        if (!orderDetail) return res.status(404).send("Product not found...");

        if (orderDetail.image.public_id) {
            const destroyResponse = await cloudinary.uploader.destroy(
                orderDetail.image.public_id
            );

            if (destroyResponse) {
                const deletedOrderDetail = await OrderDetail.findByIdAndDelete(req.params.id);

                res.status(200).send(deletedOrderDetail);
            }
        } else {
            console.log("Action terminated. Failed to deleted product image...");
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

// EDIT PRODUCT

router.put("/:id", isAdmin, async (req, res) => {
    if (req.body.orderDetailImg) {
        const destroyResponse = await cloudinary.uploader.destroy(
            req.body.orderDetail.image.public_id
        );

        if (destroyResponse) {
            const uploadedResponse = await cloudinary.uploader.upload(
                req.body.orderDetail,
                {
                    upload_preset: "fundation",
                }
            );

            if (uploadedResponse) {
                const updatedOrderDetail = await OrderDetail.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set: {
                            ...req.body.orderDetail,
                            image: uploadedResponse,
                        },
                    },
                    { new: true }
                );

                res.status(200).send(updatedOrderDetail);
            }
        }
    } else {
        try {
            const updatedOrderDetail = await OrderDetail.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body.orderDetail,
                },
                { new: true }
            );
            res.status(200).send(updatedOrderDetail);
        } catch (err) {
            res.status(500).send(err);
        }
    }
});

//GET ALL PRODUCTS

router.get("/", async (req, res) => {
    const qbrand = req.query.brand;
    try {
        let orderDetails;

        if (qbrand) {
            orderDetails = await OrderDetail.find({
                brand: qbrand,
            }).sort({ _id: -1 });
        } else {
            orderDetails = await OrderDetail.find().sort({ _id: -1 });
        }

        res.status(200).send(orderDetails);
    } catch (error) {
        res.status(500).send(error);
    }
});

//GET PRODUCT

router.get("/find/:id", async (req, res) => {
    try {
        const orderDetail = await OrderDetail.findById(req.params.id);
        res.status(200).send(orderDetail);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
