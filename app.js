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
const itemsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

const listSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    items: [itemsSchema]
})

//Criação da coleção
const Items = mongoose.model('Items', itemsSchema);

const Lists = mongoose.model('Lists', listSchema);

//Usar um compressor do corpo requisição
//Parser interno do Express
app.use(express.urlencoded({extended: true}));

//Arquivos Static.
app.use(express.static(path.join(__dirname + '/public')));

//Configuração EJS
app.set('view engine', 'ejs');

//Renderizar a página
app.get('/', async (req, res) => {

    try {
        //Chamada da função getDate
        const today = date.getDate();
        
        /*Busca no banco de dados todos as listas. Retornando a aplicação
        um array de objetos. Na Pagina EJS de renderizacão somente add no indice o ".name"
        */
        const list = await Lists.find({});

        //Renderização com parametros EJS
        res.render('list', {
            today: today,
            newList: list,
            listTittle: "Home"
        });

    } catch (error) {

        console.log('erro na rota "/" ', error);

    }

})

//Adicionar Listas
app.post('/', async (req, res) => {
     
    try {
        //Armazenamento dos dados do corpo da requisição
        const dataInput = req.body.todoInput;
        
        //Vendo o que está chegando nos dados
        const debug = req.body
        console.log(debug)

        //Enviando dados para o Banco de dados.
        //await Items.create({ name: dataInput });
        await Lists.create({name: dataInput, items: []});
        //Após inserção dos dados, redireciona para a pagina principal
        res.redirect('/');
        
    } catch (error) {

        console.log('Erro no envio dos dados', error);

    } 
})

//Deletar Listas
app.post('/delete', async (req,res) => {
    try {
        //Captura do id do Input(Checkbox)
        const idListChecked = req.body.checkbox;
        const ListRemoved = await Lists.findByIdAndDelete({_id: idListChecked});
        
        //Procurar ID e deletar no banco de dados e validação
        if(!ListRemoved){

            console.log(`${itemRemoved} não foi encontrado, ocorreu algum erro e verificaremos.`);

        } else {

            //Redirecionamento da pagina após a deletação
            console.log('item deletado com sucesso');
            res.redirect('/');

        }
        
  
    } catch (error) {
        console.log('erro na hora de deletar o item do banco de dados', error);
    }

})

//Endereço dinâmico
app.get('/:listSelected', async (req, res) => {
    try {
        const paramCatched = req.params.listSelected;
    
        console.log('Capturado o id', paramCatched);
    
        const list = await Lists.findById({ _id: paramCatched});

        console.log('lista selecionada' , list);
        console.log('Teste de seleção dos items', list.items);

        // res.redirect('/');
        //ate aqui em cima ok
        
        //Chamada da função getDate
        const today = date.getDate();

        res.render('listSelected', {
            today: today,
            items: list.items,
            listTittle: list.name
        });

    } catch (error) {
        console.log('erro na rota dinamica analisar o seguinte erro' , error);
    } 
})


//Levantamento do servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
})

