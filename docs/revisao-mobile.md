# Revisão mobile-first do ONCO+

## O que mudou

O início apresenta a tarefa diária primeiro; a agenda vem depois. Retiramos introdução extensa, rótulos decorativos em caixa alta e cartões de funções com o mesmo peso. Histórico semanal fica em expansão. Navegação de quatro abas: Hoje, Diário, Agenda e Fórum. Mais opções no cabeçalho conserva orientações, ajustes, resumo e fotos.

Rosé/framboesa/ameixa substituem o verde. A fonte Atkinson Hyperlegible é servida localmente; corpo17px e opção21px. Menus não diminuem quando o texto é ampliado. Bordas de controles mais fortes, seleção identificada e foco com contraste entre superfícies. Sem gradientes ou sombras de cartões.

O fórum voltou com tópicos, respostas, apelido, busca, assuntos, salvos, apoiar e controles de ocultação. As ações menos frequentes ficam em Mais opções, e filtros ficam recolhidos inicialmente. Exemplos claramente identificados; não há participantes fictícios apresentados como reais. A implementação é local e não envia conversas a outras pessoas. Compartilhamento real entre aparelhos ainda requer servidor e infraestrutura apropriados.

## Skills e agentes

Fontes, commits e aplicação: [skills-manifest.json](skills-manifest.json). Quatro skills de terceiros instaladas e aplicadas. A quinta, web-accessibility, é adaptação local baseada no repositório e na recomendação WCAG do W3C, sem alegar autoria oficial.

Agentes de design, acessibilidade e fórum usados na revisão; papéis persistentes em `.codex/agents/`. Eles herdam modelo e permissões da sessão. Não são processos permanentes de monitoramento do app.

O launcher de contexto Impeccable estava indisponível; foi seguido o fallback de leitura direta. O gerador de sistema visual UI/UX Pro Max trouxe sugestões de marketing fora do escopo e elas foram rejeitadas; aplicadas regras pertinentes de toque, navegação e legibilidade. Taste draw/lint e referências de telas de aplicativo aplicados, com inspeção visual pelo navegador CUA disponível.

## Evidência de verificação

- Compilação de produção e TypeScript aprovados.
- Oito testes: datas locais, próxima agenda, dias sem tomada, calendário discreto, validação/persistência e integridade do fórum.
- `npm audit`: nenhuma vulnerabilidade conhecida apontada na verificação.
- `git diff --check`: aprovado.
- Taste lint:0falhas;3avisos preservados por serem datas/horários e halo de foco acessível.
- Navegador:390px,320px, texto ampliado21px, paisagem844×390 e tela larga. Sem overflow nos fluxos observados; a320px, largura de conteúdo305px com barra de rolagem15px. Título de100caracteres sem espaços quebrou corretamente, inclusive no texto ampliado.
- Criação e resposta de conversa, busca, apoiar/salvar e retorno após recarregar foram verificados com mensagens fictícias no ambiente local. Dados de teste não foram incluídos no repositório ou no site publicado.
- A navegação básica por Tab avançou para Diário. Erros do diário indicam a etapa e posicionam o foco após atualização. Não é auditoria exaustiva de teclado.

## Limites

Não houve teste com participantes, leitor de tela ou aparelhos físicos. Capturas e viewport emulado validam composição, não equivalem a teste de todos os gestos de toque ou motores de navegador. Não há certificação WCAG nem prova de aumento da retenção ou benefício clínico. Fórum público, moderação e sincronização não estão implementados nesta versão local.
