const express = require("express")
// import mysql from 'mysql2/promise';
const pool = require("./db")
const app = express()
const port = 5000

app.use(express.json())

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
        const { todo, todo_desc, deadline, user_id } = req.body;
        if (!todo || !todo_desc || !deadline || !user_id) {
            return res.status(400).json({ message: "all fields required" })
        }

        const queryString = 'insert into todo_app (todo,todo_desc,deadline,user_id) values(?,?,?,?)';
        const queryValues = [todo, todo_desc, deadline, user_id];
        const result = await pool.query(queryString, queryValues);
        console.log({result})
        return res.status(200).json({ message: "to do added successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server error" }, error)
    }
})

app.put("/todo", (req, res) => {
    try {
        const body = req.body;
        const { oldTodo, newTodo } = body;
        const index = todos.indexOf(oldTodo);
        if (index === -1) {
            return res.status(400).send({ message: "todo not found" })
        }
        todos[index] = newTodo;
        return res.status(200).send({ message: "todo updated successfully" }, todos)
    } catch (error) {
        return res.status(500).send(error)
    }
})
app.delete("/todo", (req, res) => {
    try {
        const body = req.body;
        const rem = body.todo;
        // console.log(rem);

        const index = todos.indexOf(rem);
        if (index === -1) {
            return res.status(400).send({ message: "todo not found in array" })
        }
        todos.splice(index, 1)
        return res.status(200).send({ message: "todo deleted successfully" })
        // console.log(todos)
    } catch (error) {
        return res.status(500).send(error)
    }
})

app.listen(port, () => {
    console.log(`app is listening to port ${port}`)
})

