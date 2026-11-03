# Korb Mobility website

Static site in `site/`: no build step, no cookies, fonts hosted locally.

Open `site/site.js` and set before going live:

- `preview: false` removes the blue preview bar
- `pricing` holds the tariff (demo values until compared with real prices)
- `services.trafficKey`: free TomTom key for distance and live traffic. Without it, the published site asks for address and date only and sends them to WhatsApp
- `licensed: true` once the Genehmigung is granted: shows the price calculator and ride sections
- `impressum.html`: add the licensing authority and licence type (§ 49 Abs. 4 PBefG) at the same time

Yellow highlighted text in `impressum.html` and `datenschutz.html` must be filled in before publishing.

Preview: `python3 -m http.server 4173 --directory site`
