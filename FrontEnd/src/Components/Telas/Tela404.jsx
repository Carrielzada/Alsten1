import Pagina from "../Templates2/Pagina";
import imagem404 from '../../assets/imagens/pagina404.png';
import { Container } from "react-bootstrap";
export default function Tela404(props){
    return (
        <Pagina>
            <Container>
                <img src={imagem404} alt="Imagem 404"/>
                <h1 className="text-center">O recurso solicitado não existe!</h1>
            </Container>
        </Pagina>
    );
}