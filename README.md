# ONCO+

Protótipo de apoio ao acompanhamento de pessoas com câncer de mama, incluindo homens e mulheres. Interface em português simples, com diário, agenda e resumo pessoal para consulta.

## Executar

Node.js 20.9 ou superior, npm.

```sh
npm ci
npm run dev
```

Abra http://localhost:3000. Para validar: `npm run lint`, `npm test`, `npm run build`.

## O que funciona

- Registro de emoções e sintomas; histórico semanal sem sequências obrigatórias.
- Agenda compartilhada com início e resumo; exportação de compromisso em calendário.
- Rotina opcional de medicamento, com registros de tomada por data e opção de desfazer.
- Dúvidas para consulta e resumo imprimível/PDF gerado pelo navegador.
- Lembrete diário opcional por arquivo ICS importado no calendário pessoal.
- Texto ampliado, navegação consistente, foco visível e formulários com rótulos.
- Fotos opcionais com prévia, limite de 3 imagens, conversão para JPEG e exclusão.
- Informações educativas com fontes e fórum por apelido: tópicos, respostas, busca, salvos, apoio e controles locais de ocultação.

## Limites explícitos

Não há autenticação, backend clínico, equipe de monitoramento, integração com SUS ou notificações push. As fotos não são interpretadas e os registros não geram diagnósticos. Não se introduzem prescrições, doses, exames, códigos clínicos ou resultados fictícios.

Por padrão os dados existem apenas na memória da aba. Armazenamento persistente em `localStorage` exige opção explícita; não tem senha, criptografia própria ou backup. Não usar este protótipo como prontuário ou repositório de dados sensíveis de participantes. Pessoas com acesso ao aparelho podem ver os dados. As requisições normais da hospedagem continuam existindo.

O fórum anônimo voltou como protótipo local. Você pode iniciar conversas, responder, salvar, apoiar e ocultar conteúdo; exemplos são identificados como fictícios. As conversas não são compartilhadas entre aparelhos, e denúncias não chegam a uma equipe. Uma comunidade real requer backend e governança próprios.

Veja [DOCUMENTACAO_TECNICA.md](DOCUMENTACAO_TECNICA.md) para arquitetura, evidências e plano de validação. Publicar no GitHub não comprova que o deploy da Vercel foi atualizado.

## Design e agentes

A interface parte do celular, com quatro abas (Hoje, Diário, Agenda e Fórum), paleta rosé/ameixa e fonte Atkinson Hyperlegible hospedada no próprio projeto. Consulte [DESIGN.md](DESIGN.md), [AGENTS.md](AGENTS.md) e [o registro das skills](docs/skills-manifest.json). Os três papéis de agentes estão em `.codex/agents/`; não são processos autônomos permanentes.
