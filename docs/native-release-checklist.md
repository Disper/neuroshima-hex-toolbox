# Native Release Checklist

Use this checklist when validating the native Android and iOS apps against the current web implementation.

## Behavioral Parity

- Verify `mobile-shared/generated/parity-fixtures.json` against the native implementations before every release candidate.
- Confirm standard 6-character deck codes produce the same first draws as the web app.
- Confirm all Iron Gang suffix modes mutate the deck exactly as specified.
- Confirm Merchants Guild reconnaissance insertion positions are deterministic for the same code.
- Confirm Wiremen remaining technology bonuses match the web app after moving tiles between Remaining and Drawn.
- Confirm army order and Polish display names match the exported data.

## Manual Smoke Test

- Browse armies in English and Polish.
- Search by English and Polish army names.
- Open an army detail screen and verify HQ ability and tile group ordering.
- Generate a new standard deck and a new Iron Gang deck.
- Enter an invalid code and confirm validation messaging.
- Draw through a full standard deck and reset it.
- Draw through a Merchants Guild deck and trigger both reconnaissance insertions.
- Open counter mode, select two distinct armies, move tiles between columns, and reset both.
- Open tile flip mode and verify the result updates on every tap.

## Store Preparation

- Replace placeholder app icon assets in both native projects.
- Review privacy disclosures before enabling analytics or crash reporting.
- Review image redistribution rights for App Store / Play Store shipment.
- Prepare screenshots for phone and tablet form factors.
- Define semantic versioning and map app build numbers to store release builds.

## Beta Distribution

- iOS: archive and upload to TestFlight once the local Xcode installation is healthy.
- Android: build a debug/release APK or AAB from Android Studio and upload to Play Internal Testing.
- Capture parity issues discovered in beta against the fixture file, not by hand-editing native data.
