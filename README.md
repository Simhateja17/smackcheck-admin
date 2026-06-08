# smackcheck-admin

Admin console for SmackCheck.

## Local setup

Create `admin_panel/.env.local` from `.env.local.example`.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

The admin panel signs in through Supabase Auth, then calls the shared Express
backend with the Supabase access token. The backend only allows users with
`profiles.is_admin = true` to access `/api/admin/*`.

## Run

```bash
npm run dev
```

If the Next dev server and Express backend both try to use port `3000`, run one
of them on a different port and update `NEXT_PUBLIC_API_BASE_URL`.
