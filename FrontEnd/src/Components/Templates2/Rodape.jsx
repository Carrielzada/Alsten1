import { FaWhatsapp, FaBug } from "react-icons/fa";
import './Rodape.css';

export default function Rodape(props) {
    return (
        <footer className="rodape-moderno">
            <div className="container-fluid px-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                    {/* Copyright */}
                    <div className="copyright">
                        <small>
                            &copy; {new Date().getFullYear()} <span className="logo-text">Alsten</span>. Todos os direitos reservados.
                        </small>
                    </div>

                    {/* Ações */}
                    <div className="footer-actions">
                        {/* Botão reportar problema */}
                        <a
                            href="https://wa.me/5515997723051?text=Ol%C3%A1!%20Preciso%20reportar%20um%20problema%20no%20sistema%20Alsten"
                            title="Reportar problema via WhatsApp"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="footer-btn"
                            aria-label="Reportar problema"
                        >
                            <FaBug className="me-1" />
                            <span>Reportar Problema</span>
                        </a>
                        
                        {/* WhatsApp direto */}
                        <a
                            href="https://wa.me/5515997723051"
                            title="Suporte via WhatsApp"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="footer-whatsapp"
                            aria-label="WhatsApp"
                        >
                            <FaWhatsapp />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
