import * as icons from '../../Icons/projectileIcons';
import * as Types from '../types/global';

export const basicArrow: Types.Projectile = {
    type: 'Projectile',
    name: 'Basic Arrow',
    symbol: icons.basicArrowImg,
    data: { x: 0, y: 0 },
    attack: { Instant: 1, DoT: 0, Times: 0, Aliment: 'none' }
}

const arrowIconDirection: Record<string, string> = {
    up: icons.basicArrowImg,
    down: icons.basicArrowImg,
    left: icons.basicArrowImg,
    right: icons.basicArrowImg
}

export class basicArrowClass implements Types.Projectile
{
    type: 'Projectile' = 'Projectile';
    id?: ReturnType<typeof setInterval>;
    name: string = 'Basic Arrow';
    symbol: string;
    data: Types.locationData;
    attack: Types.attackInfo = { Instant: 1, DoT: 0, Times: 0, Aliment: 'none' };

    constructor( direction: string, data: Types.locationData, attack: number ) {
        this.data = data;
        this.attack.Instant += attack;
        this.symbol = arrowIconDirection[direction];
    }
}