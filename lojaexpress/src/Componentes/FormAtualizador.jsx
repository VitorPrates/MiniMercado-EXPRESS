import nindentificado from "../../public/n-identificado.png"
import * as Icons from "react-bootstrap-icons"


export default function FormAtualizador({id,img,nome,quantidade,preco, onDelete, aparecer, cancelar})
{ 
    return(
        <form className={`border w-[95%] m-auto mt-2.5 p-1 grid grid-cols-[1fr_30%_15%_1fr_15%_repeat(4,1fr)] items-center justify-center text-center *:m-auto ${aparecer? "hidden": ""}`}>
            <p className="flex flex-col text-center justify-center items-center">
                <Icons.ImageFill/>
                <input className="w-full" type="file" accept='image/*' name="imagem"/>
            </p>
            <p className="flex flex-col">{nome? nome : "Nome do produto"}
                <input className="border pl-1" type="text" placeholder="Novo Nome aqui"/>
            </p>
            <span className="flex flex-col w-full">Quantidade
                <input className="border text-center" type="number" placeholder="0" />
            </span>
            <span ><Icons.X/></span>

            <p className="w-full" >R$ <input type="number" placeholder="00,00" step={0.01} className="border w-full text-center"/></p>
            <span>=</span>
            
            <p>{quantidade && preco? ((quantidade*preco)/100).toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'}) : `${(0).toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'})}`}</p>
            <div className="flex items-center border-green-500 bg-green-300 border w-fit p-2 rounded-2xl text-green-800 ">
                <button type="button" onClick={()=>onDelete(id)} className="cursor-pointer"><Icons.Upload/></button>
            </div>
            <span className="flex items-center border-red-500 bg-red-300 border w-fit p-2 rounded-2xl text-red-800" onClick={() => cancelar()} ><Icons.X/></span>
        </form>
    )
}