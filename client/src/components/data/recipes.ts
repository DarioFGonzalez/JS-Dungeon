import { Recipe } from '../types/global';
import { Dagger1, Sword1, CopperPickaxe } from '../data/gear';
import { CopperOre, PoisonClaw, SilverOre } from '../data/materials';
import { Antidote, Bandages, basicArrow, explosiveArrow, fireArrow, poisonArrow } from './items';

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

export const cPickaxeRecipe: Recipe = {
    item: CopperPickaxe,
    ingredients:[
        {
            material: CopperOre,
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

export const basicArrowRecipe: Recipe = {
    item: basicArrow,
    ingredients:[
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