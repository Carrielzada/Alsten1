const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// CORS totalmente aberto para resolver o problema
app.use(cors({
    origin: '*',  // Aceita qualquer origem
    credentials: false  // Desabilita credentials para evitar problemas
}));

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Backend funcionando!',
        cors: 'CORS totalmente aberto',
        timestamp: new Date().toISOString()
    });
});

app.get('/test-cors', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'CORS funcionando!',
        origin: req.headers.origin,
        headers: req.headers
    });
});

app.post('/autenticacao/login', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Endpoint de login funcionando!',
        body: req.body,
        origin: req.headers.origin
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log('Servidor com CORS aberto rodando na porta ' + PORT);
    console.log('Acesse: http://31.97.151.181:' + PORT + '/health');
});
