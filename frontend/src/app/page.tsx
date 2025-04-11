export default function Home() {
  return (
    <main className="relative w-full h-screen flex flex-col items-center justify-center text-center text-white">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/images/background.jpg')" }}
      ></div>

      {/* Watermark (Oil Shine Effect) */}
      <div
        className="absolute inset-0 bg-cover pointer-events-none"
        style={{ backgroundImage: "url('/images/oil-shine.png')" }}
      ></div>

      {/* Content */}
      <section className="relative z-10 px-6">
        <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
          Monitor Your Vehicles in Real-Time
        </h1>
        <p className="mt-4 text-lg md:text-xl drop-shadow-md">
          Track emissions, GPS, fuel, and more with ease.
        </p>
        <button className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 transition rounded-lg shadow-md">
          Get Started
        </button>
      </section>

      {/* Features Section */}
      <section className="relative z-10 mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
        <div className="p-6 bg-white bg-opacity-80 rounded-lg shadow-md text-black">
          <h2 className="text-xl font-semibold">Live GPS Tracking</h2>
          <p className="mt-2 text-sms">
            See your vehicles' exact location in real-time.
          </p>
        </div>
        <div className="p-6 bg-white bg-opacity-80 rounded-lg shadow-md text-black">
          <h2 className="text-xl font-semibold">Fuel & Emissions Monitoring</h2>
          <p className="mt-2 text-sms">
            Track fuel consumption and CO2 levels instantly.
          </p>
        </div>
        <div className="p-6 bg-white bg-opacity-80 rounded-lg shadow-md text-black">
          <h2 className="text-xl font-semibold">Vehicle Status Overview</h2>
          <p className="mt-2 text-sms">
            Get a summary of vehicle health and performance.
          </p>
        </div>
      </section>
    </main>
  );
}
