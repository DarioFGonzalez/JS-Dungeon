import { Bow1, CopperPickaxe, Dagger1, Sword1, WoodenLumberjack } from '../data/gear';
import { CopperOre, PoisonClaw, SilverOre, wood1 } from '../data/materials';
import { Recipe } from '../types/global';
import { Antidote, Bandages, copperArrow, explosiveArrow, fireArrow, poisonArrow, woodenArrow } from './items';

export const daggerRecipe: Recipe = {
    item: Dagger1,
    ingredients:[
    {
        material: CopperOre,
        quantity: 2
    },
    {
        material: SilverOre,
        quantity: 1
    }
],
    crafted: false,
    selected: false,
    failed: false
}

export const woodenBowRecipe: Recipe = {
    item: Bow1,
    ingredients:[
    {
        material: wood1,
        quantity: 3
    }
],
    crafted: false,
    selected: false,
    failed: false
}

export const cPickaxeRecipe: Recipe = {
    item: CopperPickaxe,
    ingredients:[
        {
            material: CopperOre,
            quantity: 2
        },
        {
            material: wood1,
            quantity: 1
        }
    ],
    crafted: false,
    selected: false,
    failed: false
}

export const wLumberjackRecipe: Recipe = {
    item: WoodenLumberjack,
    ingredients:[
        {
            material: CopperOre,
            quantity: 1
        },
        {
            material: wood1,
            quantity: 2
        }
    ],
    crafted: false,
    selected: false,
    failed: false
}

export const macheteRecipe: Recipe = {
    item: Sword1,
    ingredients:[
        {
            material: CopperOre,
            quantity: 3
        },
        {
            material: SilverOre,
            quantity: 1
        }
    ],
    crafted: false,
    selected: false,
    failed: false
}

export const antidoteRecipe: Recipe = {
    item: Antidote,
    ingredients:[
        {
            material: PoisonClaw,
            quantity: 1
        }
    ],
    quantity: 1,
    crafted: false,
    selected: false,
    failed: false
}

export const woodenArrowRecipe: Recipe = {
    item: woodenArrow,
    ingredients:[
        {
            material: wood1,
            quantity: 1
        }
    ],
    quantity: 3,
    crafted: false,
    selected: false,
    failed: false
}

export const copperArrowRecipe: Recipe = {
    item: copperArrow,
    ingredients:[
        {
            material: wood1,
            quantity: 1
        },
        {
            material: CopperOre,
            quantity: 1
        }
    ],
    quantity: 3,
    crafted: false,
    selected: false,
    failed: false
}

export const poisonArrowRecipe: Recipe = {
    item: poisonArrow,
    ingredients:[
        {
            material: wood1,
            quantity: 1
        },
        {
            material: CopperOre,
            quantity: 1
        },
        {
            material: PoisonClaw,
            quantity: 1
        }
    ],
    quantity: 3,
    crafted: false,
    selected: false,
    failed: false
}

export const fireArrowRecipe: Recipe = {
    item: fireArrow,
    ingredients:[
        {
            material: wood1,
            quantity: 1
        },
        {
            material: CopperOre,
            quantity: 1
        },
        {
            material: Bandages,
            quantity: 1
        }
    ],
    quantity: 2,
    crafted: false,
    selected: false,
    failed: false
}

export const explosiveArrowRecipe: Recipe = {
    item: explosiveArrow,
    ingredients: [
        {
            material: wood1,
            quantity: 1
        },
        {
            material: SilverOre,
            quantity: 1
        },
        {
            material: Bandages,
            quantity: 1
        }
    ],
    quantity: 2,
    crafted: false,
    selected: false,
    failed: false
}