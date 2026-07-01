/* Sanity connector for Purple by Harry
   Reads content + images (CDN) from the Sanity project.
   Every page uses this as an OVERRIDE: if Sanity has data it takes over,
   otherwise the page keeps its existing local content (never breaks). */
(function () {
  var CFG = { projectId: 'g3ju6n9y', dataset: 'production', v: '2023-10-01' };
  window.SANITY = CFG;

  window.sanityFetch = function (query) {
    var url = 'https://' + CFG.projectId + '.apicdn.sanity.io/v' + CFG.v +
      '/data/query/' + CFG.dataset + '?query=' + encodeURIComponent(query);
    return fetch(url, { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { return d ? d.result : null; })
      .catch(function () { return null; });
  };

  // append optimize/resize params to a Sanity image URL
  window.sImg = function (url, params) {
    if (!url) return null;
    return url + (url.indexOf('?') > -1 ? '&' : '?') + (params || 'w=1400&q=80&auto=format&fit=max');
  };

  // GROQ queries
  window.SQ = {
    site: '*[_type=="siteImages"][0]{"logo":logo.asset->url,"logoMark":logoMark.asset->url,"about":{"portrait":about.portrait.asset->url,"room":about.room.asset->url,"cats":about.cats.asset->url},"instagram":instagram[].asset->url,"varieties":{"carla":varieties.carla[].asset->url,"stripey":varieties.stripey[].asset->url,"crystal":varieties.crystal[].asset->url}}',
    social: '*[_type=="social"][0]{instagram,tiktok,facebook}',
    vault: '*[_type=="vault"][0]{max,"images":images[]{size,"img":image.asset->url}}',
    products: '*[_type=="product"]|order(order asc){"id":_id,name,lat,cat,tags,price,stock,"img":image.asset->url}',
    posts: '*[_type=="post"]|order(date desc){title,"slug":slug.current,date,excerpt,body,"cover":cover.asset->url}',
    guide: '*[_type=="guide"][0]{intro,"sections":sections[]{id,title,body}}'
  };
})();
