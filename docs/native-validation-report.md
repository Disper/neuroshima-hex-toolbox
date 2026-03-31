# Native Validation Report

## Completed In This Environment

- Generated shared mobile content, localization bundles, copied images, and parity fixtures with `scripts/generate-native-shared.mjs`
- Emitted native-facing JSON payloads into:
  - `mobile-shared/generated/`
  - `android/app/src/main/assets/generated/`
  - `ios/NeuroshimaHexNative/Resources/Generated/`
- Emitted Android and Apple localization resources
- Added native Android and iOS project scaffolding
- Added native feature flows for:
  - army browser
  - army detail
  - deck setup
  - draw mode
  - counter mode
  - tile flip mode
  - about/version surface
- Checked edited source files with IDE lints; no diagnostics were reported

## Blocked By Local Tooling

- `xcodebuild` could not complete because the local Xcode installation failed to load `IDESimulatorFoundation`
- No working `gradle` or Gradle wrapper was available in this shell, so the Android project could not be compiled here

## Follow-Up Verification Once Tooling Is Healthy

1. Run the shared generator again after any content changes:
   - `/opt/homebrew/bin/node scripts/generate-native-shared.mjs`
2. Open `ios/NeuroshimaHexNative.xcodeproj` in Xcode and build the `NeuroshimaHexNative` scheme
3. Open `android/` in Android Studio and sync/build the `app` module
4. Compare native behavior against `mobile-shared/generated/parity-fixtures.json`
5. Execute the manual smoke test in `docs/native-release-checklist.md`
