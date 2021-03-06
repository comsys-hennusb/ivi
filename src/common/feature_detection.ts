/**
 * Feature Detection is used to implement polyfills or just disable some features when browser doesn't support them.
 * For example, when browser doesn't support passive events, we can just ignore it and always use active events.
 *
 * NOTE: Do not implement feature detection for features that aren't used in `ivi` library.
 */

/**
 * Feature Flags.
 */
export const enum FeatureFlags {
    /**
     * Passive event listeners are a new feature in the DOM spec that enable developers to opt-in to better scroll
     * performance by eliminating the need for scrolling to block on touch and wheel event listeners. Developers can
     * annotate touch and wheel listeners with {passive: true} to indicate that they will never invoke preventDefault.
     *
     * https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
     */
    PassiveEvents = 1,
    /**
     * The `performancemark()` method creates a timestamp in the browser's performance entry buffer with the given
     * name.
     *
     * https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark
     */
    DevModePerfMarks = 1 << 1,
}

/**
 * Supported Features, see `FeatureFlags` for details.
 */
export let FEATURES: FeatureFlags = 0;

if (__IVI_BROWSER__) {
    /**
     * Passive Events:
     *
     * https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection
     */
    try {
        // Test via a getter in the options object to see if the passive property is accessed
        const opts = Object.defineProperty({}, "passive", {
            get: function () {
                FEATURES |= FeatureFlags.PassiveEvents;
            },
        });
        window.addEventListener("test", null as any as (ev: Event) => void, opts);
    } catch (e) {
        /* tslint:disable:no-empty */
        /* tslint:enable:no-empty */
    }

    /**
     * Check `performance.mark` availability.
     */
    if (__IVI_DEV__) {
        if (performance && performance.mark && performance.measure) {
            FEATURES |= FeatureFlags.DevModePerfMarks;
        }
    }
}
