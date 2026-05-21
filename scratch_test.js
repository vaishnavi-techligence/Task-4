async function test() {
  const res = await fetch('https://fakestoreapi.com/products');
  const data = await res.json();
  data.forEach(p => {
    console.log(`ID: ${p.id} | Title: "${p.title}" | Category: "${p.category}"`);
  });
}

test().catch(console.error);
