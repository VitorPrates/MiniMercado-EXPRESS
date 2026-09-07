import nindentificado from "../../public/n-identificado.png"
import * as Icons from "react-bootstrap-icons"


export default function CardItem({img,nome,quantidade,preco})
{
    return(
        <div className="border p-1 grid grid-cols-[1fr_auto_repeat(6,1fr)] items-center justify-center text-center *:m-auto">
            <img src={img? `http://localhost:5000${img}` : nindentificado} width={50} alt="" />
            <p>{nome? nome : "Produto"}</p>
            <p>{quantidade? quantidade : "0"}</p>
            <span ><Icons.X/></span>
            <p>{preco? (preco/100).toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'}) : "R$ 00,00"}</p>
            <span>=</span>
            <p>{quantidade && preco? ((quantidade*preco)/100).toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'}) : `${(0).toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'})}`}</p>
            <span className="bg-gray-300 w-fit p-2 rounded-2xl text-red-600"><Icons.Trash/></span>
        </div>
    )
}