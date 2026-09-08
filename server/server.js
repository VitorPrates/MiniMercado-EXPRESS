const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const sqlite3 = require('sqlite3').verbose();

const PORT = process.env.PORT || 5000;

// --------------------------------------------------
// MIDDLEWARE
// --------------------------------------------------

app.use(cors());
app.use(express.json());

// --------------------------------------------------
// BANCO DE DADOS
// --------------------------------------------------
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Erro ao abrir o banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

// Criar tabela
db.run(`
    CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        imagem TEXT,
        nome TEXT NOT NULL,
        quantidade INTEGER,
        preco INTEGER NOT NULL DEFAULT(100)
    )
`);

// --------------------------------------------------
// UPLOADS
// --------------------------------------------------
const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {

        const uniqueSuffix =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1E9);
        cb(
            null,
            uniqueSuffix + path.extname(file.originalname)
        );
    }

});

// Aceita apenas imagens
const upload = multer({
    storage: storage,

    fileFilter: (req, file, cb) => {

        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Apenas imagens são permitidas.'));
        }

    }
});

// --------------------------------------------------
// SERVIR IMAGENS
// --------------------------------------------------
app.use(
    '/uploads',
    express.static(uploadDir)
);

// --------------------------------------------------
// LISTAR PRODUTOS
// --------------------------------------------------
app.get('/produtos', (req, res) => {
    db.all(
        'SELECT * FROM produtos ORDER BY id DESC',
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                produtos: rows
            });
        }
    );

});

// --------------------------------------------------
// CADASTRAR PRODUTO
// --------------------------------------------------
app.post('/cadastrar',upload.single('imagem'),(req, res) => {
        const {
            nome,
            quantidade,
            preco
        } = req.body;

        // Verificar nome
        if (!nome) {
            return res.status(400).json({
                error: 'O nome do produto é obrigatório.'
            });
        }

        // Converter quantidade
        const quantidadeNumerica = Number(quantidade);

        if (
            !Number.isInteger(quantidadeNumerica) ||
            quantidadeNumerica < 1
        ) {
            return res.status(400).json({
                error: 'Quantidade inválida.'
            });
        }

        // Converter preço para centavos
        const precoNumerico = Number(preco);
        if (
            !Number.isFinite(precoNumerico) ||
            precoNumerico <= 0
        ) {
            return res.status(400).json({
                error: 'Preço inválido.'
            });
        }

        const precoCentavos = Math.round(precoNumerico * 100);

        // Caminho da imagem
        let imagem = null;

        if (req.file) {
            imagem = `/uploads/${req.file.filename}`;
        }

        // Inserir no banco
        const query = `
            INSERT INTO produtos
            (imagem, nome, quantidade, preco)
            VALUES (?, ?, ?, ?)
        `;

        db.run(
            query,
            [
                imagem,
                nome,
                quantidadeNumerica,
                precoCentavos
            ],
            function (err) {
                if (err) {

                    // Se deu erro no banco,
                    // apagar a imagem que acabou de ser enviada
                    if (req.file) {
                        fs.unlink(
                            req.file.path,
                            () => {}
                        );
                    }

                    return res.status(400).json({
                        error: err.message
                    });
                }

                res.status(201).json({
                    id: this.lastID,
                    imagem,
                    nome,
                    quantidade: quantidadeNumerica,
                    preco: precoCentavos
                });

            }
        );
    }
);

// --------------------------------------------------
// Deletar produto
// --------------------------------------------------
app.delete('/produtos/:id', (req, res) => {

    const { id } = req.params;

    // Primeiro busca o produto
    db.get(
        'SELECT imagem FROM produtos WHERE id = ?',
        [id],
        (err, produto) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (!produto) {
                return res.status(404).json({
                    error: 'Produto não encontrado.'
                });
            }

            // Apaga do banco
            db.run(
                'DELETE FROM produtos WHERE id = ?',
                [id],
                function (err) {

                    if (err) {
                        return res.status(500).json({
                            error: err.message
                        });
                    }

                    // Se existe imagem, apaga o arquivo
                    if (produto.imagem) {

                        const nomeArquivo =
                            path.basename(produto.imagem);

                        const caminhoImagem =
                            path.join(
                                uploadDir,
                                nomeArquivo
                            );

                        fs.unlink(
                            caminhoImagem,
                            (erro) => {

                                // Arquivo não existir não impede
                                // que o produto seja considerado apagado
                                if (erro && erro.code !== 'ENOENT') {
                                    console.error(
                                        'Erro ao apagar imagem:',
                                        erro
                                    );
                                }

                            }
                        );

                    }
                    res.json({
                        message: 'Produto apagado com sucesso.',
                        id: Number(id)
                    });

                }
            );

        }
    );

});
// --------------------------------------------------
// Atualizar Produto
// --------------------------------------------------
app.put(
    '/produtos/:id',
    upload.single('imagem'),
    (req, res) => {

        const { id } = req.params;

        const {
            nome,
            quantidade,
            preco
        } = req.body;


        // -----------------------------
        // VALIDAÇÕES
        // -----------------------------

        if (!nome) {
            return res.status(400).json({
                error: 'O nome do produto é obrigatório.'
            });
        }


        const quantidadeNumerica =
            Number(quantidade);

        if (
            !Number.isInteger(quantidadeNumerica) ||
            quantidadeNumerica < 1
        ) {

            return res.status(400).json({
                error: 'Quantidade inválida.'
            });

        }


        const precoNumerico =
            Number(preco);

        if (
            !Number.isFinite(precoNumerico) ||
            precoNumerico <= 0
        ) {

            return res.status(400).json({
                error: 'Preço inválido.'
            });

        }


        const precoCentavos =
            Math.round(precoNumerico * 100);


        // -----------------------------
        // BUSCAR PRODUTO ATUAL
        // -----------------------------

        db.get(
            'SELECT * FROM produtos WHERE id = ?',
            [id],
            (err, produtoAtual) => {

                if (err) {

                    return res.status(500).json({
                        error: err.message
                    });

                }


                if (!produtoAtual) {

                    return res.status(404).json({
                        error: 'Produto não encontrado.'
                    });

                }


                // -----------------------------
                // DEFINIR IMAGEM
                // -----------------------------

                let imagem =
                    produtoAtual.imagem;


                // Se enviou uma nova imagem
                if (req.file) {

                    imagem =
                        `/uploads/${req.file.filename}`;

                }


                // -----------------------------
                // UPDATE
                // -----------------------------

                const query = `
                    UPDATE produtos
                    SET
                        imagem = ?,
                        nome = ?,
                        quantidade = ?,
                        preco = ?
                    WHERE id = ?
                `;


                db.run(
                    query,
                    [
                        imagem,
                        nome,
                        quantidadeNumerica,
                        precoCentavos,
                        id
                    ],
                    function (err) {

                        if (err) {

                            // Se uma nova imagem foi enviada
                            // mas o banco falhou, apagar arquivo
                            if (req.file) {

                                fs.unlink(
                                    req.file.path,
                                    () => {}
                                );

                            }

                            return res.status(500).json({
                                error: err.message
                            });

                        }


                        // -----------------------------
                        // APAGAR IMAGEM ANTIGA
                        // -----------------------------

                        if (
                            req.file &&
                            produtoAtual.imagem
                        ) {

                            const nomeArquivo =
                                path.basename(
                                    produtoAtual.imagem
                                );

                            const caminhoImagem =
                                path.join(
                                    uploadDir,
                                    nomeArquivo
                                );

                            fs.unlink(
                                caminhoImagem,
                                (erro) => {

                                    if (
                                        erro &&
                                        erro.code !== 'ENOENT'
                                    ) {

                                        console.error(
                                            'Erro ao apagar imagem antiga:',
                                            erro
                                        );

                                    }

                                }
                            );

                        }


                        // -----------------------------
                        // RETORNAR PRODUTO ATUALIZADO
                        // -----------------------------

                        res.json({

                            id: Number(id),

                            imagem,

                            nome,

                            quantidade:
                                quantidadeNumerica,

                            preco:
                                precoCentavos

                        });

                    }
                );

            }
        );

    }
);



// --------------------------------------------------
// TESTE
// --------------------------------------------------

app.get('/teste', (req, res) => {

    res.json({
        msg: 'Parece que sim!'
    });

});

// --------------------------------------------------
// REACT EM PRODUÇÃO
// --------------------------------------------------

app.use(
    express.static(
        path.join(__dirname, '../lojaexpress/')
    )
);

app.get('/', (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            '../lojaexpress/',
            'index.html'
        )
    );

});

// --------------------------------------------------
// SERVIDOR
// --------------------------------------------------
app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});