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

create table if not exists review_submissions (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  display_name text not null,
  email text not null,
  athlete_type text not null,
  training_with_htk text not null,
  challenge_before text not null,
  result_improvement text not null,
  testimonial_quote text not null,
  rating int check (rating between 1 and 5),
  public_permission boolean not null default false,
  wants_video_testimonial boolean not null default false,
  media_url text,
  media_label text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  featured boolean not null default false,
  result_tags text[] not null default '{}',
  source text not null default 'submit_review',
  created_at timestamptz not null default now()
);

create index if not exists review_submissions_created_at_idx
  on review_submissions (created_at desc);

create index if not exists review_submissions_status_idx
  on review_submissions (status);

create index if not exists review_submissions_featured_idx
  on review_submissions (featured desc, created_at desc);

insert into storage.buckets (id, name, public)
values ('review-assets', 'review-assets', true)
on conflict (id) do nothing;

create table if not exists lesson_progress (
  id uuid primary key default uuid_generate_v4(),
  clerk_user_id text not null,
  module_id text not null,
  completed boolean not null default false,
  completed_at timestamptz,
  unique (clerk_user_id, module_id)
);
