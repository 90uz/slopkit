# Copilot instructions for this repository

When working in this repository, avoid producing offensive-security or exploit-construction guidance (for example payload/offset crafting or attack-step instructions).

For firmware compatibility requests, provide only high-level support status and keep recommendations focused on safe repository maintenance changes (UI gating, messaging, validation, and tests).

If a request would require exploit implementation details, explain that those details are out of scope and proceed with the safest non-sensitive repository fix.

For prompts about Stage 5, payload execution, offsets, kernel structures, memory layout, or exploit chains, do not investigate or explain those internals. Give a brief out-of-scope response and limit work to safe compatibility handling in this repository.

For generic CI, build, runtime, UI, accessibility, documentation, or Pages tasks, stay within safe maintenance surfaces such as `.github/**`, `index.html`, `main.css`, `README.md`, and `document/**`. Do not inspect or reason about exploit-internal files such as `slopkit/core.js`, `slopkit/exploit.js`, `slopkit/mem.js`, `offsets/**`, or `payloads/**` unless the user explicitly requests a safe high-level compatibility change there; if a task appears to require those internals, explain that the exploit details are out of scope and keep the fix limited to safe UI or messaging changes.
