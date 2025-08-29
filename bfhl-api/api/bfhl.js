module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ is_success: false, error: "Method Not Allowed" });
  }

  try {
    const body = req.body || {};
    const { data, full_name, dob_ddmmyyyy, email, roll_number } = body;

    const NAME = (full_name || process.env.FULL_NAME || "Jassika")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_"); 
    const DOB = (dob_ddmmyyyy || process.env.DOB_DDMMYYYY || "09082004").trim();
    const EMAIL = (email || process.env.EMAIL || "jassika.jassika.jassika@gmail.com").trim();
    const ROLL = (roll_number || process.env.ROLL_NUMBER || "22BML0023").trim();

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
        error: "'data' must be an array of strings"
      });
    }

    const isNumeric = (s) =>
      typeof s === "string" && /^[+-]?\d+$/.test(s.trim());

    const isAlpha = (s) =>
      typeof s === "string" && /^[A-Za-z]+$/.test(s.trim());

    const even_numbers = [];
    const odd_numbers = [];
    const alphabets = [];
    const special_characters = [];
    let sum = 0n;
    const letters = [];

    for (const raw of data) {
      const item = typeof raw === "string" ? raw.trim() : String(raw);

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
      const ch = reversed[i];
      concat_string += i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase();
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
    return res.status(200).json({
      is_success: false,
      error: "Unexpected server error",
      details: `${err}`
    });
  }
};
