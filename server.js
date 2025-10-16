// Variável de ambiente (Coisas que não seram mandadas para o repositório)
require('dotenv').config();

// Inicializando o Express
const express = require('express');
const app = express();

// Chamada do Mongoose (Modela a Base de Dados)
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTIONSTRING)
    .then(() => {
        app.emit('pronto') // Envia o comando 'pronto' quando a promisse for resolvida
    })
    .catch(e => console.log(e));

//
const session = require('express-session'); // Identifica o navegador de um cliente (cookie)
const MongoStore = require('connect-mongo'); // Sessions/cookies salvas na base de dados
const flashMensage = require('connect-flash'); // Mensagens auto-destruidas salvas em seção
const routes = require('./routes'); // Rotas dessa aplicação
const path = require('path'); // Trabalhar com caminhos e diretórios
const helmet = require('helmet'); // Proteção da aplicação de algumas vulnerabilidades da web
const csrf = require('csurf'); // Tokens para formulários (nenhum site externo poste dentro do app)
const { checkCsrfError, csrfMiddleware } = require('./src/middleware/middleware'); // Chama os Middlewares

app.use(helmet());

app.use(express.urlencoded({ extended: true })); // Permite a postagem de formulários para dentro da aplicação
// Outra alternativa é: `app.use(express.json())`
app.use(express.static(path.join(__dirname, 'front-end'))); // Acesso a arquivos estáticos (html, css, img e etc)

// Configurações da session
const sessionOptions = session({
    secret: 'jfwio61gdssdfjioewfui65xc65cd615',
    store: MongoStore.create({
        mongoUrl: process.env.CONNECTIONSTRING,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 2,
        httpOnly: true
    }
});
app.use(sessionOptions);
app.use(flashMensage());

app.set('views', path.resolve(__dirname, 'src', 'views')); // Arquivos renderizados na tela
app.set('view engine', 'ejs'); // Engine utilizada apra renderizar o HTML

app.use(csrf());
// Nossos próprios middlewares
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);

// Recebe o comando 'pronto' da inicialização do mongoose e executa o server

const PORT = process.env.PORT || 3000;

app.on('pronto', () => {
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
})