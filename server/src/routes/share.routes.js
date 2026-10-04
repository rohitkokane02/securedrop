import express from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { supabase } from "../config/supabase.js";


const router = express.Router();

router.post("/verify", async (req, res) => {

    try {
        const { otp } = req.body;
         
        if (!otp) {
            return res.status(400).json({
                success: false,
            message: "OTP is required"
            });
        }

        const otpLookup = crypto.createHmac("sha256", process.env.OTP_LOOKUP_SECRET)
            .update(otp)
            .digest("hex");

        const { data: share, error: databaseError } = await supabase
            .from("shares")
            .select("file_id, file_path, otp_hash, expires_at")
            .eq("otp_lookup", otpLookup)
            .maybeSingle();

        if (databaseError) {
            console.log("database Error: ", databaseError);

            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        if (!share) {
            return res.status(404).json({
                success: false,
                message: "File not found"
            });
        }

        const remainingTimeMs = new Date(share.expires_at).getTime() - Date.now();
        if (remainingTimeMs <= 0) {
            return res.status(410).json({
                success: false,
                message: "file expired"
            });
        }

        const isOtpValied = await bcrypt.compare(
            otp,
            share.otp_hash
        )

        if (!isOtpValied) {
            return res.status(401).json({
                success: false,
                message: "Invalied OTP"
            })
        }

        const remainingTimeSconds = Math.floor(remainingTimeMs / 1000);
        if (remainingTimeSconds <= 0) {
            return res.status(410).json({
                success: false,
                message: "file expired"
            });
        }
        
        const { data, error: signedUrlError } = await supabase.storage
            .from("files")
            .createSignedUrl(share.file_path, remainingTimeSconds);

        if (signedUrlError || !data?.signedUrl) {
            console.log("Single URL error: ", signedUrlError);

            return res.status(500).json({
                success: false,
                message: "Failed to generate download URL"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Access granted",
            downloadUrl: data.signedUrl
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
});


export default router; 