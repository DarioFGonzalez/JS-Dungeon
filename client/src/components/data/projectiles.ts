import * as icons from '../../Icons/projectileIcons';
import * as Types from '../types/global';

const basicArrowIcon: Record<string, string> = {
    up: icons.basicArrowImg,
    down: icons.basicArrowImg,
    left: icons.basicArrowImg,
    right: icons.basicArrowImg
}

const fireArrowIcon: Record<string, string> = {
    up: icons.basicArrowImg,
    down: icons.basicArrowImg,
    left: icons.basicArrowImg,
    right: icons.basicArrowImg
}

export class basicArrowClass implements Types.Projectile
{
    type = 'Arrow';
    id?: ReturnType<typeof setInterval>;
    name: string = 'Basic Arrow';
    symbol: string;
    data: Types.locationData;
    attack: Types.attackInfo = { Instant: 1, DoT: 0, Times: 0, Aliment: 'none' };

    constructor( direction: string, data: Types.locationData, bowAttack: number ) {
        this.data = data;
        this.attack.Instant += bowAttack;
        this.symbol = basicArrowIcon[direction];
    }
}

export class fireArrowClass implements Types.Projectile {
    type = 'Arrow';
    id?: ReturnType<typeof setInterval>;
    name: string = 'Fire Arrow';
    symbol: string;
    data: Types.locationData;
    attack: Types.attackInfo = { Instant: 1, DoT: 2, Times: 1, Aliment: 'none' };

    constructor( direction: string, data: Types.locationData, bowAttack: number ) {
        this.data = data;
        this.attack.Instant += bowAttack;
        this.symbol = fireArrowIcon[direction];
    }
}