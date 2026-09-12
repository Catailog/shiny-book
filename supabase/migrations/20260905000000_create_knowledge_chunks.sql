create extension if not exists vector;

create table public.knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  source_ref text,
  locale text,
  content text not null,
  embedding vector(768) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.knowledge_chunks enable row level security;

grant select, insert, update, delete on public.knowledge_chunks to service_role;

create index knowledge_chunks_embedding_idx
  on public.knowledge_chunks
  using hnsw (embedding vector_cosine_ops);

-- `locale is null` rows (FAQ/announcement/pricing - locale-independent content,
-- same as the full-context knowledge base they replace) are always eligible
-- regardless of the query's locale. All arguments are typed and bound; no
-- dynamic SQL is built here.
create or replace function public.match_knowledge_chunks(
  query_embedding vector(768),
  match_locale text,
  match_count int,
  min_similarity float
)
returns table (
  id uuid,
  source text,
  source_ref text,
  locale text,
  content text,
  similarity float
)
language sql
stable
as $$
  select
    knowledge_chunks.id,
    knowledge_chunks.source,
    knowledge_chunks.source_ref,
    knowledge_chunks.locale,
    knowledge_chunks.content,
    1 - (knowledge_chunks.embedding <=> query_embedding) as similarity
  from public.knowledge_chunks
  where (knowledge_chunks.locale is null or knowledge_chunks.locale = match_locale)
    and 1 - (knowledge_chunks.embedding <=> query_embedding) >= min_similarity
  order by knowledge_chunks.embedding <=> query_embedding
  limit match_count;
$$;
