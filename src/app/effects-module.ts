import { EffectsModule } from "@ngrx/effects";
import { effects } from "../ngrx/effects/all-effects";

export const effectsModule = EffectsModule.forRoot(effects);