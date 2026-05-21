const product = {
  "id": 20,
  "title": "DANVOUY Womens T Shirt Casual Cotton Short",
  "price": 12.99,
  "description": "95%Cotton,5%Spandex, Features: Casual, Short Sleeve, Letter Print,V-Neck,Fashion Tees, The fabric is soft and has some stretch., Occasion: Casual/Office/Beach/School/Home/Street. Season: Spring,Summer,Autumn,Winter.",
  "category": "women's clothing",
  "image": "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_t.png",
  "rating": {
    "rate": 3.6,
    "count": 145
  }
};

const titleLower = (product.title || '').toLowerCase();
const catLower = (product.category || '').toLowerCase();

const isJewelry = catLower.includes('jewel') || titleLower.includes('ring') || titleLower.includes('bracelet') || titleLower.includes('gem') || titleLower.includes('earring');
const isClothing = catLower.includes('clothing') || titleLower.includes('gown') || titleLower.includes('kirtle') || titleLower.includes('coat') || titleLower.includes('sherwani') || titleLower.includes('tunic') || titleLower.includes('blazer') || titleLower.includes('kimono') || titleLower.includes('jacket');
const isTech = catLower.includes('electronics') || titleLower.includes('drive') || titleLower.includes('ssd') || titleLower.includes('tv') || titleLower.includes('playstation') || titleLower.includes('monitor') || titleLower.includes('audio');
const isBag = catLower.includes('bag') || titleLower.includes('backpack') || titleLower.includes('pack') || titleLower.includes('handbag') || titleLower.includes('tote');

const isGown = titleLower.includes('gown') || titleLower.includes('kirtle') || titleLower.includes('lehenga') || titleLower.includes('kimono') || titleLower.includes('dress');

console.log('isJewelry:', isJewelry);
console.log('isClothing:', isClothing);
console.log('isTech:', isTech);
console.log('isBag:', isBag);
console.log('isGown:', isGown);
