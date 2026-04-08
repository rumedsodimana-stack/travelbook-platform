# TravelBook Platform — How to Use

This guide covers all four portals from the perspective of their intended users.

---

## Part 1 — For Travelers (TravelBook Consumer App)

### Getting Started

1. Open the TravelBook app and create an account (email/password or social sign-in via Supabase Auth)
2. Complete your traveler profile — passport nationality matters for the AI planner's visa recommendations
3. You're now on the **Home** screen: a search bar at the top, the AI Travel Planner hero section, and category tiles below (Flights, Hotels, Rides, Tours, Events, Activities)

---

### Using the AI Travel Planner

The AI Travel Planner is the fastest way to go from "I want to go somewhere" to a fully-booked itinerary.

**Step 1 — Open the Planner**

Tap the **"Plan My Trip"** button on the home screen hero section. A full-screen planner modal opens.

**Step 2 — Fill in Trip Details**

| Field | What to enter |
|---|---|
| Destination | City or country (e.g. "Tokyo", "Bali", "Paris") |
| Origin city | Where you're departing from |
| Start date | First day of travel |
| End date | Last day of travel |
| Budget | Total trip budget in your chosen currency |
| Travelers | Number of people |
| Preferences | Optional — e.g. "love street food, hate museums, want beach time" |

**Step 3 — Generate the Plan**

Tap **"Generate Itinerary"**. Gemini AI processes your inputs (typically 2–4 seconds) and returns a complete, day-by-day plan. A loading animation plays while it thinks.

**Step 4 — Explore the Cascading Carousels**

Your plan is laid out as a vertical timeline. Each item in the timeline — visa, flights, hotel, daily activities, restaurants — is a **horizontal swipe card carousel** with 3–4 options.

- Swipe **left/right** on a card to cycle through options (e.g. swap the 5★ hotel for the 3★ budget option)
- Each card shows the provider name, price per person, rating, and key tags
- A **running total** at the bottom updates in real time as you make selections
- Items marked **Required** (visa, outbound/return flight) cannot be removed from the plan

**Step 5 — Book**

Once you've customized the plan to your liking, you have two paths:

- **Book All** — Confirms every selected item in a single Stripe checkout session. Recommended for convenience.
- **Book individually** — Tap the **"Select"** button on any card to book just that item. Useful if you already have some bookings in place.

**Step 6 — Listen to Your Itinerary**

Tap the **🔊 narrate** button to have Gemini read your itinerary aloud using AI-generated speech. Great for listening while packing or commuting.

---

### Searching & Booking Manually

You can also skip the AI planner and browse/book directly by category.

#### Flights

1. Tap **Flights** from the home screen
2. Enter origin (IATA code or city name), destination, date, and passenger count
3. Results are pulled from **Amadeus** and sorted by price. Tap a result to see fare details and cabin class options
4. Tap **Book** to proceed to Stripe checkout
5. Your e-ticket is saved to your **My Bookings** screen

#### Hotels

1. Tap **Hotels**, enter destination and check-in/check-out dates
2. Browse hotel cards — each shows star rating, nightly rate, and key amenities
3. Tap a hotel to see room types, photos, and availability
4. Select a room and tap **Book** to confirm with Stripe

#### Rides

1. Tap **Rides** from the home screen
2. Enter pickup location and destination
3. The app matches you with available TravelBook Rides vehicle owners in real time (Firebase)
4. Accept a match to confirm your ride — the driver's location appears on a live Mapbox map
5. On trip completion, rate your driver and your receipt is saved

#### Tours & Experiences

1. Tap **Tours** to browse packages created by TravelBook Tours operators
2. Alternatively, tap **Activities** for Viator/GetYourGuide day trips and experiences
3. Filter by category, duration, price, and rating
4. Tap a tour for full details: itinerary, inclusions, meeting point on the map
5. Select a date and party size, then book with Stripe

#### Events

1. Tap **Events** to see concerts, sports, and shows at your destination
2. Results are sourced from **Ticketmaster** (large venues) and **Eventbrite** (local events)
3. Tap an event to see seat map, ticket tiers, and dates
4. Complete purchase through Stripe

#### Travel Insurance

Insurance is offered at two points:
- **During AI Plan checkout** — the visa card in your plan includes insurance add-on options (Cover Genius / Battleface)
- **On any individual booking confirmation** — after booking a flight, a prompt appears to add trip cancellation coverage

---

### My Trips & Bookings

The **My Trips** tab shows all your saved AI-generated plans and individual bookings in one place. Tap any trip to re-open the plan view and see your confirmed bookings highlighted.

---

## Part 2 — For Vehicle Owners (TravelBook Rides Portal)

### Signing Up as a Driver

1. Open the TravelBook Rides portal and tap **Get Started**
2. Create an account with Firebase Auth (email or Google sign-in)
3. Complete the **driver onboarding flow**:
   - Upload your driver's license and vehicle registration
   - Add vehicle details: make, model, year, color, license plate
   - Upload vehicle photos (exterior, interior)
   - Set your service area (city or radius)
   - Connect your bank account for earnings payouts

### Listing Your Vehicle

After onboarding:

1. Go to **My Vehicle** tab and tap **Edit Listing**
2. Set your **pricing model**: per km, per hour, or flat-rate airport transfers
3. Configure your **availability calendar** — block out days you're not available
4. Toggle your vehicle **Active** when you're ready to accept requests

### Accepting Ride Requests

1. When a TravelBook consumer in your area requests a ride, your app receives a **real-time notification** (Firebase push)
2. The request shows: pickup location, destination, estimated distance, and your estimated earnings
3. Tap **Accept** within 30 seconds to confirm, or **Decline** to pass
4. On acceptance, your location is shared with the traveler via the live map
5. Navigate to pickup using in-app directions (Mapbox)
6. On arrival, tap **I'm Here** — the traveler receives a notification
7. Start the trip with **Begin Ride**, and end it with **Complete Ride**

### Earnings Dashboard

The **Earnings** tab shows:
- Today's earnings and active rides
- Weekly and monthly summaries
- Per-ride breakdown with pickup/drop-off, distance, and fare
- Payout history (Stripe Connect payouts to your bank)

---

## Part 3 — For Hotels & Dining Venues (TravelBook Hotel OS)

### Onboarding Your Property

1. Navigate to the TravelBook Hotel OS portal and sign in or create an operator account
2. Complete the **property onboarding wizard**:
   - Property name, address, and contact details
   - Property type: Hotel, Boutique Hotel, B&B, Restaurant, Bar
   - Upload cover photos and gallery images
   - Set the property description and highlight amenities
3. Your property is submitted for review and goes live on TravelBook within 24 hours

### Managing Rooms (Hotels)

In the **Rooms** tab:

1. Tap **Add Room Type** to create a new category (e.g. "Deluxe Double", "Ocean Suite")
2. Set per-room details: bed configuration, max occupancy, room size, amenities, and nightly base rate
3. Upload room photos
4. Set **availability** — either manually block dates or connect your existing PMS calendar via iCal sync
5. Rooms appear on the TravelBook consumer app's hotel search once published

**Managing live bookings:** The **Reservations** tab shows all incoming bookings from TravelBook consumers in real time, sorted by check-in date. Each booking shows guest name, room type, dates, and payment status. Tap a booking to view full guest details or mark as checked-in.

### Managing Dining (Restaurants)

In the **Dining** tab:

1. Set your **restaurant profile**: cuisine type, typical price per cover, opening hours
2. Configure **covers** — total number of dining seats available per time slot
3. Set **reservation windows**: how far in advance guests can book, and minimum party sizes
4. Manage incoming dining reservations from the **Reservations** tab, same as hotel bookings

### Availability Calendar

The **Calendar** view gives a monthly grid overview of occupancy. Color coding shows:
- **Green** — available
- **Amber** — partially booked
- **Red** — fully booked / blocked

Tap any date to manually adjust availability or add a block-out period.

---

## Part 4 — For Tour Operators (TravelBook Tours Portal)

### Creating Your Operator Account

1. Open the TravelBook Tours portal and register as an operator
2. Complete your **company profile**: business name, location, contact, and description
3. Upload your operator logo and cover image
4. Your profile is reviewed and approved before packages go live

### Building a Tour Package

1. In the **Packages** tab, tap **+ New Package**
2. Fill in the package builder:

**Basic Info**
- Package name and short tagline
- Destination and departure city
- Package type: Day Trip, Multi-Day, Luxury, Adventure, Cultural

**Itinerary**
- Add days one by one using the day builder
- For each day, add timed activities, meals, and transport segments
- Attach meeting point (pin on Mapbox) and end location

**Inclusions & Exclusions**
- List what's included (transfers, meals, entrance fees, guides)
- List what's excluded (flights, personal expenses, tips)

**Pricing**
- Set base price per person
- Configure pricing tiers: Solo (1 pax), Couple (2 pax), Small Group (3–6), Large Group (7+)
- Add optional add-ons (e.g. private guide +$50/person)

**Capacity**
- Set maximum group size per departure
- Set minimum group size to confirm a departure

3. Tap **Publish** to make the package live on TravelBook consumer app

### Managing Bookings

The **Bookings** tab shows all confirmed reservations for your packages:

- Upcoming departures sorted by date, with traveler names and party sizes
- Revenue earned per booking (after TravelBook platform fee)
- Ability to **confirm**, **waitlist**, or **cancel** bookings
- Messaging thread with each traveler for pre-trip coordination

### Analytics

The **Analytics** tab provides:
- Total bookings and revenue by month
- Most popular packages by booking volume
- Conversion rate (views → bookings) per package
- Average group size and traveler rating per package
