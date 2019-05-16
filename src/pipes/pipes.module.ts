import { NgModule } from '@angular/core';
import { NumCommasPipe } from './num-commas/num-commas';
import { ChatMembersFilterPipe } from './chat-members-filter/chat-members-filter';
import { InboxDuplicatePipe } from './inbox-duplicate/inbox-duplicate';
import { DateRangePipe } from './date-range/date-range';
@NgModule({
	declarations: [
        NumCommasPipe,
        ChatMembersFilterPipe,
        InboxDuplicatePipe,
    DateRangePipe
    ],
	imports: [],
	exports: [
        NumCommasPipe,
        ChatMembersFilterPipe,
        InboxDuplicatePipe,
    DateRangePipe
    ]
})
export class PipesModule {}
