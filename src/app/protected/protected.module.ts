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
import { SMTPSecurityTypeSelectComponent } from './components/select/smtpsecurity-type-select/smtpsecurity-type-select.component';
import { DialogTemplateComponent } from './components/dialog-template/dialog-template.component';
import { PdfViewerComponent } from './components/pdf-viewer/pdf-viewer.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { DocumentTypeSelectComponent } from './components/select/document-type-select/document-type-select.component';
import { EmpresaSelectComponent } from './components/select/empresa-select/empresa-select.component';
import { EstadoSelectComponent } from './components/select/estado-select/estado-select.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { EditRolModalComponent } from './pages/configuraciones/rol/edit-rol-modal/edit-rol-modal.component';
import { RolSelectComponent } from './components/select/rol-select/rol-select.component';
import { ReporteEmitidosPorAnioComponent } from './pages/reportes/empresa/reporte-emitidos-por-anio/reporte-emitidos-por-anio.component';
import { ReporteRecibidosPorAnioComponent } from './pages/reportes/empresa/reporte-recibidos-por-anio/reporte-recibidos-por-anio.component';
import { ReporteDocumentosNotificadosComponent } from './pages/reportes/email/reporte-documentos-notificados/reporte-documentos-notificados.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { BusinessPanelComponent } from './pages/dashboard/business-panel/business-panel.component';
import { ConsumerPanelComponent } from './pages/dashboard/consumer-panel/consumer-panel.component';

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
    PieChartComponent,
    EditRolModalComponent,
    RolSelectComponent,
    ReporteEmitidosPorAnioComponent,
    ReporteRecibidosPorAnioComponent,
    ReporteDocumentosNotificadosComponent,
    LineChartComponent,
    BusinessPanelComponent,
    ConsumerPanelComponent
  ],
  imports: [
    CommonModule,
    ProtectedRoutingModule,
    ImportMaterialModule
  ]
})
export class ProtectedModule { }
