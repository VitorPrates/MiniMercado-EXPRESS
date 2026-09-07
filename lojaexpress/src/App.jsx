import './App.css'
import { useState, useEffect } from 'react'
import  CardItem  from "./Componentes/CardItem.jsx"
import * as Icons from "react-bootstrap-icons"
import Header from './Componentes/Header.jsx'


function App() {
  return (
    <div>
      <Header/>
      <form action="" className='w-[95%] m-auto max-w-275 p-3'>
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
        <CardItem/>
      </form>
    </div>
  )
}

export default App
