// Builds the Android APK and drops it where the site serves it.
//
// The APK is a shell around https://stratusradio.app - see
// capacitor.config.json. Rebuilding it is only needed for the icon, the name, or
// a version bump. A change to the stations or the player reaches installed phones
// through a normal deploy, because the app loads the deployed site rather than a
// copy of it.
//
// The APK workflow in .github/workflows/apk.yml is how a release is built:
// it holds the signing key in Actions secrets and counts versionCode up on its
// own. This script is the local fallback, for a machine that has the key.
//
// Without the key gradle still builds, but it writes app-release-unsigned.apk
// rather than app-release.apk, which no phone will install. That is checked for
// below rather than left to fail as a missing file three lines later.

import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, statSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

// Forward slashes in the constants: Node accepts them on Windows and they keep
// backslash escapes out of this file. The one path cmd.exe is handed goes
// through resolve() first, which makes it native - see run().
const WINDOWS = process.platform === "win32";
const JAVA_HOME = process.env.JAVA_HOME || "C:/Program Files/Android/Android Studio/jbr";
const ANDROID_HOME =
  process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT || "C:/Users/lkeliwin/AppData/Local/Android/Sdk";
const GRADLEW = resolve("android", WINDOWS ? "gradlew.bat" : "gradlew");
const BUILT = "android/app/build/outputs/apk/release/app-release.apk";
const SERVED = "download/stratusradio.apk";

function run(command, args, extraEnv = {}) {
  // Both a .bat and a PATHEXT lookup like npx need cmd.exe on Windows. It is
  // invoked directly rather than through spawn's shell option: the shell option
  // concatenates arguments into one string instead of escaping them, which Node
  // now deprecates, and it also made cmd read the forward slash in a path as
  // the start of a switch.
  const result = spawnSync(
    WINDOWS ? "cmd.exe" : command,
    WINDOWS ? ["/c", command, ...args] : args,
    { stdio: "inherit", env: { ...process.env, ...extraEnv } },
  );
  if (result.status !== 0) process.exit(result.status ?? 1);
}

if (!existsSync(JAVA_HOME)) {
  console.error(`No JDK at ${JAVA_HOME}. Set JAVA_HOME, or install Android Studio, which brings its own.`);
  process.exit(1);
}
if (!existsSync(ANDROID_HOME)) {
  console.error(`No Android SDK at ${ANDROID_HOME}. Set ANDROID_HOME.`);
  process.exit(1);
}

// Resolved the same way android/app/build.gradle resolves it, so the two
// cannot disagree about where the key is.
const KEYSTORE_PROPERTIES =
  process.env.STRATUS_KEYSTORE_PROPERTIES || `${process.env.USERPROFILE || process.env.HOME}/keys/stratusradio/keystore.properties`;

if (!existsSync(KEYSTORE_PROPERTIES)) {
  console.error(`No signing key at ${KEYSTORE_PROPERTIES}.`);
  console.error("");
  console.error("Release the APK from the Actions tab instead: run the APK workflow on main");
  console.error("and give it a version name. It holds the key in secrets, bumps versionCode,");
  console.error("signs, commits the build and deploys it.");
  console.error("");
  console.error("Building here without the key produces an unsigned APK that no phone will");
  console.error("install, so this stops rather than replacing the one being served.");
  process.exit(1);
}

// The native project holds its own copy of capacitor.config.ts and of the
// placeholder webDir, so a change to either only reaches the APK through this.
run("npx", ["cap", "sync", "android"], { JAVA_HOME, ANDROID_HOME });
run(GRADLEW, ["-p", "android", "assembleRelease"], { JAVA_HOME, ANDROID_HOME });

mkdirSync("download", { recursive: true });
copyFileSync(BUILT, SERVED);

// Read the version out of the gradle file rather than repeating it here, so
// this cannot report a number the build did not use.
const gradle = readFileSync("android/app/build.gradle", "utf8");
const versionName = gradle.match(/versionName\s+"([^"]+)"/)?.[1] ?? "?";
const versionCode = gradle.match(/versionCode\s+(\d+)/)?.[1] ?? "?";

console.log("");
console.log(`wrote ${SERVED} - ${(statSync(SERVED).size / 1024 / 1024).toFixed(1)} MB`);
console.log(`version ${versionName} (code ${versionCode})`);
console.log("");
console.log("Check it before you hand it out - a build carrying any other certificate will");
console.log("not install over the one people already have:");
console.log("  apksigner verify --print-certs download/stratusradio.apk");
console.log("  expected SHA-256 edb04910cbdf3fcd4a89d0ecd48669bb8e06efd9c26fa81811e1095589453ec6");
console.log("");
console.log("Then commit it and push to main. It is served at https://stratusradio.app/download/stratusradio.apk");
console.log("You bumped versionCode by hand for this one; the APK workflow does it for you.");
