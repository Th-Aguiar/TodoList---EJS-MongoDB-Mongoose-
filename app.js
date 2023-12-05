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

//Requisição de deletar tanto uma lista quanto o item de uma lista
app.post('/delete', async (req,res) => {
    try {
        //Captura do id do Input(Checkbox)
        const checkbox = req.body;
        const listName = req.body.listName;

        //Verificação de qual Página estamos - Home ou Dinamica
        if(checkbox.home){

            //Método de Deletar uma lista
            const listRemoved = await Lists.findByIdAndDelete({_id: checkbox.home});
            
            //Procurar ID e deletar no banco de dados e validação
            if(!listRemoved){
    
                console.log(`${listRemoved} não foi encontrado, ocorreu algum erro e verificaremos.`);
    
            } else {
    
                //Redirecionamento da pagina após a deletação
                console.log('item deletado com sucesso');
                res.redirect('/');
    
            }

        } else{
            
            //Método de deletar items de uma lista no Banco de dados
           const itemRemoved = await Lists.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkbox.items}}});

           //Verificação e redirecionamento
            if(!itemRemoved){

                console.log(`${itemRemoved} não foi encontrado`);

            }else{

                //Redirecionamento da página após a remoção
                console.log('item deletado com sucesso');
                res.redirect('/' + listName);
            }
        }

        
  
    } catch (error) {
        console.log('erro na hora de deletar o item do banco de dados', error);
    }

})

//Endereço dinâmico
app.get('/:listSelected', async (req, res) => {
    const paramCatched = req.params.listSelected;
    
    try {
    
        console.log('Capturado o NAME:', paramCatched);
    
        const list = await Lists.findOne({ name: paramCatched}).exec();
        
        if(!list){

            console.log('LISTA NAO ACHADA')

        } else{
            console.log('lista selecionada' , list);
            console.log('Teste de seleção dos items', list.items);
            


            res.render('listSelected', {
                items: list.items,
                listTittle: list.name
            });
        }

        // res.redirect('/');

    } catch (error) {
        console.log('erro na rota dinamica analisar o seguinte erro' , error);
    } 
})

app.post('/:listSelected', async (req,res) => {
    const paramCatched = req.params.listSelected;
    console.log('Parametro solicitado:', paramCatched)

    try{
        const dataInput = req.body.todoInput;
        //Vendo os dados
        console.log('Dados da lista dinamica:' + dataInput);
        
        //Capturar uma lista para inserir o dado
        const resultList = await Lists.findOne({name: paramCatched});

        //Adicionar um dado em um array
        resultList.items.push({name: dataInput})
        await resultList.save();
        console.log('Dado adicionado com sucesso')

        //Redirecionando para a página
        res.redirect('/' + paramCatched)
    }catch(error){
        console.log('Error na hora de enviar itens na lista personalizada', error);
    }
})

//Levantamento do servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
})

