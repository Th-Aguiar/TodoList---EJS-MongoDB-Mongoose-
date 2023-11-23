//Exportando um modulo Common JS.
module.exports = {getDate, getDay};

//Função para obtenção do dia atual
function getDate() {
    //instância de um objeto date
    const date = new Date();
    
    // Configurações da formatação da data
    const options = { 
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    }
    //Pega o dia e data atual do sistema
    const today = date.toLocaleString('pt-BR', options);
    
    return today;
}

function getDay(){
    //instância de um objeto date
    const date = new Date();
    
    // Configurações da formatação da data
    const options = { 
        weekday: "long"
    }
    //Pega o dia e data atual do sistema
    const today = date.toLocaleString('pt-BR', options);
    
    return today;
}
