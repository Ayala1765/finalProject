
const bcrypt = require('bcrypt'); // ספרייה להצפנת סיסמאות
const jwt = require('jsonwebtoken'); // ספרייה ליצירת טוקנים (JWT)
const Donor = require("../models/Donor")
// מפתח הטוקן (JWT) - ודא לשמור אותו בסביבה מאובטחת
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'
// פונקציה: הרשמה
const register = async (req, res) => {
  try {
    const { name, username, password, email, phone } = req.body;
    console.log(name, username, password, email, phone);
    
  if (!username||!password||!email) {
      return res.status(400).json({ error: 'There are required fileds' });
    }
    // הצפנת הסיסמה
    const saltRounds = 10; // מספר סיבובי ההצפנה
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // יצירת משתמש חדש
    const newDonor = new Donor({
      name,
      username,
      password: hashedPassword,// שמירה של הסיסמה המוצפנת 
      email,
      phone,
    })
    await newDonor.save()
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
}


// פונקציה: התחברות

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // בדיקה אם המשתמש קיים
    const donor = await Donor.findOne({ email });
    if (!donor) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // בדיקת סיסמה
    const isMatch = await bcrypt.compare(password, donor.password); // השוואת סיסמה
    console.log(password, donor.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // יצירת טוקן (JWT)
    const token = jwt.sign({ id: donor._id, role: donor.role }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
}

module.exports={register,login}