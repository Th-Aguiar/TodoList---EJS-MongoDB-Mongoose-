const express = require('express');
const app = express();
const mongoose = require('mongoose');

//const bodyParser = require("body-parser"); Não usar, pois, o EXPRESS já possui um método interno de parser
const port = 3000;
//Path do node
const path = require('path');
const date = require(__dirname + "/modules/date.js");

//Conexão com o Banco de dados
mongoose.connect('mongodb://127.0.0.1:27017/todolistDb');

//Definição dos Schemas
const todoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

//Criação da coleção
const TodoList = mongoose.model('todoList', todoSchema);

//Criação de um Objeto requerido.
const todo = new TodoList({
    name:"Ler a bíblia"
})
//Variavel de armazenamento
let listItems = [];
let workList = [];


//Usar um compressor do corpo requisição
//Parser interno do Express
app.use(express.urlencoded({extended: true}));

//Arquivos Static.
app.use(express.static(path.join(__dirname + '/public')));

//Configuração EJS
app.set('view engine', 'ejs');

//Rota principal
app.get('/', (req, res) => {
    //Chamada da função getDate
    const today = date.getDate();

    //Renderização com parametros EJS
    res.render('list', {
        today: today,
        newListItem: listItems,
        listTittle: "Home"
    });
})

//Rota Work
app.get('/trabalho', (req,res) => {
    const today = getDate();

    //Renderização com parametros EJS
    res.render('list', {
        today: today,
        newListItem: workList,
        listTittle: "Work",
    })
})


//Post Home
app.post('/', (req, res) => {
    //Armazenamento dos dados do corpo da requisição
    const data = req.body.todoInput;
    const debug = req.body
    const buttonValue = req.body.button;
    console.log(debug)

    if(buttonValue === "Work"){
        //Adicionar dados em uma array
        workList.push(data);

        //Redirecionamento
        res.redirect('/trabalho');
    } else {
        //Adicionar dados em uma array.
        listItems.push(data);

        //redirecionamento
        res.redirect('/')
    }

})

//Post Work
app.post('/post', (req, res) => {
    //Armazenamento dos dadosdo corpo da requisição.
    const data = req.body.todoInput;

    //adicionar dados em uma array.
    workList.push(data);
    //redicerionamento

    res.redirect('/trabalho');
})
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
})

