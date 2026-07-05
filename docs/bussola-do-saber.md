# Bússola do Saber — Especificação (vddig · ENSP/Fiocruz)

Aba com caixa de busca em linguagem simples que explica termos técnicos
(normativos, siglas de gestão pública e conceitos de IA) usados na plataforma.

- **Objetivo:** promover letramento e autonomia — usuário entende termos técnicos sem depender de terceiros.
- **Busca — entrada:** caixa de texto livre em linguagem simples, tolerante a erros de digitação.
- **Busca — sinônimos:** reconhece abreviações, siglas e variações (ex.: "LOAS", "verba assistencial") apontando ao mesmo verbete.
- **Busca — resposta:** explicação curta, sem jargão, com exemplo prático e link para a norma-fonte quando houver.
- **Fonte:** RAG setorial (normativas de cada área) + glossário institucional curado, com validação humana (human-in-the-loop).
- **Curadoria:** glossário mantido por Planejamento/Assessoria; termos de IA revisados pela vddig; atualização versionada e datada.
- **Governança:** cada verbete registra autor, data e fonte; termos sensíveis passam pela camada DLP/LGPD.
- **Integração — chat IA:** termos técnicos na resposta do assistente ficam clicáveis e abrem a explicação na Bússola.
- **Integração — telas:** siglas em KPIs, metas e dashboard exibem tooltip "?" que leva ao verbete.
- **Integração — busca reversa:** sem resultado, a Bússola sugere abrir o assistente para uma explicação sob demanda.
