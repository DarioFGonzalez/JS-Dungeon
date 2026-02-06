import { recipe } from '../types/global';
import { Dagger1, Sword1, CopperPickaxe } from '../data/gear';
import { CopperOre, SilverOre } from '../data/materials';

export const daggerRecipe: recipe = {
    item: Dagger1,
    ingredients:[
    {
        material: CopperOre,
        quantity: 3
    },],
    selected: false
}

export const cPickaxeRecipe: recipe = {
    item: CopperPickaxe,
    ingredients:[
        {
            material: CopperOre,
            quantity: 2
        }
    ],
    selected: false
}

export const macheteRecipe: recipe = {
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
    selected: false
}