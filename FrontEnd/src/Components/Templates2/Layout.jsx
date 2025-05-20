import React from 'react';
import Cabecalho from './Cabecalho'; // Supondo que Cabecalho.jsx exista
import Menu from './Menu'; // Supondo que Menu.jsx exista
import Rodape from './Rodape'; // Supondo que Rodape.jsx exista
import './Layout.css'; // Criaremos este arquivo para estilos básicos do layout

const Layout = ({ children }) => {
    return (
        <div className="app-container">
            <Cabecalho />
            <div className="main-content-area">
                <Menu />
                <main className="content">
                    {children}
                </main>
            </div>
            <Rodape />
        </div>
    );
};

export default Layout;

