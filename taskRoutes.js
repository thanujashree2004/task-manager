const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/auth");


// ================= CREATE TASK =================
router.post("/", auth, (req, res) => {
  const { title, description, assigned_to, status } = req.body;

  db.query(
    "INSERT INTO tasks (title, description, created_by, assigned_to, organization_id, status) VALUES (?,?,?,?,?,?)",
    [title, description, req.user.id, assigned_to, req.user.orgId, status || "todo"],
    (err, result) => {
      if (err) return res.send(err);

      db.query(
        "INSERT INTO audit_logs (user_id, task_id, action) VALUES (?,?,?)",
        [req.user.id, result.insertId, "CREATE"]
      );

      res.send("Task created");
    }
  );
});


// ================= GET TASKS =================
router.get("/", auth, (req, res) => {
  db.query(
    "SELECT * FROM tasks WHERE organization_id=?",
    [req.user.orgId],
    (err, result) => {
      if (err) return res.send(err);
      res.json(result);
    }
  );
});


// ================= UPDATE TASK =================
router.put("/:id", auth, (req, res) => {
  const { title, description, status } = req.body;

  db.query(
    "UPDATE tasks SET title=?, description=?, status=? WHERE id=? AND organization_id=?",
    [title, description, status, req.params.id, req.user.orgId],
    (err) => {
      if (err) return res.send(err);

      db.query(
        "INSERT INTO audit_logs (user_id, task_id, action) VALUES (?,?,?)",
        [req.user.id, req.params.id, "UPDATE"]
      );

      res.send("Task updated");
    }
  );
});


// ================= DELETE TASK =================
router.delete("/:id", auth, (req, res) => {
  db.query(
    "DELETE FROM tasks WHERE id=? AND organization_id=?",
    [req.params.id, req.user.orgId],
    (err) => {
      if (err) return res.send(err);

      db.query(
        "INSERT INTO audit_logs (user_id, task_id, action) VALUES (?,?,?)",
        [req.user.id, req.params.id, "DELETE"]
      );

      res.send("Task deleted");
    }
  );
});

module.exports = router;