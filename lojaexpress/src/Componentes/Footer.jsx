import * as Icons from "react-bootstrap-icons"

export default function Footer()
{
    return (
        <footer className="mt-auto mb-0 w-full text-center p-5 bg-blue-800 border-b-blue-950 border-t-2">
            <h3 className=" text-white text-lg flex items-center gap-2 justify-center"><span className="font-bold">Desenvolvido por: </span>Vitor Prates & <Icons.Openai/>  & <Icons.Google/></h3>
        </footer>
    )
}