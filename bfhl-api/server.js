const express = require("express");
const app = express();
app.use(express.json());

app.post("/bfhl", (req, res) => {
  try {
    const body = req.body || {};
    const { data } = body;

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

    const isNumeric = (s) => /^[+-]?\d+$/.test(s);
    const isAlpha = (s) => /^[A-Za-z]+$/.test(s);

    const even_numbers = [];
    const odd_numbers = [];
    const alphabets = [];
    const special_characters = [];
    let sum = 0n;
    const letters = [];

    for (let raw of data) {
      const item = (typeof raw === "string" ? raw : String(raw)).trim();

      if (isNumeric(item)) {
        const bi = BigInt(item);
        sum += bi;
        (bi % 2n === 0n ? even_numbers : odd_numbers).push(item); 
      } else if (isAlpha(item)) {
        alphabets.push(item.toUpperCase());
        for (const ch of item) letters.push(ch);
      } else {
        special_characters.push(item);
      }
    }

    const reversed = letters.reverse().join("");
    let concat_string = "";
    for (let i = 0; i < reversed.length; i++) {
      concat_string += i % 2 === 0 ? reversed[i].toUpperCase() : reversed[i].toLowerCase();
    }

    return res.status(200).json({
      is_success: true,
      user_id: `${NAME}_${DOB}`,
      email: EMAIL,
      roll_number: ROLL,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: sum.toString(),
      concat_string
    });
  } catch (err) {
    return res.status(200).json({ is_success: false, error: "Unexpected server error", details: String(err) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}/bfhl`);
});
