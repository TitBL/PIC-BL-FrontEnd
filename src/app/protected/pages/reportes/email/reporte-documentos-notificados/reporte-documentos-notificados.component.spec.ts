import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteDocumentosNotificadosComponent } from './reporte-documentos-notificados.component';

describe('ReporteDocumentosNotificadosComponent', () => {
  let component: ReporteDocumentosNotificadosComponent;
  let fixture: ComponentFixture<ReporteDocumentosNotificadosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReporteDocumentosNotificadosComponent]
    });
    fixture = TestBed.createComponent(ReporteDocumentosNotificadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
