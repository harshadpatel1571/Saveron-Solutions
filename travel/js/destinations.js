const DESTINATIONS=[['Ladakh',
'mountain adventure luxury',
'High-altitude landscapes and private road journeys',
'destination-ladakh.html',
'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'],
['Kashmir',
'mountain family honeymoon luxury',
'Lakes, valleys and refined mountain stays',
'packages.html',
'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80'],
['Himachal Pradesh',
'mountain family adventure',
'Mountain towns and restorative stays',
'packages.html',
'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=800&q=80'],
['Rajasthan',
'heritage luxury family',
'Palaces, living heritage and desert landscapes',
'packages.html',
'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80'],
['Kerala',
'family luxury honeymoon',
'Backwaters, green hills and the coast',
'packages.html',
'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80'],
['Goa',
'beach luxury short family',
'Coastal retreats, dining and culture',
'packages.html',
'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'],
['North East India',
'mountain adventure long',
'Distinctive landscapes and layered culture',
'packages.html',
'https://images.unsplash.com/photo-1581791534721-e599df4417f7?auto=format&fit=crop&w=800&q=80'],
['Andaman',
'beach honeymoon family',
'Island stays, clear water and soft adventure',
'packages.html',
'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80']];
document.addEventListener('DOMContentLoaded',
()=> {
  let filter='all';
  const grid=document.querySelector('#destination-grid'),
  search=document.querySelector('#dest-search');
  const render=()=> {
    const q=search.value.toLowerCase();
    const list=DESTINATIONS.filter(d=>(filter==='all'||d[1].includes(filter))&&d[0].toLowerCase().includes(q));
    grid.innerHTML=list.map(d=>`<article class="destination-card"><div class="media"><img loading="lazy" src="${d[4]}" alt="${d[0]} destination landscape"></div><div class="card-body"><h3>${d[0]}</h3><p>${d[2]}</p><a class="text-link" href="${d[3]}">Explore destination</a></div></article>`).join('')||'<p>No destinations match your search.</p>'
  };
  search.oninput=render;
  document.querySelectorAll('[data-dest-filter]').forEach(b=>b.onclick=()=> {
    filter=b.dataset.destFilter;
    document.querySelectorAll('[data-dest-filter]').forEach(x=>x.classList.toggle('active',
    x===b));
    render()
  });
  render()
});
