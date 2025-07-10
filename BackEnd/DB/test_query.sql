-- Script para testar a consulta que está falhando
USE alsten_os;

-- Testar a consulta exata que está sendo executada
SELECT 
    os.*,
    m.modelo as modelo_nome,
    f.nome_fabricante as fabricante_nome,
    urg.urgencia,
    ta.tipo_analise,
    tl.tipo_lacre,
    tLimp.tipo_limpeza,
    tt.tipo_transporte,
    p.pagamento
FROM ordem_servico os
LEFT JOIN modelo m ON os.modeloEquipamento = m.id OR os.modeloEquipamento = m.modelo
LEFT JOIN fabricante f ON os.fabricante = f.id OR os.fabricante = f.nome_fabricante
LEFT JOIN urgencia urg ON os.urgencia_id = urg.id
LEFT JOIN tipo_analise ta ON os.tipo_analise_id = ta.id
LEFT JOIN tipo_lacre tl ON os.tipo_lacre_id = tl.id
LEFT JOIN tipo_limpeza tLimp ON os.tipo_limpeza_id = tLimp.id
LEFT JOIN tipo_transporte tt ON os.tipo_transporte_id = tt.id
LEFT JOIN pagamento p ON os.pagamento_id = p.id
ORDER BY os.dataCriacao DESC;

-- Verificar os dados atuais
SELECT 
    id,
    cliente,
    modeloEquipamento,
    fabricante,
    numeroSerie,
    defeitoAlegado,
    dataCriacao
FROM ordem_servico; 