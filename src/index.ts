import sharp from 'sharp';
import * as fs from 'fs';
import { HexMap } from './HexMap';

const map = new HexMap({
    height: 16,
    width: 20,
    hexSize: 60,
    peaks: 7,
    fontSize: 16,
    lineWidth: 2,
    riverSourceAltitude: 8,
    riverChancePerPeak: 30,
    riverWidth: 5,
});

fs.writeFileSync('test.svg', map.toSvg());
fs.writeFileSync('debug.json', JSON.stringify(map.toJson(), null, 4));
sharp('test.svg').png().toFile('test.png');
