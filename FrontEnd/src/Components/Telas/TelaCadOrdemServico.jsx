import FormCadOrdemServico from './Formularios/FormCadOrdemServico';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { consultarOrdemServicoPorId, adquirirLockOS, liberarLockOS } from '../../Services/ordemServicoService';

const TelaCadOrdemServico = () => {
    const { id } = useParams();
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
                    setLockError(err?.message || 'Esta OS está sendo editada por outro usuário.');
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
        window.close(); // Fecha a janela ao salvar no modo edição
    };

    if (loading) return <div>Carregando...</div>;
    if (lockError) return <div style={{ color: 'red', padding: 32, fontWeight: 'bold' }}>{lockError}</div>;

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