-- ─────────────────────────────────────────
-- Table sous_traitants
-- ─────────────────────────────────────────
create table public.sous_traitants (
  id                  uuid        default gen_random_uuid() primary key,
  user_id             uuid        references auth.users(id) on delete cascade not null,
  nom                 text        not null,
  specialite          text        not null,
  email               text,
  telephone           text,
  statut_conformite   text        not null default 'En attente'
                                  check (statut_conformite in ('Conforme', 'En attente', 'Non conforme')),
  prochaine_echeance  date,
  created_at          timestamptz default now() not null
);

-- ─────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────
alter table public.sous_traitants enable row level security;

create policy "select_own" on public.sous_traitants
  for select using (auth.uid() = user_id);

create policy "insert_own" on public.sous_traitants
  for insert with check (auth.uid() = user_id);

create policy "update_own" on public.sous_traitants
  for update using (auth.uid() = user_id);

create policy "delete_own" on public.sous_traitants
  for delete using (auth.uid() = user_id);
