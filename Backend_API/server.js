const express = require("express");
const sql = require("mssql/msnodesqlv8");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const session = require("express-session");
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');
const fs = require("fs").promises;
const multer = require("multer");
const path = require('path');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001","http://localhost:3002"],
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
}));

const config = {
  user: "sa",
  password: "12345678",
  server: "MSI\\SQLEXPRESS",
  database: "Patient",
};
let pool;

async function initializePool() {
  try {
    pool = await sql.connect(config);
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: '',
    pass: '',
  },
});

initializePool();

app.use(session({
  secret: '',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 60000 }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

/////////////////////////////////////////////////___Login_______/////////////////////////////////////////////////////////

app.post("/api/logincust", async (req, res) => {
  const { email, password } = req.body;

  try {
    let pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .input("password", sql.NVarChar, password)
      .query("SELECT * FROM Tbl_contact WHERE Email = @email AND Password = @password");

    if (result.recordset.length > 0) {
      const userData = result.recordset[0];
      console.log("User Data:", userData);

      req.session.userData = {
        Contact_id: userData.Contact_id,
        email: userData.Email,
        firstname: userData.FirstName,
        lastname: userData.LastName,

      };


      req.session.isLoggedIn = true;

      req.session.save((err) => {
        if (err) {
          console.error("Error saving session:", err);
          res.status(500).json({ error: 'Failed to save session' });
        } else {
          console.log("Session saved successfully");
          console.log("Session on server side:", req.session);
          console.log("Contact_id on server side:", req.session.userData.Contact_id);

          res.json({
            success: true,
            message: 'Login successful',
            Contact_id: userData.Contact_id,
            userEmail: userData.Email,
          });
        }
      });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to connect to the database' });
  }
});

app.get('/api/contact/:contactId', async (req, res) => {
  const contactId = req.params.contactId;

  try {
    let pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('contactId', sql.Int, contactId)
      .query('SELECT * FROM Tbl_contact WHERE Contact_id = @contactId');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    const contact = result.recordset[0];
    res.json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});
app.get('/api/profile/:contact_id', async (req, res) => {
  const contactId = req.params.contact_id;

  try {
    const result = await pool.request()
      .input('contact_id', sql.Int, contactId)
      .query(`
        SELECT c.*, p.DateOfBirth,  p.Gender,p.Address ,p.Height,p.Weight,p.BloodGroup
        FROM Tbl_contact c
        INNER JOIN Patients p ON c.Contact_id = p.PatientID
        WHERE c.Contact_id = @contact_id
      `);

    if (result.recordset.length > 0) {
      const profileData = result.recordset[0];
      console.log("Profile Data:", profileData);
      res.json(profileData);
    } else {
      console.log("Profile not found for Contact_id:", contactId); 
      res.status(404).json({ error: 'Profile not found' });
    }
  } catch (error) {
    console.error("Error fetching profile data:", error);
    res.status(500).json({ error: 'Failed to fetch profile data' });
  }
});

app.post('/change-password', async (req, res) => {
  const { currentPassword, newPassword, contactId } = req.body;

  try {
    await sql.connect(config);
    const result = await sql.query`SELECT Password FROM Tbl_contact WHERE Contact_id = ${contactId}`;
    const storedPassword = result.recordset[0].Password;

    if (currentPassword !== storedPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    await sql.query`UPDATE Tbl_contact SET Password = ${newPassword} WHERE Contact_id = ${contactId}`;
    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } 
});

const otpStorage = {};

const sendOTPByEmail = (email, otp) => {
  
  const mailOptions = {
    from: 'poojachavan081096@gmail.com',
    to: email,
    subject: 'Your OTP for Password Reset',
    text: `Your OTP is: ${otp}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

app.post('/api/changepassword/requestotp', async (req, res) => {
  const { email } = req.body;
  const OTP = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

  try {
   
    sendOTPByEmail(email, OTP);

    otpStorage[email] = OTP;

    const pool = await sql.connect(config); 

    const result = await pool.request()
      .input('OTP', sql.VarChar, OTP)
      .input('Email', sql.VarChar, email)
      .query('UPDATE Tbl_contact SET otp = @OTP WHERE email = @Email');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    // OTP saved successfully to the database
    return res.status(200).json({ message: "OTP sent and saved successfully." });
  } catch (error) {
    console.error('Error saving OTP to the database:', error);
    // Handle error if OTP could not be saved to the database
    return res.status(500).json({ message: "An error occurred while sending OTP." });
  }
});

app.post('/api/changepassword/verifyotp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const userResult = await pool
      .request()
      .input('email', sql.NVarChar, email)
      .query('SELECT otp FROM Tbl_contact WHERE Email = @email');

    if (userResult.recordset.length > 0) {
      const storedOTP = userResult.recordset[0].otp; // Note the lowercase 'otp' here

      if (otp === storedOTP) {
        res.status(200).json({ message: "OTP verified successfully" }); 
      } else {
        res.status(401).json({ message: "Invalid OTP" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post('/api/changepassword', async (req, res) => {
  const { email, newPassword, otp } = req.body;

  try {
    // Verify OTP first
    const pool = await sql.connect(config);
    const userResult = await pool
      .request()
      .input('email', sql.NVarChar, email)
      .query('SELECT otp FROM Tbl_contact WHERE Email = @email');

    if (userResult.recordset.length > 0) {
      const storedOTP = userResult.recordset[0].otp; // Note the lowercase 'otp' here

      if (otp === storedOTP) {
        // OTP is valid, proceed to change the password
        const result = await pool.request()
          .input('Password', sql.VarChar, newPassword)
          .input('Email', sql.VarChar, email)
          .query('UPDATE Tbl_contact SET Password = @Password WHERE Email = @Email');

        if (result.rowsAffected[0] > 0) {
          // Password changed successfully
          res.status(200).json({ message: "Password changed successfully" });
        } else {
          res.status(500).json({ message: "Failed to change password" });
        }
      } else {
        // Invalid OTP
        res.status(401).json({ message: "Invalid OTP" });
      }
    } else {
      // User not found
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

///////////////////////////////////////////////_____Doctor______//////////////////////////////////////////////////////

app.post('/upload-avatar', upload.single('avatar'), (req, res) => {
  try {
    const avatarPath = req.file.path;

    res.status(200).json({ avatarPath });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/add-doctor', upload.single("avatar"), async (req, res) => {
  try {
   
    const {
      first_name,
      last_name,
      username,
      email,
      password,
      dob,
      gender,
      address,
      country,
      city,
      state,
      postal_code, 
      phone,
      biography,
      status,
      confirm_password ,
      department
    } = req.body;
    const avatar = req.file ? `/uploads/${req.file.filename}` : null;

    if (!first_name || !username || !email || !status || !postal_code || !confirm_password) {
      return res.status(400).json({ message: 'first_name, Username, Email, Status, Postal Code, and Confirm Password are required fields' });
    }


    if (password !== confirm_password) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const query = `INSERT INTO doctors (first_name, last_name, username, email, password, dob, gender, address, country, city, state, postal_code, phone, avatar, biography, status,confirm_password,department) 
                   VALUES (@first_name, @last_name, @username, @email, @password,
                           @dob, @gender, @address, @country, @city, @state,
                           @postal_code, @phone, @avatar, @biography, @status,@confirm_password,@department)`;

    const request = pool.request();


    request.input('first_name', sql.NVarChar(50), first_name);
    request.input('last_name', sql.NVarChar(50), last_name);
    request.input('username', sql.NVarChar(50), username);
    request.input('email', sql.NVarChar(100), email);
    request.input('password', sql.NVarChar(100), password);
    request.input('confirm_password', sql.NVarChar(100), confirm_password); 
    request.input('dob', sql.Date, dob);
    request.input('gender', sql.NVarChar(10), gender);
    request.input('address', sql.NVarChar(255), address);
    request.input('country', sql.NVarChar(100), country);
    request.input('city', sql.NVarChar(100), city);
    request.input('state', sql.NVarChar(100), state);
    request.input('postal_code', sql.NVarChar(20), postal_code); 
    request.input('phone', sql.NVarChar(20), phone);
    request.input('avatar', sql.NVarChar(255), avatar);
    request.input('biography', sql.NVarChar(sql.MAX), biography);
    request.input('status', sql.NVarChar(10), status);
    request.input('department', sql.NVarChar(50), department);
   
    await request.query(query);

    res.status(201).json({ message: 'Doctor added successfully' });
  } catch (error) {
    console.error('Error adding doctor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/api/updatedoctors/:id', upload.single('avatar'), async (req, res) => {
  const id = req.params.id;
  const {
    first_name,
    last_name,
    username,
    email,
    password,
    dob,
    gender,
    address,
    country,
    city,
    state,
    postal_code,
    phone,
    biography,
    status,
    department,
  } = req.body;

  
  const avatar = req.file ? `/uploads/${req.file.filename}` : undefined;

  try {
    const query = `
      UPDATE doctors 
      SET 
        first_name = @first_name, 
        last_name = @last_name, 
        username = @username, 
        email = @email, 
        password = @password, 
        dob = @dob, 
        gender = @gender, 
        address = @address, 
        country = @country, 
        city = @city, 
        state = @state, 
        postal_code = @postal_code, 
        phone = @phone, 
        ${avatar !== undefined ? 'avatar = @avatar,' : ''}
        biography = @biography, 
        status = @status,
        department = @department
      WHERE 
        id = @id`;

    const request = pool.request()
      .input('first_name', first_name)
      .input('last_name', last_name)
      .input('username', username)
      .input('email', email)
      .input('password', password)
      .input('dob', dob)
      .input('gender', gender)
      .input('address', address)
      .input('country', country)
      .input('city', city)
      .input('state', state)
      .input('postal_code', postal_code)
      .input('phone', phone)
      .input('biography', biography)
      .input('status', status)
      .input('department', department)
      .input('id', id);

    if (avatar !== undefined) {
      request.input('avatar', avatar);
    }

    await request.query(query);

    res.status(200).json({ message: 'Doctor updated successfully' });
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/doctors/:id', async (req, res) => {
  try {

    const { id } = req.params;
    const query = 'SELECT * FROM doctors WHERE id = @id';
   
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(query);

    if (result.recordset.length === 0) {

      return res.status(404).json({ message: 'Doctor not found' });
    }


    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/doctorss', async (req, res) => {
  try {

    const query = 'SELECT D.*,  DP.department_name FROM doctors D INNER JOIN Tbl_Adddepartment DP ON D.department = DP.dep_id';
    const result = await pool.request().query(query);
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error fetching holidays:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/doctors', async (req, res) => {
  try {
    const departmentName = req.query.departmentName;

    await sql.connect(config);
    const result = await sql.query`SELECT * FROM doctors WHERE department = ${departmentName}`;

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error fetching doctors by department:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/api/doctors/delete/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const query = 'DELETE FROM doctors WHERE id = @id';
    await pool.request()
      .input('id', sql.Int, id)
      .query(query);

    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

///////////////////////////////////////////________Department__________///////////////////////////////////////////

app.get('/api/departments/:hospitalId', async (req, res) => {
  const hospitalId = req.params.hospitalId; 
  try {
    const pool = await sql.connect(config);
    const request = pool.request();
    const result = await request
      .input('hospitalId', sql.Int, hospitalId)
      .query(`
        SELECT * FROM Tbl_Adddepartment
        WHERE Hospital_id = @hospitalId;
      `);
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ message: 'Failed to fetch departments' });
  }
});

app.post('/submit-department', async (req, res) => {
  try {
    await sql.connect(config);

    // Check if the department already exists within the same hospital
    const depCheck = await sql.query`
      SELECT department_name 
      FROM Tbl_Adddepartment 
      WHERE department_name = ${req.body.departmentName} AND Hospital_ID = ${req.body.hospitalId}
    `;
    
    if (depCheck.recordset.length > 0) {
      // Department already exists within the same hospital
      return res.status(400).json({ message: 'Department already exists in this hospital' });
    }

    // Insert the new department
    await sql.query`
      INSERT INTO Tbl_Adddepartment (department_name, description, status, Hospital_ID)
      VALUES (${req.body.departmentName}, ${req.body.description}, ${req.body.status}, ${req.body.hospitalId});
    `;

    res.status(201).json({ message: 'Department created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.put('/update-department/:dep_id', async (req, res) => {
  const { dep_id } = req.params;
  const { departmentName, description, status } = req.body;
  console.log(req.body)

  try {
    const request = pool.request();
    const result = await request
      .input('dep_id', sql.Int, dep_id)
      .input('departmentName', sql.NVarChar, departmentName)
      .input('description', sql.NVarChar, description)
      .input('status', sql.NVarChar, status)
      .query(`
        UPDATE Tbl_Adddepartment 
        SET department_name = @departmentName, description = @description, status = @status
        WHERE dep_id = @dep_id
      `);

    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: 'Department updated successfully' });
    } else {
      res.status(404).json({ message: 'Department not found' });
    }
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({ message: 'Failed to update department' });
  }
});

app.get('/api/departments/:dep_id', async (req, res) => {
  const { dep_id } = req.params;

  try {
    const request = pool.request();
    const result = await request.query(`SELECT * FROM Tbl_Adddepartment WHERE dep_id = ${dep_id}`);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching department:', error);
    res.status(500).json({ message: 'Failed to fetch department' });
  }
});

app.delete('/delete-department/:dep_id', async (req, res) => {
  const { dep_id } = req.params;

  try {
    const request = pool.request();
    const result = await request.query(`DELETE FROM Tbl_Adddepartment WHERE dep_id = ${dep_id}`);

    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: 'Department deleted successfully' });
    } else {
      res.status(404).json({ message: 'Department not found' });
    }
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ message: 'Failed to delete department' });
  }
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//////////////////////////////////////___Patients______-//////////////////////////////////////////

app.post("/submit-formpatients", upload.single("avatar"), async (req, res) => {
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    confirmPassword,
    dob,
    gender,
    address,
    country,
    state,
    city,
    postalCode,
    phone,
    status,
  } = req.body;

  const avatar = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const request = pool.request();
    const result = await request
      .input("firstName", sql.NVarChar, firstName)
      .input("lastName", sql.NVarChar, lastName)
      .input("username", sql.NVarChar, username)
      .input("email", sql.NVarChar, email)
      .input("password", sql.NVarChar, password)
      .input("confirmPassword", sql.NVarChar, confirmPassword)
      .input("dob", sql.Date, dob)
      .input("gender", sql.NVarChar, gender)
      .input("address", sql.NVarChar, address)
      .input("country", sql.NVarChar, country)
      .input("state", sql.NVarChar, state)
      .input("city", sql.NVarChar, city)
      .input("postalCode", sql.NVarChar, postalCode)
      .input("phone", sql.NVarChar, phone)
      .input("avatar", sql.NVarChar, avatar)
      .input("status", sql.NVarChar, status)
      .query(`
        INSERT INTO Tbl_Patients (
          firstName,
          lastName,
          username,
          email,
          password,
          confirmPassword,
          dob,
          gender,
          address,
          country,
          state,
          city,
          postalCode,
          phone,
          avatar,
          status
        )
        VALUES (
          @firstName,
          @lastName,
          @username,
          @email,
          @password,
          @confirmPassword,
          @dob,
          @gender,
          @address,
          @country,
          @state,
          @city,
          @postalCode,
          @phone,
          @avatar,
          @status
        )
      `);

    res.status(200).json({ message: "Form submitted successfully!" });
  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).json({ message: "Failed to submit form." });
  }
});

app.put('/api/updatepatients/:pat_id', upload.single('avatar'), async (req, res) => {
  const { pat_id } = req.params;
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    confirmPassword,
    dob,
    gender,
    address,
    country,
    state,
    city,
    postalCode,
    phone,
    status,
  } = req.body;

 
  const avatar = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const request = pool.request();
    const query = `
      UPDATE Tbl_Patients 
      SET 
        firstName = @firstName,
        lastName = @lastName,
        username = @username,
        email = @email,
        password = @password,
        confirmPassword = @confirmPassword,
        dob = @dob,
        gender = @gender,
        address = @address,
        country = @country,
        state = @state,
        city = @city,
        postalCode = @postalCode,
        phone = @phone,
        ${avatar !== null ? 'avatar = @avatar,' : ''} 
        status = @status
       
      WHERE pat_id = @pat_id;
    `;

    const result = await request
      .input('pat_id', sql.Int, pat_id)
      .input('firstName', sql.NVarChar, firstName)
      .input('lastName', sql.NVarChar, lastName)
      .input('username', sql.NVarChar, username)
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, password)
      .input('confirmPassword', sql.NVarChar, confirmPassword)
      .input('dob', sql.Date, dob)
      .input('gender', sql.NVarChar, gender)
      .input('address', sql.NVarChar, address)
      .input('country', sql.NVarChar, country)
      .input('state', sql.NVarChar, state)
      .input('city', sql.NVarChar, city)
      .input('postalCode', sql.NVarChar, postalCode)
      .input('phone', sql.NVarChar, phone)
      .input('status', sql.NVarChar, status)
     
      .input('avatar', sql.NVarChar, avatar)
      .query(query);

    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: 'Patient updated successfully' });
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ message: 'Failed to update patient' });
  }
});

app.delete('/api/patients/delete/:pat_id', async (req, res) => {
  const pat_id = req.params.pat_id;

  try {
    const query = 'DELETE FROM Tbl_Patients WHERE pat_id = @pat_id';
    await pool.request()
      .input('pat_id', sql.Int, pat_id)
      .query(query);

    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/patients', async (req, res) => {

  try {
    const request = pool.request();
    const result = await request.query('SELECT * FROM Tbl_Patients');

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ message: 'Failed to fetch departments' });
  }
});

app.get('/api/patients/:pat_id', async (req, res) => {
  const { pat_id } = req.params;

  try {
    const request = pool.request();
    const result = await request.query(`SELECT * FROM Tbl_patients WHERE pat_id = ${pat_id}`);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'patients not found' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Failed to fetch patients' });
  }
});

app.use(express.static('uploads'));

app.post('/api/register', async (req, res) => {
  try {
   
    await sql.connect(config);

    const result = await sql.query`
      INSERT INTO Patients (FirstName, LastName, Email, Password, BloodGroup, Height, Weight, PhoneNumber, DateOfBirth, Gender, Address, CreatedAt)
      VALUES (${req.body.firstName}, ${req.body.lastName}, ${req.body.email}, ${req.body.password}, ${req.body.bloodGroup}, ${req.body.height}, ${req.body.weight}, ${req.body.phoneNumber},
        ${req.body.dateOfBirth}, ${req.body.gender}, ${req.body.address}, GETDATE());
      SELECT SCOPE_IDENTITY() AS PatientID; -- Retrieve the generated PatientID
    `;

    const patientID = result.recordset[0].PatientID;

    await sql.query`
      INSERT INTO Tbl_contact (FirstName, LastName, Email, Password, Contact_id, PhoneNumber)
      VALUES (${req.body.firstName}, ${req.body.lastName}, ${req.body.email}, ${req.body.password}, ${patientID}, ${req.body.phoneNumber});
    `;

    res.status(201).json({ message: 'Patient registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/patient/approved-doctors/:hospitalId', async (req, res) => {
  const hospitalId = req.params.hospitalId;

  try {
    let pool = await sql.connect(config);
    const result = await pool.request()
      .input('status', sql.NVarChar, 'approved')
      .input('hospitalID', sql.Int, hospitalId)
      .query('SELECT DoctorID, DoctorName, Speciality, Experience, Education, Contact, Email, AvailableTime, Address, Gender FROM Tbl_request_doctor WHERE Status = @status AND HospitalID = @hospitalID');

    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching approved doctors:', error);
    res.status(500).send('Error fetching approved doctors');
  }
});



///////////////////////////////////////////////////_____appoinment______//////////////////////////////////////////////

app.get('/api/appointment-details/:appointmentId', async (req, res) => {
  const appointmentId = req.params.appointmentId;

  try {
    await sql.connect(config);

    const result = await sql.query`
      SELECT A.*, D.first_name, D.last_name, DP.department_name 
      FROM Tbl_Appointments A 
      INNER JOIN doctors D ON A.doctor = D.id 
      INNER JOIN Tbl_Adddepartment DP ON A.department = DP.dep_id 
      WHERE A.AppointmentID = ${appointmentId}
    `;

    res.json(result.recordset[0]); 
  } catch (error) {
    console.error('Error fetching appointment details:', error);
    res.status(500).json({ error: 'An error occurred while fetching appointment details.' });
  } 
});

app.post("/delete-appointment", async (req, res) => {
  const { AppointmentID } = req.body;

  try {
    const request = pool.request();
    const result = await request
      .input("AppointmentID", sql.NVarChar, AppointmentID)
      .query(`
        UPDATE Tbl_Appointments
        SET status = 'Canceled'
        WHERE AppointmentID = @AppointmentID
      `);

    res.status(200).json({ message: "Appointment canceled successfully!" });
  } catch (error) {
    console.error("Error canceling appointment:", error);
    res.status(500).json({ message: "Failed to cancel appointment." });
  }
});

app.get('/api/latest-appointment-id', async (req, res) => {
  try {
  
    const pool = await sql.connect(config);
   
    const result = await pool.request().query(`
      SELECT TOP 1 AppointmentID 
      FROM [dbo].[Tbl_Appointments] 
      ORDER BY AppointmentID DESC
    `);
   
    const latestId = result.recordset[0].AppointmentID;
    
    res.json({ latestId });
  } catch (error) {
    console.error('Error fetching latest appointment ID:', error);
    res.status(500).json({ message: 'Failed to fetch latest appointment ID.' });
  }
});

app.get('/api/getappointment/:contactId', async (req, res) => {
  try {
    const { contactId } = req.params; // Get contactId from URL parameters
    let query = `
      SELECT A.*, D.first_name, D.last_name,D.avatar, DP.department_name
      FROM Tbl_Appointments A
      INNER JOIN doctors D ON A.doctor = D.id
      INNER JOIN Tbl_Adddepartment DP ON A.department = DP.dep_id
      WHERE A.Contact_id = @contactId`; // Filter appointments based on contactId
    const result = await pool.request()
                             .input('contactId', sql.VarChar, contactId)
                             .query(query);
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
});



app.delete('/api/appointment/delete/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const query = 'DELETE FROM Tbl_Appointments WHERE id = @id';
    await pool.request()
      .input('id', sql.Int, id)
      .query(query);

    res.status(200).json({ message: 'appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

////////////////////////////////////////////////////////////////////////////////////////////

app.get('/api/get-patients', async (req, res) => {
  try {
    // Connect to the database
    await sql.connect(config);

    // Query to select all employees
    const result = await sql.query`SELECT * FROM Patients
    `;

   

    // Send the list of employees as a response
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/get-patients/:patientID', async (req, res) => {
  const patientID = req.params.patientID;

  try {
    let pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('patientID', sql.Int, patientID)
      .query('SELECT * FROM Patients WHERE PatientID = @patientID');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    const contact = result.recordset[0];
    res.json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/api/update-patient/:patientID', async (req, res) => {
  const patientID = req.params.patientID;
  const { firstName, lastName, email, password, bloodGroup, height, weight, phoneNumber, dateOfBirth, gender, address } = req.body;

  try {
    // Update the patient details in the database
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('FirstName', sql.VarChar(255), firstName)
      .input('LastName', sql.VarChar(255), lastName)
      .input('Email', sql.VarChar(255), email)
      .input('Password', sql.VarChar(255), password)
      .input('BloodGroup', sql.VarChar(255), bloodGroup)
      .input('Height', sql.VarChar(255), height)
      .input('Weight', sql.VarChar(255), weight)
      .input('PhoneNumber', sql.VarChar(255), phoneNumber)
      .input('DateOfBirth', sql.Date, dateOfBirth)
      .input('Gender', sql.VarChar(10), gender)
      .input('Address', sql.VarChar(255), address)
      .input('PatientID', sql.Int, patientID)
      .query(`
          UPDATE Patients 
          SET 
          FirstName = @FirstName, 
          LastName = @LastName, 
          Email = @Email, 
          Password = @Password, 
          BloodGroup = @BloodGroup, 
          Height = @Height, 
          Weight = @Weight, 
          PhoneNumber = @PhoneNumber, 
          DateOfBirth = @DateOfBirth, 
          Gender = @Gender, 
          Address = @Address 
          WHERE 
          PatientID = @PatientID`);

    if (result.rowsAffected[0] === 0) {
      // No rows were affected, indicating the patient ID doesn't exist
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Send a success response
    res.status(200).json({ message: 'Patient updated successfully' });
  } catch (error) {
    console.error('Error updating patient:', error);
    // Send an error response
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/delete-patient/:patientID', (req, res) => {
  const patientID = parseInt(req.params.patientID);
  const sql = `DELETE FROM Patients WHERE PatientID = ?`;

  connection.query(sql, [patientID], (error, results) => {
    if (error) {
      console.error('Error deleting patient:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Patient not found' });
    } else {
      res.status(200).json({ message: 'Patient deleted successfully' });
    }
  });
});

app.get('/api/report/:patientId', async (req, res) => {
  try {
    
    const patientId = parseInt(req.params.patientId);

    await sql.connect(config);

    const result = await sql.query`
      SELECT * FROM Patients WHERE Patient_id = ${patientId};
    `;
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/send_otp', async (req, res) => {
  try {
      const { email } = req.body;
      const otp = generateOTP();

      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'poojachavan081096@gmail.com',
          pass: 'quks xmdh uhxe bbkz',
        }
    });

    const mailOptions = {
        from: 'poojachavan081096@gmail.com',
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP for registration is: ${otp}`
    };
      transporter.sendMail(mailOptions, async (error, info) => {
          if (error) {
              console.error("Error sending OTP:", error);
              res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
          } else {
              console.log('OTP sent:', info.response);
              // Update database with generated OTP
              try {
                  await updateOTPInDatabasePatients(email, otp);
                  res.status(200).json({ message: 'OTP sent successfully.' });
              } catch (error) {
                  console.error("Error updating OTP in database:", error);
                  res.status(500).json({ message: 'Failed to update OTP in database.' });
              }
          }
      });
  } catch (error) {
      console.error("Error generating OTP:", error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

async function updateOTPInDatabasePatients(email, otp) {
  try {
      
      const pool = await sql.connect(config);

      const result = await pool
          .request()
          .input('email', sql.NVarChar, email)
          .query('SELECT OTP FROM Patients WHERE Email = @email');

      if (result.recordset.length > 0) {
          const existingOTP = result.recordset[0].OTP;
          if (existingOTP !== otp) {
              await pool
                  .request()
                  .input('otp', sql.NVarChar, otp)
                  .input('email', sql.NVarChar, email)
                  .query('UPDATE Patients SET OTP = @otp WHERE Email = @email');

              console.log('OTP updated in the database successfully for:', email);
          } else {
              console.log('OTP already exists in the database for:', email);
          }
      } else {
          console.log('No record found for email:', email);
      }

     
  } catch (error) {
      console.error("Error updating OTP in database:", error);
      throw error; 
  }
}

function generateOTP() {
 
  return Math.floor(100000 + Math.random() * 900000);
}
app.post('/api/verify_otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
   
    const userResult = await pool
      .request()
      .input('email', sql.NVarChar, email)
      .query('SELECT OTP FROM Patients WHERE Email = @email');

    if (userResult.recordset.length > 0) {
      const storedOTP = userResult.recordset[0].OTP;

      if (otp === storedOTP) {
        res.sendStatus(200); 
      } else {
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('Database error:', error);
    res.sendStatus(500);
  }
});

app.get('/appointments', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query(`
      SELECT 
        a.*, 
        d.FirstName, 
        d.LastName, 
        dep.department_name ,
        h.name
      FROM Tbl_Appointments a
      INNER JOIN Tbl_doctor_login d ON a.doctor = d.Doctor_id
      INNER JOIN Tbl_HospitalProfile h ON a.Hospital_id = h.Hospital_id
      INNER JOIN Tbl_Adddepartment dep ON a.department = dep.dep_id
    `);

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post("/submit-appointments", async (req, res) => {
  const {
    Contact_id,
    patientName,
    department,
    doctor,
    date,
    patientEmail,
    patientPhoneNumber,
    message,
    status,
    address,
    type,
    AppointmentID,
    time_slot,
    hospital // Add hospital to the request body
  } = req.body;
  
  try {
    const request = pool.request();
    const result = await request
    .input("Contact_id", sql.NVarChar, Contact_id) 
    .input("patientName", sql.NVarChar, patientName)
    .input("department", sql.NVarChar, department)
    .input("doctor", sql.NVarChar, doctor)
    .input("date", sql.Date, new Date(date)) 
    .input("patientEmail", sql.NVarChar, patientEmail)
    .input("patientPhoneNumber", sql.NVarChar, patientPhoneNumber)
    .input("message", sql.NVarChar, message)
    .input("status", sql.NVarChar, status)
    .input("address", sql.NVarChar, address)
    .input("type", sql.NVarChar, type)
    .input("AppointmentID", sql.NVarChar, AppointmentID)
    .input("time_slot", sql.Time, time_slot) 
    .input("hospital", sql.NVarChar, hospital) 
    .query(`
    INSERT INTO Tbl_Appointments (
      Contact_id, 
      patientName,
      department,
      doctor,
      date,
      patientEmail,
      patientPhoneNumber,
      message,
      address,
      type,
      status,
      AppointmentID,
      time_slot,
      Hospital_id
    )
    VALUES (
      @Contact_id, 
      @patientName,
      @department,
      @doctor,
      @date,
      @patientEmail,
      @patientPhoneNumber,
      @message,
      @address,
      @type,
      @status,
      @AppointmentID,
      @time_slot,
      @hospital 
    )
    `);
  
    res.status(200).json({ message: "Appointment created successfully!" });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ message: "Failed to create appointment." });
  }
});


app.put("/api/appointments/:id", async (req, res) => {
  const appointmentId = req.params.id;
  const {
    patientName,
    department,
    doctor,
    date,
    patientEmail,
    patientPhoneNumber,
    message,
    status,
    address,
    type,
    time_slot
  } = req.body;

  try {
    const request = pool.request();
    const result = await request
      .input("appointmentId", sql.NVarChar, appointmentId)
      .input("patientName", sql.NVarChar, patientName)
      .input("department", sql.NVarChar, department)
      .input("doctor", sql.NVarChar, doctor)
      .input("date", sql.Date, new Date(date))
      .input("patientEmail", sql.NVarChar, patientEmail)
      .input("patientPhoneNumber", sql.NVarChar, patientPhoneNumber)
      .input("message", sql.NVarChar, message)
      .input("status", sql.NVarChar, status)
      .input("address", sql.NVarChar, address)
      .input("type", sql.NVarChar, type)
      .input("time_slot", sql.Time, time_slot)
      .query(`
        UPDATE Tbl_Appointments
        SET
          patientName = @patientName,
          department = @department,
          doctor = @doctor,
          date = @date,
          patientEmail = @patientEmail,
          patientPhoneNumber = @patientPhoneNumber,
          message = @message,
          status = @status,
          address = @address,
          type = @type,
          time_slot = @time_slot
        WHERE
          AppointmentID = @appointmentId
      `);

    res.status(200).json({ message: "Appointment updated successfully!" });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ message: "Failed to update appointment." });
  }
});
app.get('/api/latest-appointment-id', async (req, res) => {
  try {
   
    const pool = await sql.connect(config);
   
    const result = await pool.request().query(`
      SELECT TOP 1 AppointmentID 
      FROM [dbo].[Tbl_Appointments] 
      ORDER BY AppointmentID DESC
    `);
   
    const latestId = result.recordset[0].AppointmentID;

    res.json({ latestId });
  } catch (error) {
    console.error('Error fetching latest appointment ID:', error);
    res.status(500).json({ message: 'Failed to fetch latest appointment ID.' });
  }
});

app.get('/api/booked-slots', async (req, res) => {
  try {
    const { date, doctorId } = req.query;
    let query = `
      SELECT DISTINCT CONVERT(VARCHAR(5), time_slot, 108) AS formatted_time_slot 
      FROM Tbl_Appointments 
      WHERE CONVERT(DATE, date) = '${date}'
    `;
    if (doctorId) {
      query += ` AND doctor = '${doctorId}'`;
    }

    const result = await pool.request().query(query);

    const bookedSlots = result.recordset.map(row => row.formatted_time_slot);

    res.json(bookedSlots);
  } catch (error) {
    console.error('Error fetching booked slots:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/accept-appointment/:appointmentId', async (req, res) => {
  const { appointmentId } = req.params;

  try {
    await sql.connect(config);

    const request = new sql.Request();

    // Execute the update query
    const result = await request
      .input('AppointmentID', sql.NVarChar, appointmentId)
      .query(`
        UPDATE Tbl_Appointments
        SET status = 'Accepted'
        WHERE AppointmentID = @AppointmentID
      `);

    res.status(200).json({ message: 'Appointment accepted successfully!' });
  } catch (error) {
    console.error('Error accepting appointment:', error);
    res.status(500).json({ message: 'Failed to accept appointment.' });
  } 
});


app.put('/api/update-appointment-status/:appointmentId', async (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body;

  try {
    await sql.connect(config);

    const request = new sql.Request();

    await request
      .input('AppointmentID', sql.NVarChar, appointmentId)
      .input('Status', sql.NVarChar, status)
      .query(`
        UPDATE Tbl_Appointments
        SET status = @Status
        WHERE AppointmentID = @AppointmentID
      `);

    res.status(200).json({ message: 'Appointment status updated successfully!' });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ message: 'Failed to update appointment status.' });
  }
});


////////////////////////////////////////////////____Employee_______//////////////////////////////////////////////

app.post('/api/addEmployee', async (req, res) => {
  try {

    await sql.connect(config);

    const result = await sql.query`
      INSERT INTO employees (first_name, last_name, username, email, password, joining_date, phone, role, employee_id, status, created_at)
      VALUES (${req.body.first_name}, ${req.body.last_name}, ${req.body.username}, ${req.body.email}, ${req.body.password}, ${req.body.joining_date}, ${req.body.phone}, ${req.body.role}, ${req.body.employee_id}, ${req.body.status}, GETDATE())
    `;


    res.status(201).json({ message: 'Employee added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/employees', async (req, res) => {
  try {

    await sql.connect(config);
    const result = await sql.query`SELECT * FROM employees`;

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/employees/:employeeId', async (req, res) => {
  try {

    await sql.connect(config);

    const { employeeId } = req.params;


    const result = await sql.query`SELECT * FROM employees WHERE employee_id = ${parseInt(employeeId)}`;

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }


    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/api/employees/:employeeId', async (req, res) => {
  const employeeId = req.params.employeeId;
  const { first_name, last_name, username, email, password, joining_date, phone, role, status } = req.body;

  try {

    const query = `
    UPDATE employees 
    SET 
      first_name = '${first_name}', 
      last_name = '${last_name}', 
      username = '${username}', 
      email = '${email}', 
      password = '${password}', 
      joining_date = '${joining_date}', 
      phone = '${phone}', 
      role = '${role}', 
      status = '${status}' 
    WHERE 
      employee_id = ${employeeId}`;
    await pool.request().query(query);

    res.status(200).json({ message: 'Employee updated successfully' });
  } catch (error) {
    console.error('Error updating employee:', error);

    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/api/employees/delete/:employeeId', async (req, res) => {
  const employeeId = req.params.employeeId;

  try {
    const query = 'DELETE FROM employees WHERE employee_id = @employeeId';
    await pool.request()
      .input('employeeId', sql.VarChar, employeeId)
      .query(query);

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/add-leave', async (req, res) => {
  try {

    const { leaveType, leaveReason, fromDate, toDate, numberOfDays } = req.body;

    if (!leaveType || !leaveReason || !fromDate || !toDate || !numberOfDays) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const query = `INSERT INTO leaves (leave_type, leave_reason, from_date, to_date, number_of_days) 
    VALUES (@leave_type, @leave_reason, @from_date, @to_date, @number_of_days)`;

    const request = pool.request();

    request.input('leave_type', sql.VarChar(255), leaveType);
    request.input('leave_reason', sql.NVarChar, leaveReason);
    request.input('from_date', sql.Date, fromDate);
    request.input('to_date', sql.Date, toDate);
    request.input('number_of_days', sql.Int, numberOfDays);

    await request.query(query);

    res.status(201).json({ message: 'Leave added successfully' });
  } catch (error) {

    console.error('Error adding leave:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/leave-requests', async (req, res) => {
  try {

    await sql.connect(config);

    const result = await sql.query`SELECT * FROM leaves`;

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/leave-requests/:id', async (req, res) => {
  try {

    await sql.connect(config);
    const { id } = req.params;
    const result = await sql.query`SELECT * FROM leaves WHERE id = ${parseInt(id)}`;

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching leave request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/add-holiday', async (req, res) => {
  try {

    const { title, date, day } = req.body;

    if (!title || !date || !day) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const query = `INSERT INTO holidays (title, date, day) 
                   VALUES (@title, @date, @day)`;

    const request = pool.request();

    request.input('title', sql.NVarChar(255), title);
    request.input('date', sql.Date, date);
    request.input('day', sql.NVarChar(50), day);
    await request.query(query);

    res.status(201).json({ message: 'Holiday added successfully' });
  } catch (error) {

    console.error('Error adding holiday:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/holidays', async (req, res) => {
  try {

    const query = 'SELECT * FROM holidays';
    const result = await pool.request().query(query);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error fetching holidays:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/holidays/:id', async (req, res) => {
  const holidayId = req.params.id;
  try {

    const query = `SELECT * FROM holidays WHERE id = ${holidayId}`;
    const result = await pool.request().query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Holiday not found' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching holiday:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/api/holidays/:id', async (req, res) => {
  const holidayId = req.params.id;
  const { title, date } = req.body;

  try {

    const query = `UPDATE holidays SET title = '${title}', date = '${date}' WHERE id = ${holidayId}`;
    await pool.request().query(query);

    res.status(200).json({ message: 'Holiday updated successfully' });
  } catch (error) {
    console.error('Error updating holiday:', error);

    res.status(500).json({ message: 'Internal server error' });
  }
});

////////////////////////////////////////////////_______Hospital______////////////////////////////////////////////

app.put('/hospital/update-hospital-profile/:hospitalId', upload.fields([{ name: 'logo' }, { name: 'photo' }]), async (req, res) => {
  const hospitalId = req.params.hospitalId; // Extracting hospitalId from URL parameter

  const {
    name,
    locations,
    departments,
    timing,
    facilities,
    about
  } = req.body;

  let logo = null;
  let photo = null;

  // Check if logo and photo files exist in req.files
  if (req.files && req.files['logo']) {
    logo = `/uploads/${req.files['logo'][0].filename}`;
  }

  if (req.files && req.files['photo']) {
    photo = `/uploads/${req.files['photo'][0].filename}`;
  }

  try {
    const pool = await sql.connect(config);
    const request = pool.request();
    const query = `
      UPDATE Tbl_HospitalProfile
      SET name = @name, locations = @locations, departments = @departments, timing = @timing,about=@about,
          facilities = @facilities${logo ? ', logo = @logo' : ''}${photo ? ', photo = @photo' : ''}
      WHERE Hospital_id = @hospitalId;
    `;

    await request
      .input('hospitalId', sql.Int, hospitalId)
      .input('name', sql.NVarChar, name)
      .input('locations', sql.NVarChar, locations)
      .input('departments', sql.NVarChar, departments)
      .input('timing', sql.NVarChar, timing)
      .input('facilities', sql.NVarChar, facilities)
      .input('about', sql.NVarChar, about)
      .input('logo', sql.NVarChar, logo)
      .input('photo', sql.NVarChar, photo)
      .query(query);

    res.status(200).json({ message: "Hospital profile updated successfully!" });
  } catch (error) {
    console.error("Error updating hospital profile:", error);
    res.status(500).json({ message: "Failed to update hospital profile." });
  }
});

// Assuming you're using Express.js
app.get('/api/hospital/profile/:hospitalId', async (req, res) => {
  const hospitalId = req.params.hospitalId;

  try {
    const pool = await sql.connect(config);
    const request = pool.request();
    const result = await request
      .input('hospitalId', sql.Int, hospitalId)
      .query(`
        SELECT * FROM Tbl_HospitalProfile
        WHERE Hospital_id = @hospitalId;
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Hospital profile not found' });
    }

    const hospitalProfile = result.recordset[0];
    res.status(200).json(hospitalProfile);
  } catch (error) {
    console.error('Error fetching hospital profile:', error);
    res.status(500).json({ message: 'Failed to fetch hospital profile' });
  }
});

app.post("/api/Hospitallogin", async (req, res) => {
  const { email, password } = req.body;

  try {
    let pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .input("password", sql.NVarChar, password)
      .query("SELECT * FROM Tbl_hospital_login WHERE Email = @email AND Password = @password");

    if (result.recordset.length > 0) {
      const userData = result.recordset[0];
      console.log("User Data:", userData);

      req.session.userData = {
        Hospital_id: userData.Hospital_id,
        email: userData.Email,
        name: userData.NameOfHospital,
        address: userData.Address,
        phoneNumber: userData.PhoneNumber,
      };

      req.session.isLoggedIn = true;

      req.session.save((err) => {
        if (err) {
          console.error("Error saving session:", err);
          res.status(500).json({ error: 'Failed to save session' });
        } else {
          console.log("Session saved successfully");
          console.log("Session on server side:", req.session);
          console.log("Hospital_id on server side:", req.session.userData.Hospital_id);

          res.json({
            success: true,
            message: 'Login successful',
            Hospital_id: userData.Hospital_id,
            userEmail: userData.Email,
            hospitalName: userData.NameOfHospital,
            hospitalAddress: userData.Address,
            hospitalPhoneNumber: userData.PhoneNumber,
          });
        }
      });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to connect to the database' });
  }
});

app.post('/api/hospital/register', async (req, res) => {
  const { nameOfHospital, email, password, phoneNumber, address } = req.body;

  try {
    await sql.connect(config);
    
    const transaction = new sql.Transaction();
    await transaction.begin();
    
    try {
    
      const registrationRequest = new sql.Request(transaction);
      const registrationResult = await registrationRequest
        .input('nameOfHospital', sql.NVarChar, nameOfHospital)
        .input('email', sql.NVarChar, email)
        .input('password', sql.NVarChar, password)
        .input('phoneNumber', sql.NVarChar, phoneNumber)
        .input('address', sql.NVarChar, address)
        .query(`
          INSERT INTO Tbl_registration (NameofHospital, Email, Password, PhoneNumber, Address, CreatedAt)
          VALUES (@nameOfHospital, @Email, @Password, @PhoneNumber, @Address, GETDATE());
          SELECT SCOPE_IDENTITY() AS HospitalID;
        `);

      const hospitalID = registrationResult.recordset[0].HospitalID;

      const loginRequest = new sql.Request(transaction);
      await loginRequest
        .input('nameOfHospital', sql.NVarChar, nameOfHospital)
        .input('email', sql.NVarChar, email)
        .input('password', sql.NVarChar, password)
        .input('phoneNumber', sql.NVarChar, phoneNumber)
        .input('address', sql.NVarChar, address)
        .input('hospitalID', sql.Int, hospitalID)
        .query(`
          INSERT INTO Tbl_hospital_login (NameofHospital, Email, Password, PhoneNumber, Address, Hospital_id)
          VALUES (@nameOfHospital, @Email, @Password, @PhoneNumber, @Address, @hospitalID);
        `);

      const profileRequest = new sql.Request(transaction);
      await profileRequest
        .input('nameOfHospital', sql.NVarChar, nameOfHospital)
        .input('hospitalID', sql.Int, hospitalID)
        .query(`
          INSERT INTO Tbl_HospitalProfile (name, Hospital_id, locations, departments, timing, facilities, logo, photo,about)
          VALUES (@nameOfHospital, @hospitalID, '', '', '', '', '', '','');
        `);

      await transaction.commit();
      
      res.status(201).json({ message: 'Hospital registered successfully' });
    } catch (err) {
    
      await transaction.rollback();
      console.error('Transaction error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  } catch (err) {
    console.error('Connection error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/hospital/send_otp', async (req, res) => {
  try {
      const { email } = req.body;
      const otp = generateOTP();

      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'poojachavan081096@gmail.com',
          pass: 'quks xmdh uhxe bbkz',
        }
    });

    const mailOptions = {
        from: 'poojachavan081096@gmail.com',
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP for registration is: ${otp}`
    };
      transporter.sendMail(mailOptions, async (error, info) => {
          if (error) {
              console.error("Error sending OTP:", error);
              res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
          } else {
              console.log('OTP sent:', info.response);
              // Update database with generated OTP
              try {
                  await updateOTPInDatabaseregistration(email, otp);
                  res.status(200).json({ message: 'OTP sent successfully.' });
              } catch (error) {
                  console.error("Error updating OTP in database:", error);
                  res.status(500).json({ message: 'Failed to update OTP in database.' });
              }
          }
      });
  } catch (error) {
      console.error("Error generating OTP:", error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

async function updateOTPInDatabaseregistration(email, otp) {
  try {
      
      const pool = await sql.connect(config);

      const result = await pool
          .request()
          .input('email', sql.NVarChar, email)
          .query('SELECT OTP FROM Tbl_registration WHERE Email = @email');

      if (result.recordset.length > 0) {
          const existingOTP = result.recordset[0].OTP;
          if (existingOTP !== otp) {
              await pool
                  .request()
                  .input('otp', sql.NVarChar, otp)
                  .input('email', sql.NVarChar, email)
                  .query('UPDATE Tbl_registration SET OTP = @otp WHERE Email = @email');

              console.log('OTP updated in the database successfully for:', email);
          } else {
              console.log('OTP already exists in the database for:', email);
          }
      } else {
          console.log('No record found for email:', email);
      }

     
  } catch (error) {
      console.error("Error updating OTP in database:", error);
      throw error; 
  }
}

function generateOTP() {
 
  return Math.floor(100000 + Math.random() * 900000);
}
app.post('/api/hospital/verify_otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
   
    const userResult = await pool
    .request()
    .input('email', sql.NVarChar, email)
    .query('SELECT OTP FROM Tbl_registration WHERE Email = @email;');
  

    if (userResult.recordset.length > 0) {
      const storedOTP = userResult.recordset[0].OTP;

      if (otp === storedOTP) {
        res.sendStatus(200); 
      } else {
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('Database error:', error);
    res.sendStatus(500);
  }
});

app.get('/hospitalinfo/:hospitalId', async (req, res) => {
  const hospitalId = req.params.hospitalId;

  try {
    let pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('hospitalId', sql.Int, hospitalId)
      .query('SELECT * FROM Tbl_hospital_login WHERE Hospital_id = @hospitalId');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    const contact = result.recordset[0];
    res.json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});




/////////////////////////////////________Doctor__________////////////////////////////////////////////////






app.post("/api/Doctorlogin", async (req, res) => {
  const { email, password } = req.body;

  try {
    let pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .input("password", sql.NVarChar, password)
      .query("SELECT * FROM Tbl_doctor_login WHERE Email = @email AND Password = @password");

    if (result.recordset.length > 0) {
      const userData = result.recordset[0];
      console.log("User Data:", userData);

      req.session.userData = {
        Doctor_id: userData.Doctor_id,
        email: userData.Email,
        firstName: userData.FirstName,
        lastName: userData.LastName,
        phoneNumber: userData.PhoneNumber,
      };

      req.session.isLoggedIn = true;

      req.session.save((err) => {
        if (err) {
          console.error("Error saving session:", err);
          res.status(500).json({ error: 'Failed to save session' });
        } else {
          console.log("Session saved successfully");
          console.log("Session on server side:", req.session);
          console.log("Doctor_id on server side:", req.session.userData.Doctor_id);

          res.json({
            success: true,
            message: 'Login successful',
            Doctor_id: userData.Doctor_id,
            userEmail: userData.Email,
            firstName: userData.FirstName,
            lastName: userData.LastName,
            phoneNumber: userData.PhoneNumber,
          });
        }
      });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to connect to the database' });
  }
});


app.post('/api/doctor/register', async (req, res) => {
  try {
    await sql.connect(config);

    // Check if email already exists
    const emailCheck = await sql.query`
      SELECT Email FROM Tbl_doctor_register WHERE Email = ${req.body.email}
    `;
    
    if (emailCheck.recordset.length > 0) {
      // Email already exists
      return res.status(400).json({ message: 'Email is already in use' });
    }

    // Proceed with registration if email does not exist
    const result = await sql.query`
      INSERT INTO Tbl_doctor_register (FirstName, LastName, Email, Password, Specialization, Education, PhoneNumber, DateOfBirth, Gender, Address, CreatedAt)
      VALUES (${req.body.firstName}, ${req.body.lastName}, ${req.body.email}, ${req.body.password}, ${req.body.specialization}, ${req.body.education}, ${req.body.phoneNumber}, ${req.body.dateOfBirth}, ${req.body.gender}, ${req.body.address}, GETDATE());
      SELECT SCOPE_IDENTITY() AS DoctorID; -- Retrieve the generated DoctorID
    `;

    const doctorID = result.recordset[0].DoctorID;

    await sql.query`
      INSERT INTO Tbl_doctor_login (FirstName, LastName, Email, Password, Doctor_id, PhoneNumber)
      VALUES (${req.body.firstName}, ${req.body.lastName}, ${req.body.email}, ${req.body.password}, ${doctorID}, ${req.body.phoneNumber});
    `;

    res.status(201).json({ message: 'Doctor registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

async function updateOTPInDatabasedoctor(email, otp) {
  try {
      
      const pool = await sql.connect(config);

      const result = await pool
          .request()
          .input('email', sql.NVarChar, email)
          .query('SELECT OTP FROM Tbl_doctor_register WHERE Email = @email');

      if (result.recordset.length > 0) {
          const existingOTP = result.recordset[0].OTP;
          if (existingOTP !== otp) {
              await pool
                  .request()
                  .input('otp', sql.NVarChar, otp)
                  .input('email', sql.NVarChar, email)
                  .query('UPDATE Tbl_doctor_register SET OTP = @otp WHERE Email = @email');

              console.log('OTP updated in the database successfully for:', email);
          } else {
              console.log('OTP already exists in the database for:', email);
          }
      } else {
          console.log('No record found for email:', email);
      }

     
  } catch (error) {
      console.error("Error updating OTP in database:", error);
      throw error; 
  }
}

app.post('/api/doctor/send_otp', async (req, res) => {
  try {
      const { email } = req.body;
      const otp = generateOTP();

      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'poojachavan081096@gmail.com',
          pass: 'quks xmdh uhxe bbkz',
        }
    });

    const mailOptions = {
        from: 'poojachavan081096@gmail.com',
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP for registration is: ${otp}`
    };
      transporter.sendMail(mailOptions, async (error, info) => {
          if (error) {
              console.error("Error sending OTP:", error);
              res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
          } else {
              console.log('OTP sent:', info.response);
              // Update database with generated OTP
              try {
                  await updateOTPInDatabasedoctor(email, otp);
                  res.status(200).json({ message: 'OTP sent successfully.' });
              } catch (error) {
                  console.error("Error updating OTP in database:", error);
                  res.status(500).json({ message: 'Failed to update OTP in database.' });
              }
          }
      });
  } catch (error) {
      console.error("Error generating OTP:", error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


function generateOTP() {
 
  return Math.floor(100000 + Math.random() * 900000);
}

app.post('/api/doctor/verify_otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const pool = await sql.connect(config);

    const userResult = await pool
      .request()
      .input('email', sql.VarChar, email)
      .query('SELECT OTP FROM Tbl_doctor_register WHERE Email = @email');

    if (userResult.recordset.length > 0) {
      const storedOTP = userResult.recordset[0].OTP;

      if (otp === storedOTP) {
        res.sendStatus(200); // OTP verification successful
      } else {
        res.sendStatus(401); // Invalid OTP
      }
    } else {
      res.sendStatus(404); // Email not found
    }
  } catch (error) {
    console.error('Database error:', error);
    res.sendStatus(500); // Internal server error
  }
});


app.get('/api/doctorinfo/:doctorId', async (req, res) => {
  const doctorId = req.params.doctorId;

  try {
    let pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('doctorId', sql.Int, doctorId)
      .query('SELECT * FROM Tbl_doctor_login WHERE Doctor_id = @doctorId');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    const contact = result.recordset[0];
    res.json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT endpoint to update doctor information
app.put('/api/updatedoctor/:doctorId', async (req, res) => {
  const doctorId = req.params.doctorId;
  const { FirstName, LastName, Email, PhoneNumber } = req.body;

  try {
    let pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('doctorId', sql.Int, doctorId)
      .input('FirstName', sql.NVarChar, FirstName)
      .input('LastName', sql.NVarChar, LastName)
      .input('Email', sql.NVarChar, Email)
      .input('PhoneNumber', sql.NVarChar, PhoneNumber)
      .query(`UPDATE Tbl_doctor_login 
              SET FirstName = @FirstName, LastName = @LastName, Email = @Email, PhoneNumber = @PhoneNumber 
              WHERE Doctor_id = @doctorId`);

    if (result.rowsAffected.length === 0) {
      return res.status(404).json({ error: 'Doctor not found or no changes made' });
    }

    res.json({ message: 'Doctor profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});


app.post('/api/schedule', async (req, res) => {
  try {
    await sql.connect(config);

    const { schedule, doctorId } = req.body;

    const request = new sql.Request();

    const query = `
      MERGE Tbl_Time AS target
      USING (VALUES (@Doctor_id, @Monday, @Tuesday, @Wednesday, @Thursday, @Friday, @Saturday, @Sunday)) AS source (Doctor_id, MondaySchedule, TuesdaySchedule, WednesdaySchedule, ThursdaySchedule, FridaySchedule, SaturdaySchedule, SundaySchedule)
      ON (target.Doctor_id = source.Doctor_id)
      WHEN MATCHED THEN 
        UPDATE SET 
          MondaySchedule = source.MondaySchedule, 
          TuesdaySchedule = source.TuesdaySchedule, 
          WednesdaySchedule = source.WednesdaySchedule,
          ThursdaySchedule = source.ThursdaySchedule, 
          FridaySchedule = source.FridaySchedule, 
          SaturdaySchedule = source.SaturdaySchedule, 
          SundaySchedule = source.SundaySchedule
      WHEN NOT MATCHED THEN
        INSERT (Doctor_id, MondaySchedule, TuesdaySchedule, WednesdaySchedule, ThursdaySchedule, FridaySchedule, SaturdaySchedule, SundaySchedule)
        VALUES (source.Doctor_id, source.MondaySchedule, source.TuesdaySchedule, source.WednesdaySchedule, source.ThursdaySchedule, source.FridaySchedule, source.SaturdaySchedule, source.SundaySchedule);
    `;

    // Bind the parameters
    request.input('Doctor_id', sql.Int, doctorId);
    request.input('Monday', sql.NVarChar, schedule.Monday);
    request.input('Tuesday', sql.NVarChar, schedule.Tuesday);
    request.input('Wednesday', sql.NVarChar, schedule.Wednesday);
    request.input('Thursday', sql.NVarChar, schedule.Thursday);
    request.input('Friday', sql.NVarChar, schedule.Friday);
    request.input('Saturday', sql.NVarChar, schedule.Saturday);
    request.input('Sunday', sql.NVarChar, schedule.Sunday);

    // Execute the query
    const result = await request.query(query);

    sql.close();

    res.status(200).json({ message: 'Schedule updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating schedule' });
  }
});


app.get('/api/timetable/:doctorId', async (req, res) => {
  const { doctorId } = req.params;

  try {
    await sql.connect(config);

    const request = new sql.Request();

    const query = `
      SELECT MondaySchedule, TuesdaySchedule, WednesdaySchedule, ThursdaySchedule, FridaySchedule, SaturdaySchedule, SundaySchedule
      FROM Tbl_Time
      WHERE Doctor_id = @doctorId;
    `;

    request.input('doctorId', sql.Int, doctorId);

    const result = await request.query(query);

    if (result.recordset.length === 0) {
      // If no rows are returned, send the default timetable
      const defaultTimetable = {
        Monday: '8.00-20.00',
        Tuesday: '8.00-20.00',
        Wednesday: '8.00-20.00',
        Thursday: '8.00-20.00',
        Friday: '8.00-20.00',
        Saturday: '8.00-14.00',
        Sunday: '8.00-18.00'
      };
      return res.json(defaultTimetable);
    }

    // Construct timetable data based on the response
    const timetable = {
      Monday: result.recordset[0].MondaySchedule,
      Tuesday: result.recordset[0].TuesdaySchedule,
      Wednesday: result.recordset[0].WednesdaySchedule,
      Thursday: result.recordset[0].ThursdaySchedule,
      Friday: result.recordset[0].FridaySchedule,
      Saturday: result.recordset[0].SaturdaySchedule,
      Sunday: result.recordset[0].SundaySchedule,
    };

    res.json(timetable);
  } catch (err) {
    console.error('Error fetching timetable:', err);
    res.status(500).json({ message: 'Error fetching timetable' });
  }
});


app.post('/api/profile/doctor', async (req, res) => {
  const { specialities, bio, Doctor_id } = req.body;

  try {
    // Connect to SQL Server
    await sql.connect(config);

    const request = new sql.Request();

    // SQL query to merge (insert or update) data into Tbl_DoctorProfile table
    const query = `
      MERGE Tbl_DoctorProfile AS target
      USING (SELECT @Doctor_id AS Doctor_id) AS source
      ON (target.Doctor_id = source.Doctor_id)
      WHEN MATCHED THEN 
        UPDATE SET 
          specialities = @specialities, 
          bio = @bio
      WHEN NOT MATCHED THEN
        INSERT (Doctor_id, specialities, bio)
        VALUES (@Doctor_id, @specialities, @bio);
    `;

    // Add parameters to the request
    request.input('Doctor_id', sql.Int, Doctor_id);
    request.input('specialities', sql.NVarChar(255), specialities);
    request.input('bio', sql.NVarChar(sql.MAX), bio);

    // Execute the query
    await request.query(query);

    // Send success response
    res.status(200).json({ message: 'Specialties and Bio saved successfully' });
  } catch (err) {
    console.error('Error saving specialties and bio:', err);
    res.status(500).json({ message: 'Error saving specialties and bio' });
  } 
});

// In your server file (e.g., server.js or api.js)
app.get('/api/profile/doctor/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Connect to SQL Server
    await sql.connect(config);

    const request = new sql.Request();
    request.input('Doctor_id', sql.Int, id);

    // SQL query to fetch data from Tbl_DoctorProfile table
    const query = 'SELECT specialities, bio FROM Tbl_DoctorProfile WHERE Doctor_id = @Doctor_id';
    const result = await request.query(query);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset[0]);
    } else {
      res.status(404).json({ message: 'Doctor profile not found' });
    }
  } catch (err) {
    console.error('Error fetching doctor profile:', err);
    res.status(500).json({ message: 'Error fetching doctor profile' });
  } 
});


app.post('/api/profile/doctor/experience', async (req, res) => {
  const { doctorId, experience, period, title, hospital } = req.body;

  try {
    // Connect to SQL Server
    await sql.connect(config);

    const request = new sql.Request();
    request.input('DoctorID', sql.Int, doctorId);
    request.input('Experience', sql.NVarChar(1000), experience); // Increased size to handle more detailed experience
    request.input('Period', sql.NVarChar(50), period);
    request.input('Title', sql.NVarChar(100), title);
    request.input('Hospital', sql.NVarChar(100), hospital);

    // SQL query to merge (insert or update) data into Tbl_DoctorExperience table
    const query = `
      MERGE Tbl_DoctorExperience AS target
      USING (SELECT @DoctorID AS DoctorID, @Period AS Period, @Title AS Title, @Hospital AS Hospital) AS source
      ON (target.DoctorID = source.DoctorID AND target.Period = source.Period AND target.Title = source.Title AND target.Hospital = source.Hospital)
      WHEN MATCHED THEN 
        UPDATE SET Experience = @Experience
      WHEN NOT MATCHED THEN
        INSERT (DoctorID, Experience, Period, Title, Hospital)
        VALUES (@DoctorID, @Experience, @Period, @Title, @Hospital);
    `;

    await request.query(query);

    res.status(201).json({ message: 'Experience added or updated successfully' });
  } catch (err) {
    console.error('Error adding or updating experience:', err);
    res.status(500).json({ message: 'Error adding or updating experience' });
  } 
});


app.put('/api/profile/update/experience/:ExperienceID', async (req, res) => {
  const { doctorId, experience, period, title, hospital } = req.body;
  const ExperienceID = req.params.ExperienceID;

  try {
    await sql.connect(config);
    const request = new sql.Request();
    request.input('ExperienceID', sql.Int, ExperienceID);
    request.input('DoctorID', sql.Int, doctorId);
    request.input('Experience', sql.NVarChar(1000), experience);
    request.input('Period', sql.NVarChar(50), period);
    request.input('Title', sql.NVarChar(100), title);
    request.input('Hospital', sql.NVarChar(100), hospital);

    const query = `
      UPDATE Tbl_DoctorExperience
      SET Experience = @Experience,
          Period = @Period,
          Title = @Title,
          Hospital = @Hospital
      WHERE ExperienceID = @ExperienceID AND DoctorID = @DoctorID
    `;

    const result = await request.query(query);

    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: 'Experience updated successfully' });
    } else {
      res.status(404).json({ message: 'Experience not found or not updated' });
    }
  } catch (err) {
    console.error('SQL error:', err.message);
    res.status(500).json({ message: 'Error updating experience' });
  } 
});

app.get('/api/profile/doctor/:id/experience', async (req, res) => {
  const { id } = req.params;

  try {
    // Connect to SQL Server
    await sql.connect(config);

    const request = new sql.Request();
    request.input('DoctorID', sql.Int, id);

    // SQL query to fetch doctor's experience data
    const query = `
      SELECT Period, Title, Hospital, Experience,ExperienceID,DoctorID
      FROM Tbl_DoctorExperience
      WHERE DoctorID = @DoctorID
    `;

    const result = await request.query(query);

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json({ message: 'Doctor experience not found' });
    }
  } catch (err) {
    console.error('Error fetching doctor experience:', err);
    res.status(500).json({ message: 'Error fetching doctor experience' });
  } 
});


app.post('/api/uploadImage', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { doctorId, name } = req.body;
    const filePath = req.file.path;

    // Read image file as a buffer
    const imageBuffer = await fs.readFile(filePath);

    // Connect to the database
    await sql.connect(config);

    // Create a new request object
    const request = new sql.Request();

    // Define the SQL query with parameterized inputs
    const query =
      'INSERT INTO Tbl_DoctorImage (Doctor_id,  Image) VALUES (@doctorId,  @image)';

    // Add parameters to the request
    request.input('doctorId', sql.Int, doctorId);
 
    request.input('image', sql.VarBinary(sql.MAX), imageBuffer);

    // Execute the query
    const result = await request.query(query);

    // Check if the query was successful
    if (result.rowsAffected && result.rowsAffected.length > 0 && result.rowsAffected[0] === 1) {
      res.json({ success: true, message: 'Image uploaded successfully', fileName: req.file.filename });
    } else {
      res.status(500).json({ success: false, message: 'Failed to upload image to database' });
    }

    // Close the database connection
    await sql.close();

    // Delete the uploaded file after processing
    await fs.unlink(filePath);

  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ success: false, message: 'Error uploading image' });
  }
});

// Ensure the uploads directory exists
const uploadDir = './uploads';
(async () => {
  try {
    await fs.access(uploadDir);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.mkdir(uploadDir);
    } else {
      console.error('Error checking or creating uploads directory:', err);
    }
  }
})();

app.get('/api/doctorimage/:doctorId', async (req, res) => {
  const doctorId = req.params.doctorId;
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('doctorId', sql.Int, doctorId)
      .query(`
        SELECT TOP 1 Image 
        FROM Tbl_DoctorImage 
        WHERE Doctor_id = @doctorId
        ORDER BY  Id  DESC
      `);
    
    if (result.recordset.length > 0) {
      const imageBuffer = result.recordset[0].Image;
      res.writeHead(200, {
        'Content-Type': 'image/jpeg',
        'Content-Length': imageBuffer.length,
      });
      res.end(imageBuffer);
    } else {
      res.status(404).send('Image not found');
    }
  } catch (error) {
    console.error('Error fetching doctor image:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/api/updatePassword', async (req, res) => {
  const { doctorId, oldPassword, newPassword } = req.body;

  try {
    await sql.connect(config);

    const request = new sql.Request();

    // Check if old password matches
    const checkQuery = `
      SELECT Doctor_id FROM Tbl_doctor_login 
      WHERE Doctor_id = @doctorId AND Password = @oldPassword;
    `;

    request.input('doctorId', sql.Int, doctorId);
    request.input('oldPassword', sql.NVarChar, oldPassword);

    const checkResult = await request.query(checkQuery);

    if (checkResult.recordset.length === 0) {
      return res.status(400).json({ message: 'Invalid old password' });
    }

    // Update password
    const updateQuery = `
      UPDATE Tbl_doctor_login
      SET Password = @newPassword
      WHERE Doctor_id = @doctorId;
    `;

    request.input('newPassword', sql.NVarChar, newPassword);

    await request.query(updateQuery);

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error updating password:', err);
    res.status(500).json({ message: 'Error updating password' });
  }
});

app.post("/api/change-password", async (req, res) => {
  const { email, newPassword, repeatPassword } = req.body;

  if (!pool) {
    return res.status(500).json({ success: false, message: 'Database connection not established' });
  }

  // Validate if new password and repeat password match
  if (newPassword !== repeatPassword) {
    return res.json({ success: false, message: "New password and repeat password do not match" });
  }

  try {

    // Update password
    const updatePasswordResult = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .input("newPassword", sql.NVarChar, newPassword)
      .query("UPDATE Tbl_doctor_login SET Password = @newPassword WHERE Email = @email");

    if (updatePasswordResult.rowsAffected[0] > 0) {
      res.json({ success: true, message: "Password changed successfully" });
    } else {
      res.json({ success: false, message: "Password change failed" });
    }
  } catch (error) {
    console.error("Database error:", error);
    res.sendStatus(500);
  }
});


app.get('/api/approved-doctors/:HospitalId', async (req, res) => {
  const { HospitalId } = req.params;
  
  try {
    let pool = await sql.connect(config);
    let result = await pool.request()
      .input('HospitalID', sql.Int, HospitalId)
      .query('SELECT * FROM [dbo].[Tbl_request_doctor] WHERE status = \'approved\' AND HospitalID = @HospitalID');

    res.json(result.recordset);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.get('/api/get-Hospital', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM Tbl_HospitalProfile
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/register-doctor', async (req, res) => {
  const {
    hospitalId, // Receive hospital ID from the request body
    doctorName,
    speciality,
    experience,
    department,
    education,
    contact,
    email,
    availableTime,
    address,
    doctorId,
    gender
  } = req.body;

  try {
    let pool = await sql.connect(config);
    const result = await pool.request()
      .input('hospitalId', sql.Int, hospitalId) // Include hospital ID in the SQL query
      .input('doctorId', sql.Int, doctorId) // Include hospital ID in the SQL query
      .input('doctorName', sql.NVarChar, doctorName)
      .input('speciality', sql.NVarChar, speciality)
      .input('experience', sql.NVarChar, experience)
      .input('department',sql.NVarChar, department)
      .input('education', sql.NVarChar, education)
      .input('contact', sql.NVarChar, contact)
      .input('email', sql.NVarChar, email)
      .input('availableTime', sql.NVarChar, availableTime)
      .input('address', sql.NVarChar, address)
      .input('gender', sql.NVarChar, gender)
      .query(`
        INSERT INTO Tbl_request_doctor (HospitalID,DoctorID, DoctorName, Speciality, Experience, Department, Education, Contact, Email, AvailableTime, Address, Gender)
        VALUES (@hospitalId,@doctorId, @doctorName, @speciality, @experience, @department, @education, @contact, @email, @availableTime, @address, @gender)
      `);

    res.status(201).json({ success: true, message: 'Doctor registered successfully' });
  } catch (err) {
    console.error('Error registering doctor:', err);
    res.status(500).json({ success: false, message: 'Failed to register doctor' });
  }
});

app.get('/api/requested-doctors/:hospitalId', async (req, res) => {
  const hospitalId = req.params.hospitalId;
  console.log('Hospital ID:', hospitalId); // Check hospitalId value

  try {
    let pool = await sql.connect(config);
    const result = await pool.request()
      .input('hospitalId', sql.Int, hospitalId)
      .query('SELECT * FROM Tbl_request_doctor WHERE HospitalID = @hospitalId');

    console.log('Result:', result.recordset); // Check result from database

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error fetching requested doctors:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch requested doctors' });
  }
});

app.get('/api/requested-Hospitals/:doctorId', async (req, res) => {
  const doctorId = req.params.doctorId;
  console.log('doctor ID:', doctorId); // Check doctorId value

  try {
    let pool = await sql.connect(config);
    const result = await pool.request()
      .input('doctorId', sql.Int, doctorId)
      .query(`
        SELECT rd.*, hp.name 
        FROM Tbl_request_doctor rd
        INNER JOIN Tbl_HospitalProfile hp ON rd.HospitalID = hp.Hospital_id
        WHERE rd.DoctorID = @doctorId
      `);

    console.log('Result:', result.recordset); // Check result from database

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error fetching requested doctors:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch requested doctors' });
  }
});


app.post('/api/approve-doctor', async (req, res) => {
  const { doctorID, hospitalID } = req.body;

  try {
    let pool = await sql.connect(config);

    // Update the status of the doctor to 'approved'
    await pool.request()
      .input('status', sql.NVarChar, 'approved')
      .input('doctorID', sql.Int, doctorID)
      .input('hospitalID', sql.Int, hospitalID)
      .query('UPDATE Tbl_request_doctor SET Status = @status WHERE DoctorID = @doctorID AND HospitalID = @hospitalID');

    // Fetch the updated list of approved doctors
    const result = await pool.request()
      .input('status', sql.NVarChar, 'approved')
      .input('hospitalID', sql.Int, hospitalID)
      .query('SELECT DoctorID, DoctorName, Speciality, Experience, Education, Contact, Email, AvailableTime, Address, Gender FROM Tbl_request_doctor WHERE Status = @status AND HospitalID = @hospitalID');

    res.json(result.recordset);
  } catch (error) {
    console.error('Error approving doctor:', error);
    res.status(500).send('Error approving doctor');
  }
});

// Optional reject endpoint

app.post('/api/reject-doctor', async (req, res) => {
  const { doctorID, hospitalID } = req.body;

  try {
    // Ensure connection is established
    let pool = await sql.connect(config);
    const request = pool.request();

    // Update Status to 'rejected' in Tbl_request_doctor
    const query = `
      UPDATE Tbl_request_doctor 
      SET Status = @status 
      WHERE DoctorID = @doctorID AND HospitalID = @hospitalID
    `;
    const result = await request
      .input('status', sql.NVarChar, 'rejected')
      .input('doctorID', sql.Int, doctorID)
      .input('hospitalID', sql.Int, hospitalID)
      .query(query);

    res.send('Doctor rejected successfully');
  } catch (error) {
    console.error('Error rejecting doctor:', error);
    res.status(500).send('Error rejecting doctor');
  }
});


app.get('/api/doctors-requested', async (req, res) => {
  try {
    let pool = await sql.connect(config);
    // Fetch doctors with Status set to 'approved'
    const result = await pool.request()
      .input('status', sql.NVarChar, 'approved')
      .query('SELECT DoctorID, DoctorName, Speciality, Experience, Education, Contact, Email, AvailableTime, Address, Gender FROM Tbl_request_doctor WHERE Status = @status');

    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching approved doctors:', error);
    res.status(500).send('Error fetching approved doctors');
  }
});

app.get('/api/get-Doctors', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM Tbl_doctor_register
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/get-showdr', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT 
    p.Doctor_id,
    p.specialities,
    l.firstName,
    l.lastName,
    l.email
  FROM Tbl_DoctorProfile p
  INNER JOIN Tbl_doctor_login l
  ON p.Doctor_id = l.Doctor_id
  
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/myhospitals/:doctorId', async (req, res) => {
  const { doctorId } = req.params;
  try {
    await sql.connect(config);
    const result = await sql.query`
      SELECT h.*
      FROM Tbl_HospitalProfile h
      INNER JOIN Tbl_request_doctor r
      ON h.Hospital_id = r.HospitalID
      WHERE r.DoctorID = ${doctorId}
      AND r.Status = 'approved'
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/myhospitalsappointment/:doctorId', async (req, res) => {
  const { doctorId } = req.params;
  try {
    await sql.connect(config);
    const result = await sql.query`
      SELECT h.*, d.FirstName, d.LastName, d.Doctor_id, a.department_name AS Department, a.dep_id AS DepartmentId
      FROM Tbl_HospitalProfile h
      INNER JOIN Tbl_request_doctor r ON h.Hospital_id = r.HospitalID
      INNER JOIN Tbl_doctor_login d ON r.DoctorID = d.Doctor_id
      INNER JOIN Tbl_Adddepartment a ON r.Department = a.dep_id
      WHERE r.DoctorID = ${doctorId}
      AND r.Status = 'approved'
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/myhos/:hospitalId', async (req, res) => {
  const { hospitalId } = req.params;
  try {
    await sql.connect(config);
    const result = await sql.query`
      SELECT h.*, d.FirstName, d.LastName, d.Doctor_id, a.department_name AS Department, a.dep_id AS DepartmentId
      FROM Tbl_HospitalProfile h
      INNER JOIN Tbl_request_doctor r ON h.Hospital_id = r.HospitalID
      INNER JOIN Tbl_doctor_login d ON r.DoctorID = d.Doctor_id
      INNER JOIN Tbl_Adddepartment a ON r.Department = a.dep_id
      WHERE h.Hospital_id = ${hospitalId}
      AND r.Status = 'approved'
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});



app.post('/api/request-doctor', async (req, res) => {
  const {
    role,
    experience,
    education,
    contact,
    email,
    workingTime,
    address,
    doctorId,
    hospitalId,
    message
  } = req.body;

  try {
    let pool = await sql.connect(config);
    const result = await pool.request()
      .input('role', sql.NVarChar, role)
      .input('doctorId', sql.Int, doctorId)
      .input('hospitalId', sql.Int, hospitalId)
      .input('experience', sql.NVarChar, experience)
      .input('education', sql.NVarChar, education)
      .input('contact', sql.NVarChar, contact)
      .input('email', sql.NVarChar, email)
      .input('workingTime', sql.NVarChar, workingTime)
      .input('address', sql.NVarChar, address)
      .input('message', sql.NVarChar, message)
      .query(`
        INSERT INTO Tbl_RequestHospital (Role,HospitalID,DoctorID,Experience, Education, ContactNo, Email, WTime, Address, Message)
        VALUES (@role,@experience,@HospitalId,@DoctorId, @education, @contact, @email, @workingTime, @address, @message)
      `);

    res.status(201).json({ success: true, message: 'Doctor registered successfully' });
  } catch (err) {
    console.error('Error registering doctor:', err);
    res.status(500).json({ success: false, message: 'Failed to register doctor' });
  }
});

app.get('/api/requested-hospitals', async (req, res) => {
  try {
    let pool = await sql.connect(config);
    const result = await pool.request().query(`
      SELECT * FROM Tbl_RequestHospital
    `);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error fetching requested doctors:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch requested doctors' });
  }
});

////////////////////////////////////////////////////////


// app.post('/api/save-event', async (req, res) => {
//   const { ename, edate, etime, edesc, ecolor, etype } = req.body;

//   try {
//     // Connect to SQL Server
//     await sql.connect(config);

//     const request = new sql.Request();
//     request.input('ename', sql.NVarChar(255), ename);
//     request.input('edate', sql.Date, edate); // Use Date type for edate
//     request.input('etime', sql.Time, etime); // Use Time type for etime
//     request.input('edesc', sql.NVarChar(sql.MAX), edesc); // Use sql.MAX for TEXT in SQL Server
//     request.input('ecolor', sql.NVarChar(50), ecolor);
//     request.input('etype', sql.NVarChar(50), etype); // Add etype input parameter

//     // SQL query to insert event into Tbl_events table
//     const query = `
//       INSERT INTO Tbl_events (ename, edate, etime, edesc, ecolor, etype)
//       VALUES (@ename, @edate, @etime, @edesc, @ecolor, @etype);
//     `;

//     await request.query(query);

//     console.log('Event saved to database!');
//     res.status(201).send('Event saved successfully!');
//   } catch (err) {
//     console.error('Error saving event:', err);
//     res.status(500).send('Error saving event');
//   } 
// });

app.post('/api/save-event', async (req, res) => {
  const { ename, edate, etime, edesc, ecolor, etype } = req.body;

  try {
    // Connect to SQL Server
    await sql.connect(config);

    const request = new sql.Request();
    request.input('ename', sql.NVarChar(255), ename);
    request.input('edate', sql.Date, edate); // Use Date type for edate
    request.input('etime', sql.Time, etime); // Use Time type for etime
    request.input('edesc', sql.NVarChar(sql.MAX), edesc); // Use sql.MAX for TEXT in SQL Server
    request.input('ecolor', sql.NVarChar(50), ecolor);
    request.input('etype', sql.NVarChar(50), etype); // Add etype input parameter

    // SQL query to insert event into Tbl_events table
    const query = `
      INSERT INTO Tbl_events (ename, edate, etime, edesc, ecolor, etype)
      VALUES (@ename, @edate, @etime, @edesc, @ecolor, @etype);
    `;

    await request.query(query);

    console.log('Event saved to database!');
    res.status(201).send('Event saved successfully!');
  } catch (err) {
    console.error('Error saving event:', err);
    res.status(500).send('Error saving event');
  }
});

app.get('/api/events', async (req, res) => {
  try {
    await sql.connect(config);

    const result = await sql.query`SELECT ename, edate, etime, edesc, ecolor FROM Tbl_events`;
    const events = result.recordset.map(event => ({
      title: event.ename,
      start: event.edate,
      end: event.edate, 
      time:event.etime,
      description: event.edesc,
      className: event.ecolor,
      extendedProps: {
        description: event.edesc,
      }
    }));

    res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Error fetching events' });
  }
});

app.get('/api/events/filter', async (req, res) => {
  try {
    await sql.connect(config);

    const eventType = req.query.type;

    let query = 'SELECT ename, edate, etime, edesc, ecolor, etype FROM Tbl_events';
    if (eventType) {
      query += ` WHERE etype = '${eventType}'`;
    }

    const result = await sql.query(query);
    const events = result.recordset.map(event => ({
      title: event.ename,
      start: event.edate,
      end: event.edate,
      time: event.etime,
      description: event.edesc,
      className: event.ecolor,
      extendedProps: {
        description: event.edesc,
        type: event.etype
      }
    }));

    res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Error fetching events' });
  }
});





const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
