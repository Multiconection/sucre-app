# SUCRE - Plataforma de Créditos

Aplicación Next.js para la gestión de créditos, perfiles, listados y transacciones.

## Características

- ✅ Next.js 14 con App Router
- ✅ Tailwind CSS para estilos
- ✅ Integración con Supabase
- ✅ Sistema de billetera de créditos
- ✅ Gestión de perfiles
- ✅ Gestión de listados
- ✅ Historial de transacciones

## Configuración

1. Instala las dependencias:
```bash
npm install
```

2. Configura las variables de entorno en `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

3. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura de Base de Datos

### Tablas principales:

- **profiles**: Perfiles de usuarios
- **listings**: Listados de productos/servicios
- **transactions**: Historial de transacciones
- **wallet**: Billetera de créditos por perfil

## Funcionalidades de Billetera

- Agregar créditos a un perfil
- Deducir créditos de un perfil
- Consultar saldo actual
- Ver historial de transacciones
