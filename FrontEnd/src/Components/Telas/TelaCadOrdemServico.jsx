import FormCadOrdemServico from './Formularios/FormCadOrdemServico';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { consultarOrdemServicoPorId, adquirirLockOS, liberarLockOS, refreshLockOS } from '../../Services/ordemServicoService';
import { useToast } from '../../hooks/useToast';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import ErrorBoundary from '../ErrorBoundary';

const TelaCadOrdemServico = () => {
    const { id } = useParams();
    const toast = useToast();
    const { executeAsync } = useErrorHandler();
    const [ordemServicoEmEdicao, setOrdemServicoEmEdicao] = useState(null);
    const [loading, setLoading] = useState(false);
    const [lockError, setLockError] = useState(null);
    const [dirty, setDirty] = useState(false);
    const lockAdquirido = useRef(false);
    const [lockAtivo, setLockAtivo] = useState(false);

    useEffect(() => {
        let ignore = false;
        
        const fetchData = async () => {
            if (id) {
                setLoading(true);
                await executeAsync(
                    async () => {
                        // Tenta adquirir o lock primeiro
                        await adquirirLockOS(id);
                        lockAdquirido.current = true;
                        setLockAtivo(true);
                        const os = await consultarOrdemServicoPorId(id);
                        if (!ignore) setOrdemServicoEmEdicao(os);
                        return os;
                    },
                    {
                        showErrorAlert: false,
                        fallbackMessage: 'Esta OS está sendo editada por outro usuário.',
                        onError: (err, errorMessage) => {
                            lockAdquirido.current = false;
                            setLockError(errorMessage);
                            toast.error(errorMessage);
                        },
                        onFinally: () => setLoading(false)
                    }
                ).catch(() => {}); // Ignorar erro já tratado
            } else {
                setOrdemServicoEmEdicao(null);
            }
        };
        
        fetchData();
        return () => { ignore = true; };
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        // Ao desmontar, libera o lock se foi adquirido
        return () => {
            if (id && lockAdquirido.current) {
                liberarLockOS(id).catch(() => {});
                setLockAtivo(false);
            }
        };
    }, [id]);

    // Mantém o lock vivo enquanto o formulário estiver aberto
    useEffect(() => {
        if (!id || !lockAtivo) return;
        const interval = setInterval(() => {
            refreshLockOS(id).catch(() => {});
        }, 2 * 60 * 1000); // a cada 2 minutos
        return () => clearInterval(interval);
    }, [id, lockAtivo]);

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
        <ErrorBoundary>
            <FormCadOrdemServico
                onFormSubmit={handleFormSubmit}
                modoEdicao={!!id}
                ordemServicoEmEdicao={ordemServicoEmEdicao}
                onDirtyChange={setDirty}
            />
            <ToastContainer />
        </ErrorBoundary>
    );
};

export default TelaCadOrdemServico;