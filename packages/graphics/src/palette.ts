export class Palette {
    readonly buffer: Buffer
    /**
     * Number of colors in the palette
     */
    readonly length: number

    /**
     * Allocates a 4bpp palette similar to MakeCode Arcade
     * @returns
     */
    static arcade() {
        return new Palette(hex`
            000000 ffffff ff2121 ff93c4 ff8135 fff609 249ca3 78dc52 
            003fad 87f2ff 8e2ec4 a4839f 5c406c e5cdc4 91463d 000000
        `)
    }

    /**
     * Allocates a 1bpp monochrome palette
     * @returns
     */
    static monochrome() {
        return new Palette(hex`000000 ffffff`)
    }

    constructor(init: Buffer) {
        this.buffer = init.slice(0)
        this.buffer.set(init)
        this.length = (this.buffer.length / 3) >> 0
    }

    /**
     * Returns the 24bit RGB color at the given index. Supports negative indices like Array.at
     * @param index
     * @returns
     */
    at(index: number) {
        index = index >> 0
        if (index < 0) index += this.length
        if (index < 0 || index >= this.length) return undefined

        return (
            (this.buffer[3 * index] << 16) |
            (this.buffer[3 * index + 1] << 8) |
            (this.buffer[3 * index + 2] << 0)
        )
    }

    /**
     * Sets a 24bit RGB color at the given index
     * @param index
     * @param color 24bit RGB color
     */
    setAt(index: number, color: number) {
        index = index >> 0
        if (index < 0) index += this.length
        if (index < 0 || index >= this.length) return

        this.buffer[3 * index] = color >> 16
        this.buffer[3 * index + 1] = color >> 8
        this.buffer[3 * index + 2] = color >> 0
    }

    /**
     * Packs palette for Jacdac packet
     * @returns
     */
    packed(): Buffer {
        const res: Buffer = Buffer.alloc(this.length << 2)
        for (let i = 0; i < this.length; ++i) {
            res[i * 4] = this.buffer[i * 3]
            res[i * 4 + 1] = this.buffer[i * 3 + 1]
            res[i * 4 + 2] = this.buffer[i * 3 + 2]
        }
        return res
    }

    /**
     * Unpacks palette from Jacdac packet
     * @param buffer
     */
    unpack(buffer: Buffer) {
        if (buffer.length >> 2 !== this.length)
            throw new RangeError("incorrect number of colors")
        for (let i = 0; i < this.length; ++i) {
            this.buffer[i * 3] = buffer[i * 4]
            this.buffer[i * 3 + 1] = buffer[i * 4 + 1]
            this.buffer[i * 3 + 2] = buffer[i * 4 + 2]
        }
    }
}
