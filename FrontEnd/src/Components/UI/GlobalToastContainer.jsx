import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './toast-custom.css';

// Container global de toasts com configurações padronizadas para toda a aplicação
const GlobalToastContainer = () => {
    return (
        <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            limit={3} // Máximo 3 toasts simultâneos
            style={{
                zIndex: 9999,
                fontSize: '14px'
            }}
            // Estilos customizados para combinar com o design da Alsten
            toastClassName="toast-custom"
            bodyClassName="toast-body-custom"
            progressClassName="toast-progress-custom"
        />
    );
};

export default GlobalToastContainer;