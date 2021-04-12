import { RouterEffects } from './router.effect';
import { AuthEffects } from './auth.effect';
import { CompanyEffects } from './company.effect';
import { CollaboratorEffects } from './collaborator.effect';
import { InstructorEffects } from './instructor.effect';
import { CustomerEffects } from './customer.effect';
import { ProductEffects } from  './product.effect'; 

export const effects: any[] = [RouterEffects, AuthEffects, CompanyEffects, CollaboratorEffects, InstructorEffects, CustomerEffects, ProductEffects];

export * from './router.effect';
export * from './auth.effect';
export * from './company.effect';
export * from './collaborator.effect';
export * from './instructor.effect';
export * from './customer.effect';
export * from './product.effect';

