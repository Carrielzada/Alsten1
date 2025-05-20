import { Navbar } from "react-bootstrap";
import logoImage from "../../assets/imagens/logoalsten.jpg";

export default function Cabecalho(props) {
  return (
    <Navbar className="bg-light shadow-lg w-100 pt-0 px-3 pb-0">
      <div className="d-flex justify-content-between align-items-center w-100">
        {/* Ícone de menu no lado esquerdo */}
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>

        {/* Logo centralizada */}
        <div className="text-center w-100">
          <img src={logoImage} alt="Logo" className="img-fluid" style={{ maxWidth: "250px" }}/>
        </div>
      </div>
    </Navbar>
  );
}
