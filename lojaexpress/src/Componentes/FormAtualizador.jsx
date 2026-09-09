import { useState } from "react";

import nindentificado from "../../public/n-identificado.png";

import * as Icons from "react-bootstrap-icons";


export default function FormAtualizador({id,img,nome,quantidade,preco,onUpdate,cancelar}) {
    const [qtd, setQtd] = useState(quantidade ?? "");
    const [prc, setPrc] = useState(
        preco ? preco / 100 : ""
    );
    const [novoNome, setNovoNome] = useState(nome ?? "");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            const response = await fetch(
                `http://localhost:5000/produtos/${id}`,
                {
                    method: "PUT",
                    body: formData
                }
            );
            const produto = await response.json();
            if (!response.ok) {
                throw new Error(produto.error);
            }
            // Envia o produto atualizado para o App
            onUpdate(produto);
            // Fecha o formulário
            cancelar();
        } catch (error) {

            console.error(
                "Erro ao atualizar produto:",
                error
            );

        }
    };
    return (
        <form onSubmit={handleSubmit}className="border w-[95%] max-w-275 m-auto mt-2.5 p-1 grid grid-cols-[1fr_30%_15%_1fr_15%_repeat(4,1fr)] items-center justify-center text-center *:m-auto rounded-[10px]">
            <p className=" flex flex-col text-center justify-center items-center ">
                <img src={ img ? `http://localhost:5000${img}` : nindentificado } width={50} alt="" className="aspect-square"/>
                <input className="w-full"type="file"accept="image/*"name="imagem"/>
            </p>
            <p className="flex flex-col">
                {nome || "Nome do produto"}
                <input className="border pl-1" type="text" name="nome" value={novoNome} onChange={(e) => setNovoNome(e.target.value) } />
            </p>
            <span className="flex flex-col w-full">
                Quantidade
                <input className="border text-center" type="number" name="quantidade" min={1} value={qtd} onChange={(e) => setQtd(e.target.value) } />
            </span>
            <span>
                <Icons.X />
            </span>
            <p className="w-full">
                R$<input type="number" name="preco" min={0.01} step={0.01} value={prc} className="border w-full text-center" onChange={(e) => setPrc(e.target.value) } />
            </p>
            <span>=</span>
            <p>{qtd && prc ? ( Number(qtd) * Number(prc) ).toLocaleString( "pt-BR", { style: "currency", currency: "BRL" } ) : "R$ 0,00" }</p>
            <div className="flex items-center border-green-500 bg-green-300 border w-fit p-2 rounded-2xl text-green-800 ">
                <button type="submit" className="cursor-pointer">
                    <Icons.Check />
                </button>
            </div>
           <button type="button" className=" cursor-pointer flex items-center border-red-500 bg-red-300 border w-fit p-2 rounded-2xl text-red-800"onClick={cancelar}> <Icons.X /> </button>
        </form>

    );
}