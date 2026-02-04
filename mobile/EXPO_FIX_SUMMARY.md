# Expo Mobile App - Troubleshooting Summary

**Date:** December 19, 2025  
**Project:** `c:\Users\2024\Desktop\playground\mobile`

---

## Issues Encountered

### 1. TypeScript Configuration Error
**Error:**
```
File 'expo/tsconfig.base' not found.
```
**Location:** `tsconfig.json:L2`

**Cause:** The `extends` field was missing the `.json` extension.

**Fix:** Changed line 2 from:
```json
"extends": "expo/tsconfig.base"
```
To:
```json
"extends": "expo/tsconfig.base.json"
```

---

### 2. Metro Config ESM Error on Windows
**Error:**
```
Error [ERR_UNSUPPORTED_ESM_URL_SCHEME]: Error loading Metro config at: C:\Users\2024\Desktop\playground\mobile\metro.config.js
Only URLs with a scheme in: file, data, and node are supported by the default ESM loader. On Windows, absolute paths must be valid file:// URLs. Received protocol 'c:'
```

**Cause:** Multiple issues:
1. React version mismatch with Expo 54 requirements
2. TailwindCSS v4 incompatible with NativeWind 4.x
3. Windows ESM path resolution issues

---

### 3. npm Dependency Conflict
**Error:**
```
npm error ERESOLVE could not resolve
npm error peer react@"^19.2.3" from react-dom@19.2.3
npm error Found: react@19.1.0
```

**Cause:** `react` and `react-dom` were set to `19.2.3`, but Expo 54 expects `19.1.0`.

**Fix:** Updated `package.json`:
```json
"react": "19.1.0",
"react-dom": "19.1.0",
```

---

### 4. NativeWind + TailwindCSS Incompatibility
**Error:**
```
Error: NativeWind only supports Tail[windcss 3.x]
```

**Cause:** TailwindCSS was set to `^4.1.18`, but NativeWind 4.x only supports TailwindCSS 3.x.

**Fix:** Updated `package.json`:
```json
"tailwindcss": "^3.4.0",
```

---

## Summary of All Changes

### `tsconfig.json`
```diff
- "extends": "expo/tsconfig.base",
+ "extends": "expo/tsconfig.base.json",
```

### `package.json`
```diff
{
  "name": "mobile",
  "version": "1.0.0",
+ "type": "commonjs",
  "main": "expo-router/entry",
  ...
  "dependencies": {
-   "react": "19.2.3",
-   "react-dom": "19.2.3",
+   "react": "19.1.0",
+   "react-dom": "19.1.0",
    ...
  },
  "devDependencies": {
-   "tailwindcss": "^4.1.18",
+   "tailwindcss": "^3.4.0",
    ...
  }
}
```

### `metro.config.js`
```diff
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

+ // Disable unstable package exports to fix Windows ESM path issues
+ config.resolver.unstable_enablePackageExports = false;

module.exports = withNativeWind(config, { input: "./global.css" });
```

---

## Commands to Reinstall Dependencies

If you encounter similar issues in the future, run:

```powershell
# Remove old dependencies and reinstall
Remove-Item -Recurse -Force node_modules, package-lock.json -ErrorAction SilentlyContinue
npm install

# Start Expo with cache cleared
npx expo start -c
```

---

## Environment Information

| Tool | Version |
|------|---------|
| Node.js | v20.19.6 |
| npm | 10.8.2 |
| Expo SDK | 54.0.30 |
| React | 19.1.0 |
| React Native | 0.81.5 |
| NativeWind | 4.2.1 |
| TailwindCSS | 3.4.x |

---

## Result

✅ Expo development server started successfully with all issues resolved.
