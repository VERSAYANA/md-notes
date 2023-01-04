
create table notes (
  id uuid not null primary key,
  userId uuid not null references auth.users,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  updated_at timestamp with time zone NOT NULL DEFAULT NOW(),
  isPublic boolean NOT NULL DEFAULT FALSE
);

CREATE TABLE tags (
  id uuid not null PRIMARY KEY,
  name text not null UNIQUE
);

CREATE TABLE note_tags (
  note_id uuid NOT NULL REFERENCES notes(id),
  tag_id uuid NOT NULL REFERENCES tags(id),
  PRIMARY KEY (note_id, tag_id)
);
