

const key = process.env.key;

export async function getStaticProps() {
    const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${key}&q=London`);
    const data = await res.json();
  
    return {
      props: { data },
      revalidate: 10, // Revalidate every 10 seconds
    };
  }
  
  export default function StaticRendering({ data }) {
    return (
      <div>
        <h1>Data from API</h1>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  }