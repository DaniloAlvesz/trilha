# Product: ONCO+

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Pessoas com câncer de mama, incluindo mulheres e homens, em acompanhamento e pós-tratamento. O usuário pediu atenção a pessoas com baixo letramento digital. O uso é breve e pode ocorrer no celular, em casa ou antes de uma consulta; o contexto exato deve ser validado com participantes.

## Product Purpose

Ajudar a registrar como a pessoa está, organizar compromissos e preparar dúvidas para conversar com a equipe de saúde. A frequência diária deve resultar de utilidade e facilidade, sem cobrança, punição ou promessa de benefício clínico.

## Operating Context

O protótipo utiliza Next.js, React e TypeScript. As funções existentes incluem diário, agenda, rotina opcional de medicamento, perguntas e resumo para consulta, leitura ampliada, orientações educativas e fotos opcionais. Os dados clínicos não são monitorados por uma equipe.

## Capabilities and Constraints

Os registros pessoais começam vazios. A persistência no navegador depende de escolha explícita; não há autenticação, banco clínico remoto, sincronização entre aparelhos ou criptografia própria do produto. Não tratar o protótipo como prontuário. Lembretes exportados precisam ser importados no calendário da pessoa. O aplicativo não prescreve, interpreta imagens, define exames ou orienta compensação de doses.

O usuário solicitou a volta do fórum anônimo. O alcance real da troca de mensagens, a persistência e os controles devem ser descritos conforme a implementação. Um fórum apenas local não deve se apresentar como conversa entre pessoas de aparelhos diferentes. Apelido público não é garantia de anonimato técnico. Não inventar participantes, respostas, profissionais ou moderação.

## Brand Commitments

Nome ONCO+. Linguagem simples em português brasileiro, inclusiva de homens e mulheres. Direção solicitada: mobile first, paleta mais feminina e retomada do fórum anônimo. Feminilidade visual não restringe o público nem determina tratamento.

## Evidence on Hand

Protótipo anterior publicado em https://trilha-sepia.vercel.app/. O usuário relatou desenvolvimento inicial e duas pesquisas com 21 respondentes cada; não foi informado se eram as mesmas pessoas. A segunda pesquisa avaliou utilidade percebida após apresentação da proposta. Não é evidência de retenção, eficácia clínica ou teste de usabilidade observado. Não há métricas de uso longitudinal fornecidas.

## Product Principles

- A tarefa mais comum precisa ser encontrável e executável sem ajuda.
- Mostrar apenas informação real ou identificar demonstração de forma explícita.
- Manter os registros coerentes entre diário, agenda e resumo.
- Explicar armazenamento e publicação no ponto em que a pessoa decide.
- Dar autonomia para voltar, pausar, editar e excluir.

## Accessibility & Inclusion

Usar WCAG 2.2 como referência técnica, sem alegar conformidade integral a partir de inspeção parcial. Rótulos visíveis, foco reconhecível, contraste suficiente, alvos confortáveis e ausência de rolagem horizontal da página. Palavras comuns, frases curtas e mensagens que expliquem a recuperação. Conteúdo médico permanece sujeito à revisão por profissionais habilitados.

Referências: [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [W3C: palavras claras](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o3p01-clear-words/), [W3C: instruções por etapas](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o4p07-step-instructions/).
