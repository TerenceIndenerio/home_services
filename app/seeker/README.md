# Seeker Dashboard

This folder contains all the screens and components related to the seeker functionality.

## Structure

```
seeker/
├── _layout.tsx              # Bottom tab navigation layout
├── index.tsx                # Dashboard screen (Home tab)
├── search.tsx               # Search screen
├── messages.tsx             # Messages screen
├── profile.tsx              # Profile screen
├── components/              # Seeker-specific components
│   ├── AvailabilityStatus.tsx
│   ├── BalanceCard.tsx
│   ├── BookingHistoryItem.tsx
│   ├── BookingHistoryList.tsx
│   ├── BookingRequestItem.tsx
│   ├── BookingRequestsList.tsx
│   └── Header.tsx
└── README.md
```

## Navigation

The seeker dashboard has its own bottom tab navigation with the following tabs:

1. **Dashboard** (Home) - Shows booking requests, balance, and history
2. **Search** - Service search functionality
3. **Messages** - Chat and messaging
4. **Profile** - User profile and settings

## Access

To navigate to the seeker dashboard from the main app:
- Use the "Go to Seeker Dashboard" button on the main home screen
- Or navigate programmatically using `router.push("/seeker")`

## Components

All seeker-specific components are located in the `components/` folder and are designed to work together to provide a complete seeker experience. 