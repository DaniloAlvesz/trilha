---
name: ONCO+
description: Apoio ao cuidado com leitura clara e tarefas próximas no celular.
colors:
  primary: "#96395D"
  primary-deep: "#50263C"
  foreground: "#382B34"
  muted: "#6D5864"
  background: "#FFF9F7"
  surface: "#FFFFFF"
  rose: "#F4E3E8"
  subtle: "#F9ECF0"
  border: "#E6D6DC"
  control-border: "#957383"
typography:
  body:
    fontFamily: "Atkinson, Arial, Helvetica, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
  title:
    fontFamily: "Atkinson, Arial, Helvetica, sans-serif"
    fontSize: "1.65rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
rounded:
  control: "10px"
  panel: "14px"
spacing:
  touch-gap: "12px"
  phone-gutter: "18px"
  section: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "12px 18px"
---

# ONCO+ design system

## Overview

A tarefa vem antes da apresentação. O celular mostra primeiro o registro diário, depois o próximo compromisso e as ações de consulta, fórum e informação. A direção feminina foi solicitada pelo usuário; o conteúdo continua inclusivo para homens e mulheres.

## Colors

Rosé nas superfícies, framboesa na ação principal e ameixa no texto de destaque. Fundo quase branco com toque rosado. As cores são tokens reais de `app/globals.css`; o nome legado `--teal` agora aponta para framboesa para preservar compatibilidade dos componentes. Não depende da cor para indicar seleção: há texto, marca ou borda adicional.

Pares calculados: branco/framboesa ~6,91:1; ameixa/rosé ~10,10:1; texto/fundo ~12,89:1; secundário/fundo ~6,24:1. Revalidar cores novas; esses pares não certificam a aplicação completa.

## Typography

Atkinson Hyperlegible 400 e 700 servida do próprio projeto, sob licença OFL em `public/fonts/OFL.txt`. Base17px com linha1,55; texto ampliado21px. Títulos funcionais de28px aproximadamente no celular; menus continuam crescendo com a preferência de texto. Não usar rótulos decorativos em caixa alta acima de títulos. Trechos de usuários quebram linhas, inclusive palavras sem espaços.

## Layout

CSS parte de320px; adiciona duas colunas a partir de640px e navegação superior a partir de900px. No celular, quatro abas persistentes: Hoje, Diário, Agenda e Fórum. Mais opções ficam no cabeçalho. Margem18px, seções24px, controles e espaços dimensionados para toque. Histórico semanal e filtros do fórum são expansíveis.

O detalhe de uma conversa ocupa um único painel; links de voltar preservam uma navegação compreensível. Conteúdo de registro pessoal não é misturado com conversa de fórum no relatório clínico pessoal.

## Elevation & Depth

Superfícies planas. Separação por espaço, linha fina e tom; sem sombras em cartões de repouso, gradientes, vidro ou ícones em caixas repetidas. Mensagens de estado ocupam fluxo normal e não cobrem botões ou foco.

## Shapes

Controles com raio10px, painelprincipal14px. Bordas necessárias ao reconhecimento de campos usam `--control`; linhas decorativas podem ser mais suaves. Anel de foco de3px ameixa, contorno branco externo para distinção de superfícies.

## Components

Um botão principal por tarefa; ações secundárias com contorno, rótulo completo e altura mínima50px. O diário usa perguntas numeradas porque são uma sequência real. Erros são associados a campos/grupos com texto em português e foco no primeiro erro. O fórum usa tópico legível, categoria em texto, apelido, respostas e ações locais explícitas. Mais opções abriga ações menos frequentes.

## Do's and Don'ts

- Manter a primeira ação encontrável sem ler um manifesto de apresentação.
- Simplificar linguagem sem infantilizar; explicar limites junto à ação relevante.
- Não preencher resultados, prescrições, participantes ou contadores fictícios sem rótulo de exemplo.
- Não alegar envio a profissionais, moderação real ou conversa entre pessoas no protótipo local.
- Testar320/390px, textoampliado, paisagem e tela larga. Screenshot não substitui teste em aparelho físico ou leitor de tela.
