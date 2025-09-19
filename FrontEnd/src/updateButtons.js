// Script para atualizar automaticamente todas as telas com nosso Button moderno
// Este script vai substituir todos os imports de Button nas telas

const fs = require('fs');
const path = require('path');

// Lista de arquivos que precisam ser atualizados
const arquivosParaAtualizar = [
  'TelaCadClientePJ.jsx',
  'TelaCadModeloEquipamento.jsx', 
  'TelaCadFabricante.jsx',
  'TelaCadServicoPadrao.jsx',
  'TelaCadUrgencia.jsx',
  'TelaCadAnalise.jsx',
  'TelaCadDefeito.jsx',
  'TelaBoasVindas.jsx',
  'TelaCadTipoLacre.jsx',
  'TelaCadTipoTransporte.jsx',
  'TelaCadTipoLimpeza.jsx',
  'TelaLogsOS.jsx',
  'TelaCadFabricanteSerie.jsx',
  'TelaRelatorioCompleto.jsx',
  'TelaCadTipoAnalise.jsx',
  'TelaWorkInProgress.jsx',
  'TelaCadDefeitoAlegado.jsx',
  'TelaCadLacre.jsx',
  'TelaCadClientePF.jsx',
  'TelaListagemOS.jsx',
  'TelaCadPagamento.jsx',
  'TelaOSConcluidas.jsx'
];

// Diretório das telas
const telasDir = path.join(__dirname, 'Components', 'Telas');

// Função para atualizar um arquivo
function atualizarArquivo(caminhoArquivo) {
  try {
    let conteudo = fs.readFileSync(caminhoArquivo, 'utf8');
    let modificado = false;

    // Padrão 1: import com Button junto com outros componentes
    const padrao1 = /import\s*\{\s*([^}]*)\s*Button\s*([^}]*)\s*\}\s*from\s*['"]react-bootstrap['"];?/g;
    if (padrao1.test(conteudo)) {
      conteudo = conteudo.replace(padrao1, (match, before, after) => {
        const componentes = [];
        if (before.trim()) componentes.push(before.trim().replace(/,$/, ''));
        if (after.trim()) componentes.push(after.trim().replace(/^,/, ''));
        
        const novosComponentes = componentes
          .filter(comp => comp.trim())
          .join(', ');
          
        return `import { ${novosComponentes} } from 'react-bootstrap';\nimport Button from '../UI/Button'; // Nosso Button moderno`;
      });
      modificado = true;
    }

    // Padrão 2: import apenas Button
    const padrao2 = /import\s*Button\s*from\s*['"]react-bootstrap['"];?/g;
    if (padrao2.test(conteudo)) {
      conteudo = conteudo.replace(padrao2, `import Button from '../UI/Button'; // Nosso Button moderno`);
      modificado = true;
    }

    // Padrão 3: Button importado separadamente
    const padrao3 = /import\s*\{\s*Button\s*\}\s*from\s*['"]react-bootstrap['"];?/g;
    if (padrao3.test(conteudo)) {
      conteudo = conteudo.replace(padrao3, `import Button from '../UI/Button'; // Nosso Button moderno`);
      modificado = true;
    }

    if (modificado) {
      fs.writeFileSync(caminhoArquivo, conteudo, 'utf8');
      console.log(`✅ Atualizado: ${path.basename(caminhoArquivo)}`);
    } else {
      console.log(`⏭️  Pulado: ${path.basename(caminhoArquivo)} (já atualizado ou sem Button)`);
    }

  } catch (error) {
    console.error(`❌ Erro ao atualizar ${path.basename(caminhoArquivo)}:`, error.message);
  }
}

// Executar atualização
console.log('🚀 Iniciando atualização dos botões...\n');

arquivosParaAtualizar.forEach(arquivo => {
  const caminhoCompleto = path.join(telasDir, arquivo);
  
  if (fs.existsSync(caminhoCompleto)) {
    atualizarArquivo(caminhoCompleto);
  } else {
    console.log(`⚠️  Arquivo não encontrado: ${arquivo}`);
  }
});

// Verificar também formulários
const formulariosDir = path.join(telasDir, 'Formularios');
if (fs.existsSync(formulariosDir)) {
  const formularios = fs.readdirSync(formulariosDir).filter(f => f.endsWith('.jsx'));
  
  console.log('\n📝 Atualizando formulários...\n');
  
  formularios.forEach(arquivo => {
    const caminhoCompleto = path.join(formulariosDir, arquivo);
    atualizarArquivo(caminhoCompleto);
  });
}

console.log('\n🎉 Atualização concluída!');
console.log('📋 Todos os botões agora usam nosso sistema moderno automaticamente!');