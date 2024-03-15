const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

function findIndex(arr, id){
    for(let i = 0; i < arr.length; i++){
        if(arr[i].id === id) return i;
    }
    return -1;
}

function removeAtIndex(arr, index){
    let newArray = [];
    for(let i = 0; i < arr.length; i++){
        if(i !== index) newArray.push(arr[i]);
    }
    return newArray;
}

app.get('/todos', (req,res) => {
    fs.readFile("todos.json", "utf-8", (err, data) => {
        if(err) throw err;
        var answer = JSON.parse(data);
        res.json(answer);
    });
});


app.post('/todos' , (req,res) => {
    const newTodo = {
        id: Math.floor(Math.random() * 1000000), 
        title: req.body.title,
        description: req.body.description    
    };
    fs.readFile("todos.json", "utf-8", (err, data) => {
        if(err) throw err;
        const todos = JSON.parse(data);
        todos.push(newTodo);
        fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
            if(err) throw err;
            res.status(201).json(newTodo);
        });
    });
    
});

app.delete('/todos/:id', (req,res) => {
    fs.readFile("todos.json","utf-8", (err, data) => {
        if(err) throw err;
        let todos = JSON.parse(data);
        const todoIndex = findIndex(todos, parseInt(req.params.id));
        if(todoIndex === -1) {
            res.status(404).send();
        } else {
            todos = removeAtIndex(todos, todoIndex);
            fs.writeFile("todos.json", JSON.stringify(todos) , (err) => {
                if(err) throw err;
                res.status(200).send();
            })
    }
    });
});



app.use((req, res, next) => {
    res.status(404).send();
});

app.listen(3000);