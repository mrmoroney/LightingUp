//% color="#ff6600" icon="\uf06d" block="Candle"
namespace candle {

    let _strip: neopixel.Strip = null
    let currentR = 0
    let currentG = 0
    let currentB = 0
    let gustTimer = 0

    /**
     * Set up the candle on a NeoPixel strip
     * @param pin the pin the strip is connected to
     * @param numLeds number of LEDs on the strip
     * @param brightness brightness 0-255, eg: 255
     */
    //% block="set up candle on pin %pin with %numLeds LEDs at brightness %brightness"
    //% brightness.min=0 brightness.max=255
    //% numLeds.min=1 numLeds.max=30
    export function setup(pin: DigitalPin, numLeds: number, brightness: number): void {
        _strip = neopixel.create(pin, numLeds, NeoPixelMode.RGB)
        _strip.clear()
        _strip.show()
        _strip.setBrightness(brightness)
    }

    /**
     * Run one frame of the candle flicker effect
     * @param rDim red value of dim colour, eg: 100
     * @param gDim green value of dim colour, eg: 40
     * @param bDim blue value of dim colour, eg: 5
     * @param rBright red value of bright colour, eg: 226
     * @param gBright green value of bright colour, eg: 100
     * @param bBright blue value of bright colour, eg: 10
     * @param flickerAmount how much the flame flickers 0-100, eg: 70
     * @param smoothDown dip speed, eg: 2
     * @param smoothUp recovery speed, eg: 5
     * @param gustChance chance of a gust per frame 0-100, eg: 10
     * @param gustStrength strength of gusts 0-100, eg: 80
     */
    //% block="flicker candle || R (Dim) %rDim G (Dim) %gDim B (Dim) %bDim R (Bright) %rBright G (Bright) %gBright B (Bright) %bBright flicker %flickerAmount smooth down %smoothDown smooth up %smoothUp gust chance %gustChance gust strength %gustStrength"
    //% flickerAmount.min=0 flickerAmount.max=100
    //% gustChance.min=0 gustChance.max=100
    //% gustStrength.min=0 gustStrength.max=100
    //% smoothDown.min=2 smoothDown.max=10
    //% smoothUp.min=2 smoothUp.max=15
    //% expandableArgumentMode="toggle"
    export function flicker(
        rDim = 100, gDim = 40, bDim = 5,
        rBright = 226, gBright = 100, bBright = 10,
        flickerAmount = 70, smoothDown = 2, smoothUp = 5,
        gustChance = 10, gustStrength = 80
    ): void {
        if (_strip == null) return

        if (gustTimer > 0) {
            gustTimer = gustTimer - 1
        } else if (Math.randomRange(0, 100) < gustChance) {
            gustTimer = Math.randomRange(3, 8)
        }

        let flicker = Math.randomRange(0, flickerAmount)
        if (gustTimer > 0) {
            flicker = Math.min(100, flicker + gustStrength)
        }

        let targetR = rBright + Math.idiv((rDim - rBright) * flicker, 100)
        let targetG = gBright + Math.idiv((gDim - gBright) * flicker, 100)
        let targetB = bBright + Math.idiv((bDim - bBright) * flicker, 100)

        let smoothR = targetR < currentR ? smoothDown : smoothUp
        let smoothG = targetG < currentG ? smoothDown : smoothUp
        let smoothB = targetB < currentB ? smoothDown : smoothUp

        let stepR = Math.idiv(targetR - currentR, smoothR)
        if (targetR != currentR && stepR == 0) { stepR = targetR > currentR ? 1 : -1 }
        currentR = currentR + stepR

        let stepG = Math.idiv(targetG - currentG, smoothG)
        if (targetG != currentG && stepG == 0) { stepG = targetG > currentG ? 1 : -1 }
        currentG = currentG + stepG

        let stepB = Math.idiv(targetB - currentB, smoothB)
        if (targetB != currentB && stepB == 0) { stepB = targetB > currentB ? 1 : -1 }
        currentB = currentB + stepB

        _strip.setPixelColor(0, neopixel.rgb(currentR, currentG, currentB))
        _strip.show()
    }
}
