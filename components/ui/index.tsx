export default function Home() {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: "url('ombre-bg.png')" }} // Replace with your filename
      >
        <div className="px-6 bg-white/70 p-6 rounded-xl shadow-lg">
          <h1 className="text-5xl md:text-6xl font-semibold text-gray-900">
            Two Hearts,<br />one closet.
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            No more ‘what are you wearing?’ texts.
          </p>
        </div>
      </div>
    );
  }
  
  // files I added as of july 2 : index. tsx + landing. tsx + ombre-bg.png 