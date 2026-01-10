export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-tierra-500 via-tierra-400 to-esmeralda-500 overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
            Intercambia bienes y servicios con valor social
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto drop-shadow-md">
            Una economía colaborativa donde cada intercambio fortalece nuestra comunidad
          </p>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-12 text-white"
          fill="currentColor"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path d="M0,60 C300,90 600,30 900,60 C1050,75 1125,82.5 1200,90 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </section>
  )
}
