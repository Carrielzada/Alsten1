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

            <><FormCadOrdemServico onFormSubmit={handleFormSubmit} /><ToastContainer /></>

    );
};

export default TelaCadOrdemServico;