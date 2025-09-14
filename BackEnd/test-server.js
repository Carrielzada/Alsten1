const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// CORS configurado para aceitar todas as origens temporariamente
app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend funcionando!' });
});

app.get('/test-cors', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'CORS funcionando!',
        origin: req.headers.origin 
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor de teste rodando na porta ${PORT}`);
});
