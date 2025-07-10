-- Script para debugar os dados da OS
-- Verificar os dados da OS com ID 8

SELECT 
    os.id,
    os.modeloEquipamento,
    os.fabricante,
    m.id as modelo_id,
    m.modelo as modelo_nome,
    f.id as fabricante_id,
    f.nome_fabricante as fabricante_nome
FROM ordem_servico os
LEFT JOIN modelo m ON os.modeloEquipamento = m.id
LEFT JOIN fabricante f ON os.fabricante = f.id
WHERE os.id = 8;

-- Verificar todos os modelos disponíveis
SELECT id, modelo FROM modelo ORDER BY id;

-- Verificar todos os fabricantes disponíveis
SELECT id, nome_fabricante FROM fabricante ORDER BY id; 