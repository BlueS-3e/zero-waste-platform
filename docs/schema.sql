-- ZeroWaste Definitive Schema v2
-- This file is kept in sync with the live Supabase database.

-- 1. Profiles: Linked to Supabase Auth
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  role text check (role in ('household','collector','admin')),
  phone text,
  location_lat double precision,
  location_lng double precision,
  created_at timestamptz default now()
);

-- 2. Waste Requests: The core business logic
create table waste_requests (
  id uuid default gen_random_uuid() primary key,
  household_id uuid references profiles(id) on delete cascade,
  collector_id uuid references profiles(id) on delete set null,
  status text default 'pending' check (status in ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
  waste_type text,
  location_lat double precision,
  location_lng double precision,
  address text,
  description text,
  phone text,
  scheduled_at timestamptz,
  created_at timestamptz default now()
);

-- 3. Payments: Mobile Money tracking
create table payments (
  id uuid default gen_random_uuid() primary key,
  request_id uuid references waste_requests(id) on delete set null,
  household_id uuid references profiles(id) on delete cascade,
  operator text check (operator in ('MTN', 'Vodafone', 'Tigo')),
  phone text,
  amount decimal(10,2),
  status text default 'pending',
  created_at timestamptz default now()
);

-- 4. Ratings: Feedback system
create table ratings (
  id uuid default gen_random_uuid() primary key,
  request_id uuid references waste_requests(id) on delete cascade,
  household_id uuid references profiles(id) on delete cascade,
  collector_id uuid references profiles(id) on delete cascade,
  rating int check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

-- 5. Automation: Profile Trigger
-- This function automatically creates a profile row when a user signs up.
-- It extracts 'fullName' and 'role' from the Auth metadata.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'fullName', new.email),
    coalesce(new.raw_user_meta_data ->> 'role', 'household')
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. Row Level Security (RLS) Configuration

alter table profiles enable row level security;
alter table waste_requests enable row level security;
alter table payments enable row level security;
alter table ratings enable row level security;

-- Profiles Policies
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Admins can view all profiles" on profiles for select using ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Waste Requests Policies
create policy "Users can view their own requests" on waste_requests for select using (auth.uid() = household_id or auth.uid() = collector_id);
create policy "Households can insert requests" on waste_requests for insert with check (auth.uid() = household_id);
create policy "Collectors can view pending requests" on waste_requests for select using (status = 'pending');
create policy "Admins/Collectors can update requests" on waste_requests for update using (
  (auth.jwt() -> 'user_metadata' ->> 'role') in ('admin', 'collector')
);

-- Payments/Ratings
create policy "Users can manage their own payments" on payments for all using (auth.uid() = household_id);
create policy "Users can manage their own ratings" on ratings for all using (auth.uid() = household_id);
