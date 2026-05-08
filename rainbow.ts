//% color=#FF00FF icon="\uf185" block="RainbowFX"
namespace rainbowfx {

    // Shared strip reference
    let strip: neopixel.Strip = null

    // User‑set fade colours (null until user sets them)
    let fadeColor1: number = null
    let fadeColor2: number = null
    let fadeColor3: number = null

    //
    // ────────────────────────────────────────────────────────────────
    //   STRIP SETUP BLOCK
    // ────────────────────────────────────────────────────────────────
    //

    /**
     * Setup the NeoPixel strip once at startup.
     * Must be called before any other RainbowFX blocks.
     * Specify the No. of LEDs in the strip and the data pin
     */
    //% block="setup strip on pin %pin with %leds LEDs"
    //% pin.defl=DigitalPin.P16
    //% leds.defl=4
    export function setupStrip(pin: DigitalPin, leds: number): void {
        strip = neopixel.create(pin, leds, NeoPixelMode.RGB)
        strip.clear()
        strip.show()
    }


    //
    // ────────────────────────────────────────────────────────────────
    //   RGB FLASH EFFECT (Quadratic Ease‑Out)
    // ────────────────────────────────────────────────────────────────
    //

    /**
     * Flash the LEDs in the order R,G,B increasing in speed until white is displayed
     */
    //% block="RGB flash"
    export function RGBflash(): void {
        if (!strip) return  // safety check

        let speed = 1000   // smooth, slow start

        strip.clear()
        strip.show()

        while (speed > 1) {

            // Red
            strip.clear()
            strip.setPixelColor(0, neopixel.colors(NeoPixelColors.Red))
            strip.show()
            basic.pause(speed)

            // Green
            strip.clear()
            strip.setPixelColor(0, neopixel.colors(NeoPixelColors.Green))
            strip.show()
            basic.pause(speed)

            // Blue
            strip.clear()
            strip.setPixelColor(0, neopixel.colors(NeoPixelColors.Blue))
            strip.show()
            basic.pause(speed)

            // Quadratic ease‑out (faster finish)
            speed = speed - (speed * speed * 0.0004)
        }

        // Final white
        strip.clear()
        strip.setPixelColor(0, neopixel.colors(NeoPixelColors.White))
        strip.show()
    }


    //
    // ────────────────────────────────────────────────────────────────
    //   8‑COLOUR ROTATION EFFECT
    // ────────────────────────────────────────────────────────────────
    //

    let rotateIndex = 0

    /**
     * Rotate through 8 colours:
     * Red → Orange → Yellow → Green → Blue → Indigo → Violet → White
     * Each time the block is called it moves to the next colour
     */
    //% block="rotate colour"
    export function rotateColour(): void {
        if (!strip) return  // safety check

        const colors = [
            neopixel.colors(NeoPixelColors.Red),
            neopixel.colors(NeoPixelColors.Orange),
            neopixel.colors(NeoPixelColors.Yellow),
            neopixel.colors(NeoPixelColors.Green),
            neopixel.colors(NeoPixelColors.Blue),
            neopixel.colors(NeoPixelColors.Indigo),
            neopixel.colors(NeoPixelColors.Violet),
            neopixel.colors(NeoPixelColors.White)
        ]

        if (rotateIndex >= colors.length) {
            rotateIndex = 0
        }

        strip.clear()
        strip.setPixelColor(0, colors[rotateIndex])
        strip.show()

        rotateIndex++
    }


    //
    // ────────────────────────────────────────────────────────────────
    //   FADE BETWEEN 3 USER‑SPECIFIED OR DEFAULT RGB COLOURS
    // ────────────────────────────────────────────────────────────────
    //

    /**
 * Fade smoothly between 3 specified RGB colours.
 * Only LED 0 is lit.
 */
    //% block="fade between 3 RGB colours"
    export function fade3Colours(speed: number = 100): void {
        if (!strip) return  // safety check

        // *** INTERNAL DEFAULT COLOURS ***
        const colors = [
            neopixel.rgb(255, 0, 0),   // Red
            neopixel.rgb(0, 255, 0),   // Green
            neopixel.rgb(0, 0, 255)    // Blue
        ]

        // Current and next index
        let current = rotateIndex
        let next = (rotateIndex + 1) % colors.length

        // Extract RGB values
        let c1 = colors[current]
        let c2 = colors[next]

        let r1 = (c1 >> 16) & 0xFF
        let g1 = (c1 >> 8) & 0xFF
        let b1 = c1 & 0xFF

        let r2 = (c2 >> 16) & 0xFF
        let g2 = (c2 >> 8) & 0xFF
        let b2 = c2 & 0xFF

        // Fade in 50 steps
        for (let i = 0; i <= 50; i++) {
            let t = i / 50

            let r = Math.round(r1 + (r2 - r1) * t)
            let g = Math.round(g1 + (g2 - g1) * t)
            let b = Math.round(b1 + (b2 - b1) * t)

            strip.setPixelColor(0, neopixel.rgb(r, g, b))
            strip.show()
            basic.pause(speed)
        }

        rotateIndex = next
    }
}
