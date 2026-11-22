# Online quizzes: setup and operation

Online quizzes are **switched off** until the three Supabase keys in step 6 exist in Vercel. Without them the
site behaves exactly as before: `/login`, `/dashboard` and `/q/...` return 404, the builder has no "Share online"
step, and the privacy page says nothing is stored.

Everything below is one-time setup. Budget about an hour, most of it in the Google and mail-provider consoles.
Dashboard menu names move around; the section names here were correct in November 2026.

## What you are setting up

| Piece | What it does | Where |
| --- | --- | --- |
| Supabase project | Stores teachers, quizzes and results; handles teacher sign-in | supabase.com |
| Google OAuth client | "Continue with Google" | console.cloud.google.com |
| Mail service (SMTP) | Delivers the emailed sign-in link | Resend, Brevo, Postmark, SES or similar |
| Three environment variables | Switch the feature on | Vercel |

Students never sign in. They open a link, type a name and take the quiz.

## 1. Create the Supabase project

1. New project at supabase.com.
2. **Region.** Pick the region closest to most of your teachers. It decides where student names and scores are
   stored, and it cannot be changed later without moving the data. US school districts commonly ask for US storage
   in their data agreements; EU schools will prefer an EU region.
3. **Plan.** The Free plan is enough to start, with one catch: a Free project is paused after about a week of low
   activity. While it is paused every quiz link and the dashboard fail until you press Resume in the Supabase
   dashboard. Term-time use keeps it awake; a school holiday will not. The Pro plan never pauses and adds daily
   backups. Decide before you tell teachers about the feature.
4. If the project asks whether to expose new tables automatically, leave that **off**. The SQL in the next step
   grants exactly what the site needs.

## 2. Create the tables

1. Supabase dashboard, SQL Editor, new query.
2. Paste the whole of `supabase/migrations/20261122000000_online_quizzes.sql` and run it.
3. Check in the Table Editor: `plans`, `teachers`, `quizzes` and `attempts` exist, and each shows row level
   security enabled. `plans` has one row, `free`, with limits 30 and 200.

The tables have row level security on and no policies, and the database functions can only be run with the secret
key. Nothing in the browser can read or write them directly. If you later use the Supabase CLI, the same file is
already in the place `supabase db push` expects.

## 3. Tell Supabase where the site lives

Authentication, URL Configuration:

- **Site URL:** `https://arpelio.com`
- **Redirect URLs** (add each):
  - `https://arpelio.com/auth/callback`
  - `https://*-ace61391s-projects.vercel.app/auth/callback` (Vercel preview deployments)
  - `http://localhost:3000/auth/callback` (local development against the real project)
  - `https://www.arpelio.com/auth/callback`, only if `www.arpelio.com` serves the site instead of redirecting

If a sign-in ends on the home page with `?code=...` in the address bar, the address the teacher signed in from is
missing from this list.

## 4. Google sign-in

In Google Cloud Console (a free project is fine):

1. Google Auth Platform, **Branding**: app name "Arpelio", your support email, authorized domain `arpelio.com`.
2. **Audience**: External. Publish the app (move it out of "Testing"). In Testing mode only the test users you
   list can sign in.
3. **Clients**, create an OAuth client of type **Web application**:
   - Authorized JavaScript origins: `https://arpelio.com`
   - Authorized redirect URIs: the callback URL shown on the Google provider page in Supabase. It looks like
     `https://<project-ref>.supabase.co/auth/v1/callback`.
4. Copy the Client ID and Client Secret.

In Supabase, Authentication, Sign In / Providers, Google: enable it, paste the ID and secret, save.

Know this before launch: until Google has verified your branding, its sign-in screen names the Supabase project
address (`<project-ref>.supabase.co`) instead of "Arpelio". It works, but it looks unfamiliar to a teacher.
Submitting the branding for verification in Google Cloud fixes it and can take a few business days. A Supabase
custom domain (a paid add-on) is the other fix.

## 5. Email-link sign-in

Supabase's built-in mail sender is for testing only. It delivers only to email addresses that belong to your
Supabase organization and allows a couple of messages an hour. With it, the email link works for you and fails
for every teacher. You have two choices:

**A. Launch with Google only.** Add `NEXT_PUBLIC_ARPELIO_EMAIL_SIGNIN=off` in Vercel (step 6). The sign-in page
then shows only the Google button. Remove the variable when B is done.

**B. Connect a mail service.**

1. Create an account with a transactional mail provider and verify `arpelio.com` with it (it gives you DNS records
   to add in Cloudflare).
2. Supabase, Authentication, SMTP settings: enable custom SMTP. Sender `no-reply@arpelio.com`, name "Arpelio",
   then the host, port, user and password from the provider.
3. Authentication, Rate Limits: custom SMTP starts at 30 emails an hour. Raise it if you expect a rush.
4. Authentication, email templates. Change the link in **both** "Magic Link" and "Confirm signup" (a teacher
   signing in for the first time can receive the second one) to:

   ```html
   <a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email">Sign in to Arpelio</a>
   ```

   The default link only works in the browser the teacher asked from. This form works when the email is opened
   on a phone or another computer, which is what teachers do.

## 6. Add the keys to Vercel

Supabase, Project Settings, API Keys:

| Vercel variable | Value | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL, `https://<project-ref>.supabase.co` | |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key, `sb_publishable_...` | Safe in the browser |
| `SUPABASE_SECRET_KEY` | Secret key, `sb_secret_...` | Server only. Mark it Sensitive. Never give it a `NEXT_PUBLIC_` name |

Optional:

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_ARPELIO_DATA_REGION` | Shown on the privacy page, e.g. `the United States` or `the European Union` |
| `NEXT_PUBLIC_ARPELIO_EMAIL_SIGNIN` | `off` to hide the email-link form (step 5A) |

Older projects call the two keys `anon` and `service_role`. The site also reads `NEXT_PUBLIC_SUPABASE_ANON_KEY`
and `SUPABASE_SERVICE_ROLE_KEY`, but Supabase is retiring those keys, so use the new ones.

Recommended order:

1. Add the variables to the **Preview** environment only and redeploy a preview. Run the checks in step 7 there.
2. Add them to **Production** and redeploy. The `NEXT_PUBLIC_` values are fixed at build time, so the feature
   appears only after a new deployment.

Preview and Production share one database when they share keys. A quiz made on a preview is real data.

## 7. Check it works

On the deployment you just made:

- [ ] `/login` loads. "Continue with Google" signs you in and lands on the dashboard.
- [ ] Email link: request one for an address that is **not** on your Supabase team. It arrives, and opening it on
      a different device signs you in.
- [ ] Builder: pick an instrument and notes, step 5 "Share online", create a quiz. You get a link.
- [ ] Open the link in a private window. Enter a name, answer, use Previous and Next, submit. A score appears.
- [ ] Dashboard, View results: the student, the score and "Most missed" are right. Download CSV works.
- [ ] Close the quiz: the link now says the quiz is closed. Reopen it.
- [ ] Delete the test result, then the quiz. The link returns "not found".
- [ ] Sign out. `/dashboard` sends you to sign in.
- [ ] `/privacy` now describes teacher accounts and student results.

## Running it on your machine

```bash
npm run dev:quiz      # the whole feature against an in-memory database, with a fake sign-in form
npm run test:quiz     # grading rules and database rules (92 checks)
```

`dev:quiz` needs no Supabase project. Data disappears when the server stops. The stand-in runs the same SQL file as
production and cannot switch on in a Vercel deployment.

## Operating it

**Change the free limits** (quizzes per teacher, submissions per quiz):

```sql
update public.plans set max_quizzes = 50, max_attempts_per_quiz = 300 where id = 'free';
```

**Give one teacher more room** (this is also how a paid plan would work later):

```sql
insert into public.plans (id, max_quizzes, max_attempts_per_quiz) values ('plus', 500, 1000) on conflict (id) do nothing;
update public.teachers set plan = 'plus' where email = 'teacher@school.org';
```

**Delete a teacher account on request:** Supabase, Authentication, Users, delete the user. Their quizzes and all
results are removed with them.

**Delete one student's results on request:** the teacher can do it from the dashboard. You can do it in SQL:

```sql
delete from public.attempts where id = '<attempt id>';
```

**Switch the feature off:** remove `NEXT_PUBLIC_SUPABASE_URL` from Vercel and redeploy. The pages return 404 and
the privacy page reverts. The data stays in Supabase until you delete it there.

**Keep the privacy page true.** It reads `NEXT_PUBLIC_ARPELIO_DATA_REGION`. If you move to a plan with backups,
add the backup retention period to the "Where it is kept" section in `src/app/privacy/page.js`.

## What this version does not do

- No rate limiting on quiz submissions beyond the per-quiz cap. Someone with a link could fill a quiz with junk
  entries up to the cap; the teacher can delete them and close the quiz.
- No editing a quiz after it is shared. Make a new one.
- No time limits, and retakes are allowed. Every submission is kept and shown.
- No self-service "delete my account" button. Requests come to info@arpelio.com.
- Students type their own name. Nothing stops a student from typing someone else's.
