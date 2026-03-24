# Project Charter: Sunrise Alarm DIY "Solaris"

## 1. General Project Information

- Project Title: Sunrise Alarm DIY "Solaris"
- Issue Date: March 23, 2026

## 2. Project Objective

Develop and build a high-performance DIY sunrise alarm, together with a companion application, that combines the color gradient and brightness characteristics of the Philips SmartSleep and Lumie Bodyclock Shine 300. The goal is to deliver a complete solution composed of the physical device and a responsive app that supports configuration, alarm scheduling, sunrise routine management, audio selection, and device monitoring, using components such as an ESP32, SK6812 RGBW LED strip, and WLED-based firmware.

## 3. Project Justification

This project is justified by the search for a sunrise alarm solution that meets specific requirements for strong lighting, superior color gradients, and better control software, which are often not fully satisfied by commercial products available in the Brazilian market or are only available at a high cost. The DIY approach provides:

- Customization: Full control over light intensity, colors, transitions, alarms, and automation flows.
- Power: Use of high-density LED strips to achieve significantly higher brightness than most commercial devices.
- Cost-Effectiveness: Access to top-tier performance at a hardware cost considerably lower than imported premium models.
- Learning Opportunity: A chance to gain knowledge in electronics, programming, UX, and automation.
- Software Ownership: Freedom to design the companion app around the exact wake-up experience desired by the user.

## 4. Project Scope

### 4.1 Main Deliverables

- Assembled Physical Device: A functional "Solaris" sunrise alarm with ESP32, SK6812 RGBW LED strip integrated into a physical structure such as a table lamp.
- Configured Firmware: ESP32 running WLED firmware, including configured Usermods for display and the required integrations for the sunrise alarm workflow.
- Companion App: A responsive application for device onboarding, alarm configuration, sunrise routine editing, status monitoring, and integrations through WLED-compatible APIs.
- Complete Documentation: Electronic assembly guide, physical design suggestions, software configuration guide, deployment instructions, and power consumption analysis.

### 4.2 Out of Scope

- Mass production or commercialization of the device.
- Rewriting the WLED core firmware from scratch.
- Integration with complex home automation systems other than Home Assistant or similar platforms through API or MQTT.
- Creation of detailed 3D printable models, with only design suggestions included.
- Native mobile applications in the first delivery phase.

## 5. Key Requirements

- Lighting: Strong enough to simulate sunrise effectively in a bedroom environment, with the ability to reach high brightness.
- Color Gradient and Brightness: Smooth transitions across colors such as red, orange, yellow, and warm white, along with gradual intensity changes that replicate a natural sunrise.
- Alarm Management: Ability to create, edit, duplicate, enable, disable, and delete alarms with configurable recurrence rules and sunrise duration.
- Audio: Ability to configure wake-up sounds and volume behavior to complement the visual alarm.
- Display: Show the time and alarm status through an OLED display.
- Control App: Responsive web interface for onboarding the device, configuring routines, previewing sunrise behavior, and monitoring current device state.
- Connectivity: Reliable Wi-Fi communication between the app and the device, with graceful handling of offline or unreachable states.
- Automation: Optional integration with Home Assistant, MQTT, or similar platforms through documented APIs.
- Aesthetics: Table-lamp design with homogeneous light diffusion that eliminates the visible "pixel effect."

## 6. Main Stakeholders

- User: Final beneficiary of the sunrise alarm, responsible for requirement validation and feedback.
- Manus AI: Project manager and provider of technical expertise and documentation.

## 7. Estimated Budget

The estimated cost for the hardware components is approximately R$ 342.50, based on prices in Brazil. The companion app budget is expected to be low because the initial release can be developed using a lightweight web stack and free-tier services where needed.

## 8. Delivery Plan: App Sprints and Milestones

### 8.1 Completed Foundation Phases

The project already has a conceptual baseline in place:

1. Phase 1: Definition and Components - Completed (technical specifications and BOM).
2. Phase 2: Design and Assembly - Completed (electronic schematic and physical design suggestions).
3. Phase 3: Firmware and Automation Research - Completed (WLED configuration guide and integration direction).
4. Phase 4: Power Consumption Analysis - Completed (energy consumption report).

### 8.2 Planning Assumptions

- Sprint length: 1 to 2 weeks.
- Delivery model: each sprint ends with a demo-ready increment of the companion app.
- Milestone discipline: each completed sprint should end with a dedicated GitHub checkpoint commit such as `phase-0-foundation`, `phase-1-device-onboarding`, and `phase-2-alarm-engine`.
- Quality gate for every sprint: lint passes, automated tests pass, and the main acceptance flow for the sprint is manually verified.
- Firmware strategy: the app should integrate with WLED-compatible APIs and configuration mechanisms instead of introducing unnecessary firmware rewrites.

### Sprint 0 - Foundation and Technical Bootstrap

**Milestone:** a runnable software foundation with project structure, shared conventions, test tooling, and a mockable device communication layer.

**Detailed actions**

- Create the application structure for frontend, backend or API adapter layer if needed, shared types, and documentation folders.
- Define the app architecture, including how the UI will communicate with the device, where alarm data will be stored, and what parts rely on WLED endpoints.
- Implement the first responsive app shell with routing, layout primitives, design tokens, and placeholder views for dashboard, alarms, and settings.
- Add environment configuration, code quality tooling, test runners, and baseline CI workflow.
- Create a mock device API contract so UI and domain logic can be developed before full hardware integration.
- Document the local development flow, environment variables, and test strategy.

**Measurable code goals**

- 1 runnable frontend application committed.
- 1 shared device client abstraction with mocked responses.
- 1 CI workflow running install, lint, and tests.
- 8 or more passing baseline unit tests.
- 0 critical lint errors on the main branch.

**Exit criteria**

- A developer can clone the project, install dependencies, start the app locally, and navigate the initial shell.
- Core modules for UI, domain logic, and device communication are separated clearly enough to support future sprints without structural rework.

### Sprint 1 - Device Onboarding and Connectivity

**Milestone:** the app can discover or register a device, validate connectivity, and display reliable online or offline status.

**Detailed actions**

- Build the onboarding flow to add a device manually by IP or hostname and validate connectivity through the selected WLED endpoints.
- Implement connection health checks, retry behavior, timeout handling, and user-facing connectivity feedback.
- Add local persistence for registered devices, current active device, and basic metadata.
- Create a device status service that polls relevant state such as power, brightness, Wi-Fi status, and firmware version.
- Implement clear empty, loading, success, and failure states for onboarding and connection recovery.
- Add automated tests for validation, connection state transitions, and device registration rules.

**Measurable code goals**

- 3 completed onboarding screens or views.
- 1 reusable device registry service.
- 2 connectivity utilities covering polling and retry behavior.
- 12 or more passing automated tests for device onboarding and status handling.
- 100% of device connection flows handled through the shared device client abstraction.

**Exit criteria**

- A user can register at least one device and see whether it is reachable from the app.
- The app fails gracefully when the device is offline, misconfigured, or slow to respond.

### Sprint 2 - Alarm Engine and Sunrise Routine Builder

**Milestone:** users can manage alarms and define sunrise routines with predictable scheduling logic.

**Detailed actions**

- Implement CRUD flows for alarms, including recurrence, wake-up time, sunrise duration, enabled state, and optional audio selection.
- Create a sunrise routine editor that supports color progression, brightness progression, and preset references compatible with WLED behavior.
- Build validation rules for overlapping alarms, invalid durations, duplicate routine names, and unsupported values.
- Add preview logic so the user can inspect the generated routine timeline before saving it.
- Persist alarms and routines through a consistent storage layer, with mock and real adapters if needed.
- Add domain tests for schedule resolution, recurrence calculation, and sunrise timeline generation.

**Measurable code goals**

- 4 full alarm CRUD flows implemented: create, read, update, delete.
- 1 dedicated scheduling domain service.
- 1 sunrise routine editor screen with preview support.
- 15 or more passing tests covering scheduler and validation logic.
- 100% of alarm calculations routed through shared domain modules rather than page-level code.

**Exit criteria**

- A user can create a weekly alarm with a sunrise routine and trust the app preview to match the saved configuration.
- Invalid schedules are blocked with understandable validation messages.

### Sprint 3 - Dashboard, Live Controls, and Device State Sync

**Milestone:** the app provides a useful control center for current device state, next alarm, and live manual control.

**Detailed actions**

- Build the main dashboard with device summary, next scheduled alarm, current brightness, current preset, and current connectivity status.
- Add live controls for turning the light on or off, adjusting brightness, selecting presets, and triggering a sunrise test manually.
- Implement state synchronization rules so changes made in the app remain consistent with the latest device state.
- Add optimistic UI where safe, with rollback behavior for failed commands.
- Create reusable formatters and mapping helpers for device payloads, times, and routine summaries.
- Write tests for command dispatching, dashboard data mapping, and sync conflict handling.

**Measurable code goals**

- 1 dashboard page with at least 5 production-ready widgets.
- 3 reusable service or hook modules for device state, commands, and sync.
- 10 or more command pathways covered by automated tests.
- 15 or more passing tests dedicated to dashboard behavior and live controls.
- 0 known cases where the dashboard displays stale device status after a successful refresh cycle.

**Exit criteria**

- A user can open the dashboard, understand the current device condition, and trigger manual controls with confidence.
- Device state remains understandable even when commands fail or the device temporarily disconnects.

### Sprint 4 - Audio, Display, and Advanced Settings

**Milestone:** the app can configure the non-light parts of the experience, including sound and display-related settings.

**Detailed actions**

- Build settings flows for audio selection, wake-up volume, fade behavior, and silence fallback rules.
- Add configuration screens for display preferences such as clock visibility, alarm status indicators, and brightness behavior if supported by the current hardware stack.
- Implement app settings for timezone, default sunrise duration, snooze behavior, and device naming.
- Organize settings code into cohesive modules so device capabilities can be enabled or hidden per hardware configuration.
- Add validation and help text for settings with non-obvious hardware dependencies.
- Expand automated coverage for settings persistence, capability gating, and invalid combinations.

**Measurable code goals**

- 2 settings screens completed: device settings and alarm experience settings.
- 3 settings service modules with clear ownership.
- 12 or more passing automated tests focused on settings validation and persistence.
- 100% of advanced settings behind explicit capability checks where hardware support may vary.
- 0 silent failures when a user saves an unsupported setting combination.

**Exit criteria**

- A user can configure light, sound, and display behavior from the app without guessing which options apply to the current device.
- Unsupported combinations are blocked or explained clearly.

### Sprint 5 - Integrations, Import and Export, and Automation Readiness

**Milestone:** the app is ready to work with external automation ecosystems and reusable configuration packs.

**Detailed actions**

- Add import and export of alarm profiles, routine presets, and app settings in a documented JSON format.
- Implement integration endpoints or adapters for Home Assistant, MQTT, or webhook-based automation flows where appropriate.
- Create an integrations screen with setup instructions, connection status, and example payloads.
- Add audit-friendly logs for key automation actions such as alarm trigger, missed trigger, manual override, and device reconnection.
- Validate that exported configurations can be re-imported cleanly across clean environments.
- Write tests covering payload validation, import safety, and integration adapter behavior.

**Measurable code goals**

- 1 import and export pipeline implemented end to end.
- 1 integrations screen completed.
- 2 reusable integration adapters or modules.
- 14 or more passing tests covering import, export, and automation payload handling.
- 100% of exported configuration files validated before import.

**Exit criteria**

- A user can back up their setup, restore it, and connect the app to at least one supported automation path.
- Integration failures are visible and diagnosable instead of silent.

### Sprint 6 - Polish, Reliability, and MVP Release

**Milestone:** the app is stable, documented, and ready for regular daily use with the sunrise alarm hardware.

**Detailed actions**

- Refactor large screens and services into smaller cohesive modules where complexity has grown during earlier sprints.
- Improve error states, empty states, loading states, and recovery flows across onboarding, alarms, dashboard, and settings.
- Validate responsive behavior for desktop and mobile web layouts.
- Add smoke tests for the highest-value user journeys: onboarding, alarm creation, live control, and backup restore.
- Finalize release documentation, setup instructions, known limitations, and support notes for future iterations.
- Perform a release-readiness pass against the app goals defined in this charter.

**Measurable code goals**

- 1 smoke test suite covering the 4 main user journeys.
- 30 or more total passing automated tests in the project after sprint completion.
- 0 blocker defects in onboarding, alarm scheduling, live control, or settings persistence.
- 100% of main screens reviewed at desktop and mobile breakpoints.
- 1 release checklist added to the documentation set.

**Exit criteria**

- A user can onboard the device, configure alarms, preview and trigger routines, and recover their configuration from backup.
- The app is stable enough for daily real-world usage with the target hardware.

### Final App Milestones Summary

- `phase-0-foundation`: project structure, test tooling, CI, and mockable device client are ready.
- `phase-1-device-onboarding`: the app can register a device and report connectivity status.
- `phase-2-alarm-engine`: alarms and sunrise routine management are functional.
- `phase-3-dashboard-sync`: live dashboard and manual controls are stable.
- `phase-4-settings`: audio, display, and advanced settings are functional.
- `phase-5-integrations`: import, export, and automation adapters are available.
- `phase-6-release`: polished MVP is validated and documented.

## 9. Initial Risks

- Assembly Difficulty: Requires basic soldering and electronics skills.
- Firmware Capability Gaps: Some desired app features may depend on the exact WLED endpoints and available Usermods.
- Device Connectivity: Local network instability may affect the perceived reliability of the app.
- Firmware Compilation: Building or configuring WLED with the required modules may still be challenging for beginners.
- Diffusion Quality: Achieving the ideal diffusion may require experimentation with materials and spacing.
- Scope Growth: The companion app can grow quickly if the first release is not kept focused on the core wake-up journey.

## 10. Assumptions

- The user has basic knowledge of electronics and tools such as a soldering iron and multimeter.
- The user has access to a stable internet connection for firmware downloads and access to the WLED web interface.
- The user has access to a 3D printer or other means to build the physical lamp structure.
- The chosen hardware and firmware combination exposes enough control points to support the companion app without a full custom firmware rewrite.
- The first version of the app can be delivered as a responsive web app instead of a native mobile app.

## 11. Constraints

- Budget: Limited to the cost of DIY components and low-cost software infrastructure.
- Time: Dependent on the user's availability for implementation, assembly, and configuration.
- Resources: Dependent on component availability in the local market or through import channels.
- Firmware Boundaries: The app should work with existing WLED-compatible behavior as much as possible.

## 12. Success Metrics

- Proper operation of the color gradient and light intensity transitions.
- Sufficient brightness for the intended wake-up purpose.
- Reliable creation and execution of alarm routines.
- Clear and functional audio playback where supported.
- Correct display of time and alarm status on the OLED screen.
- Stable Wi-Fi connection and predictable device communication from the app.
- Successful completion of the main app flow: onboarding, scheduling, preview, triggering, and backup.

## 13. Power Consumption

The DIY sunrise alarm has negligible energy consumption. Operating for 1 hour per day at maximum brightness, the estimated monthly cost is approximately R$ 1.27, based on the average Brazilian residential electricity rate in 2026. The actual consumption will likely be lower because the sunrise effect increases gradually rather than running at maximum power the entire time.

## 14. References

- WLED Project: kno.wled.ge
- Philips SmartSleep HF3650: Philips USA
- Lumie Bodyclock Shine 300: Lumie UK
