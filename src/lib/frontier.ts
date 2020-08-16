import { HexCell } from '../hexCell';
import { exists } from './exists';
import { uniq } from './uniq';

export const frontier = (cells: (HexCell | undefined)[]): HexCell[] =>
    uniq(cells.filter(exists).reduce((neighbours, cell) => [...neighbours, ...cell.neighbours().filter(exists)], []));
