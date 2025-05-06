import Pagina from "../Templates2/Pagina";
import './TelaMenu.css';
import { useContext, useState } from "react";
import { ContextoUsuarioLogado } from "../../App";
import { FaClipboardList, FaTasks, FaRegUser, FaRegLightbulb } from 'react-icons/fa';

export default function TelaMenu() {
    const { usuarioLogado } = useContext(ContextoUsuarioLogado);
    const [imagemAtual, setImagemAtual] = useState(null); // Controle da imagem exibida

    const handleExibirImagem = (nomeImagem) => {
        setImagemAtual(nomeImagem); // Define a imagem a ser exibida
    };

    return (
        <Pagina>
            <main className="p-3">
                {/* Boas-vindas e Quadros */}
                <div className="header-container text-center pt-1 pb-2 bg-light shadow" style={{ fontSize: '0.9rem' }}>
                    <p className="lead mb-0" style={{ fontSize: '1.1rem' }}>
                        Bem-vindo(a) <strong>{usuarioLogado.nome || "Visitante"}</strong>, aqui você pode gerenciar todas as informações e funcionalidades com facilidade.
                    </p>
                    
                    {/* Quadros de Funcionalidades */}
                    <div className="row g-3 justify-content-center py-1">
                        <div className="col-md-5 col-sm-6">
                            <div className="card shadow-sm h-100 border-primary">
                                <div className="card-body text-center p-2">
                                    <FaClipboardList size={40} className="mb-2 text-primary" />
                                    <h5 style={{ fontSize: '1rem' }}>Acesse sua Propaganda</h5>
                                    <p style={{ fontSize: '0.9rem' }}>
                                        Encontre todas as informações da sua publicidade na aba <strong>Dashboard</strong>.
                                    </p>
                                    <button
                                        className="btn btn-outline-success mt-1"
                                        style={{
                                            fontSize: '0.8rem', // Tamanho do texto
                                            padding: '0.2rem 0.4rem', // Diminuir espaçamento interno
                                            lineHeight: '1', // Reduzir a altura da linha
                                            width: '100px', // Largura fixa opcional
                                            height: '40px', // Altura fixa opcional
                                        }}
                                        onClick={() => handleExibirImagem('/detalharPropaganda.png')}
                                    >
                                        Veja Como
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-5 col-sm-6">
                            <div className="card shadow-sm h-100 border-success">
                                <div className="card-body text-center p-2">
                                    <FaTasks size={40} className="mb-2 text-success" />
                                    <h5 style={{ fontSize: '1rem' }}>Gerencie sua Propaganda</h5>
                                    <p style={{ fontSize: '0.9rem' }}>
                                        Mande uma mensagem detalhada com sua solicitação.
                                    </p>
                                    <button
                                        className="btn btn-outline-primary mt-1"
                                        style={{
                                            fontSize: '0.8rem', // Tamanho do texto
                                            padding: '0.2rem 0.4rem', // Diminuir espaçamento interno
                                            lineHeight: '1', // Reduzir a altura da linha
                                            width: '100px', // Largura fixa opcional
                                            height: '40px', // Altura fixa opcional
                                        }}
                                        onClick={() => handleExibirImagem('/enviarMensagem.png')}
                                    >
                                        Veja Como
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-5 col-sm-6">
                            <div className="card shadow-sm h-100 border-warning">
                                <div className="card-body text-center p-2">
                                    <FaRegUser size={40} className="mb-2 text-warning" />
                                    <h5 style={{ fontSize: '1rem' }}>Gerencie seu Usuário</h5>
                                    <p style={{ fontSize: '0.9rem' }}>
                                        Altere sua senha e acesse o ícone para sair do sistema.
                                    </p>
                                    <button
                                        className="btn btn-outline-warning mt-1"
                                        style={{
                                            fontSize: '0.8rem', // Tamanho do texto
                                            padding: '0.2rem 0.4rem', // Diminuir espaçamento interno
                                            lineHeight: '1', // Reduzir a altura da linha
                                            width: '100px', // Largura fixa opcional
                                            height: '40px', // Altura fixa opcional
                                        }}
                                        onClick={() => handleExibirImagem('/alterarSenha.png')}
                                    >
                                        Veja Como
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-5 col-sm-6">
                            <div className="card shadow-sm h-100 border-info">
                                <div className="card-body text-center p-2">
                                    <FaRegLightbulb size={40} className="mb-2 text-info" />
                                    <h5 style={{ fontSize: '1rem' }}>Dicas e Suporte</h5>
                                    <p style={{ fontSize: '0.9rem' }}>
                                        Aproveite os nossos serviços para alcançar seus objetivos.
                                    </p>
                                    <button
                                        className="btn btn-outline-info mt-1"
                                        style={{
                                            fontSize: '0.8rem', // Tamanho do texto
                                            padding: '0.2rem 0.4rem', // Diminuir espaçamento interno
                                            lineHeight: '1', // Reduzir a altura da linha
                                            width: '100px', // Largura fixa opcional
                                            height: '40px', // Altura fixa opcional
                                        }}
                                        onClick={() => handleExibirImagem('/mensagemWhatsapp.png')}
                                    >
                                        Veja Como
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Exibição da Imagem na Tela Cheia */}
                {imagemAtual && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 9999,
                        }}
                        onClick={() => setImagemAtual(null)} // Fechar ao clicar na área
                    >
                        <img
                            src={imagemAtual}
                            alt="Tutorial"
                            style={{
                                maxWidth: '90%',
                                maxHeight: '90%',
                                borderRadius: '10px',
                            }}
                        />
                    </div>
                )}
            </main>
        </Pagina>
    );
}
