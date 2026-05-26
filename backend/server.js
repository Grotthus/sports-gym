import db from "./config/db.js";
import express from "express";
import cors from "cors";
import crypto from "crypto";
//const express = require(`express`);
const app = express();
const authCodes = {};

function hashPassword(password) {
  return crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
}

app.use(cors());
app.use(express.json()); //to read json
app.get(`/`,(req, res) => {
    //console.log("asdjakdh" + req.params.id);
    res.send(`hello server is running`);
});

app.get("/users", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users");
    res.json(rows);
  } catch (err) {
    res.status(500).send("DB error");
  }
});
/// READ: get one user by id
/*
SELECT `users`.*, `users`.`id_User`
FROM `users`;

*/
app.get("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await db.query("SELECT `users`.*, `users`.`id_User` FROM `users` WHERE `users`.`id_User` = ?", [id]);
    res.json(rows);
  } catch (err) {
    res.status(500).send("DB error");
  }
});
// READ: get all active memberships
app.get("/memberships", async (req,res) => {
  try{
    const [rows] = await db.query("SELECT `membership`.*, `membership`.`IsActive` FROM `membership` WHERE `membership`.`IsActive` = '1';");
    res.json(rows);
  }
  catch(err){
    res.status(500).send("DB membership error");
  }

});
// READ: get one membership by id
app.get("/memberships/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await db.query(
      "SELECT * FROM Membership WHERE id_Membership = ?",
      [id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB membership by id error");
  }
});

// CREATE: insert membership
app.post("/memberships", async (req, res) => {
  try {
    const { Name, BasePrice, Period, Description, IsActive, fk_Discountid_Discount } = req.body;

    const [result] = await db.query(
      `INSERT INTO Membership
      (Name, BasePrice, Period, Description, IsActive, fk_Discountid_Discount)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [Name, BasePrice, Period, Description, IsActive, fk_Discountid_Discount]
    );

    res.json({ message: "Membership created", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).send("Insert membership error");
  }
});

// UPDATE: update membership
app.put("/memberships/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { Name, BasePrice, Period, Description } = req.body;

    await db.query(
      `UPDATE membership
       SET Name = ?, BasePrice = ?, Period = ?, Description = ?
       WHERE id_Membership = ?`,
      [Name, BasePrice, Period, Description, id]
    );

    res.send(`Membership updated: ${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Update membership error");
  }
});

//////// update: user
app.put("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const [rows] = await db.query(
      "SELECT * FROM users WHERE id_User = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const currentUser = rows[0];

    const {
      Email = currentUser.Email,
      Name = currentUser.Name,
      LastName = currentUser.LastName,
      Address = currentUser.Address,
      PhoneNumber = currentUser.PhoneNumber,
      Role = currentUser.Role,
      fk_Membershipid_Membership = currentUser.fk_Membershipid_Membership
    } = req.body;

    await db.query(
      `UPDATE users
       SET Email = ?, Name = ?, LastName = ?, Address = ?, PhoneNumber = ?, Role = ?, fk_Membershipid_Membership = ?
       WHERE id_User = ?`,
      [
        Email,
        Name,
        LastName,
        Address,
        PhoneNumber,
        Role,
        fk_Membershipid_Membership,
        id
      ]
    );

    res.json({ success: true, message: `User updated: ${id}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Update user error" });
  }
});
// SOFT DELETE: deactivate membership
app.put("/memberships/deactivate/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await db.query(
      "UPDATE Membership SET IsActive = 0 WHERE id_Membership = ?",
      [id]
    );

    res.send(`Membership deactivated: ${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Deactivate membership error");
  }
});

// HARD DELETE: delete membership
app.delete("/memberships/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await db.query(
      "DELETE FROM Membership WHERE id_Membership = ?",
      [id]
    );

    res.send(`Membership deleted: ${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Delete membership error");
  }
});

// check if exists
app.post("/memberships/exists/", async (req, res) => {
  try {
    const {email, password} = req.body;
    const hashedPassword = hashPassword(password);
    const [rows] = await db.query(
      "SELECT `users`.*, `users`.`Email`, `users`.`Password` FROM `users` WHERE `users`.`Email` = ? AND `users`.`Password` = ? ",
      [email, hashedPassword]
    );

    if(rows.length === 0) {
      return res.json({ exists: false});
    }

    const user = rows[0];
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    authCodes[user.id_User] = code;

    console.log(`AUTH CODE for ${user.Email}: ${code}`);

    if(rows.length === 1 )
    {
    return res.json({ exists: true, requiresCode: true, role: rows[0]?.Role, id: rows[0]?.id_User || null });   
   }
  } catch (err) {
    console.error(err);
    res.status(500).send("Checking membership error");
  }
});
//// verify auth code
app.post("/auth/verify", (req, res) => {
  const { userId, code } = req.body;

  if (authCodes[userId] === code) {
    delete authCodes[userId];

    return res.json({
      success: true,
      id: userId,
    });
  }

  res.json({
    success: false,
    message: "Invalid code",
  });
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}/`);
});