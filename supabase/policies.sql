alter table profiles enable row level security;
alter table meals enable row level security;
alter table exercises enable row level security;
alter table videos enable row level security;
alter table recipes enable row level security;

create policy "profiles self" on profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "meals self" on meals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "exercises self" on exercises for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "videos self" on videos for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "recipes self" on recipes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);