import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EmpresaComponent } from './pages/configuraciones/empresa/empresa.component';
import { RolComponent } from './pages/configuraciones/rol/rol.component';
import { MenuComponent } from './components/menu/menu.component';
import { RecibidosComponent } from './pages/documentos/recibidos/recibidos.component';
import { RecibidosEmpresaComponent } from './pages/documentos_empresa/recibidos/recibidos.component';
import { EmitidosEmpresaComponent } from './pages/documentos_empresa/emitidos/emitidos.component';
import { UsuarioComponent } from './pages/configuraciones/usuario/usuario.component';
import { GeneralComponent } from './pages/configuraciones/general/general.component';
import { ReporteDocumentosNotificadosComponent } from './pages/reportes/email/reporte-documentos-notificados/reporte-documentos-notificados.component';
import { ReporteRecibidosPorAnioComponent } from './pages/reportes/empresa/reporte-recibidos-por-anio/reporte-recibidos-por-anio.component';
import { ReporteEmitidosPorAnioComponent } from './pages/reportes/empresa/reporte-emitidos-por-anio/reporte-emitidos-por-anio.component';

const routes: Routes = [
  {
    path: '',
    component: MenuComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'configuraciones',
        children: [
          { path: 'general', component: GeneralComponent },
          { path: 'empresa', component: EmpresaComponent },
          { path: 'usuario', component: UsuarioComponent },
          { path: 'rol', component: RolComponent },
          { path: '**', redirectTo: 'general' },
        ]
       },
       { path: 'documentos',
        children: [
          { path: 'recibidos', component: RecibidosComponent },
          { path: '**', redirectTo: 'recibidos' },
        ]
       },
       { path: 'documentosempresa',
        children: [
          { path: 'recibidos', component: RecibidosEmpresaComponent },
          { path: 'emitidos', component: EmitidosEmpresaComponent },
          { path: '**', redirectTo: 'recibidos' },
        ]
       },
       { path: 'reportes',
        children: [
          { path: 'empresarecibidos', component: ReporteRecibidosPorAnioComponent },
          { path: 'empresaemitidos', component: ReporteEmitidosPorAnioComponent },
          { path: 'email', component: ReporteDocumentosNotificadosComponent },
          { path: '**', redirectTo: 'empresarecibidos' },
        ]
       },
      { path: '**', redirectTo: 'dashboard' },
    ]
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtectedRoutingModule { }
