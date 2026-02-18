# Behind the Odds

Plataforma educativa de simulação de cassino em PT-BR para demonstrar por que "a casa sempre ganha".

## Tecnologias
- **Frontend**: React, Tailwind CSS, Shadcn UI, Framer Motion, Recharts.
- **Backend**: Node.js, Express, Drizzle ORM, PostgreSQL.
- **Segurança**: Zod para validação e caminhos de API tipados.

## Arquitetura
- `client/`: Aplicação frontend com páginas de jogos, educação e estatísticas.
- `server/`: API REST e lógica de persistência.
- `shared/`: Esquemas de banco de dados e definições de rotas compartilhadas.

## Jogos Incluídos
- **Caça-Níqueis**: Simulador de 3 cilindros com RTP de 95%.
- **Crash Game**: Jogo de multiplicador com curva exponencial e crash point aleatório.
- **Cara ou Coroa (Dobro ou Nada)**: Demonstração de como até jogos de 50/50 podem ter margem da casa.
- **ROLETINHA**: Demonstração de como até jogos de com "boas" chances de lucro podem ter margem da casa.

## Objetivo Educativo
Educar usuários sobre RNG, House Edge e a psicologia do vício em apostas através de dados e transparência matemática.
