import SvgWithText from "@/components/svg-with-text";

export default function HomePage() {
      return (
        <div
          className="min-h-screen flex flex-col items-center font-serif justify-center text-center bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('ombre-bg.svg')" }}
        >
          <SvgWithText text="No more ‘what are you wearing?’ texts." headerText="Two Hearts, one closet." />
          
        </div>
      );
    }
    
