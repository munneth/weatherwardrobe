export default function HomePage() {
      return (
        <div
          className="min-h-screen flex flex-col items-center font-serif justify-center text-center bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('ombre-bg.svg')" }}
        >
          <h1 className="text-5xl md:text-6xl font-serif font-semibold text-black">
            Two Hearts,<br />one closet.
          </h1>
          <p className="mt-4 text-lg text-black">
            No more ‘what are you wearing?’ texts.
          </p>
        </div>
      );
    }
    
