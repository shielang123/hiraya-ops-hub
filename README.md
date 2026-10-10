# Hiraya Ops Hub

Staff app for Hiraya Farm Resort. It uses the same Firebase project as the Resort Booking system
(`hotel-63c74`), so approved bookings show up here live.

**Phase 1 includes:** staff login, roles, live arrivals and departures, a small dashboard, and a
staff management page. It only reads bookings and rooms. Check-in/out buttons, charges and bills
come in Phase 2.

## 1. Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. The Firebase settings are already in `.env.local`.

## 2. One-time Firebase setup

1. **Authentication:** Firebase console > Authentication > Sign-in method > enable **Email/Password**
   (skip if the booking admin already uses it).
2. **Firestore:** make sure Firestore Database is created.
3. **Rules:** open `firestore.rules.hub-additions.txt` and paste its functions and `match` blocks
   inside your existing rules. Do not replace your current rules. Publish.
4. **Create the first admin** (done by hand, once):
   - Authentication > Users > Add user: enter an email and password. Copy the **User UID**.
   - Firestore > Start collection `staff` > Document ID = that **User UID**, with fields:

     | Field | Type | Value |
     | --- | --- | --- |
     | name | string | your name |
     | email | string | the same email |
     | role | string | `admin` |
     | active | boolean | `true` |

5. Sign in at `/login`. From the **Staff** page you can add front desk, bar and housekeeping
   accounts. The role names are `admin`, `frontdesk`, `bar`, `housekeeping`.

## 3. Match the booking system's field names

The Hub guesses the booking field names. If cards show "Guest" or "-", open
`lib/bookings.js` > `normalizeBooking` and add your real field names to the lists. If the
approved status in your booking system is not one of `approved`, `confirmed`, `paid`, edit
`ACTIVE_STATUSES` in `lib/config.js`. Collection names are in the same file.

## 4. Deploy (Vercel)

1. Push this folder to a new GitHub repo named `hiraya-ops-hub`.
2. Import it in Vercel and add the six `NEXT_PUBLIC_FIREBASE_*` variables from `.env.local`.
3. In Firebase > Authentication > Settings > Authorized domains, add your Vercel domain.

## Project layout

```
app/            pages: / (dashboard), /arrivals, /staff, /login
components/     AuthProvider, ProtectedPage, Shell, BookingCard
hooks/          useBookings (live bookings and rooms)
lib/            firebase, config, roles, dates, bookings
```
