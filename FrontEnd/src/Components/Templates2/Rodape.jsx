import { FaWhatsapp } from "react-icons/fa";

export default function Rodape(props) {
    return (
        <footer className="footer mt-0 pb-3 bg-light shadow">
            <div className="container d-flex justify-content-between align-items-center">
                {/* Copyright centralizado */}
                <div className="text-center w-100">
                    <small className="text-muted">
                        &copy; {new Date().getFullYear()} Alsten. Todos os direitos reservados.
                    </small>
                </div>

                {/* Ícones de redes sociais no canto direito */}
                <div className="d-flex gap-3" style={{ marginRight: "1rem" }}>
                    {/* WhatsApp */}
                    <a
                        href="https://wa.me/5515997723051"
                        title="WhatsApp"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-success icon-hover"
                        aria-label="WhatsApp"
                        style={{ display: "inline-block" }}
                    >
                        <FaWhatsapp style={{ fontSize: "1.8rem" }} />
                    </a>
                </div>
            </div>
        </footer>
    );
}
