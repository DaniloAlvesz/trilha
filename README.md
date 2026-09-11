# TRILHA // CADERNETA CLÍNICA ONCOLÓGICA

Infraestrutura digital de acompanhamento clínico, logístico e emocional de sobrevivência oncológica.

## 🩺 Padrão Documental & Clínico
- **Brutalismo Clínico**: Alto contraste, sem overlays/modais intrusivos, otimizado para acessibilidade e uso ambulatorial.
- **HL7 FHIR Release 4 Compliant**: Modelagem baseada nos recursos `MedicationStatement`, `Observation`, `Encounter` e `DocumentReference`.
- **RWD (Real-World Data)**: Registro fidedigno de adesão medicamentosa e sintomas no mundo real.

## 📱 Módulos do Sistema
1. **Hoje**: Painel operacional com motores de alerta logístico (D-5), suporte de scanxiety (D-3) e controle de doses diárias.
2. **Minha Agenda**: Registro imutável de consultas, exames de controle e procedimentos.
3. **Meu Diário**: Observatório de sintomas somáticos e flutuações hormonais/emocionais.
4. **Linha do Tempo**: Monitoramento fotográfico criptografado de cicatrizes e edema linfático.
5. **Papo Privado**: Comunidade anônima com desvinculação de prontuário e proteção contra desinformação médica.
6. **Relatório Clínico**: Compilação para impressão física em folha A4 para retorno médico no SUS.

## 🚀 Como Executar Localmente

Instale as dependências e inicie o servidor:

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.
