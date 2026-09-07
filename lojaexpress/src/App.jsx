import './App.css'
import { useState, useEffect } from 'react'
import * as Icons from "react-bootstrap-icons"
import CardItem from './Componentes/CardItem.jsx'
import Header from './Componentes/Header.jsx'


function App() {
  return (
    <div>
      <Header/>
      <form action="" method='POST' className='w-[95%] m-auto max-w-275 p-3'>
        <nav className='grid grid-cols-5 grid-rows-2 justify-center items-center *:border *:p-1 *:flex *:items-center *:gap-1'>
          <p> <Icons.Image/> Imagem</p>
          <p> <Icons.Box/> Produto</p>
          <p> <Icons.Calculator/> Quantidade</p>
          <p> <Icons.Tag/> Preço</p>

          <input type="file" accept='image/*'/>
          <input type="text" placeholder='Produto' required/>
          <input type="number" placeholder='Quantidade' required min={1}/>
          <input type="number" placeholder='Preço' required step={0.1} min={1}/>

          <button className='col-start-5 row-start-1 row-end-3 '> <Icons.PlusLg/> Adicionar</button>
        </nav>
        <div className='flex flex-col p-5 border gap-1'>
          <CardItem/>
          <CardItem/>
        </div>
        <div className='flex items-center ml-auto mr-0 w-fit gap-3 p-3 border border-t-0'>
          <span className='bg-green-600 p-3 rounded-full text-white'><Icons.CurrencyDollar/></span>
          <h4 className='font-bold'>Total:</h4>
          <p>{(0).toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'})}</p>
        </div>
      </form>
    </div>
  )
}

export default App
