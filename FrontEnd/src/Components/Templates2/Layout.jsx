import React from 'react';
import Rodape from './Rodape'; // Supondo que Rodape.jsx exista
import './Layout.css'; // Criaremos este arquivo para estilos básicos do layout

const Layout = ({ children }) => {
    return (
        <div className="app-container">
            <div className="main-content-area">
                <main className="content">
                    {children}
                </main>
            </div>
            <Rodape />
        </div>
    );
};

export default Layout;

