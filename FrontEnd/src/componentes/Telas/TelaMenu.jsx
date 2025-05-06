import Pagina from "../Templates2/Pagina";
import './TelaMenu.css';
import { useContext } from "react";
import { ContextoUsuarioLogado } from "../../App";
import { FaClipboardList, FaTasks, FaRegUser } from 'react-icons/fa';

export default function TelaMenu(props) {
    const { usuarioLogado } = useContext(ContextoUsuarioLogado);

    return (
        <Pagina>
            <main>
                {/* Boas-vindas com Player de Áudio */}
                <div className="header-container text-center py-3 bg-light">
                    <h1 className="mb-4">Bem-vindo(a), {usuarioLogado.nome || "visitante"}!</h1>
                    <p className="lead mb-4">
                        Explore as funcionalidades do sistema e gerencie suas atividades com eficiência.
                    </p>
                
                </div>

                {/* Cards de Funcionalidades */}
                <div className="container mt-2">
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="card shadow-sm h-100">
                                <div className="card-body text-center">
                                    <FaClipboardList size={40} className="mb-3 text-primary" />
                                    <h5>Cadastros</h5>
                                    <p>Gerencie seus cadastros, como clientes e networking.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card shadow-sm h-100">
                                <div className="card-body text-center">
                                    <FaTasks size={40} className="mb-3 text-success" />
                                    <h5>Publicidade</h5>
                                    <p>Organize e acompanhe seus serviços de publicidade.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card shadow-sm h-100">
                                <div className="card-body text-center">
                                    <FaRegUser size={40} className="mb-3 text-warning" />
                                    <h5>Propaganda</h5>
                                    <p>Organize e acompanhe seus serviços de propaganda.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </Pagina>
    );
}
