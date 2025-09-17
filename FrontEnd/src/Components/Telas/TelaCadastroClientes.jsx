import React from 'react';
import { FaUsers } from 'react-icons/fa';
import TelaWorkInProgress from './TelaWorkInProgress';

const TelaCadastroClientes = () => {
    return (
        <TelaWorkInProgress
            title="Cadastro de Clientes"
            description="O sistema completo de cadastro de clientes está sendo desenvolvido com integração ao Bling ERP e funcionalidades avançadas de gestão."
            icon={FaUsers}
            estimatedCompletion="Próxima atualização"
            features={[
                "Cadastro completo de clientes PF e PJ",
                "Integração automática com Bling ERP",
                "Validação de documentos (CPF/CNPJ)",
                "Busca avançada de clientes",
                "Histórico de ordens de serviço",
                "Gestão de contatos e endereços",
                "Importação de dados do Bling",
                "Dashboard de relacionamento"
            ]}
        />
    );
};

export default TelaCadastroClientes;