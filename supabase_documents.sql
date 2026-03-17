-- ─────────────────────────────────────────
-- 1. Créer le bucket Storage "documents"
--    (à faire manuellement dans Storage > New bucket)
--    Nom: documents | Private: true
-- ─────────────────────────────────────────

-- ─────────────────────────────────────────
-- 2. Table documents
-- ─────────────────────────────────────────
create table public.documents (
  id               uuid        default gen_random_uuid() primary key,
  user_id          uuid        references auth.users(id) on delete cascade not null,
  sous_traitant_id uuid        references public.sous_traitants(id) on delete cascade not null,
  nom              text        not null,
  type_document    text        not null check (type_document in ('Kbis', 'Assurance RC Pro', 'Attestation URSSAF', 'Autre')),
  url              text        not null,
  date_expiration  date,
  created_at       timestamptz default now() not null
);

alter table public.documents enable row level security;

create policy "select_own" on public.documents for select using (auth.uid() = user_id);
create policy "insert_own" on public.documents for insert with check (auth.uid() = user_id);
create policy "update_own" on public.documents for update using (auth.uid() = user_id);
create policy "delete_own" on public.documents for delete using (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- 3. Policies Storage (bucket "documents")
-- ─────────────────────────────────────────
create policy "storage_insert_own" on storage.objects
  for insert with check (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "storage_select_own" on storage.objects
  for select using (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "storage_delete_own" on storage.objects
  for delete using (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
