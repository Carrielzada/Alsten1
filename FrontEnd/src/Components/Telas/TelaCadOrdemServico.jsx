import React from 'react';
import CardModerno from '../LayoutModerno/CardModerno';
import FormCadOrdemServico from './Formularios/FormCadOrdemServico';
import LayoutModerno from '../LayoutModerno/LayoutModerno';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TelaCadOrdemServico = () => {
    const handleFormSubmit = () => {
        // Lógica para recarregar dados ou atualizar a interface
        console.log("Formulário de OS enviado com sucesso!");
    };

    return (
        <LayoutModerno>
            <CardModerno titulo="Cadastro de Ordem de Serviço">
                <FormCadOrdemServico onFormSubmit={handleFormSubmit} />
            </CardModerno>
            <ToastContainer />
        </LayoutModerno>
    );
};

export default TelaCadOrdemServico;