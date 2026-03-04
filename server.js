const express = require("express")
const cors = require("cors");
const path = require("path");


const pool = require("./db")
const app = express()
const port = 5000

app.use(cors());
app.use(express.json())
app.use(express.static(path.join(__dirname, "TODO_UI1")));

app.get("/todo", async (req, res) => {
    try {
        const [rows] = await pool.query('select * from todo_app');
        if (!rows) {
            return res.status(400).json({ message: "todo not found" })
        }
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).send(error)
    }
})
app.post("/todo", async (req, res) => {
    try {
        console.log(req.body)
        const { todo, todo_desc, deadline, user_id } = req.body;
        if (!todo || !todo_desc || !deadline || !user_id) {
            return res.status(400).json({ message: "all fields required" })
        }
        const queryString = 'insert into todo_app (todo,todo_desc,deadline,user_id) values(?,?,?,?)';
        const queryValues = [todo, todo_desc, deadline, user_id];
        const result = await pool.query(queryString, queryValues);
        return res.status(200).json({ message: "to do added successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server error" }, error)
    }
})
app.put("/todo/:id", async (req, res) => {
    try {
        const todo_id = req.params.id;
        const { todo, todo_desc, deadline, priority, todo_status } = req.body;
        
        const queryString = 'update todo_app set todo=?,todo_desc = ?,deadline = ?,priority = ?,todo_status = ? where todo_id=?'
        const queryValues = [todo, todo_desc,deadline,priority,todo_status, todo_id]
        const result = await pool.query(queryString, queryValues);
        return res.status(200).json({ message: "todo updated successfully" }, result)

    } catch (error) {
        return res.status(500).send(error)
    }
})
app.delete("/todo/:id", async (req, res) => {
    try {
        const todo_id = req.params.id;
        const queryString = 'delete from todo_app where todo_id=?'
        const queryValues = [todo_id]
        const result = await pool.query(queryString, queryValues);
        return res.status(200).send({ message: "todo deleted successfully" })
    } catch (error) {
        return res.status(500).send(error)
    }
})


app.listen(port, () => {
    console.log(`app is listening to port ${port}`)
})

