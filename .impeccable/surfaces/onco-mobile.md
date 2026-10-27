# ONCO+ — início e navegação mobile

Modo: Operate. Alvos: `components/Hoje.tsx`, `components/HeaderNavigation.tsx`, `app/globals.css`; o fórum é uma tela de lista e detalhe em `/comunidade`.

## Direction contract

THESIS: “O que preciso fazer agora?” deve ter resposta na primeira tela do celular. A página inicial prioriza registro breve, próximo compromisso e preparação da consulta; elimina introdução de marketing e a sucessão de cartões de funções com o mesmo peso.

OWN-WORLD: Rosé, ameixa e superfície clara, com contraste de texto preservado. Cor forte em ação e seleção; superfícies planas, uma família sans, ícones de traço consistentes. Rótulos em sentence case e controles familiares.

STORY: A pessoa identifica o ONCO+, registra como está, reconhece o que foi guardado e encontra a agenda e o fórum sem procurar em menus profundos. Detalhes adicionais entram por expansão progressiva.

FIRST VIEWPORT: Cabeçalho compacto com marca e ajuda; título funcional e data curta; registro diário com uma ação primária; início da agenda abaixo. Navegação inferior com quatro destinos de rótulos completos. Informações de armazenamento são contextuais, sem ocupar um banner em toda visita.

FORM: Casa pessoal de cuidado, derivada do estilo Taste `editorial-greeting`, seed 887881553. Tipo e paleta preservam o brief. A folha parte de desktop; corpo maior e alvos de toque do público mobile prevalecem sobre a densidade da amostra. Impeccable context indisponível por permissão de execução; referências de Operate, new-work e craft-floor lidas diretamente.

FINISH: build, tipos e8testes passaram. Layout revisado via navegador CUA em320/390px, paisagem844px e tela larga; fonte local verificada, título de100caracteres sem espaços testado sem overflow. DESIGN.md e sidecar escritos do código. Não se executou auditoria integral de leitor de tela ou aparelho físico.

## Verificação requerida

Inspecionar o build em celular estreito, celular comum, tablet e desktop, com texto padrão e ampliado. Testar primeiro registro, estado salvo, agenda vazia e preenchida, publicação/resposta do fórum no alcance realmente implementado, erro e texto longo. A visualização deve ocorrer pelo navegador CUA disponível; o inspector externo Taste não deve ser usado quando conflitar com essa restrição de ferramentas. Registrar a limitação, sem alegar que passou.

## Fontes de direção

- `/home/nilo/.codex/skills/taste-skill/references/app-screens.md` e `.taste-skill/direction.json`.
- `/home/nilo/.codex/skills/impeccable/reference/operate.md`, `mode-operate.md` e `craft-floor.md`.
- [W3C, instruções por etapas](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o4p07-step-instructions/).

Sem depoimentos, números de pacientes, taxas de retenção ou benefícios clínicos inventados. Não há necessidade de imagens decorativas para executar estas tarefas.
