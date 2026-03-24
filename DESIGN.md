```markdown
# Design System: The Radiant Horizon

This design system is a high-end framework crafted specifically for "Solaris," a premium sunrise alarm experience. It moves away from the sterile, modular grids of standard utility apps, opting instead for an editorial, atmospheric interface that mimics the natural transition of dawn.

## 1. Overview & Creative North Star: "The Chromatic Awakening"
The Creative North Star for this system is **The Chromatic Awakening**. This concept prioritizes sensory immersion over traditional data entry. 

To break the "template" look, we utilize **Intentional Asymmetry**. Instead of centering every element, we use the `24 (8.5rem)` and `16 (5.5rem)` spacing tokens to create sweeping "white space" (negative space) that allows the warm gradients to breathe. Layouts should feel organic; overlapping elements—such as a large `display-lg` time element partially obscured by a soft `surface-container` card—create a sense of physical depth and high-tech sophistication.

## 2. Colors & Atmospheric Tones
The palette is rooted in the transition from night (`surface: #130d0b`) to the first light of day (`secondary: #feb64c`).

*   **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning. Contrast must be achieved through background shifts. For example, a configuration module using `surface-container-low` should sit directly on the `surface` background. The eye should perceive the change in tone, not a sharp line.
*   **Surface Hierarchy & Nesting:** Use the surface-container tiers to create "tactile stacks." 
    *   **Base:** `surface` (#130d0b)
    *   **Main Content Areas:** `surface-container` (#1f1816)
    *   **Interactive Floating Elements:** `surface-container-highest` (#2d2421)
*   **The "Glass & Gradient" Rule:** Use `primary` (#ff8f6f) to `secondary` (#feb64c) linear gradients (at 135 degrees) for primary action states. For high-tech overlays, apply `surface-variant` at 60% opacity with a `20px` backdrop-blur to create a "warm glass" effect.
*   **Signature Textures:** Hero headers should employ a radial gradient: `primary_container` (#ff7851) fading into the `surface` background to simulate a sun breaking the horizon.

## 3. Typography: Editorial Clarity
We pair two distinct sans-serifs to balance technical precision with approachable warmth.

*   **Display & Headlines (Manrope):** Used for the "Soul" of the UI. `display-lg` should be used for the current alarm time, treated as a graphic element rather than just text. High contrast between `display-lg` and `body-md` is essential for an editorial feel.
*   **Body & Labels (Plus Jakarta Sans):** Used for the "Function." This typeface provides exceptional legibility at small scales. 
*   **Hierarchy Note:** Use `on_surface_variant` (#b4a9a5) for secondary information to maintain a soft, low-fatigue visual environment for users who are just waking up.

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "digital." We use environmental light simulation.

*   **The Layering Principle:** Avoid shadows on static cards. Achieve lift by placing a `surface-container-highest` card on a `surface-dim` background.
*   **Ambient Shadows:** For floating modals or active pickers, use a shadow with a `48px` blur, `0px` spread, and 6% opacity. The shadow color must be `on_primary_container` (#470e00) to ensure the shadow feels like a warm glow rather than a grey smudge.
*   **The "Ghost Border" Fallback:** If a boundary is required for accessibility, use `outline_variant` at 15% opacity. It should be felt, not seen.
*   **Tactile Radius:** Use the `xl (3rem)` token for large containers and `full (9999px)` for buttons. This extreme roundness makes the interface feel soft and safe.

## 5. Components

### Buttons
*   **Primary:** A vibrant gradient from `primary` to `primary_dim`. Roundedness: `full`. No border.
*   **Secondary:** `surface-container-highest` background with `primary` text. Provides a "tactile" button feel without the intensity of a gradient.
*   **States:** On hover/active, increase the `surface-bright` value or slightly increase the gradient saturation.

### Time & Alarm Pickers
*   **The Radiant Dial:** Instead of a standard list-scroll, use a large-scale horizontal scroll for hours. Use `display-md` for the selected value and `body-sm` with 40% opacity for non-selected values.
*   **No Dividers:** Separate hours, minutes, and AM/PM using `10 (3.5rem)` spacing units rather than vertical lines.

### Cards & Configuration Modules
*   **Visual Style:** Use `surface-container-low`. Forbid the use of divider lines between settings. Use `3 (1rem)` vertical padding to create "spatial containers" that group information.
*   **Nesting:** Small toggles within a card should sit on a `surface-container-high` background to appear "pressed into" the surface.

### Toggles & Checkboxes
*   **The Solar Toggle:** Use `secondary` (#feb64c) for the "on" state thumb. When active, the track should have a soft outer glow (using the ambient shadow rule) to mimic a lit bulb.

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical margins. A larger left-hand margin (e.g., `spacing-16`) creates an elegant, high-end magazine feel.
*   **Do** use `primary` and `secondary` colors as "light sources." Imagine the light coming from the top-center of the screen.
*   **Do** prioritize `Plus Jakarta Sans` for all interactive labels to ensure users can navigate the app even when half-asleep.

### Don't:
*   **Don't** use pure white or pure grey. Every "neutral" in this system is tinted with a hint of warm orange or deep brown to maintain the "Solaris" atmosphere.
*   **Don't** use sharp corners (`none` or `sm`). Every element must feel "pebble-smooth" to the touch.
*   **Don't** use standard 1px dividers. If you feel the need for a line, use a `spacing-px` gap with a background color shift instead.

---
**Director's Closing Note:**
Junior designers should remember that this system is about *emotion*. We aren't just building a tool to set a clock; we are designing the first thing a user sees when they open their eyes. Keep it soft, keep it warm, and let the typography do the heavy lifting.```

## Alarm Page

<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Solaris | Your Radiant Morning</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700;800&amp;family=Plus+Jakarta+Sans:wght@400;500;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#ff8f6f",
                        "on-background": "#f0e3df",
                        "tertiary-fixed": "#ff9289",
                        "tertiary-fixed-dim": "#ff7b71",
                        "on-primary-container": "#470e00",
                        "on-error": "#490006",
                        "surface-container-low": "#181210",
                        "error": "#ff716c",
                        "primary-container": "#ff7851",
                        "on-primary": "#5c1400",
                        "surface-bright": "#332a27",
                        "on-tertiary-container": "#1f0001",
                        "secondary-dim": "#eea840",
                        "surface": "#130d0b",
                        "tertiary-container": "#fe4e49",
                        "error-dim": "#d7383b",
                        "on-tertiary-fixed-variant": "#7a000b",
                        "primary-fixed-dim": "#ff5d2b",
                        "outline": "#7d7370",
                        "on-tertiary": "#4a0004",
                        "background": "#130d0b",
                        "surface-container-lowest": "#000000",
                        "on-secondary": "#583700",
                        "outline-variant": "#4e4644",
                        "surface-container-high": "#261e1b",
                        "inverse-surface": "#fff8f6",
                        "on-surface-variant": "#b4a9a5",
                        "surface-dim": "#130d0b",
                        "primary-dim": "#ff734a",
                        "inverse-primary": "#b12f00",
                        "on-primary-fixed-variant": "#581300",
                        "surface-tint": "#ff8f6f",
                        "surface-container": "#1f1816",
                        "on-surface": "#f0e3df",
                        "on-primary-fixed": "#000000",
                        "primary-fixed": "#ff7851",
                        "tertiary": "#ff7168",
                        "surface-variant": "#2d2421",
                        "secondary-container": "#835500",
                        "on-error-container": "#ffa8a3",
                        "inverse-on-surface": "#5c5350",
                        "on-secondary-fixed": "#4a2e00",
                        "on-secondary-container": "#fff6ef",
                        "surface-container-highest": "#2d2421",
                        "secondary-fixed-dim": "#feb64c",
                        "secondary": "#feb64c",
                        "tertiary-dim": "#ff7168",
                        "on-secondary-fixed-variant": "#704800",
                        "error-container": "#9f0519",
                        "on-tertiary-fixed": "#3a0002",
                        "secondary-fixed": "#ffc87f"
                    },
                    fontFamily: {
                        "headline": ["Manrope"],
                        "body": ["Plus Jakarta Sans"],
                        "label": ["Plus Jakarta Sans"]
                    },
                    borderRadius: {"DEFAULT": "1rem", "lg": "2rem", "xl": "3rem", "full": "9999px"},
                },
            },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            display: inline-block;
            line-height: 1;
            text-transform: none;
            letter-spacing: normal;
            word-wrap: normal;
            white-space: nowrap;
            direction: ltr;
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .solar-glow {
            background: radial-gradient(circle at center, rgba(255, 143, 111, 0.15) 0%, rgba(19, 13, 11, 0) 70%);
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container min-h-screen pb-32">
<!-- TopAppBar -->
<nav class="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#130d0b] dark:bg-[#130d0b] no-line tonal shift via bg-[#1f1816] flat no shadows">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-[#ff8f6f]" data-icon="light_mode">light_mode</span>
<span class="text-2xl font-extrabold bg-gradient-to-br from-[#ff8f6f] to-[#feb64c] bg-clip-text text-transparent font-['Manrope'] tracking-tight">Solaris</span>
</div>
<div class="flex items-center gap-2 px-4 py-1.5 bg-surface-container-highest rounded-full border border-outline-variant/10">
<div class="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#feb64c]"></div>
<span class="text-[10px] font-bold uppercase tracking-widest text-[#ff8f6f]">Connected</span>
</div>
</nav>
<main class="pt-24 px-6 space-y-10">
<!-- Hero Section: Digital Clock -->
<section class="relative flex flex-col items-center justify-center py-12 overflow-hidden">
<div class="absolute inset-0 solar-glow scale-150 pointer-events-none"></div>
<div class="text-center relative z-10">
<span class="block text-on-surface-variant font-label font-medium tracking-[0.2em] mb-4 uppercase text-xs">Current Time</span>
<h1 class="font-headline text-[7rem] font-extrabold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-on-surface to-on-surface/40">
                    22:45
                </h1>
<div class="mt-4 inline-flex items-center gap-2 text-primary font-medium">
<span class="material-symbols-outlined text-sm" data-icon="auto_awesome">auto_awesome</span>
<span class="text-sm">Sunset Mode Active</span>
</div>
</div>
</section>
<!-- Active Alarm Card -->
<section class="relative">
<div class="bg-surface-container-high rounded-xl p-6 flex items-center justify-between shadow-[0_48px_48px_rgba(71,14,0,0.06)] group">
<div class="space-y-1">
<p class="text-on-surface-variant text-xs font-medium uppercase tracking-wider">Next Alarm</p>
<p class="font-headline text-4xl font-bold text-on-surface">06:30 <span class="text-lg font-medium opacity-60">AM</span></p>
<p class="text-secondary text-xs font-medium">Tomorrow • Tuesday</p>
</div>
<button class="relative w-16 h-8 rounded-full bg-surface-container-highest transition-colors flex items-center p-1 group-active:scale-95 duration-200">
<div class="w-6 h-6 rounded-full bg-secondary shadow-[0_0_12px_rgba(254,182,76,0.4)] transform translate-x-8 transition-transform"></div>
</button>
</div>
</section>
<!-- Sunrise Configuration -->
<section class="space-y-6">
<div class="flex items-center gap-3 ml-4">
<span class="material-symbols-outlined text-primary" data-icon="wb_twilight">wb_twilight</span>
<h2 class="font-headline text-xl font-bold">Sunrise Glow</h2>
</div>
<div class="bg-surface-container-low rounded-xl p-6 space-y-8">
<!-- Duration Slider -->
<div class="space-y-4">
<div class="flex justify-between items-end">
<label class="text-on-surface-variant text-sm font-medium">Sunrise Duration</label>
<span class="text-primary font-bold text-lg">30 <span class="text-xs font-medium opacity-60">min</span></span>
</div>
<div class="relative h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
<div class="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
</div>
</div>
<!-- Brightness Slider -->
<div class="space-y-4">
<div class="flex justify-between items-end">
<label class="text-on-surface-variant text-sm font-medium">Max Brightness</label>
<span class="text-primary font-bold text-lg">85%</span>
</div>
<div class="relative h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
<div class="absolute top-0 left-0 h-full w-[85%] bg-gradient-to-r from-primary to-secondary rounded-full"></div>
</div>
</div>
<!-- Gradient Style Selector -->
<div class="space-y-4">
<label class="text-on-surface-variant text-sm font-medium block">Gradient Style</label>
<div class="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
<div class="flex-shrink-0 flex flex-col items-center gap-2">
<div class="w-16 h-16 rounded-full ring-2 ring-primary ring-offset-4 ring-offset-surface-container-low bg-gradient-to-tr from-[#ff4d4d] via-[#ff8f6f] to-[#feb64c]"></div>
<span class="text-[10px] font-bold text-primary">Tropical</span>
</div>
<div class="flex-shrink-0 flex flex-col items-center gap-2 opacity-50">
<div class="w-16 h-16 rounded-full bg-gradient-to-tr from-[#74ebd5] to-[#acb6e5]"></div>
<span class="text-[10px] font-bold">Arctic</span>
</div>
<div class="flex-shrink-0 flex flex-col items-center gap-2 opacity-50">
<div class="w-16 h-16 rounded-full bg-gradient-to-tr from-[#f83600] to-[#f9d423]"></div>
<span class="text-[10px] font-bold">Fire</span>
</div>
<div class="flex-shrink-0 flex flex-col items-center gap-2 opacity-50">
<div class="w-16 h-16 rounded-full bg-gradient-to-tr from-[#cc2b5e] to-[#753a88]"></div>
<span class="text-[10px] font-bold">Ember</span>
</div>
</div>
</div>
</div>
</section>
<!-- Audio Configuration -->
<section class="space-y-6">
<div class="flex items-center gap-3 ml-4">
<span class="material-symbols-outlined text-primary" data-icon="graphic_eq">graphic_eq</span>
<h2 class="font-headline text-xl font-bold">Audio Ambience</h2>
</div>
<div class="bg-surface-container-low rounded-xl p-6 space-y-8">
<!-- Nature Sound Selector -->
<div class="space-y-4">
<label class="text-on-surface-variant text-sm font-medium block">Soundscape</label>
<div class="grid grid-cols-1 gap-3">
<button class="flex items-center gap-4 p-4 rounded-lg bg-surface-container-highest border border-primary/20">
<span class="material-symbols-outlined text-primary" data-icon="park">park</span>
<div class="flex-1 text-left">
<p class="text-sm font-bold">Morning Birds</p>
<p class="text-[10px] text-on-surface-variant uppercase tracking-tighter">Active</p>
</div>
<span class="material-symbols-outlined text-primary text-sm" data-icon="check_circle" style="font-variation-settings: 'FILL' 1;">check_circle</span>
</button>
<button class="flex items-center gap-4 p-4 rounded-lg bg-surface-container/50 hover:bg-surface-container-high transition-colors">
<span class="material-symbols-outlined text-on-surface-variant" data-icon="water_drop">water_drop</span>
<div class="flex-1 text-left">
<p class="text-sm font-bold">Forest Rain</p>
</div>
</button>
<button class="flex items-center gap-4 p-4 rounded-lg bg-surface-container/50 hover:bg-surface-container-high transition-colors">
<span class="material-symbols-outlined text-on-surface-variant" data-icon="waves">waves</span>
<div class="flex-1 text-left">
<p class="text-sm font-bold">Ocean Waves</p>
</div>
</button>
</div>
</div>
<!-- Volume Slider -->
<div class="space-y-4">
<div class="flex justify-between items-end">
<label class="text-on-surface-variant text-sm font-medium">Volume</label>
<span class="text-primary font-bold text-lg">40%</span>
</div>
<div class="relative h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
<div class="absolute top-0 left-0 h-full w-[40%] bg-gradient-to-r from-primary to-secondary rounded-full"></div>
</div>
</div>
</div>
</section>
<!-- Quick Actions -->
<section class="grid grid-cols-2 gap-4">
<button class="flex flex-col items-center justify-center p-6 rounded-xl bg-surface-container-highest hover:bg-surface-bright transition-colors group active:scale-95 duration-200">
<span class="material-symbols-outlined text-secondary mb-2" data-icon="play_circle">play_circle</span>
<span class="font-bold text-xs">Test Sunrise</span>
</button>
<button class="flex flex-col items-center justify-center p-6 rounded-xl bg-surface-container-highest hover:bg-surface-bright transition-colors group active:scale-95 duration-200">
<span class="material-symbols-outlined text-secondary mb-2" data-icon="volume_up">volume_up</span>
<span class="font-bold text-xs">Preview Sound</span>
</button>
</section>
<!-- Aesthetic Imagery -->
<section class="pt-4 pb-12">
<div class="rounded-xl overflow-hidden aspect-[16/9] relative">
<img class="w-full h-full object-cover" data-alt="cinematic close-up of a sunrise over a calm misty forest with soft golden and pink light breaking through the trees" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOuFaSnLIyDorGE8YANxnDOMCV8tCAwZBlDtzfin29t_AKgU0cpYJcxcad7-SKm8oLxXiMJAr2MCYnZdi6wYKEt0A_cItcVYy2MOuwtPtalmehTSzQf29PqqsrfKIwwGraBigU0OWNNSw0B_4PmAlw51Tk8uQDSEmyFg4K8LkmweyDZpqD4bJ7owXz_1BT_CsL5NgeDUJD9QsI1NWoYn0SyP_p8FJcTci-G_teWHTncl_q0QfbnzrRW92W1E7WZBKewmr6H23fugAE"/>
<div class="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
<div class="absolute bottom-4 left-4 right-4">
<p class="font-headline font-bold text-lg leading-tight">Your morning begins <br/><span class="text-primary">at the speed of light.</span></p>
</div>
</div>
</section>
</main>
<!-- BottomNavBar -->
<nav class="fixed bottom-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-[#1f1816]/90 backdrop-blur-xl docked full-width bottom-0 rounded-t-[3rem] shadow-[0_-4px_24px_rgba(71,14,0,0.06)] no-line tonal separation">
<a class="flex flex-col items-center justify-center text-[#b4a9a5] p-3 hover:text-[#ff8f6f] transition-colors active:scale-90 duration-200" href="#">
<span class="material-symbols-outlined mb-1" data-icon="alarm">alarm</span>
<span class="font-['Plus_Jakarta_Sans'] text-[10px] font-medium">Alarms</span>
</a>
<a class="flex flex-col items-center justify-center text-[#b4a9a5] p-3 hover:text-[#ff8f6f] transition-colors active:scale-90 duration-200" href="#">
<span class="material-symbols-outlined mb-1" data-icon="wb_sunny">wb_sunny</span>
<span class="font-['Plus_Jakarta_Sans'] text-[10px] font-medium">Profile</span>
</a>
<a class="flex flex-col items-center justify-center text-[#b4a9a5] p-3 hover:text-[#ff8f6f] transition-colors active:scale-90 duration-200" href="#">
<span class="material-symbols-outlined mb-1" data-icon="library_music">library_music</span>
<span class="font-['Plus_Jakarta_Sans'] text-[10px] font-medium">Sounds</span>
</a>
<a class="flex flex-col items-center justify-center bg-[#2d2421] text-[#feb64c] rounded-full p-3 shadow-[0_0_15px_rgba(254,182,76,0.2)] active:scale-90 duration-200" href="#">
<span class="material-symbols-outlined mb-1" data-icon="settings">settings</span>
<span class="font-['Plus_Jakarta_Sans'] text-[10px] font-medium">Settings</span>
</a>
</nav>
</body></html>