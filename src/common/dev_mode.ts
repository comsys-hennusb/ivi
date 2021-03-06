/**
 * Development Mode.
 *
 * Development Mode is enabled when global variable `__IVI_DEV__` is `true`.
 *
 * Development Mode can be configured via query parameters:
 *   _nv=false  Disable Nesting Validation.
 *   _st=false  Disable Stack Trace Augmentation.
 *   _sod=false Disable Screen of Death.
 *   _geh=false Disable Screen of Death Global Event Handler.
 *   _perf=true Enable Component Performance Profiling.
 */
import { FeatureFlags, FEATURES } from "./feature_detection";

/**
 * Dev Mode Flags.
 *
 * `setDevModeFlags` function is used to set Dev Mode flags.
 */
export const enum DevModeFlags {
    /**
     * Disable Nesting Validation.
     */
    DisableNestingValidation = 1,
    /**
     * Disable Stack Trace Augmentation.
     */
    DisableStackTraceAugmentation = 1 << 1,
    /**
     * Disable Screen of Death.
     */
    DisableScreenOfDeath = 1 << 2,
    /**
     * Disable global `window.addEventListener("error", ...)` error handler.
     */
    DisableScreenOfDeathGlobalErrorHandling = 1 << 3,
    /**
     * Enable Component Performance Profiling.
     */
    EnableComponentPerformanceProfiling = 1 << 4,
}

/**
 * Dev Mode Flags. See `DevModeFlags` for details.
 */
export let DEV_MODE: DevModeFlags = 0;

export function setDevModeFlags(flags: DevModeFlags): void {
    if (__IVI_DEV__) {
        DEV_MODE |= flags;
    }
}

/**
 * Debug Id counter.
 */
let _nextDebugId = 0;

/**
 * Debug Id generator.
 *
 * @return unique debug id.
 */
export function nextDebugId(): number {
    if (__IVI_DEV__) {
        return _nextDebugId++;
    }
    return 0;
}

/**
 * Print error to the console and throw local exception.
 *
 * Local exception is thrown so that we can break on caught errors.
 *
 * @param message Error message.
 */
export function printError(message: string): void {
    console.error(message);
    try {
        throw new Error(message);
    } catch (_) {
        /* tslint:disable:no-empty */
        /* tslint:enable:no-empty */
    }
}

/**
 * Get function name.
 *
 * @param fn Function.
 * @returns Function name.
 */
export function getFunctionName(fn: Function): string {
    return fn.name;
}

/**
 * Begin mark perf.
 *
 * @param markName
 */
export function perfMarkBegin(markName: string): void {
    if (__IVI_DEV__) {
        if (FEATURES & FeatureFlags.DevModePerfMarks) {
            performance.mark(markName);
        }
    }
}

/**
 * End mark perf.
 *
 * @param measureName
 * @param markName
 */
export function perfMarkEnd(measureName: string, markName: string): void {
    if (__IVI_DEV__) {
        if (FEATURES & FeatureFlags.DevModePerfMarks) {
            performance.measure(measureName, markName);
            performance.clearMarks(markName);
            performance.clearMeasures(measureName);
        }
    }
}

/**
 * Parse query string.
 *
 * @param query Query string.
 * @returns object with key-value
 */
function parseQueryString(query: string): { [key: string]: string } {
    const a = query.substr(1).split("&");

    if (a.length === 0) {
        return {};
    }

    const b: { [key: string]: string } = {};
    for (let i = 0; i < a.length; ++i) {
        const p = a[i].split("=", 2);
        if (p.length === 1) {
            b[p[0]] = "";
        } else {
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
    }
    return b;
}

if (__IVI_DEV__ && __IVI_BROWSER__) {
    const query = parseQueryString(window.location.search);

    if (query["_nv"] === "false") {
        DEV_MODE |= DevModeFlags.DisableNestingValidation;
    }
    if (query["_st"] === "false") {
        DEV_MODE |= DevModeFlags.DisableStackTraceAugmentation;
    }
    if (query["_sod"] === "false") {
        DEV_MODE |= DevModeFlags.DisableScreenOfDeath;
    }
    if (query["_geh"] === "false") {
        DEV_MODE |= DevModeFlags.DisableScreenOfDeathGlobalErrorHandling;
    }
    if (query["_perf"] === "true") {
        DEV_MODE |= DevModeFlags.EnableComponentPerformanceProfiling;
    }
}
