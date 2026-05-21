async function test() {
  const res = await fetch('https://fakestoreapi.com/products/20');
  const product = await res.json();
  console.log(JSON.stringify(product, null, 2));
}

test().catch(console.error);
