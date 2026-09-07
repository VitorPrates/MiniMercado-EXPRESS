import './App.css'
import { useState, useEffect } from 'react'
import * as Icons from "react-bootstrap-icons"
import CardItem from './Componentes/CardItem.jsx'
import Header from './Componentes/Header.jsx'


function App() {
  const [Produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true);
  let valortotal = 0
  useEffect(() => {
        fetch('http://localhost:5000/produtos')
        .then((res) => res.json())
        .then((dados) => {
            console.log(dados);
            setProdutos(dados);  
            setCarregando(false);
        })
        .catch((erro) => {
            console.error('Erro:', erro);
            setCarregando(false);
        });
    }, []);
  
    if (carregando) {
        return <div className="text-center p-10">Carregando...</div>;
    }

    if (!Produtos) {
        return <div className="text-center p-10 text-red-500">Erro ao carregar.</div>;
    }

    Produtos.produtos.forEach(produto => {
      valortotal += produto.quantidade * produto.preco/100
    });
    console.log(valortotal);


  return (
    <div>
      <Header/>
      <form action="http://localhost:5000/cadastrar" method='POST' encType="multipart/form-data" className='w-[95%] m-auto max-w-275 p-3'>
        <nav className='grid grid-cols-5 grid-rows-2 justify-center items-center *:border *:p-1 *:flex *:items-center *:gap-1'>
          <p> <Icons.Image/> Imagem</p>
          <p> <Icons.Box/> Produto</p>
          <p> <Icons.Calculator/> Quantidade</p>
          <p> <Icons.Tag/> Preço</p>

          <input type="file" accept='image/*' name="imagem"/>
          <input type="text" placeholder='Produto' name="nome" required/>
          <input type="number" placeholder='Quantidade'  name="quantidade" required min={1}/>
          <input type="number" placeholder='Preço' name="preco" required step={0.01} min={1}/>

          <button type='submit' className='col-start-5 row-start-1 row-end-3 cursor-pointer'> <Icons.PlusLg/> Adicionar</button>
        </nav>
        <div className='flex flex-col p-5 border gap-1'>
          {Produtos.produtos.map((produto) => (
            <CardItem key={produto.id} img={produto.imagem} nome={produto.nome} quantidade={produto.quantidade} preco={produto.preco}/>
          ))}
        </div>
        <div className='flex items-center ml-auto mr-0 w-fit gap-3 p-3 border border-t-0'>
          <span className='bg-green-600 p-3 rounded-full text-white'><Icons.CurrencyDollar/></span>
          <h4 className='font-bold'>Total:</h4>
          <p>{(valortotal).toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'})}</p>
        </div>
      </form>
    </div>
  )
}

export default App
