const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Backend funcionando!',
        cors: 'Configurado para aceitar todas as origens'
    });
});

app.post('/autenticacao/login', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Endpoint de login funcionando!',
        body: req.body 
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log('Servidor rodando na porta ' + PORT);
});
