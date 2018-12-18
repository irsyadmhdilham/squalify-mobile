import { EffectsModule } from "@ngrx/effects";
import { effects } from "../store/effects/all-effects";

export const effectsModule = EffectsModule.forRoot(effects);