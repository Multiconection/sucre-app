import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">SUCRE - Plataforma de Créditos</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Link 
            href="/profiles" 
            className="p-6 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Perfiles</h2>
            <p className="text-gray-600 dark:text-gray-400">Gestiona los perfiles de usuarios</p>
          </Link>
          
          <Link 
            href="/listings" 
            className="p-6 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Listados</h2>
            <p className="text-gray-600 dark:text-gray-400">Gestiona los listados disponibles</p>
          </Link>
          
          <Link 
            href="/transactions" 
            className="p-6 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Transacciones</h2>
            <p className="text-gray-600 dark:text-gray-400">Consulta el historial de transacciones</p>
          </Link>
          
          <Link 
            href="/wallet" 
            className="p-6 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">Billetera</h2>
            <p className="text-gray-600 dark:text-gray-400">Gestiona tus créditos</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
