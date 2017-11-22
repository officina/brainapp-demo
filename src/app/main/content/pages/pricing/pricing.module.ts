import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../core/modules/shared.module';

import { FusePricingStyle1Component } from './style-1/style-1.component';
import { FusePricingStyle2Component } from './style-2/style-2.component';
import { FusePricingStyle3Component } from './style-3/style-3.component';
import { ComplessivaComponent } from './style-3/leaderboards/complessiva/complessiva.component';
import { LogicaComponent } from './style-3/leaderboards/logica/logica.component';
import { CreativitaComponent } from './style-3/leaderboards/creativita/creativita.component';
import { ProblemsolvingComponent } from './style-3/leaderboards/problemsolving/problemsolving.component';
import { LablogicaComponent } from './style-3/lableaderboards/lablogica/lablogica.component';
import { LabproblemsolvingComponent } from './style-3/lableaderboards/labproblemsolving/labproblemsolving.component';
import { LabcreativitaComponent } from './style-3/lableaderboards/labcreativita/labcreativita.component';
import { LabcomplessivaComponent } from './style-3/lableaderboards/labcomplessiva/labcomplessiva.component';

const routes = [
    {
        path     : 'pages/pricing/style-1',
        component: FusePricingStyle1Component
    },
    {
        path     : 'pages/pricing/style-2',
        component: FusePricingStyle2Component
    },
    {
        path     : 'lab',
        component: FusePricingStyle3Component
    }
];

@NgModule({
    declarations: [
        FusePricingStyle1Component,
        FusePricingStyle2Component,
        FusePricingStyle3Component,
        ComplessivaComponent,
        LogicaComponent,
        CreativitaComponent,
        ProblemsolvingComponent,
        LablogicaComponent,
        LabproblemsolvingComponent,
        LabcreativitaComponent,
        LabcomplessivaComponent
    ],
    imports     : [
        SharedModule,
        RouterModule.forChild(routes)
    ]
})

export class PricingModule
{

}
