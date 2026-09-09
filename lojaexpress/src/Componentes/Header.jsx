import * as Icons from "react-bootstrap-icons";

export default function Header()
{
    return(
        <header className="text-center p-5 bg-blue-800 border-b-blue-950 border-b-2" >
            <h1 className="font-bold text-white text-lg flex items-center justify-center gap-x-2" >Mercadin Vendi Mais <Icons.CartCheckFill size={27}/></h1>
        </header>
    )
}