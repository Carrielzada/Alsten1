import FormCadOrdemServico from './Formularios/FormCadOrdemServico';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { consultarOrdemServicoPorId, adquirirLockOS, liberarLockOS } from '../../Services/ordemServicoService';
import { useToast } from '../../hooks/useToast';

const TelaCadOrdemServico = () => {
    const { id } = useParams();
    const toast = useToast();
    const [ordemServicoEmEdicao, setOrdemServicoEmEdicao] = useState(null);
    const [loading, setLoading] = useState(false);
    const [lockError, setLockError] = useState(null);
    const [dirty, setDirty] = useState(false);
    const lockAdquirido = useRef(false);

    useEffect(() => {
        let ignore = false;
        async function fetchData() {
            if (id) {
                setLoading(true);
                try {
                    // Tenta adquirir o lock primeiro
                    await adquirirLockOS(id);
                    lockAdquirido.current = true;
                    const os = await consultarOrdemServicoPorId(id);
                    if (!ignore) setOrdemServicoEmEdicao(os);
                } catch (err) {
                    lockAdquirido.current = false;
                    const errorMessage = err?.message || 'Esta OS está sendo editada por outro usuário.';
                    setLockError(errorMessage);
                    toast.error(errorMessage);
                } finally {
                    setLoading(false);
                }
            } else {
                setOrdemServicoEmEdicao(null);
            }
        }
        fetchData();
        return () => { ignore = true; };
    }, [id]);

    useEffect(() => {
        // Ao desmontar, libera o lock se foi adquirido
        return () => {
            if (id && lockAdquirido.current) {
                liberarLockOS(id).catch(() => {});
            }
        };
    }, [id]);

    // Intercepta fechamento da aba/janela
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (dirty) {
                e.preventDefault();
                e.returnValue = 'Tem certeza que deseja sair? Alterações não salvas serão perdidas.';
                return e.returnValue;
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [dirty]);

    const handleFormSubmit = () => {
        // Libera o lock ao salvar
        if (id && lockAdquirido.current) {
            liberarLockOS(id).catch(() => {});
        }
        toast.success('Ordem de serviço salva! Fechando janela...');
        setTimeout(() => window.close(), 1500); // Fecha a janela após 1.5s
    };

    if (loading) return (
        <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
            </div>
            <p className="mt-2">Carregando ordem de serviço...</p>
        </div>
    );
    
    if (lockError) return (
        <div className="alert alert-danger m-4" role="alert">
            <h4 className="alert-heading">Acesso Restrito!</h4>
            <p>{lockError}</p>
            <hr />
            <p className="mb-0">Tente novamente em alguns minutos ou contate o administrador.</p>
        </div>
    );

    return (
        <>
            <FormCadOrdemServico
                onFormSubmit={handleFormSubmit}
                modoEdicao={!!id}
                ordemServicoEmEdicao={ordemServicoEmEdicao}
                onDirtyChange={setDirty}
            />
            <ToastContainer />
        </>
    );
};

export default TelaCadOrdemServico;