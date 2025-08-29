// server.js
const express = require("express");
const app = express();
app.use(express.json());

// Health checks (useful for Render + easy browser test)
app.get("/", (_req, res) => res.send("OK"));
app.get("/bfhl", (_req, res) => res.status(405).json({ message: "Use POST /bfhl" }));

app.post("/bfhl", (req, res) => {
  try {
    const { data } = req.body || {};

    // ENV-configurable identity (Render → Environment)
    const fullNameEnv = process.env.FULL_NAME || "Jassika";
    const dobEnv = process.env.DOB_DDMMYYYY || "09082004";
    const EMAIL = process.env.EMAIL || "jassika.jassika.jassika@gmail.com";
    const ROLL = process.env.ROLL_NUMBER || "22BML0023";

    const NAME = String(fullNameEnv).toLowerCase().trim().replace(/\s+/g, "_");
    const DOB = String(dobEnv).trim();

    if (!Array.isArray(data)) {
      return res.status(200).json({
        is_success: false,
        user_id: `${NAME}_${DOB}`,
        email: EMAIL,
        roll_number: ROLL,
        odd_numbers: [],
        even_numbers: [],
        alphabets: [],
        special_characters: [],
        sum: "0",
        concat_string: "",
        error: "'data' must be an array"
      });
    }

    const isNumeric = (s) => typeof s === "string" && /^[+-]?\d+$/.test(s);
    const isAlpha = (s) => typeof s === "string" && /^[A-Za-z]+$/.test(s);
    const isAlnum = (s) => typeof s === "string" && /^[A-Za-z0-9]+$/.test(s);

    const even_numbers = [];
    const odd_numbers = [];
    const alphabets = [];
    const special_characters = [];
    let sum = 0n;
    const letters = [];

    for (const raw of data) {
      const item = (typeof raw === "string" ? raw : String(raw)).trim();

      if (isNumeric(item)) {
        const bi = BigInt(item);
        sum += bi;
        (bi % 2n === 0n ? even_numbers : odd_numbers).push(item); // keep numbers as strings
      } else if (isAlpha(item)) {
        alphabets.push(item.toUpperCase()); // tokens uppercased
        for (const ch of item) letters.push(ch); // collect letters for concat_string
      } else {
        // anything not purely alnum becomes special_characters (keeps strings)
        if (!isAlnum(item)) special_characters.push(item);
        else special_characters.push(item); // fallback, in case mixed tokens appear
      }
    }

    // Reverse, alternating caps per letter
    const reversed = letters.reverse().join("");
    let concat_string = "";
    for (let i = 0; i < reversed.length; i++) {
      concat_string += i % 2 === 0 ? reversed[i].toUpperCase() : reversed[i].toLowerCase();
    }

    return res.status(200).json({
      is_success: true,
      user_id: `${NAME}_${DOB}`, // full_name_ddmmyyyy in lowercase with underscores
      email: EMAIL,
      roll_number: ROLL,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: sum.toString(), // sum as string
      concat_string
    });
  } catch (err) {
    return res.status(200).json({
      is_success: false,
      error: "Unexpected server error",
      details: String(err)
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
