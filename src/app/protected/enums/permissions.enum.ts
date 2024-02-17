export enum PermissionsEnum {

  // Configuraciones - Empresa
  VisualizarEmpresa = 10201,
  CrearEmpresa = 10202,
  EditarEmpresa = 10203,
  HabilitarDeshabilitarEmpresa = 10204,

  // Configuraciones - Usuario
  VisualizarUsuario = 10301,
  CrearUsuario = 10302,
  EditarUsuario = 10303,
  HabilitarDeshabilitarUsuario = 10304,
  AsignarEmpresasAUsuario = 10305,

  // Mis Documentos - Recibidos
  VisualizarDocumentosRecibidos = 20101,
  DescargarDocumentosRecibidos = 20102,
  EnviarPorEmailDocumentosRecibidos = 20103,

  // Documentos Empresas - Recibidos
  VisualizarDocumentosEmpresasRecibidos = 30101,
  DescargarDocumentosEmpresasRecibidos = 30102,
  EnviarPorEmailDocumentosEmpresasRecibidos = 30103,

  // Documentos Empresas - Emitidos
  VisualizarDocumentosEmpresasEmitidos = 30201,
  DescargarDocumentosEmpresasEmitidos = 30202,
  ReenviarPorEmailDocumentosEmpresasEmitidos = 30203,

  // Reportes
  Reporte1 = 40101,
  Reporte2 = 40201,
}