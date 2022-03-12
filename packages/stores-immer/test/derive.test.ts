import { expect, it } from 'vitest'
import {writable, derive} from "../src";
import {get} from "@crikey/stores-base";

it('should derive', () => {
   const input = writable(1);
   const derived = derive(input, value => value*2);

   expect(get(derived)).toBe(2);
});
