-- Supabase Postgres schema
create table profiles (
  id uuid references auth.users primary key,
  full_name text,
  role text check (role in ('household','collector','admin')),
  phone text,
  location_lat double precision,
  location_lng double precision,
  created_at timestamp default now()
);

create table waste_requests (
  id uuid default gen_random_uuid() primary key,
  household_id uuid references profiles(id),
  collector_id uuid references profiles(id),
  status text default 'pending',
  waste_type text,
  location_lat double precision,
  location_lng double precision,
  address text,
  scheduled_at timestamp,
  created_at timestamp default now()
);

create table ratings (
  id uuid default gen_random_uuid() primary key,
  request_id uuid references waste_requests(id),
  household_id uuid references profiles(id),
  collector_id uuid references profiles(id),
  rating int check (rating between 1 and 5),
  comment text,
  created_at timestamp default now()
);
