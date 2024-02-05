import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProtectedRoutingModule } from './protected-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ImportMaterialModule } from '../modules/import-material.module';
import { MenuComponent } from './components/menu/menu.component';
import { EmpresaComponent } from './pages/configuraciones/empresa/empresa.component';
import { RolComponent } from './pages/configuraciones/rol/rol.component';
import { RecibidosComponent } from './pages/documentos/recibidos/recibidos.component';
import { EmitidosEmpresaComponent } from './pages/documentos_empresa/emitidos/emitidos.component';
import { RecibidosEmpresaComponent } from './pages/documentos_empresa/recibidos/recibidos.component';
import { EditEmpresaModalComponent } from './pages/configuraciones/empresa/edit-empresa-modal/edit-empresa-modal.component';
import { GeneralComponent } from './pages/configuraciones/general/general.component';
import { UsuarioComponent } from './pages/configuraciones/usuario/usuario.component';
import { EditUsuarioModalComponent } from './pages/configuraciones/usuario/edit-usuario-modal/edit-usuario-modal.component';
import { HistogramComponent } from './components/histogram/histogram.component';
import { SMTPSecurityTypeSelectComponent } from './components/smtpsecurity-type-select/smtpsecurity-type-select.component';
import { DialogTemplateComponent } from './components/dialog-template/dialog-template.component';
import { PdfViewerComponent } from './components/pdf-viewer/pdf-viewer.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { DocumentTypeSelectComponent } from './components/document-type-select/document-type-select.component';
import { EmpresaSelectComponent } from './components/empresa-select/empresa-select.component';
import { EstadoSelectComponent } from './components/estado-select/estado-select.component';

@NgModule({
  declarations: [
    DashboardComponent,
    MenuComponent,
    EmpresaComponent,
    RolComponent,
    RecibidosComponent,
    EmitidosEmpresaComponent,
    RecibidosEmpresaComponent,
    EditEmpresaModalComponent,
    GeneralComponent,
    UsuarioComponent,
    EditUsuarioModalComponent,
    HistogramComponent,
    SMTPSecurityTypeSelectComponent,
    DialogTemplateComponent,
    PdfViewerComponent,
    SpinnerComponent,
    DocumentTypeSelectComponent,
    EmpresaSelectComponent,
    EstadoSelectComponent,
  ],
  imports: [
    CommonModule,
    ProtectedRoutingModule,
    ImportMaterialModule
  ]
})
export class ProtectedModule { }
