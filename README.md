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
- Informações educativas com fontes e recursos para pedir apoio.

## Limites explícitos

Não há autenticação, backend clínico, equipe de monitoramento, integração com SUS ou notificações push. As fotos não são interpretadas e os registros não geram diagnósticos. Não se introduzem prescrições, doses, exames, códigos clínicos ou resultados fictícios.

Por padrão os dados existem apenas na memória da aba. Armazenamento persistente em `localStorage` exige opção explícita; não tem senha, criptografia própria ou backup. Não usar este protótipo como prontuário ou repositório de dados sensíveis de participantes. Pessoas com acesso ao aparelho podem ver os dados. As requisições normais da hospedagem continuam existindo.

A comunidade anterior era simulada. Esta versão oferece preparação para buscar apoio, sem inventar participantes, publicações ou moderação. Uma comunidade real requer backend e governança próprios.

Veja [DOCUMENTACAO_TECNICA.md](DOCUMENTACAO_TECNICA.md) para arquitetura, evidências e plano de validação. Publicar no GitHub não comprova que o deploy da Vercel foi atualizado.
