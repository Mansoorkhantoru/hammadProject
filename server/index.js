const express = require("express")
const app = express();
const Product = require("./model/products")
const OrderPlace = require("./model/Order")
const cors = require("cors")
app.use(cors())
const dotenv = require("dotenv")
dotenv.config();
const connect = require("./config/config")
connect()
const { upload, cloudinary } = require("./config/cloudinary")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.send("hello")
})

app.get("/allproduct", async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 })
        res.json({
            success: true,
            count: products.length,
            products
        })
    } catch (error) {
        console.error(error.message)
    }
})

app.get("/allproduct/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        res.json({ product })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

app.delete("/allproduct/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.json({ success: true, message: "Product Deleted" })
    } catch (error) {
        res.status(500).json({ succes: false, message: error.message })
    }
})

app.post("/addproduct", upload.single('image'), async (req, res) => {
    try {
        const { name, price, discountPrice, description, requiresPrescription } = req.body;

        if (!name || !price || !discountPrice) {
            return res.status(400).json({
                message: "Please fill all required input"
            })
        }
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please Upload an image"
            })
        }
        const produt = await Product.create({
            name, price, discountPrice, description,
            imageUrl: req.file.path || req.file.secure_url,
            publicId: req.file.filename || req.file.public_id,
            requiresPrescription: requiresPrescription === "true"
        })
        console.log("File uploaded:", req.file);
        res.json({
            success: true,
            message: "Succefully Added"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

app.post("/order", upload.single('prescription'), async (req, res) => {
    try {
        let { items, address, phone, email, name } = req.body;

        if (!items || !address || !phone) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        if (typeof items === "string") {
            items = JSON.parse(items);
        }

        let prescriptionRequired = false;
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (product && product.requiresPrescription) {
                prescriptionRequired = true;
                break;
            }
        }

        if (prescriptionRequired && !req.file) {
            return res.status(400).json({
                success: false,
                message: "Prescription is required for this order"
            });
        }

        const order = await OrderPlace.create({
            items,
            address,
            phone,
            email,
            name,
            prescription: req.file ? req.file.path || req.file.secure_url : null,
            status: "Pending" // Default status
        });

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

app.get("/allorders", async (req, res) => {
    try {
        const orders = await OrderPlace.find().sort({ createdAt: -1 })
        res.json({
            success: true,
            orders
        })
    } catch (error) {
        console.error(error.message)
    }
})

app.delete("/allorders/:id", async (req, res) => {
    try {
        const deleteOrder = await OrderPlace.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Order Deleted", deleteOrder })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
})

app.post("/admin/login", (req, res) => {
    const { username, password } = req.body
    if (username === "admin" && password === "12345") {
        return res.json({
            success: true,
            message: "Login successful"
        })
    }
    return res.status(401).json({
        success: false,
        message: "Invalid credentials"
    })
})

// ✅ Updated status endpoint with all status options
app.put("/allorders/:id/status", async (req, res) => {
    try {
        const { status } = req.body;
        
        // Validate status
        const validStatuses = ["Pending", "Accepted", "Preparing", "On The Way", "Delivered", "Cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be one of: " + validStatuses.join(", ")
            });
        }

        const updatedOrder = await OrderPlace.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true }
        );
        
        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        
        res.json({
            success: true,
            message: `Order status updated to ${status}`,
            order: updatedOrder
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ✅ New endpoint to get all available statuses
app.get("/order-statuses", (req, res) => {
    res.json({
        success: true,
        statuses: ["Pending", "Accepted", "Preparing", "On The Way", "Delivered", "Cancelled"]
    });
});

app.listen(3000)