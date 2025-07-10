-- Script para popular as tabelas auxiliares com dados iniciais
USE alsten_os;

-- Inserir dias de pagamento
INSERT INTO dias_pagamento (descricao, dias) VALUES 
('À vista', 0),
('Para 7 dias', 7),
('Para 15 dias', 15),
('Para 28 dias', 28),
('Para 30 dias', 30),
('Para 45 dias', 45),
('Para 60 dias', 60);

-- Inserir itens do checklist
INSERT INTO checklist_item (item) VALUES 
('Lavado'),
('Reparado'),
('Teste Final Realizado'),
('Lacrado'),
('Etiquetado');

-- Inserir etapas da OS
INSERT INTO etapa_os (nome, descricao) VALUES 
('PREVISTO', 'O responsável pela logística inclui a OS nessa etapa quando o cliente envia um equipamento para reparo'),
('RECEBIDO', 'O responsável pela logística recebe o equipamento'),
('EM ANÁLISE', 'O técnico responsável pela OS passa a etapa de recebido para em análise'),
('ANALISADO', 'O técnico responsável pela OS passa a etapa de em análise para analisado'),
('AGUARDANDO APROVAÇÃO', 'O setor comercial passa a etapa de analisado para aguardando aprovação'),
('PRÉ-APROVADO', 'O vendedor passará de ag. Aprovação para essa etapa somente se o cliente tiver alguma pendência'),
('APROVADO', 'O vendedor passará para essa etapa APENAS se já estiver tudo negociado e sem nenhuma pendência'),
('REPROVADO', 'O vendedor passará para essa etapa se o orçamento for reprovado pelo cliente'),
('AGUARDANDO INFORMAÇÃO', 'Após o técnico finalizar todo o reparo do equipamento de uma OS que estava na etapa PRÉ-APROVADO'),
('SEM CUSTO', 'O vendedor passará para essa etapa caso o serviço seja em garantia ou cortesia'),
('EXPEDIÇÃO', 'O técnico após finalizar todo reparo e o comercial finalizar toda a negociação com o cliente'),
('DESPACHO', 'Essa etapa informará a logística para seguir com o retorno do equipamento'),
('CONCLUÍDO', 'O responsável pela logística concluirá a OS assim que o equipamento for enviado para o cliente');

-- Inserir defeitos alegados padrão
INSERT INTO defeito_alegado_padrao (titulo, defeito) VALUES 
('Não liga', 'Equipamento não liga quando pressionado o botão de energia'),
('Tela quebrada', 'Tela do equipamento está quebrada ou com rachaduras'),
('Bateria não carrega', 'Bateria não carrega ou descarrega muito rápido'),
('Som não funciona', 'Alto-falantes não emitem som'),
('Botões não funcionam', 'Botões do equipamento não respondem ao toque'),
('Aquecimento excessivo', 'Equipamento esquenta muito durante o uso'),
('Tela com manchas', 'Tela apresenta manchas ou pontos escuros'),
('Fonte não funciona', 'Fonte de alimentação não carrega o equipamento'),
('Wi-Fi não conecta', 'Problemas de conectividade Wi-Fi'),
('Bluetooth não funciona', 'Problemas de conectividade Bluetooth');

-- Inserir serviços padrão
INSERT INTO servico_padrao (titulo, servico) VALUES 
('Troca de bateria', 'Substituição da bateria por uma nova'),
('Reparo na tela', 'Reparo ou substituição da tela'),
('Limpeza interna', 'Limpeza completa do interior do equipamento'),
('Troca de componentes', 'Substituição de componentes danificados'),
('Atualização de software', 'Atualização do sistema operacional'),
('Reparo na fonte', 'Reparo ou substituição da fonte de alimentação'),
('Limpeza de cooler', 'Limpeza e manutenção do sistema de ventilação'),
('Troca de teclado', 'Substituição do teclado'),
('Reparo na placa-mãe', 'Reparo na placa principal do equipamento'),
('Configuração de rede', 'Configuração de conectividade de rede'); 