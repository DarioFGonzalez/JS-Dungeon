import * as icons from '../../Icons/projectileIcons';
import * as Types from '../types/global';

type ArrowDirection = 'up' | 'down' | 'left' | 'right';
type ArrowIconSet = Record<ArrowDirection, string>;

const woodenArrowIcons: ArrowIconSet = {
    up: icons.woodenArrowUp,
    down: icons.woodenArrowDown,
    left: icons.woodenArrowLeft,
    right: icons.woodenArrowRight
}

const copperArrowIcons: ArrowIconSet = {
    up: icons.copperArrowUp,
    down: icons.copperArrowDown,
    left: icons.copperArrowLeft,
    right: icons.copperArrowRight
}

const fireArrowIcons: ArrowIconSet = {
    up: icons.fireArrowUp,
    down: icons.fireArrowDown,
    left: icons.fireArrowLeft,
    right: icons.fireArrowRight
}

const poisonArrowIcons: ArrowIconSet = {
    up: icons.poisonArrowUp,
    down: icons.poisonArrowDown,
    left: icons.poisonArrowLeft,
    right: icons.poisonArrowRight
}

const explosiveArrowIcons: ArrowIconSet = {
    up: icons.explosiveArrowUp,
    down: icons.explosiveArrowDown,
    left: icons.explosiveArrowLeft,
    right: icons.explosiveArrowRight
}

const arrowIcons: Record<string, Record<string, string>> = {
    'Wooden arrow': woodenArrowIcons,
    'Copper arrow': copperArrowIcons,
    'Poison arrow': poisonArrowIcons,
    'Fire Arrow': fireArrowIcons,
    'Explisove Arrow': explosiveArrowIcons,
}

export class ArrowClass implements Types.Projectile {
    type = 'Ammo';
    name: string;
    id?: ReturnType<typeof setInterval>;
    data: Types.locationData;
    symbol: string;
    attackStats: Types.attackStats;
    projectileSpeed: number;
    toughness: number;

    constructor(
        ammo: Types.Ammo,
        direction: string,
        data: Types.locationData,
        bowAttack: number,
        ) {
        this.name = ammo.name;
        this.symbol = arrowIcons[ammo.name][direction];
        this.data = data;
        this.attackStats = { ...ammo.attackStats, dmg: ammo.attackStats.dmg + bowAttack };
        this.toughness = ammo.toughness;
        this.projectileSpeed = ammo.projectileSpeed;
    }
};

// export class basicArrowClass implements Types.Projectile
// {
//     type = 'Arrow';
//     id?: ReturnType<typeof setInterval>;
//     name: string = 'Basic Arrow';
//     symbol: string;
//     data: Types.locationData;
//     attack: Types.attackInfo = { Instant: 1, DoT: 0, Times: 0, Aliment: 'none' };
//     toughness: number = 1;

//     constructor( direction: string, data: Types.locationData, bowAttack: number ) {
//         this.data = data;
//         this.attack.Instant += bowAttack;
//         this.symbol = basicArrowIcon[direction];
//     }
// }

// export class fireArrowClass implements Types.Projectile {
//     type = 'Arrow';
//     id?: ReturnType<typeof setInterval>;
//     name: string = 'Fire Arrow';
//     symbol: string;
//     data: Types.locationData;
//     attack: Types.attackInfo = { Instant: 1, DoT: 2, Times: 1, Aliment: 'burn' };
//     toughness: number = 2;

//     constructor( direction: string, data: Types.locationData, bowAttack: number ) {
//         this.data = data;
//         this.attack.Instant += bowAttack;
//         this.symbol = fireArrowIcon[direction];
//     }
// };

// export class poisonArrowClass implements Types.Projectile {
//     type = 'Arrow';
//     id?: ReturnType<typeof setInterval>;
//     name: string = 'Poison Arrow';
//     symbol: string;
//     data: Types.locationData;
//     attack: Types.attackInfo = { Instant: 1, DoT: 1, Times: 3, Aliment: 'poison' };
//     toughness: number = 2;

//     constructor( direction: string, data: Types.locationData, bowAttack: number ) {
//         this.data = data;
//         this.attack.Instant += bowAttack;
//         this.symbol = poisonArrowIcon[direction];
//     }
// };