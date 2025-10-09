# CivicConnect - Community Issue Reporting Platform

CivicConnect is a modern web platform that bridges the gap between citizens and local authorities by enabling easy reporting, tracking, and resolution of community issues. From potholes to broken streetlights, CivicConnect makes civic engagement accessible to everyone.

![CivicConnect](/public/assets/image.png)

## Features

- **Easy Issue Reporting** - Report problems with photos and GPS location
- **Interactive Map View** - Visualize all community issues on a map
- **Admin Dashboard** - Manage and update issue statuses
- **Community Engagement** - Upvote system to prioritize important issues
- **Mobile Responsive** - Works seamlessly on all devices
- **Real-time Updates** - Live status tracking from report to resolution
- **Image Upload** - Visual documentation of issues
- **Smart Categorization** - Organize issues by type

## Quick Start

### Prerequisites

- Node.js 18+ installed
- A Supabase account

### Installation

1. **Clone and Install**
```bash
npx create-next-app@latest civicconnect
cd civicconnect
npm install @supabase/supabase-js leaflet react-leaflet lucide-react date-fns
```

2. **Setup Supabase**
- Go to [supabase.com](https://supabase.com) and create a new project
- Wait for the database to initialize (2-3 minutes)

3. **Create Database Tables**

Run this SQL in your Supabase SQL Editor:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create issues table
create table issues (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  category text not null,
  status text default 'reported' check (status in ('reported', 'in-progress', 'resolved')),
  location_name text,
  latitude decimal,
  longitude decimal,
  image_url text,
  upvotes integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  user_id uuid references auth.users
);

-- Create upvotes table
create table issue_upvotes (
  issue_id uuid references issues on delete cascade,
  user_id uuid references auth.users on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (issue_id, user_id)
);

-- Enable Row Level Security
alter table issues enable row level security;
alter table issue_upvotes enable row level security;

-- Policies for issues
create policy "Anyone can view issues"
  on issues for select
  using (true);

create policy "Authenticated users can create issues"
  on issues for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own issues"
  on issues for update
  using (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update upvotes on issues"
ON public.issues
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policies for upvotes
create policy "Anyone can view upvotes"
  on issue_upvotes for select
  using (true);

create policy "Authenticated users can upvote"
  on issue_upvotes for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own upvotes"
  on issue_upvotes for delete
  using (auth.uid() = user_id);

CREATE POLICY "Users can delete their own upvotes"
ON public.issue_upvotes
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

4. **Setup Storage**

Go to Storage → Create new bucket:
- Name: `issues`
- Public bucket: ✅ YES

Then run this SQL for storage policies:

```sql
-- Storage policies
create policy "Anyone can upload images"
  on storage.objects for insert
  with check (bucket_id = 'issues');

create policy "Anyone can view images"
  on storage.objects for select
  using (bucket_id = 'issues');
```

5. **Configure Environment Variables**

Create `.env.local` in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Get these values from: Supabase Dashboard → Project Settings → API

6. **Run the Development Server**

```bash
npm run dev
```

Visit `http://localhost:3000` to see your app!

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Maps**: Leaflet / React-Leaflet
- **Icons**: Lucide React
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage

## Key Features Explained

### 1. Issue Reporting
Users can submit issues with:
- Title and detailed description
- Category selection (Infrastructure, Public Safety, etc.)
- Photo upload
- Automatic GPS location capture
- Manual location name entry

### 2. Interactive Map
- Real-time visualization of all issues
- Color-coded markers by status (Orange = Reported, Blue = In Progress, Green = Resolved)
- Filter by status and category
- Click markers for detailed popup information
- Side panel with filterable issue list

### 3. Community Engagement
- Upvote system to prioritize issues
- View upvote counts on each issue
- Community-driven prioritization

### 4. Admin Dashboard
- View all issues in a sortable table
- Update issue status (Reported → In Progress → Resolved)
- Filter by status
- See statistics and metrics
- Sort by votes, date, location

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy! 

Your app will be live at `your-app.vercel.app`

## Future Enhancements

- Email notifications for status updates
- AI-powered issue categorization
- Native mobile apps (React Native)
- Push notifications
- Advanced analytics dashboard
- Multi-language support
- User profiles and reputation system
- Comments and discussions on issues
- Historical trend analysis
- Gamification with badges and achievements

## License

MIT License - Feel free to use this for your community!

## Acknowledgments

- Built for Hacktivism II
- Powered by Supabase, Next.js, and Tailwind CSS
- Maps by OpenStreetMap & Leaflet

## Contact

For questions about this project, reach out via `chrisebuberoland@gmail.com`