# ONCO+ — trabalho coordenado

Leia PRODUCT.md para escopo e DESIGN.md para decisões atuais de interface. O produto é um protótipo de apoio a pessoas com câncer de mama; a paleta feminina não restringe gênero ou tratamento.

## Papéis configurados

Os agentes de projeto em `.codex/agents/` herdam as configurações de modelo e permissões do agente principal. O coordenador distribui arquivos sem sobreposição e integra a entrega:

- `mobile_design`: hierarquia, sistema visual, fluxo principal e revisão de screenshots.
- `accessibility`: WCAG 2.2, teclado, leitura, contraste, reflow e erros de formulário.
- `forum`: conversa por apelido, tópicos/respostas, filtros e integridade de armazenamento.

As skills instaladas no ambiente de trabalho são `web-design-guidelines`, `impeccable`, `design-taste-frontend` (pasta `taste-skill`), `ui-ux-pro-max` e `web-accessibility` (adaptação local do W3C). Consulte `docs/skills-manifest.json` para fontes. Uma instalação diferente precisa instalar suas próprias cópias.

## Entrega

Mantenha a tarefa diária e a agenda fáceis de encontrar no celular. Textos curtos, títulos funcionais e estado honesto. Não converter preferências estéticas de uma skill em informação clínica. Preservar rotas antigas.

Rode `npm run lint`, `npm test`, `npm run build` e `git diff --check` conforme a mudança. Teste visualmente 320 e 390 px, texto ampliado e tela larga; exercite ações alteradas. Descreva limitações reais sem alegar certificação. O coordenador concentra a publicação autorizada, preservando mudanças de outras pessoas.
