create extension if not exists "uuid-ossp";

create table if not exists profiles (
  id uuid primary key default uuid_generate_v4(),
  clerk_user_id text not null unique,
  email text,
  has_access boolean not null default false,
  stripe_customer_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles
  add column if not exists full_name text,
  add column if not exists onboarding_completed boolean not null default false,
  add column if not exists onboarding_completed_at timestamptz;

alter table profiles
  add column if not exists role text not null default 'athlete';

alter table profiles
  add column if not exists access_status text not null default 'none',
  add column if not exists access_source text,
  add column if not exists access_expires_at timestamptz;

update profiles
set access_status = 'none'
where access_status is null
  or access_status not in (
    'none',
    'active',
    'trialing',
    'past_due',
    'unpaid',
    'canceled',
    'expired',
    'comped',
    'admin'
  );

update profiles
set access_status = 'active'
where has_access
  and access_status = 'none';

alter table profiles
  alter column access_status set default 'none',
  alter column access_status set not null;

alter table profiles
  drop constraint if exists profiles_access_status_check;

alter table profiles
  add constraint profiles_access_status_check
  check (
    access_status in (
      'none',
      'active',
      'trialing',
      'past_due',
      'unpaid',
      'canceled',
      'expired',
      'comped',
      'admin'
    )
  );

update profiles
set role = 'athlete'
where role is null
  or role not in ('athlete', 'coach', 'admin');

alter table profiles
  alter column role set default 'athlete',
  alter column role set not null;

do $$
begin
  alter table profiles
    add constraint profiles_role_check
    check (role in ('athlete', 'coach', 'admin'));
exception
  when duplicate_object then null;
end $$;

create index if not exists profiles_role_idx
  on profiles (role);

create index if not exists profiles_access_status_idx
  on profiles (access_status);

create table if not exists leads (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  source text not null default 'site',
  created_at timestamptz not null default now()
);

create table if not exists coaching_applications (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  primary_goal text not null,
  current_state text not null,
  next_phase_goal text not null,
  time_frame text not null check (time_frame in ('30 days', '60 days', '90 days', '6+ months')),
  commitment_level text not null check (
    commitment_level in ('Just exploring', 'Somewhat serious', 'Ready to commit', 'Fully locked in')
  ),
  source text not null default 'apply_page',
  created_at timestamptz not null default now()
);

create index if not exists coaching_applications_created_at_idx
  on coaching_applications (created_at desc);

create index if not exists coaching_applications_email_idx
  on coaching_applications (email);

create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  image_url text not null,
  result text not null,
  rating int not null check (rating between 1 and 5),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists lesson_progress (
  id uuid primary key default uuid_generate_v4(),
  clerk_user_id text not null,
  module_id text not null,
  completed boolean not null default false,
  completed_at timestamptz,
  unique (clerk_user_id, module_id)
);

create table if not exists client_assignments (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  assigned_for date not null,
  title text not null,
  description text not null,
  focus text not null,
  estimated_minutes int not null default 45 check (estimated_minutes > 0),
  status text not null default 'assigned' check (status in ('assigned', 'completed', 'skipped')),
  completed_at timestamptz,
  client_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, assigned_for)
);

create index if not exists client_assignments_profile_date_idx
  on client_assignments (profile_id, assigned_for desc);

alter table client_assignments enable row level security;

create table if not exists daily_checkins (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  checkin_date date not null,
  sleep_quality int not null check (sleep_quality between 1 and 5),
  energy int not null check (energy between 1 and 5),
  soreness int not null check (soreness between 1 and 5),
  stress int not null check (stress between 1 and 5),
  pain_flag boolean not null default false,
  body_notes text,
  readiness_score int not null check (readiness_score between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, checkin_date)
);

create index if not exists daily_checkins_profile_date_idx
  on daily_checkins (profile_id, checkin_date desc);

alter table daily_checkins enable row level security;

create table if not exists athlete_onboarding (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade unique,
  full_name text not null,
  age int not null check (age between 13 and 100),
  unit_system text not null check (unit_system in ('lbs', 'kg')),
  height_inches numeric(5, 2),
  height_cm numeric(5, 2),
  current_weight_lbs numeric(6, 2),
  current_weight_kg numeric(6, 2),
  bmi numeric(5, 2) not null check (bmi between 10 and 80),
  primary_goals text not null,
  training_level text not null check (
    training_level in ('beginner', 'intermediate', 'advanced', 'competitive')
  ),
  injuries_current_pain text,
  sport text,
  weekly_availability int not null check (weekly_availability between 1 and 14),
  session_duration int not null check (session_duration between 15 and 180),
  equipment_access text not null,
  cleared_for_exercise boolean not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (
      unit_system = 'lbs'
      and height_inches is not null
      and height_inches between 36 and 96
      and current_weight_lbs is not null
      and current_weight_lbs between 50 and 700
      and height_cm is null
      and current_weight_kg is null
    )
    or
    (
      unit_system = 'kg'
      and height_cm is not null
      and height_cm between 90 and 245
      and current_weight_kg is not null
      and current_weight_kg between 25 and 320
      and height_inches is null
      and current_weight_lbs is null
    )
  )
);

alter table athlete_onboarding enable row level security;
