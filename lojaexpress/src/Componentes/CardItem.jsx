import nindentificado from "../../public/n-identificado.png"
import * as Icons from "react-bootstrap-icons"


export default function CardItem({id,img,nome,quantidade,preco, onDelete, onUpdate})
{ 
    return(
        <div className="
        border p-1 grid grid-cols-[1fr_35%_repeat(6,1fr)] items-center justify-center text-center *:m-auto rounded-[10px]
        ">
            <img src={img? `http://localhost:5000${img}` : nindentificado} width={50} alt="" className="aspect-square"/>
            <p className="cursor-pointer" onClick={() => onUpdate(id)}>{nome? nome : "Produto"}</p>
            <p>{quantidade? quantidade : "0"}</p>
            <span ><Icons.X/></span>
            <p>{preco? (preco/100).toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'}) : "R$ 00,00"}</p>
            <span>=</span>
            <p>{quantidade && preco? ((quantidade*preco)/100).toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'}) : `${(0).toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'})}`}</p>
            <div className="flex items-center border border-black w-fit p-2 rounded-2xl text-red-600 hover:bg-red-300 transition duration-300 ease-in-out">
                <button type="button" onClick={()=>onDelete(id)} className="cursor-pointer"><Icons.Trash/></button>
            </div>
        </div>
    )
}