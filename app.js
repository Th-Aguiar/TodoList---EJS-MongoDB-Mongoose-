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

//Criação da coleção
const Items = mongoose.model('Items', itemsSchema);


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
        const item = await Items.find({});

        //Renderização com parametros EJS
        res.render('list', {
            today: today,
            newListItem: item,
            listTittle: "Home"
        });

    } catch (error) {

        console.log('erro na rota "/" ', error);

    }

})

//Adicionar item
app.post('/', async (req, res) => {
     
    try {
        //Armazenamento dos dados do corpo da requisição
        const dataInput = req.body.todoInput;
        
        //Vendo o que está chegando nos dados
        const debug = req.body
        console.log(debug)

        //Enviando dados para o Banco de dados.
        await Items.create({ name: dataInput });

        //Após inserção dos dados, redireciona para a pagina principal
        res.redirect('/');
        
    } catch (error) {

        console.log('Erro no envio dos dados', error);

    } 
})

//Deletar itens
app.post('/delete', async (req,res) => {
    try {
        //Captura do id do Input(Checkbox)
        const idItemChecked = req.body.checkbox;
        const itemRemoved = await Items.findByIdAndDelete({_id: idItemChecked});
        
        //Procurar ID e deletar no banco de dados e validação
        if(!itemRemoved){

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
        //Captura do parametro
        const paramCatched = req.params.listSelected;
        console.log(paramCatched);
    
        //pesquisa da coleção no banco de dados
        const collection = await Items.findById({_id: paramCatched});
        console.log(collection);
    
        //Chamada da função getDate
        const today = date.getDate();
    
        res.render("listSelected", {
            today: today,
            listTittle: collection.name
        })
        
    } catch (error) {
        console.log('algum erro ocorreu');
        mongoose.connection.close() 
    }
})


//Levantamento do servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
})

