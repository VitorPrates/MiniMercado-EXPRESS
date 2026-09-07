const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');


const app = express();
const sqlite3 = require('sqlite3').verbose();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

// Conectar ao banco de dados (cria o arquivo database.db se não existir)
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.err('Erro ao abrir o banco de dados', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

// Criar tabela inicial
db.run(`CREATE TABLE IF NOT EXISTS produtos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  imagem TEXT,
  nome TEXT NOT NULL,
  quantidade INTEGER,
  preco INTEGER NOT NULL DEFAULT(100)
)`);

// Criar pasta de uploads se não existir
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)){
    fs.existsSync(uploadDir) || fs.mkdirSync(uploadDir);
}

// Configuração do Multer para salvar na pasta 'uploads'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });


// Rota para listar usuários (GET)
app.get('/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ users: rows });
  });
});

// Rota para criar um usuário (POST)
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  const query = `INSERT INTO users (name, email) VALUES (?, ?)`;
  
  db.run(query, [name, email], function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ id: this.lastID, name, email });
  });
});

// SERVE REACT IN PRODUCTION
// This directs Express to serve your built React files
app.use(express.static(path.join(__dirname, '../lojaexpress/')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../lojaexpress/', 'index.html'));
});

app.get('/teste', (req,res) =>{
    res.json({msg:"Parece que sim!"})
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
