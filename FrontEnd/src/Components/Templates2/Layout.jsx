import React from 'react';
import Rodape from './Rodape'; // Supondo que Rodape.jsx exista
import './Layout.css'; // Criaremos este arquivo para estilos básicos do layout
import Breadcrumb from '../UI/Breadcrumb';

const Layout = ({ children }) => {
    return (
        <div className="app-container">
            <div className="main-content-area">
                <div className="container-fluid pt-3">
                    <Breadcrumb />
                </div>
                <main className="content">
                    {children}
                </main>
            </div>
            <Rodape />
        </div>
    );
};

export default Layout;

