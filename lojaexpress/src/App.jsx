import './App.css'
import { useState, useEffect } from 'react'
import * as Icons from "react-bootstrap-icons"
import CardItem from './Componentes/CardItem.jsx'
import Header from './Componentes/Header.jsx'
import FormAtualizador from './Componentes/FormAtualizador.jsx'
import Footer from './Componentes/Footer.jsx'


function App() {
  const [Produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true);
  const [atualizador, setAtualizador] = useState(false)
  const [produtoupdate, setUpdate] = useState(null);


  let valortotal = 0

    const abrirAtualizador = (produto) => {

      setUpdate(produto);
      setAtualizador(true);

  };

  const handleUpdate = (produtoAtualizado) => {

    setProdutos(prev =>
        prev.map(produto =>
            produto.id === produtoAtualizado.id
                ? produtoAtualizado
                : produto
        )
    );

};

  const handleDelete = async (id) => {
      try {
          const response = await fetch(
              `http://localhost:5000/produtos/${id}`,
              {
                method: 'DELETE'
              }
          );
          const data = await response.json();
          if (!response.ok) {
              throw new Error(data.error);
          }
          // Remove o produto do estado
          setProdutos(prev =>
            prev.filter(produto => produto.id !== id)
          );
      } catch (error) {
        console.error('Erro ao apagar produto:', error);
      }

  };


  const handleSubmit = async (e) => {
      e.preventDefault();

      const formData = new FormData(e.target);

      try {
          const response = await fetch(
              'http://localhost:5000/cadastrar',
              {
                  method: 'POST',
                  body: formData
              }
          );

          const produto = await response.json();

          if (!response.ok) {
              throw new Error(produto.error);
          }

          setProdutos(prev => [
              produto,
              ...prev
          ]);

          e.target.reset();

      } catch (error) {
          console.error(error);
      }
  };

  useEffect(() => {
        fetch('http://localhost:5000/produtos')
        .then((res) => res.json())
        .then((dados) => {
            console.log(dados);
            setProdutos(dados.produtos);  
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

    Produtos.forEach(produto => {
      valortotal += produto.quantidade * produto.preco/100
    });
    console.log(valortotal);


  return (
    <div className='h-screen bg-gray-50 grid grid-rows-[7%_83%_10%]'>
      <Header/>
      <main>
        <form onSubmit={handleSubmit} className='w-[95%] m-auto max-w-275 p-3 pb-0'>
        <nav className='
        [&_p]:flex [&_p]:justify-center [&_p]:gap-3 [&_p]:w-full [&_p]:bg-blue-700 [&_p]:text-white [&_p]:border-black [&_p]:rounded-t-2xl [&_p]:font-bold [&_p]:border-b-0
        [&_input]:border-b-0 
        grid grid-cols-5 grid-rows-2 gap-x-1 justify-center items-center 
        *:border *:p-1 *:flex *:items-center *:gap-1'>
          <p  > <Icons.Image/> Imagem</p>
          <p> <Icons.Box/> Produto</p>
          <p> <Icons.Calculator/> Quantidade</p>
          <p> <Icons.Tag/> Preço ( R$ )</p>

          <input type="file" accept='image/*' name="imagem"/>
          <input type="text" placeholder='Produto' name="nome" required/>
          <input type="number" placeholder='Quantidade'  name="quantidade" required min={1}/>
          <input type="number" placeholder='Preço' name="preco" required step={0.01} min={1}/>

          <button type='submit' className='
          col-start-5 row-start-1 row-end-3 cursor-pointer rounded-full flex justify-center bg-blue-700 text-white font-bold
          '> <Icons.PlusLg/> Adicionar</button>
        </nav>
      </form>
      <div className='w-[95%] m-auto max-w-275'>
         <div className='flex flex-col p-5 border gap-1'>
          {Produtos.map((produto) => (
            <CardItem onUpdate={() => abrirAtualizador(produto)} onDelete={handleDelete} key={produto.id} id={produto.id} img={produto.imagem} nome={produto.nome} quantidade={produto.quantidade} preco={produto.preco}/>
          ))}
        </div>
        <div className='flex items-center ml-auto mr-0 w-fit gap-3 p-3 border border-t-0'>
          <span className='bg-green-600 p-3 rounded-full text-white'><Icons.CurrencyDollar/></span>
          <h4 className='font-bold'>Total:</h4>
          <p>{(valortotal).toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'})}</p>
        </div>
      </div>
      {atualizador && produtoupdate && (

          <FormAtualizador
              id={produtoupdate.id}
              img={produtoupdate.imagem}
              nome={produtoupdate.nome}
              quantidade={produtoupdate.quantidade}
              preco={produtoupdate.preco}
              onUpdate={handleUpdate}
              cancelar={() => setAtualizador(false)}
          />

      )}
      </main>
    <Footer/>
    </div>
  )
}

export default App
