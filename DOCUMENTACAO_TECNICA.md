# ONCO+ — documentação técnica e de produto

## Escopo

Protótipo de suporte a pessoas com câncer de mama. Não é um serviço de assistência ou software validado para decisão clínica. Mudanças de linguagem incluem homens e mulheres, sem presumir tratamento conforme gênero. Medicamentos e compromissos começam vazios.

## Arquitetura

Next.js App Router, React e TypeScript. `components/CareProvider.tsx` é a fonte compartilhada para diário, agenda, perguntas, rotina, fotos e preferências. `lib/care.ts` contém tipos, funções de data, validação do armazenamento, calendário e totais. Não existe banco remoto.

Rotas: `/` hoje, `/diario`, `/agenda`, `/aprender`, `/ajuda`, `/ajustes`, `/relatorio-print`, `/fotos`, `/comunidade` (fórum por apelido, local e sem compartilhamento remoto). Endereços anteriores são preservados para não quebrar links.

A seleção diária de medicamento substitui a marcação na mesma data; não incrementa estoques ou presume ingestão. Datas sem informação não viram doses perdidas. Ao trocar medicamento, pede confirmação para apagar marcações anteriores, evitando atribuí-las a outro tratamento. Compromissos vencidos não viram automaticamente realizados. O início usa somente compromissos futuros pendentes. Datas diárias usam o fuso local.

## Dados e privacidade

Padrão em memória: atualizar/fechar aba perde os registros. Persistência opcional, explícita, em `localStorage`, chave `onco-plus-care-v1`. Falhas de armazenamento apresentam aviso; dados permanecem na memória. Não são sincronizados entre aparelhos. Não há senha ou criptografia própria: não é adequado para coleta de dados reais em pesquisa sem infraestrutura e avaliação adicionais.

O leitor valida versão e estrutura do armazenamento, limita campos e aceita apenas URLs de imagem JPEG/PNG/WebP em base64. Fotos: até 1 MB na entrada, 3 registros, redimensionamento até 1200 px e recodificação JPEG por canvas, sem preservar metadados do arquivo original. Fotos não entram no PDF. Não há importação de dados arbitrários, HTML de usuário, telemetria de saúde ou integrações remotas.

ICS de compromissos tem título discreto e não inclui nome, diagnóstico, medicamento ou notas. Lembretes exigem importação pelo usuário; não se promete aviso com o aplicativo fechado. Pausa/exclusão ocorre no calendário que recebeu o arquivo. PDF é gerado pela impressão do navegador e pode conter dados sensíveis escolhidos pelo usuário.

## UX e retorno cotidiano

Hipóteses de produto: ação principal clara, registro breve, retorno visual em semana móvel, personalização opcional, preparação para consulta e lembrete escolhido pela pessoa. Sem recompensas condicionadas a doença, placares públicos, perda de sequências, mensagens de culpa ou promessas de melhora clínica. O objetivo é uso frequente que tenha utilidade, não tempo prolongado de tela.

A literatura associa personalização, lembretes adequados, automonitoramento e estabilidade técnica ao engajamento. Isso não estabelece um efeito garantido neste público nem permite ranquear uma técnica universalmente mais eficaz. Frequência diária deve ser opcional e adequada ao contexto de cuidado.

Fontes consultadas para decisões de projeto:

- Revisão sistemática sobre adesão a apps: https://www.jmir.org/2022/5/e35371
- Revisão de uso e engajamento em apps de saúde: https://pmc.ncbi.nlm.nih.gov/articles/PMC7293059/
- W3C, palavras claras: https://www.w3.org/WAI/WCAG2/supplemental/patterns/o3p01-clear-words/
- W3C, instruções por etapas: https://www.w3.org/WAI/WCAG2/supplemental/patterns/o4p07-step-instructions/
- NCI, câncer de mama em homens: https://www.cancer.gov/types/breast/male-breast-cancer
- Ensaio de aplicativo em hormonioterapia (sem melhora do desfecho primário de adesão): https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2820436

## Validação necessária

As pesquisas de opinião informadas no trabalho acadêmico não medem retenção nem comprovam eficácia ou usabilidade. Próximo piloto: incluir participantes com baixo letramento digital e diversidade de gênero/idade, observar tarefa sem ajuda, compreensão de armazenamento, tempo para primeiro registro, dificuldades e facilidade de retorno após ausência. Não assumir aprovação ética, consentimento ou amostra que não foram informados.

Métricas futuras, somente com consentimento e infraestrutura apropriada: proporção de pessoas que conclui primeiro registro; retorno no dia 1, 7 e 30 por coorte de entrada; dias com ação útil por semana; preparo/uso de resumo em consulta; desativação de lembretes; abandono e motivo. Diferenciar retorno ao app de adesão medicamentosa. A versão atual não envia análises a servidor e não inventa métricas.

Antes de uso clínico: revisão do conteúdo por equipe habilitada; protocolos de orientação e escalonamento; autenticação, segurança e recuperação; revisão de privacidade; definição de responsabilidades de monitoramento. Chat real requer moderação, denúncia, bloqueio e resposta a riscos. Não há selo de conformidade ou certificação.

## Revisão mobile-first e fórum

A revisão passou a usar quatro destinos de navegação com rótulos legíveis, hierarquia de tarefas no início, controles em torno de 48–50px e ampliação de texto sem diminuir o menu. Paleta rose/plum/cream registrada em DESIGN.md; Atkinson Hyperlegible 400/700 servida localmente sob OFL, sem dependência de Google Fonts em tempo de uso.

O fórum vive em `CareData.forum`, com validação em `lib/forum.ts` e o mesmo consentimento de armazenamento/exclusão do restante do app. Inclui apelido botânico, tópicos e respostas, busca normalizada, categorias, salvos, apoiar, ocultar autor e denúncia local. Há até 3 conversas de exemplo, sempre identificadas. Uma denúncia oculta o tópico no aparelho; não se afirma que foi enviada a moderadores. O app não garante anonimato completo: é uso por apelido, sem publicar nome, e os dados continuam acessíveis a quem usa o aparelho.

Papéis de manutenção em `.codex/agents/` seguem a documentação oficial de agentes do Codex: https://learn.chatgpt.com/docs/agent-configuration/subagents . Modelos e permissões são herdados, sem credenciais adicionadas. As skills foram instaladas no ambiente e aplicadas; fontes e limitações dos helpers estão em `docs/skills-manifest.json`.
