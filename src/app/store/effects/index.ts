import { RouterEffects } from './router.effect';
import { AuthEffects } from './auth.effect';
import { CompanyEffects } from './company.effect';
import { CollaboratorEffects } from './collaborator.effect';
import { InstructorEffects } from './instructor.effect';

export const effects: any[] = [RouterEffects, AuthEffects, CompanyEffects, CollaboratorEffects, InstructorEffects];

export * from './router.effect';
export * from './auth.effect';
export * from './company.effect';
export * from './collaborator.effect';
export * from './instructor.effect';

