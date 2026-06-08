import * as icons from '../../Icons/projectileIcons';
import * as Types from '../types/global';

const basicArrowIcon: Record<string, string> = {
    up: icons.arrowUp,
    down: icons.arrowDown,
    left: icons.arrowLeft,
    right: icons.arrowRight
}

const fireArrowIcon: Record<string, string> = {
    up: icons.fireArrowUp,
    down: icons.fireArrowDown,
    left: icons.fireArrowLeft,
    right: icons.fireArrowRight
}

const poisonArrowIcon: Record<string, string> = {
    up: icons.poisonArrowUp,
    down: icons.poisonArrowDown,
    left: icons.poisonArrowLeft,
    right: icons.poisonArrowRight
}

export class basicArrowClass implements Types.Projectile
{
    type = 'Arrow';
    id?: ReturnType<typeof setInterval>;
    name: string = 'Basic Arrow';
    symbol: string;
    data: Types.locationData;
    attack: Types.attackInfo = { Instant: 1, DoT: 0, Times: 0, Aliment: 'none' };
    toughness: number = 1;

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
    attack: Types.attackInfo = { Instant: 1, DoT: 2, Times: 1, Aliment: 'burn' };
    toughness: number = 2;

    constructor( direction: string, data: Types.locationData, bowAttack: number ) {
        this.data = data;
        this.attack.Instant += bowAttack;
        this.symbol = fireArrowIcon[direction];
    }
};

export class poisonArrowClass implements Types.Projectile {
    type = 'Arrow';
    id?: ReturnType<typeof setInterval>;
    name: string = 'Poison Arrow';
    symbol: string;
    data: Types.locationData;
    attack: Types.attackInfo = { Instant: 1, DoT: 1, Times: 3, Aliment: 'poison' };
    toughness: number = 2;

    constructor( direction: string, data: Types.locationData, bowAttack: number ) {
        this.data = data;
        this.attack.Instant += bowAttack;
        this.symbol = poisonArrowIcon[direction];
    }
};