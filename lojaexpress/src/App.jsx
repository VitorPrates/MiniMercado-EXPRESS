import './App.css'
import { useState, useEffect } from 'react'


function App() {
  const [resultado, setResultado] = useState([])
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
        fetch('http://localhost:5000/teste')
        .then((res) => res.json())
        .then((dados) => {
            console.log(dados);
            setResultado(dados);  
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

    if (!resultado) {
        return <div className="text-center p-10 text-red-500">Erro ao carregar.</div>;
    }
  return (
    <>
      <h1 className='text-center'>Heioo</h1>
      
    </>
  )
}

export default App
