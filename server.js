const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3309;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const connection = mysql.createConnection({
    host: 'localhost',  
    user: 'root',        
    password: '', 
    database: 'produtos', 
    port: 3300
});

connection.connect();

app.post('/', (req, res) => {
    console.log('Requisição recebida:', req.body);
    const products = req.body.products;
    if (!products || products.length === 0) {
        console.log('Nenhum produto enviado.');
        return res.status(400).send('Nenhum produto enviado.');
    }

    const query = 'INSERT INTO products (name, price, cod, description) VALUES ?';
    const values = products.map(product => [product.name, product.price, product.cod, , product.description, ]);

    connection.query(query, [values], (err, results) => {
        if (err) {
            console.error('Erro ao inserir no banco de dados:', err);
            return res.status(500).send('Erro ao salvar produtos');
        } else {
            console.log('Produtos salvos com sucesso');
            return res.status(200).send('Produtos salvos com sucesso');
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});