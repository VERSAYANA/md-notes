
alter table notes
  enable row level security;

CREATE POLICY "Public notes can be viewed by everyone, private notes can only be view by the owner" ON notes FOR SELECT USING (isPublic = true OR auth.uid() = userId) WITH CHECK (isPublic = true OR auth.uid() = userId);
CREATE POLICY "Notes can only be edited by the owner" ON notes FOR UPDATE, DELETE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
