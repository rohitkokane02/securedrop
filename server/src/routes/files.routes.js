import express from "express";
import multer from "multer";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { supabase } from "../config/supabase.js";
const API_URL = process.env.VITE_API_URL;

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024
    }
});

router.post("/upload", upload.single("file"), async(req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Plese select the file"
            })
        }
        
        const durationInMinutes = Number(req.body.duration);
        if (![2, 5, 10].includes(durationInMinutes)) {
            return res.status(400).json({
                success: false,
                message: "Invalied Durations"
            })
        }
        
        const fileID = crypto.randomUUID();
        const otp = crypto.randomInt(100000, 1000000).toString();
        const otpHash = await bcrypt.hash(otp, 12);
        const otpLookup = crypto
            .createHmac("sha256", process.env.OTP_LOOKUP_SECRET)
            .update(otp)
            .digest("hex");


        const expiresAt = new Date(
            Date.now() + durationInMinutes * 60 * 1000  
        );

        const originalName = req.file.originalname;
        const extension = originalName.includes(".") ? originalName.substring(originalName.lastIndexOf(".")) : "";
        const storagePath = `uploads/${fileID}${extension}`;

        const { error: uploadError } = await supabase.storage.from("files").upload(storagePath, req.file.buffer, {
            contentType: req.file.mimetype,
            upsert: false
        });

        if (uploadError) {
            console.error(uploadError);

            return res.status(500).json({
                success: false,
                message: "File upload fails"
            });
        }


        const { error: databaseError } = await supabase.from("shares").insert({
            file_id: fileID,
            file_path: storagePath,
            otp_hash: otpHash,
            expires_at: expiresAt,
            otp_lookup: otpLookup
        });

        if (databaseError) {
            console.error(databaseError);

            await supabase.storage.from("files").remove([storagePath]);

            return res.status(500).json({
                success: false,
                message: "Failed to save file informations"
            });
        }

        // Temporary debugging
        console.log("File ID:", fileID);
        console.log("OTP:", otp);
        console.log("OTP Hash:", otpHash);
        console.log("Opt Lookup", otpLookup);
        console.log("Expires At:", expiresAt);
        console.log("Storage Path:", storagePath);

        res.status(201).json({
            success: true,
            message: "File upload successful",
            otp,
            expiresAt
        })

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Somthing went wrong"
        })
    }
});


export default router;