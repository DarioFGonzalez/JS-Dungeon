import { Recipe } from '../types/global';
import { Dagger1, Sword1, CopperPickaxe } from '../data/gear';
import { CopperOre, SilverOre } from '../data/materials';

export const daggerRecipe: Recipe = {
    item: Dagger1,
    ingredients:[
    {
        material: CopperOre,
        quantity: 3
    },],
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
            quantity: 4
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