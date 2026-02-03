const express= require("express")
const app=express()
const port=5000

let todos=[]

app.use(express.json())

app.get("/todo",(req,res)=>{
    return res.status(200).send(todos);    
})

app.post("/todo",(req,res)=>{
    try {
        const body = req.body ;
        if(!body || !body.todo){
            return res.status(400).send({message:"todo not found"})
        }
        todos.push(body.todo)
        return res.status(200).send({message:"to do added successfully"},todos)
    } catch (error) {
        return res.status(500).send({message:"internal server error"})
    }
})

app.put("/todo/update", (req,res)=>{
    try {
        const body= req.body;
        const {oldTodo, newTodo}=body;
        const index=todos.indexOf(oldTodo);
        if(index=== -1){
            return res.status(400).send({message:"todo not found"})
        }
        todos[index]=newTodo;
        return res.status(200).send({message:"todo updated successfully"},todos)
    } catch (error) {
        return res.status(500).send(error)
    }
})
app.delete("/todo/remove",(req,res)=>{
    try {
        const body = req.body;
        const rem=body.todo;
        // console.log(rem);
        
        const index=todos.indexOf(rem);
        if(index === -1){
            return res.status(400).send({message:"todo not found in array"})
        }
        todos.splice(index,1)
        return res.status(200).send({message:"todo deleted successfully"})
        // console.log(todos)
    } catch (error) {
        return res.status(500).send(error)
    }
})

app.listen(port,()=>{
    console.log(`app is listening to port ${port}`)
})

