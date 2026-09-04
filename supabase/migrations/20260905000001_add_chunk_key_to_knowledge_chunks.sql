-- A stable, human-derivable key ("<source>:<source_ref>:<locale>") so reindexing
-- can upsert in place instead of deleting everything and reinserting (which
-- would leave a window with an empty/partial table mid-reindex).
alter table public.knowledge_chunks
  add column chunk_key text not null unique;
