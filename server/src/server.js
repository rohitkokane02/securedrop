import express from "express";
import dotenv from "dotenv";
import cors from "cors";    
import fileRoutes from "./routes/files.routes.js";
import shareRoutes from "./routes/share.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "SecureDrop API is running"
    });
});

app.use("/api/files", fileRoutes);
app.use("/api/shares", shareRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
})