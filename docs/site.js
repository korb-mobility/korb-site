/*! © Transfer. Alle Rechte vorbehalten. Vervielfältigung, Weitergabe oder Nutzung dieses Codes,
    auch in Teilen, nur mit schriftlicher Genehmigung von Transfer. */
/* Everything you may want to change is in this block. */
var CONFIG = {
  // Set to true once the Genehmigung is granted: shows the ride request and the ride sections.
  licensed: true,
  // Set to false before publishing: removes the blue preview bar and the demo note.
  preview: false,
  whatsapp: "4915777104912",
  pricing: {
    // Always a little below Uber, more on short trips: Uber about 20 EUR -> here about 16,
    // Uber about 57 EUR (26.8 km, 26 min) -> here about 50, Uber about 70 -> here about 63.
    // Checked against UberX in Stuttgart (Nov 2026): 3.4 km 8.93 -> here 8.12; 26.8 km 57 -> 49.34.
    base: 0.5,
    perKm: 1.58,
    perMin: 0.25,
    minFare: 7,
    roundUpTo: 0.1,
    // From this distance the price is shown with an invitation to ask for a better offer.
    longKm: 60,
    parkingPerDay: 7,
    // Extra per minute of delay caused by traffic, on top of perMin.
    trafficPerMin: 0.20,
    // Rush hours, Monday to Friday: the fare is multiplied by factor.
    peak: { factor: 1.15, days: [1, 2, 3, 4, 5], windows: [["08:00", "10:00"], ["15:30", "17:30"]] }
  },
  // Parcel transport stays hidden until the business is registered for it.
  parcels: false,
  // Online payment: your PayPal.me name (paypal.me/NAME). Empty hides the option.
  // The request then carries a pay link with the amount, which you send on after confirming.
  paypalMe: "",
  // Bookings into the driver app: an address that accepts the booking as JSON. Empty: WhatsApp only.
  // The key in the address is the public one; it only allows sending a booking.
  bookingsEndpoint: "https://qdrwssvwlpbloqnnyrzk.supabase.co/rest/v1/rpc/book?apikey=sb_publishable_hLvHm_ujPZSNsEoxoiEdiw_2h7lTKjC",
  services: {
    // Free TomTom key (distance and live traffic). Empty: no price, the request goes straight to WhatsApp.
    trafficKey: "Xzl9mut4JQuFweqIwy07a9OMZnsWfte6",
    traffic: "https://api.tomtom.com/routing/1/calculateRoute/",
    // Free, no key. demoRoute has no traffic and is only used in the preview.
    search: "https://photon.komoot.io/api/",
    backupSearch: "https://api.tomtom.com/search/2/search/",
    reverse: "https://photon.komoot.io/reverse",
    demoRoute: "https://router.project-osrm.org/route/v1/driving/",
    mapStyle: "https://tiles.openfreemap.org/styles/positron"
  }
};

var PLACES = {
  fra1: { label: "Flughafen Stuttgart, Flughafenstraße 32, 70629 Stuttgart", lat: 48.6899, lon: 9.1920 },
  fra2: { label: "Schlossplatz, 70173 Stuttgart", lat: 48.7784, lon: 9.1800 },
  hbf: { label: "Stuttgart Hauptbahnhof, Arnulf-Klett-Platz 2, 70173 Stuttgart", lat: 48.7840, lon: 9.1817 },
  messe: { label: "Messe Stuttgart, Messepiazza 1, 70629 Stuttgart", lat: 48.6936, lon: 9.1935 }
};

var EN = {
  tagline: "Private hire car with driver in Stuttgart.",
  ctaWa: "Message on WhatsApp",
  ctaSave: "Save contact",
  ctaCall: "Call",
  copyNumber: "Copy number",
  soonTitle: "Starting soon",
  soonLead: "Rides start as soon as our licence is granted.",
  soonBody: "Save our number now. We take rides from the day we start.",
  bookTitle: "Where can we take you?",
  heroLead: "See your price straight away. Request the ride right here. We confirm in person.",
  navHow: "How it works",
  navAir: "Airport",
  navBiz: "Companies",
  navFaq: "Questions",
  how1T: "Address",
  parcel: "Parcel instead of a passenger (same price)",
  parking: "Park my car while I am away (7 € a day)",
  returnDate: "Back on",
  parkNote: "Space in a closed, guarded car park. You rent the space only; we are not liable for damage to the car.",
  factPeak: "Rush hour",
  peakVal: "+15 %",
  q9: "Why is it dearer at some times?",
  a9: "Monday to Friday from 8:00 to 10:00 and from 15:30 to 17:30 there is a 15 % rush hour surcharge. Time lost in traffic is also charged per minute. You always see the final price before you send.",
  factPark: "Parking",
  factTotal: "Total with parking",
  servTitle: "More than rides",
  serv1N: "Parcels", serv1T: "Parcels and documents",
  serv1: "We take your parcel from door to door at the same price as a ride.",
  serv2N: "Parking", serv3N: "Long distance", serv2T: "Airport with parking",
  serv2: "Your car stays in a closed, guarded car park for 7 € a day while you travel, and we drive you to the airport. You rent the space only; we are not liable for damage to the car.",
  serv3T: "Long trips",
  serv3: "You see the price straight away. Message us and we will try to make you a better offer.",
  servCta: "Ask on WhatsApp",
  how2T: "Price",
  how3T: "Request",
  whenLegend: "When do you want to ride?",
  asap: "As soon as possible",
  later: "Choose a time",
  swap: "Swap pick-up and destination",
  quoteClass: "Comfort and Premium",
  quoteSeats: "Up to 4 people, with driver",
  factKm: "Distance",
  factMin: "Driving time",
  factTraffic: "Traffic",
  factArrive: "Arrival approx.",
  forOther: "I am booking for someone else",
  resTitle: "Choose date and time",
  resNext: "Next",
  paxName: "Passenger's name",
  paxPhone: "Passenger's phone",
  benTitle: "Plan your ride ahead",
  ben1T: "Price before you send",
  ben1: "You see the distance, driving time, traffic and final price before you message us.",
  ben2T: "Your pick-up time",
  ben2: "You choose the day and time. We confirm the ride in person by phone or WhatsApp.",
  ben3T: "Time to get in",
  ben3: "5 minutes of waiting are included; at the airport, 45 minutes after landing.",
  ben4T: "Cancel free of charge",
  ben4: "You pay nothing up to 1 hour before pick-up.",
  airCta: "See the price to the airport",
  q8: "Where does the traffic data come from?",
  a8: "From TomTom. For a ride now we use current traffic; for a later time, the usual traffic at that hour.",
  from: "Pick-up",
  to: "Destination",
  addrPh: "Enter an address",
  locate: "Use my location",
  chipAir: "Airport",
  chipCity: "Schlossplatz",
  chipHbf: "Central Station",
  chipMesse: "Trade fair",
  date: "Date",
  time: "Time",
  people: "People",
  flight: "Flight number (optional)",
  childseat: "Child seat needed",
  send: "Request ride",
  preorder: "All our rides are booked in advance. Your ride is booked once a driver accepts it. You see that here, live.",
  custName: "Your name",
  custPhone: "Phone (for questions)",
  sentTitle: "Request sent",
  sentWa: "Also write on WhatsApp",
  sentNew: "New request",
  howTitle: "How to book",
  how1: "Enter pick-up and destination.",
  how2: "See the price with traffic, choose the time.",
  how3: "Add your name and phone, send it. You see live when the driver accepts and where they are.",
  airTitle: "Stuttgart Airport",
  airLead: "Book your ride to or from the airport in advance.",
  air1: "Give us your flight number at pick-up so we can plan around your arrival.",
  air2: "After landing we wait 45 minutes at no extra charge.",
  air3: "Cancel free of charge up to 1 hour before pick-up.",
  classTitle: "Vehicle class",
  classLead: "We drive in the Comfort and Premium class.",
  classBody: "In other ride apps this matches the Comfort and Premium categories.",
  classLegal: "Private hire with driver under sec.\u00a049\u00a0(4)\u00a0PBefG.",
  safeTitle: "Safety",
  safe1: "The car is checked every week.",
  safe2: "We check the driving licence and passenger transport permit before the first shift and at least every quarter after that.",
  safe3: "As soon as the driver accepts, you see their name and the number plate.",
  bizTitle: "For companies",
  bizLead: "Rides for staff and guests, with one invoice per month.",
  bizCta: "Ask for a company account on WhatsApp",
  biz1: "Your team books here on the site as usual and adds the company name in the chat.",
  pdf: "Save offer as PDF",
  pay: "Payment",
  payCash: "Cash in the car",
  payCard: "Card in the car",
  payOnline: "Online in advance (PayPal, card)",
  flightNote: "We track your flight. If it lands late, we pick you up later at no extra charge.",
  biz2: "At the end of the month you get one invoice listing every ride with date, route and passenger.",
  biz3: "No cash, no single receipts, no minimum spend.",
  bizCompany: "Company",
  bizName: "Contact person",
  bizEmail: "Email for invoices",
  bizRides: "Rides per month, roughly",
  faqTitle: "Questions",
  q10: "I lost something at the airport.",
  q11: "Can someone follow my ride live?",
  a11: "Yes. During the ride tap “Share ride”. Whoever opens the link sees the driver, car and arrival live but cannot change anything.",
  shareRide: "Share ride",
  q1: "How is the price set?",
  a1: "From the distance and driving time of your route, so traffic counts too. You see the final price including VAT before you send.",
  q2: "Can I get in on the street?",
  a2: "No. As a private hire car we may only drive bookings received in advance.",
  q3: "How much luggage fits?",
  a3: "4 large suitcases with 4 people. For more luggage, message us first.",
  q4: "How long does the driver wait?",
  a4: "5 minutes from the agreed time at no charge; at the airport, 45 minutes after landing.",
  q5: "How can I pay?",
  a5: "Cash in the car.",
  q6: "Can I get an invoice?",
  a6: "Yes. Send us your billing address on WhatsApp.",
  q7: "I left something in the car.",
  a7: "Message us on WhatsApp with the date and route of your ride.",
  placeTitle: "Registered base",
  openMap: "Open in maps",
  share: "Share page",
  scanTitle: "Get it on your phone",
  scanWa: "Scan to open WhatsApp",
  scanSave: "Scan to save the contact",
  privacy: "Privacy",
  wComment: "Comment (optional)",
  chatPh: "Message to the driver …",
  extras: "Extras: another pick-up time, child seat, offer, flight …",
  offerOnly: "Only ask for an offer (no fixed ride yet)",
  shareLoc: "Share my location with the driver",
  sharedLoc: "Your driver can see where you are right now.",
  chatSend: "Send",
  wRate: "Send rating",
  wCancel: "Cancel ride"
};

var EL = {
  tagline: "Ενοικιαζόμενο αυτοκίνητο με οδηγό στη Στουτγάρδη.",
  ctaWa: "Μήνυμα στο WhatsApp",
  ctaSave: "Αποθήκευση επαφής",
  ctaCall: "Κλήση",
  copyNumber: "Αντιγραφή αριθμού",
  soonTitle: "Ξεκινάμε σύντομα",
  soonLead: "Οι διαδρομές ξεκινούν μόλις εκδοθεί η άδειά μας.",
  soonBody: "Αποθηκεύστε τον αριθμό μας από τώρα. Δεχόμαστε διαδρομές από την πρώτη μέρα.",
  bookTitle: "Πού να σας πάμε;",
  heroLead: "Δείτε την τιμή αμέσως. Ζητήστε τη διαδρομή εδώ. Επιβεβαιώνουμε προσωπικά.",
  navHow: "Πώς λειτουργεί",
  navAir: "Αεροδρόμιο",
  navBiz: "Εταιρείες",
  navFaq: "Ερωτήσεις",
  how1T: "Διεύθυνση",
  parcel: "Δέμα αντί για επιβάτη (ίδια τιμή)",
  parking: "Στάθμευση του αυτοκινήτου μου όσο λείπω (7 € τη μέρα)",
  returnDate: "Επιστροφή στις",
  parkNote: "Θέση σε κλειστό, φυλασσόμενο πάρκινγκ. Νοικιάζετε μόνο τη θέση· δεν ευθυνόμαστε για ζημιές στο αυτοκίνητο.",
  factPeak: "Ώρα αιχμής",
  peakVal: "+15 %",
  q9: "Γιατί κάποιες ώρες είναι ακριβότερα;",
  a9: "Δευτέρα με Παρασκευή 8:00 με 10:00 και 15:30 με 17:30 ισχύει προσαύξηση ώρας αιχμής 15 %. Ο χρόνος που χάνεται στην κίνηση χρεώνεται επίσης ανά λεπτό. Βλέπετε πάντα την τελική τιμή πριν στείλετε.",
  factPark: "Στάθμευση",
  factTotal: "Σύνολο με στάθμευση",
  servTitle: "Κάτι παραπάνω από διαδρομές",
  serv1N: "Δέματα", serv1T: "Δέματα και έγγραφα",
  serv1: "Πηγαίνουμε το δέμα σας από πόρτα σε πόρτα, στην τιμή μιας διαδρομής.",
  serv2N: "Στάθμευση", serv3N: "Μεγάλη απόσταση", serv2T: "Αεροδρόμιο με στάθμευση",
  serv2: "Το αυτοκίνητό σας μένει σε κλειστό, φυλασσόμενο πάρκινγκ για 7 € τη μέρα όσο ταξιδεύετε, και σας πάμε στο αεροδρόμιο. Νοικιάζετε μόνο τη θέση· δεν ευθυνόμαστε για ζημιές στο αυτοκίνητο.",
  serv3T: "Μεγάλες αποστάσεις",
  serv3: "Βλέπετε την τιμή αμέσως. Στείλτε μας μήνυμα και θα προσπαθήσουμε να σας κάνουμε καλύτερη προσφορά.",
  servCta: "Ρωτήστε στο WhatsApp",
  how2T: "Τιμή",
  how3T: "Αίτημα",
  whenLegend: "Πότε θέλετε να ταξιδέψετε;",
  asap: "Το συντομότερο",
  later: "Επιλογή ώρας",
  swap: "Αλλαγή παραλαβής και προορισμού",
  quoteClass: "Comfort και Premium",
  quoteSeats: "Έως 4 άτομα, με οδηγό",
  factKm: "Απόσταση",
  factMin: "Χρόνος διαδρομής",
  factTraffic: "Κίνηση",
  factArrive: "Άφιξη περίπου",
  forOther: "Κλείνω για κάποιον άλλο",
  resTitle: "Διαλέξτε μέρα και ώρα",
  resNext: "Συνέχεια",
  paxName: "Όνομα επιβάτη",
  paxPhone: "Τηλέφωνο επιβάτη",
  benTitle: "Οργανώστε τη διαδρομή σας από πριν",
  ben1T: "Τιμή πριν στείλετε",
  ben1: "Βλέπετε απόσταση, χρόνο, κίνηση και τελική τιμή πριν μας στείλετε.",
  ben2T: "Η ώρα παραλαβής σας",
  ben2: "Διαλέγετε μέρα και ώρα. Επιβεβαιώνουμε προσωπικά, τηλεφωνικά ή στο WhatsApp.",
  ben3T: "Χρόνος για να μπείτε",
  ben3: "Περιλαμβάνονται 5 λεπτά αναμονής· στο αεροδρόμιο 45 λεπτά μετά την προσγείωση.",
  ben4T: "Δωρεάν ακύρωση",
  ben4: "Δεν πληρώνετε τίποτα έως 1 ώρα πριν την παραλαβή.",
  airCta: "Δείτε την τιμή ως το αεροδρόμιο",
  q8: "Από πού έρχονται τα στοιχεία κίνησης;",
  a8: "Από την TomTom. Για διαδρομή τώρα χρησιμοποιούμε την τρέχουσα κίνηση· για αργότερα, τη συνηθισμένη κίνηση εκείνης της ώρας.",
  from: "Παραλαβή",
  to: "Προορισμός",
  addrPh: "Πληκτρολογήστε διεύθυνση",
  locate: "Χρήση της τοποθεσίας μου",
  chipAir: "Αεροδρόμιο",
  chipCity: "Schlossplatz",
  chipHbf: "Κεντρικός σταθμός",
  chipMesse: "Έκθεση (Messe)",
  date: "Ημερομηνία",
  time: "Ώρα",
  people: "Άτομα",
  flight: "Αριθμός πτήσης (προαιρετικά)",
  childseat: "Χρειάζομαι παιδικό κάθισμα",
  send: "Ζήτηση διαδρομής",
  preorder: "Οι διαδρομές μας κλείνονται πάντα από πριν. Η διαδρομή ισχύει μόλις τη δεχτεί ο οδηγός.",
  custName: "Το όνομά σας",
  custPhone: "Τηλέφωνο (για ερωτήσεις)",
  sentTitle: "Το αίτημα στάλθηκε",
  sentWa: "Γράψτε μας και στο WhatsApp",
  sentNew: "Νέο αίτημα",
  howTitle: "Πώς κλείνετε",
  how1: "Βάλτε παραλαβή και προορισμό.",
  how2: "Δείτε την τιμή με την κίνηση, διαλέξτε ώρα.",
  how3: "Όνομα και τηλέφωνο, αποστολή. Βλέπετε ζωντανά πότε τη δέχεται ο οδηγός.",
  airTitle: "Αεροδρόμιο Στουτγάρδης",
  airLead: "Κλείστε από πριν τη διαδρομή προς ή από το αεροδρόμιο.",
  air1: "Δώστε μας τον αριθμό πτήσης για να προσαρμοστούμε στην άφιξή σας.",
  air2: "Μετά την προσγείωση περιμένουμε 45 λεπτά χωρίς επιπλέον χρέωση.",
  air3: "Δωρεάν ακύρωση έως 1 ώρα πριν την παραλαβή.",
  classTitle: "Κατηγορία οχήματος",
  classLead: "Οδηγούμε στην κατηγορία Comfort και Premium.",
  classBody: "Σε άλλες εφαρμογές αντιστοιχεί στις κατηγορίες Comfort και Premium.",
  classLegal: "Ενοικιαζόμενο όχημα με οδηγό κατά § 49 (4) PBefG.",
  safeTitle: "Ασφάλεια",
  safe1: "Το αυτοκίνητο ελέγχεται κάθε εβδομάδα.",
  safe2: "Ελέγχουμε το δίπλωμα και την άδεια μεταφοράς επιβατών πριν την πρώτη βάρδια και τουλάχιστον κάθε τρίμηνο.",
  safe3: "Μόλις ο οδηγός δεχτεί τη διαδρομή, βλέπετε το όνομά του και την πινακίδα.",
  bizTitle: "Για εταιρείες",
  bizLead: "Διαδρομές για προσωπικό και επισκέπτες, με ένα τιμολόγιο τον μήνα.",
  bizCta: "Ζητήστε εταιρικό λογαριασμό στο WhatsApp",
  biz1: "Η ομάδα σας κλείνει εδώ όπως πάντα και γράφει το όνομα της εταιρείας στο μήνυμα.",
  pdf: "Αποθήκευση προσφοράς ως PDF",
  pay: "Πληρωμή",
  payCash: "Μετρητά στο αυτοκίνητο",
  payCard: "Κάρτα στο αυτοκίνητο",
  payOnline: "Online από πριν (PayPal, κάρτα)",
  flightNote: "Παρακολουθούμε την πτήση σας. Αν καθυστερήσει, σας παραλαμβάνουμε αργότερα χωρίς χρέωση.",
  biz2: "Στο τέλος του μήνα λαμβάνετε ένα τιμολόγιο με όλες τις διαδρομές, ημερομηνία, διαδρομή και επιβάτη.",
  biz3: "Χωρίς μετρητά, χωρίς μεμονωμένες αποδείξεις, χωρίς ελάχιστη χρέωση.",
  bizCompany: "Εταιρεία",
  bizName: "Υπεύθυνος επικοινωνίας",
  bizEmail: "Email για τιμολόγια",
  bizRides: "Διαδρομές τον μήνα, περίπου",
  faqTitle: "Ερωτήσεις",
  q10: "Έχασα κάτι στο αεροδρόμιο.",
  q11: "Μπορεί κάποιος να βλέπει τη διαδρομή μου live;",
  a11: "Ναι. Κατά τη διαδρομή πατήστε «Κοινοποίηση διαδρομής». Όποιος ανοίξει τον σύνδεσμο βλέπει οδηγό, αυτοκίνητο και άφιξη live, χωρίς να μπορεί να αλλάξει κάτι.",
  shareRide: "Κοινοποίηση διαδρομής",
  q1: "Πώς βγαίνει η τιμή;",
  a1: "Από την απόσταση και τον χρόνο της διαδρομής, άρα μετράει και η κίνηση. Βλέπετε την τελική τιμή με ΦΠΑ πριν στείλετε.",
  q2: "Μπορώ να μπω στο δρόμο;",
  a2: "Όχι. Ως ενοικιαζόμενο όχημα με οδηγό εκτελούμε μόνο κρατήσεις που έχουν γίνει από πριν.",
  q3: "Πόσες αποσκευές χωράνε;",
  a3: "4 μεγάλες βαλίτσες με 4 άτομα. Για περισσότερες, γράψτε μας πρώτα.",
  q4: "Πόσο περιμένει ο οδηγός;",
  a4: "5 λεπτά από τη συμφωνημένη ώρα χωρίς χρέωση· στο αεροδρόμιο 45 λεπτά μετά την προσγείωση.",
  q5: "Πώς πληρώνω;",
  a5: "Μετρητά στο αυτοκίνητο.",
  q6: "Μπορώ να πάρω τιμολόγιο;",
  a6: "Ναι. Στείλτε μας τη διεύθυνση τιμολόγησης στο WhatsApp.",
  q7: "Ξέχασα κάτι στο αυτοκίνητο.",
  a7: "Γράψτε μας στο WhatsApp με ημερομηνία και διαδρομή.",
  placeTitle: "Έδρα",
  openMap: "Άνοιγμα σε χάρτες",
  share: "Κοινοποίηση σελίδας",
  scanTitle: "Στο κινητό σας",
  scanWa: "Σκανάρετε για WhatsApp",
  scanSave: "Σκανάρετε για αποθήκευση επαφής",
  privacy: "Απόρρητο",
  wComment: "Σχόλιο (προαιρετικά)",
  chatPh: "Μήνυμα στον οδηγό …",
  extras: "Επιπλέον: άλλη ώρα παραλαβής, παιδικό κάθισμα, προσφορά, πτήση …",
  offerOnly: "Μόνο αίτημα προσφοράς (όχι ακόμα σταθερή διαδρομή)",
  shareLoc: "Κοινοποίηση της θέσης μου στον οδηγό",
  sharedLoc: "Ο οδηγός βλέπει πού βρίσκεστε τώρα.",
  chatSend: "Αποστολή",
  wRate: "Αποστολή αξιολόγησης",
  wCancel: "Ακύρωση διαδρομής"
};

var TEXT = {
  de: {
    greet: "Hallo,", biz: "Hallo, wir interessieren uns für Fahrten für unser Unternehmen.", bizReq: "Anfrage Firmenkonto mit Monatsrechnung", company: "Firma", contact: "Ansprechperson", email: "E-Mail", rides: "Fahrten pro Monat",
    copied: "Kopiert", offerNote: "Nur Angebot gewünscht, noch keine feste Fahrt.", wSearch: "Wir suchen einen Fahrer …", wSearchSub: "Bleiben Sie auf dieser Seite. Sobald ein Fahrer annimmt, sehen Sie ihn hier.", wLeft: "Noch {m}:{s} Min.", wLater: "Anfrage eingegangen", wLaterSub: "Sobald ein Fahrer Ihre Fahrt annimmt, sehen Sie es hier. Bei Fragen rufen wir Sie unter {phone} an.", wAccepted: "{name} hat Ihre Fahrt angenommen", wComing: "{name} ist unterwegs zu Ihnen", wEta: "Ankunft in ca. {n} Min.", wArrived: "{name} ist da", wArrivedSub: "Ihr Fahrer wartet am Abholort.", wPicked: "Gute Fahrt!", wDone: "Wie war Ihre Fahrt, {name}?", wThanks: "Danke für Ihre Bewertung.", wExpired: "Gerade ist kein Fahrer frei", wExpiredSub: "Rufen Sie uns an oder schreiben Sie uns, wir finden eine Lösung.", wCancelled: "Fahrt storniert", wNoShow: "Fahrt beendet: Sie waren nach 5 Minuten Wartezeit nicht am Abholort. Wartegebühr: {fee}.", wDriverCancelled: "Ihr Fahrer musste die Fahrt absagen. Bitte fragen Sie neu an oder rufen Sie uns an.", wCancelAsk: "Fahrt wirklich stornieren?", wPlate: "Kennzeichen", name: "Name", phone: "Telefon", sending: "Wird gesendet …", sentText: "Danke, {name}. Wir melden uns in wenigen Minuten unter {phone} und bestätigen Ihre Fahrt.", sendFail: "Die Anfrage konnte nicht gesendet werden. Wir öffnen WhatsApp, damit sie trotzdem ankommt.", request: "Fahrtanfrage", from: "Abholung", to: "Ziel", date: "Datum", time: "Uhrzeit", people: "Personen", flight: "Flug", childseat: "Kindersitz gewünscht", price: "Angezeigter Preis", flightLive: "Live-Status", payLabel: "Bezahlung", payNames: { cash: "Bar im Fahrzeug", card: "Karte im Fahrzeug", online: "Online vorab" }, payLink: "Zahllink", pdfTitle: "Angebot für Ihre Fahrt", pdfNo: "Nr.", pdfMade: "Erstellt am", pdfKm: "Strecke", pdfMin: "Fahrzeit", pdfFare: "Fahrpreis", pdfPark: "Parken", pdfNote: "Unverbindliches Angebot, Endpreis inkl. MwSt. Die Fahrt gilt, sobald ein Fahrer sie angenommen hat. Den Beleg über die gefahrene Fahrt erhalten Sie nach der Fahrt.", pdfLegal: "Mietwagen mit Fahrer nach § 49 Abs. 4 PBefG", 
    finalPrice: "Endpreis inkl. MwSt., mit dem aktuellen Verkehr.", finalPriceLater: "Endpreis inkl. MwSt., mit dem üblichen Verkehr zu dieser Uhrzeit.", noDelay: "frei", peakMsg: "Stoßzeit-Zuschlag enthalten.", longNote: "Bei langen Strecken machen wir Ihnen gern ein besseres Angebot. Schreiben Sie uns.", longMsg: "Lange Strecke: Ich freue mich über ein Angebot.", parcelService: "Service: Pakettransport (kein Fahrgast)", parkWish: "Auto parken, solange ich weg bin", until: "bis", parkLine: "{n} Tage × 7 € = {sum}", total: "Gesamt", delay: "+{n} Min.", whenLabel: "Zeit", asap: "So früh wie möglich",
    demo: "Vorschau: Beispieltarif ohne Verkehrsdaten.", working: "Route wird berechnet", failed: "Den Preis nennen wir Ihnen auf WhatsApp.", noAddress: "Adresse nicht gefunden. Bitte prüfen Sie die Eingabe.",
    tooFar: "Für so lange Strecken machen wir Ihnen ein Angebot auf WhatsApp.", noLocation: "Ihr Standort ist nicht verfügbar. Bitte geben Sie die Adresse ein.", myLocation: "Mein Standort", minutes: "Min.", locale: "de-DE"
  },
  en: {
    greet: "Hello,", biz: "Hello, we are interested in rides for our company.", bizReq: "Company account request with monthly invoice", company: "Company", contact: "Contact person", email: "Email", rides: "Rides per month",
    copied: "Copied", offerNote: "Only an offer wanted, no fixed ride yet.", wSearch: "Looking for a driver …", wSearchSub: "Stay on this page. As soon as a driver accepts, you see them here.", wLeft: "{m}:{s} min left.", wLater: "Request received", wLaterSub: "As soon as a driver accepts your ride, you see it here. If we have questions we call you at {phone}.", wAccepted: "{name} accepted your ride", wComing: "{name} is on the way to you", wEta: "Arriving in about {n} min.", wArrived: "{name} is here", wArrivedSub: "Your driver is waiting at the pick-up point.", wPicked: "Enjoy your ride!", wDone: "How was your ride, {name}?", wThanks: "Thank you for your rating.", wExpired: "No driver is free right now", wExpiredSub: "Call or message us and we will find a solution.", wCancelled: "Ride cancelled", wNoShow: "Ride ended: you were not at the pick-up after 5 minutes of waiting. Waiting fee: {fee}.", wDriverCancelled: "Your driver had to cancel the ride. Please request again or call us.", wCancelAsk: "Cancel this ride?", wPlate: "Plate", name: "Name", phone: "Phone", sending: "Sending …", sentText: "Thank you, {name}. We will get back to you at {phone} within a few minutes to confirm your ride.", sendFail: "The request could not be sent. We are opening WhatsApp so it still reaches us.", request: "Ride request", from: "Pick-up", to: "Destination", date: "Date", time: "Time", people: "People", flight: "Flight", childseat: "Child seat needed", price: "Price shown", flightLive: "live status", payLabel: "Payment", payNames: { cash: "Cash in the car", card: "Card in the car", online: "Online in advance" }, payLink: "Pay link", pdfTitle: "Offer for your ride", pdfNo: "No.", pdfMade: "Created on", pdfKm: "Distance", pdfMin: "Driving time", pdfFare: "Fare", pdfPark: "Parking", pdfNote: "Non-binding offer, final price including VAT. Your ride is booked once a driver accepts it. You receive the receipt for the ride after the ride.", pdfLegal: "Private hire with driver under sec. 49 (4) PBefG", 
    finalPrice: "Final price including VAT, with current traffic.", finalPriceLater: "Final price including VAT, with the usual traffic at this hour.", noDelay: "clear", peakMsg: "Rush hour surcharge included.", longNote: "For long trips we are happy to make you a better offer. Message us.", longMsg: "Long trip: I would welcome an offer.", parcelService: "Service: parcel transport (no passenger)", parkWish: "Park my car while I am away", until: "until", parkLine: "{n} days × 7 € = {sum}", total: "Total", delay: "+{n} min", whenLabel: "Time", asap: "As soon as possible",
    demo: "Preview: sample tariff without traffic data.", working: "Calculating your route", failed: "We will send you the price on WhatsApp.", noAddress: "Address not found. Please check what you entered.",
    tooFar: "For trips this long we make you an individual offer on WhatsApp.", noLocation: "Your location is not available. Please enter the address.", myLocation: "My location", minutes: "min", locale: "en-GB"
  },
  el: {
    greet: "Γεια σας,", biz: "Γεια σας, μας ενδιαφέρουν διαδρομές για την εταιρεία μας.", bizReq: "Αίτημα εταιρικού λογαριασμού με μηνιαίο τιμολόγιο", company: "Εταιρεία", contact: "Υπεύθυνος", email: "Email", rides: "Διαδρομές τον μήνα",
    copied: "Αντιγράφηκε", offerNote: "Μόνο προσφορά, όχι ακόμα σταθερή διαδρομή.", wSearch: "Ψάχνουμε οδηγό …", wSearchSub: "Μείνετε σε αυτή τη σελίδα. Μόλις τη δεχτεί οδηγός, θα τον δείτε εδώ.", wLeft: "Απομένουν {m}:{s} λεπτά.", wLater: "Το αίτημα ελήφθη", wLaterSub: "Μόλις κάποιος οδηγός δεχτεί τη διαδρομή, θα το δείτε εδώ. Για ερωτήσεις θα σας καλέσουμε στο {phone}.", wAccepted: "Ο/Η {name} δέχτηκε τη διαδρομή σας", wComing: "Ο/Η {name} έρχεται προς εσάς", wEta: "Άφιξη σε περίπου {n} λεπτά.", wArrived: "Ο/Η {name} έφτασε", wArrivedSub: "Ο οδηγός σας περιμένει στο σημείο παραλαβής.", wPicked: "Καλό ταξίδι!", wDone: "Πώς ήταν η διαδρομή σας, {name};", wThanks: "Ευχαριστούμε για την αξιολόγηση.", wExpired: "Αυτή τη στιγμή δεν υπάρχει διαθέσιμος οδηγός", wExpiredSub: "Καλέστε μας ή γράψτε μας και θα βρούμε λύση.", wCancelled: "Η διαδρομή ακυρώθηκε", wNoShow: "Η διαδρομή έληξε: δεν ήσασταν στο σημείο μετά από 5 λεπτά αναμονής. Χρέωση αναμονής: {fee}.", wDriverCancelled: "Ο οδηγός χρειάστηκε να ακυρώσει. Ζητήστε ξανά ή καλέστε μας.", wCancelAsk: "Να ακυρωθεί η διαδρομή;", wPlate: "Πινακίδα", name: "Όνομα", phone: "Τηλέφωνο", sending: "Αποστολή …", sentText: "Ευχαριστούμε, {name}.", sendFail: "Το αίτημα δεν στάλθηκε. Ανοίγουμε το WhatsApp για να φτάσει σε εμάς.", request: "Αίτημα διαδρομής", from: "Παραλαβή", to: "Προορισμός", date: "Ημερομηνία", time: "Ώρα", people: "Άτομα", flight: "Πτήση", childseat: "Χρειάζομαι παιδικό κάθισμα", price: "Τιμή που εμφανίστηκε", flightLive: "ζωντανά", payLabel: "Πληρωμή", payNames: { cash: "Μετρητά στο αυτοκίνητο", card: "Κάρτα στο αυτοκίνητο", online: "Online από πριν" }, payLink: "Σύνδεσμος πληρωμής", pdfTitle: "Προσφορά για τη διαδρομή σας", pdfNo: "Αρ.", pdfMade: "Δημιουργήθηκε", pdfKm: "Απόσταση", pdfMin: "Χρόνος", pdfFare: "Κόμιστρο", pdfPark: "Στάθμευση", pdfNote: "Μη δεσμευτική προσφορά, τελική τιμή με ΦΠΑ. Η διαδρομή ισχύει μόλις τη δεχτεί οδηγός. Την απόδειξη τη λαμβάνετε μετά τη διαδρομή.", pdfLegal: "Ενοικιαζόμενο όχημα με οδηγό κατά § 49 (4) PBefG",
    finalPrice: "Τελική τιμή με ΦΠΑ, με την τρέχουσα κίνηση.", finalPriceLater: "Τελική τιμή με ΦΠΑ, με τη συνηθισμένη κίνηση εκείνης της ώρας.", noDelay: "ελεύθερη", peakMsg: "Περιλαμβάνεται προσαύξηση ώρας αιχμής.", longNote: "Για μεγάλες αποστάσεις σας κάνουμε ευχαρίστως καλύτερη προσφορά. Γράψτε μας.", longMsg: "Μεγάλη απόσταση: θα ήθελα μια προσφορά.", parcelService: "Υπηρεσία: μεταφορά δέματος (χωρίς επιβάτη)", parkWish: "Στάθμευση του αυτοκινήτου όσο λείπω", until: "έως", parkLine: "{n} μέρες × 7 € = {sum}", total: "Σύνολο", delay: "+{n} λεπ.", whenLabel: "Ώρα", asap: "Το συντομότερο",
    demo: "Προεπισκόπηση: δείγμα τιμής χωρίς στοιχεία κίνησης.", working: "Υπολογισμός διαδρομής", failed: "Την τιμή θα σας τη στείλουμε στο WhatsApp.", noAddress: "Η διεύθυνση δεν βρέθηκε. Ελέγξτε τι γράψατε.",
    tooFar: "Για τόσο μεγάλες αποστάσεις σας κάνουμε προσφορά στο WhatsApp.", noLocation: "Η τοποθεσία σας δεν είναι διαθέσιμη. Πληκτρολογήστε τη διεύθυνση.", myLocation: "Η τοποθεσία μου", minutes: "λεπ.", locale: "el-GR"
  }
};

var body = document.body;
var params = new URLSearchParams(location.search);
var form = document.getElementById("book");
var statusEl = document.getElementById("status");
var resultEl = document.getElementById("result");
var lang = "de";
var DICT = { en: EN, el: EL };
var german = {};
var picked = { from: null, to: null };
var trip = null;
var routeRun = 0;
var routeDone = Promise.resolve();
// Prices need the traffic service; the preview can also show them with sample data.
var priceOn = !!CONFIG.services.trafficKey || CONFIG.preview;

function store(key, value) {
  try {
    if (value === undefined) return localStorage.getItem(key);
    localStorage.setItem(key, value);
  } catch (e) { return null; }
}

function waLink(message) {
  return "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(message);
}

function setLang(next) {
  lang = next;
  document.documentElement.lang = next;
  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    var key = el.getAttribute("data-i18n");
    if (!(key in german)) german[key] = el.textContent;
    var dict = DICT[next];
    el.textContent = dict && dict[key] ? dict[key] : german[key];
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
    var key = el.getAttribute("data-i18n-ph");
    if (!(key in german)) german[key] = el.placeholder;
    var dict = DICT[next];
    el.placeholder = dict && dict[key] ? dict[key] : german[key];
  });
  document.querySelectorAll("[data-lang]").forEach(function (b) {
    b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === next));
  });
  document.querySelectorAll(".js-wa").forEach(function (a) { a.href = waLink(TEXT[next].greet); });
  document.querySelectorAll(".js-wa-biz").forEach(function (a) { a.href = waLink(TEXT[next].biz); });
  store("t-lang", next);
  showPrice();
}

function toast(message) {
  var t = document.getElementById("toast");
  t.textContent = message;
  t.classList.add("on");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(function () { t.classList.remove("on"); }, 1800);
}

function copy(text) {
  var done = function () { toast(TEXT[lang].copied); };
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(done);
  } else {
    var area = document.createElement("textarea");
    area.value = text;
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
    done();
  }
}

/* Price */

function rideStart() {
  if (form.mode.value === "later" && form.date.value && form.time.value) return new Date(form.date.value + "T" + form.time.value + ":00");
  return new Date();
}

// True when the ride starts in a rush hour window.
function isPeak() {
  var p = CONFIG.pricing.peak, when = rideStart();
  if (!p || p.days.indexOf(when.getDay()) < 0) return false;
  var hm = ("0" + when.getHours()).slice(-2) + ":" + ("0" + when.getMinutes()).slice(-2);
  return p.windows.some(function (w) { return hm >= w[0] && hm < w[1]; });
}

function trafficDelay(t) {
  return Math.max(t.minutes - t.freeMinutes, 0);
}

function priceFor(t) {
  var p = CONFIG.pricing;
  var amount = Math.max(p.base + t.km * p.perKm + t.minutes * p.perMin + trafficDelay(t) * p.trafficPerMin, p.minFare);
  if (isPeak()) amount *= p.peak.factor;
  amount = Math.ceil(amount / p.roundUpTo - 1e-9) * p.roundUpTo;
  return Math.round(amount * 100) / 100;
}

function money(amount) {
  return new Intl.NumberFormat(TEXT[lang].locale, { style: "currency", currency: "EUR" }).format(amount);
}

function showPrice() {
  if (!trip || !priceOn) { resultEl.hidden = true; return; }
  var t = TEXT[lang];
  var fare = priceFor(trip);
  var park = parkingCost();
  document.getElementById("price").textContent = money(fare);
  var later = form.mode.value === "later";
  var delay = Math.round(trafficDelay(trip));
  var when = departure();
  document.getElementById("q-km").textContent = trip.km.toFixed(1).replace(".", lang === "de" ? "," : ".") + " km";
  document.getElementById("q-min").textContent = Math.round(trip.minutes) + " " + t.minutes;
  document.getElementById("q-traffic").textContent = delay ? t.delay.replace("{n}", delay) : t.noDelay;
  document.getElementById("q-peak-row").hidden = !isPeak();
  document.getElementById("q-arrive-row").hidden = !(later && when);
  if (later && when) {
    document.getElementById("q-arrive").textContent = new Date(new Date(when).getTime() + trip.minutes * 60000).toLocaleTimeString(t.locale, { hour: "2-digit", minute: "2-digit" });
  }
  document.getElementById("q-park-row").hidden = !park;
  document.getElementById("q-total-row").hidden = !park;
  if (park) {
    document.getElementById("q-park").textContent = t.parkLine.replace("{n}", park.days).replace("{sum}", money(park.sum));
    document.getElementById("q-total").textContent = money(fare + park.sum);
  }
  var note = trip.demo ? t.demo : (later ? t.finalPriceLater : t.finalPrice);
  if (trip.km > CONFIG.pricing.longKm) note += " " + t.longNote;
  document.getElementById("price-note").textContent = note;
  document.getElementById("sticky-price").textContent = money(fare + (park ? park.sum : 0));
  stickySync();
  resultEl.hidden = false;
}

// Parking while away: whole days from the ride day to the return day, at least one.
function parkingCost() {
  if (!form.parking.checked || !form.returnDate.value) return null;
  var start = form.mode.value === "later" && form.date.value ? form.date.value : new Date().toISOString().slice(0, 10);
  var days = Math.max(1, Math.round((new Date(form.returnDate.value) - new Date(start)) / 86400000));
  return { days: days, sum: days * CONFIG.pricing.parkingPerDay };
}

// Offer as PDF: fill a print-only sheet and open the print dialog, where "Save as PDF" is offered.
function esc(v) {
  return String(v).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
}
function printOffer() {
  if (!trip) return;
  var t = TEXT[lang];
  var now = new Date();
  var pad = function (n) { return String(n).padStart(2, "0"); };
  var no = "K-" + now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate()) + "-" + pad(now.getHours()) + pad(now.getMinutes());
  var later = form.mode.value === "later";
  var fare = priceFor(trip), park = parkingCost(), fl = flightCode();
  var rows = [
    [t.from, form.from.value.trim()],
    [t.to, form.to.value.trim()],
    [t.whenLabel, later && form.date.value ? new Date(form.date.value + "T" + (form.time.value || "00:00")).toLocaleString(t.locale, { dateStyle: "full", timeStyle: "short" }) : t.asap],
    [t.people, form.parcel.checked ? t.parcelService : form.people.value],
    [t.pdfKm, document.getElementById("q-km").textContent],
    [t.pdfMin, document.getElementById("q-min").textContent]
  ];
  if (fl) rows.push([t.flight, fl.label]);
  if (form.childseat.checked) rows.push([t.childseat, "✓"]);
  var sums = [[t.pdfFare, money(fare)]];
  if (isPeak()) sums.push(["", t.peakMsg]);
  if (park) sums.push([t.pdfPark, t.parkLine.replace("{n}", park.days).replace("{sum}", money(park.sum))], [t.total, money(fare + park.sum)]);
  var table = function (list) { return list.map(function (r) { return "<tr><th>" + esc(r[0]) + "</th><td>" + esc(r[1]) + "</td></tr>"; }).join(""); };
  document.getElementById("print-sheet").innerHTML =
    '<header><p class="ps-mark">Transfer<span></span></p><p>Transfer<br>+49 1577 7104912</p></header>' +
    "<h1>" + esc(t.pdfTitle) + "</h1>" +
    '<p class="ps-meta">' + esc(t.pdfNo) + " " + no + " · " + esc(t.pdfMade) + " " + esc(now.toLocaleString(t.locale, { dateStyle: "medium", timeStyle: "short" })) + "</p>" +
    "<table>" + table(rows) + "</table>" +
    '<table class="ps-sum">' + table(sums) + "</table>" +
    '<p class="ps-note">' + esc(t.pdfNote) + "</p>" +
    '<footer>' + esc(t.pdfLegal) + "</footer>";
  var title = document.title;
  document.title = "Transfer-" + no;
  window.print();
  document.title = title;
}
document.getElementById("pdf").addEventListener("click", printOffer);

/* Map */

var map = null;

function loadMap() {
  var box = document.getElementById("map");
  var script = document.createElement("script");
  script.src = "assets/vendor/maplibre-gl.js";
  script.onerror = function () { box.classList.add("off"); };
  script.onload = function () {
    try {
      var created = new maplibregl.Map({
        container: box,
        style: CONFIG.services.mapStyle,
        center: [9.18, 48.78],
        zoom: 10.5,
        attributionControl: { compact: true },
        cooperativeGestures: true,
        dragRotate: false,
        locale: {
          "CooperativeGesturesHandler.WindowsHelpText": "Zum Zoomen Strg gedrückt halten und scrollen",
          "CooperativeGesturesHandler.MacHelpText": "Zum Zoomen ⌘ gedrückt halten und scrollen",
          "CooperativeGesturesHandler.MobileHelpText": "Karte mit zwei Fingern bewegen"
        }
      });
      created.on("load", function () {
        // Keep the credits behind their info button so they do not cover the route.
        var credits = box.querySelector(".maplibregl-ctrl-attrib");
        if (credits) {
          credits.classList.remove("maplibregl-compact-show");
          credits.removeAttribute("open");
        }
        created.addSource("route", { type: "geojson", data: emptyLine() });
        created.addSource("points", { type: "geojson", data: emptyPoints() });
        created.addLayer({ id: "route", type: "line", source: "route", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#3ddc84", "line-width": 4 } });
        created.addLayer({ id: "points", type: "circle", source: "points", paint: {
          "circle-radius": 8,
          "circle-color": ["get", "color"],
          "circle-stroke-color": "#000",
          "circle-stroke-width": 2
        } });
        map = created;
        drawMap();
      });
      created.on("error", function (e) {
        if (!map && e.error && /style/i.test(String(e.error.message))) box.classList.add("off");
      });
    } catch (e) {
      box.classList.add("off");
    }
  };
  document.head.appendChild(script);
}

function emptyLine() {
  return { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [] } };
}

function emptyPoints() {
  return { type: "FeatureCollection", features: [] };
}

function drawMap() {
  if (!map) return;
  var features = [];
  var bounds = new maplibregl.LngLatBounds();
  [["from", "#ffffff"], ["to", "#3ddc84"]].forEach(function (pair) {
    var place = picked[pair[0]];
    if (!place) return;
    features.push({ type: "Feature", properties: { color: pair[1] }, geometry: { type: "Point", coordinates: [place.lon, place.lat] } });
    bounds.extend([place.lon, place.lat]);
  });
  var line = trip && trip.coords ? trip.coords : [];
  line.forEach(function (c) { bounds.extend(c); });
  map.getSource("points").setData({ type: "FeatureCollection", features: features });
  map.getSource("route").setData({ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: line } });
  if (features.length === 1 && !line.length) {
    map.easeTo({ center: features[0].geometry.coordinates, zoom: 13 });
  } else if (features.length) {
    map.fitBounds(bounds, { padding: 44, maxZoom: 14, duration: 500 });
  }
}

if ("IntersectionObserver" in window) {
  new IntersectionObserver(function (entries, observer) {
    if (entries.some(function (e) { return e.isIntersecting; })) {
      observer.disconnect();
      loadMap();
    }
  }, { rootMargin: "300px" }).observe(document.getElementById("map"));
} else {
  loadMap();
}

/* Route */

function departure() {
  if (form.mode.value !== "later") return null;
  if (!form.date.value || !form.time.value) return null;
  var when = new Date(form.date.value + "T" + form.time.value + ":00");
  return when.getTime() > Date.now() + 120000 ? form.date.value + "T" + form.time.value + ":00" : null;
}

function fetchTrip() {
  var s = CONFIG.services, a = picked.from, b = picked.to;
  if (s.trafficKey) {
    var when = departure();
    var url = s.traffic + a.lat + "," + a.lon + ":" + b.lat + "," + b.lon + "/json?traffic=true&travelMode=car&computeTravelTimeFor=all&key=" + encodeURIComponent(s.trafficKey) + (when ? "&departAt=" + encodeURIComponent(when) : "");
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error("route");
      return r.json();
    }).then(function (data) {
      var route = data.routes[0];
      var coords = [];
      route.legs.forEach(function (leg) {
        leg.points.forEach(function (p) { coords.push([p.longitude, p.latitude]); });
      });
      var free = route.summary.noTrafficTravelTimeInSeconds;
      var minutes = route.summary.travelTimeInSeconds / 60;
      return { km: route.summary.lengthInMeters / 1000, minutes: minutes, freeMinutes: free ? free / 60 : minutes, coords: coords, demo: false };
    });
  }
  if (!CONFIG.preview) return Promise.reject(new Error("no route service"));
  return fetch(s.demoRoute + a.lon + "," + a.lat + ";" + b.lon + "," + b.lat + "?overview=simplified&geometries=geojson").then(function (r) {
    if (!r.ok) throw new Error("route");
    return r.json();
  }).then(function (data) {
    var route = data.routes[0];
    return { km: route.distance / 1000, minutes: route.duration / 60, freeMinutes: route.duration / 60, coords: route.geometry.coordinates, demo: true };
  });
}

function updateRoute() {
  var run = ++routeRun;
  trip = null;
  resultEl.hidden = true;
  statusEl.textContent = "";
  stickySync();
  drawMap();
  routeDone = Promise.resolve();
  if (!picked.from || !picked.to) return;
  // Without a price the addresses are still shown on the map; there is nothing to calculate.
  if (!priceOn) return;
  statusEl.textContent = TEXT[lang].working;
  routeDone = fetchTrip().then(function (found) {
    if (run !== routeRun) return;
    trip = found;
    statusEl.textContent = "";
    drawMap();
    showPrice();
  }).catch(function () {
    if (run === routeRun) statusEl.textContent = TEXT[lang].failed;
  });
}

/* Address fields */

function labelOf(p) {
  var street = p.street ? p.street + (p.housenumber ? " " + p.housenumber : "") : "";
  var first = p.name && p.name !== street ? p.name : "";
  var place = [p.postcode, p.city || p.town || p.village].filter(Boolean).join(" ");
  return [first, street, place].filter(Boolean).join(", ");
}

// Also used by the customer account to set a saved place.
window.tPick = function (key, place) { choose(key, place); };
window.labelOf = labelOf;

function choose(key, place) {
  picked[key] = place;
  document.getElementById(key).value = place.label;
  closeList(key);
  // Address chosen: the keyboard goes away so the ride list can be seen.
  document.getElementById(key).blur();
  updateRoute();
}

function closeList(key) {
  var list = document.getElementById(key + "-list");
  list.hidden = true;
  list.innerHTML = "";
  document.getElementById(key).setAttribute("aria-expanded", "false");
}

function showList(key, places) {
  var list = document.getElementById(key + "-list");
  list.innerHTML = "";
  places.forEach(function (place) {
    var li = document.createElement("li");
    li.setAttribute("role", "option");
    li.textContent = place.label;
    // A finger, a mouse or a pen: whichever comes first picks the address (a tap that scrolls the list picks nothing).
    var take = function (e) { if (e.cancelable) e.preventDefault(); if (li.taken) return; li.taken = true; choose(key, place); };
    li.addEventListener("mousedown", take);
    li.addEventListener("click", take);
    list.appendChild(li);
  });
  list.hidden = !places.length;
  document.getElementById(key).setAttribute("aria-expanded", String(!!places.length));
}

function photonSearch(query) {
  var url = CONFIG.services.search + "?limit=8&lat=48.78&lon=9.18&lang=" + (lang === "de" ? "de" : "en") + "&q=" + encodeURIComponent(query);
  var abort = new AbortController();
  var timer = setTimeout(function () { abort.abort(); }, 2500);
  return fetch(url, { signal: abort.signal }).then(function (r) {
    clearTimeout(timer);
    if (!r.ok) throw new Error("search");
    return r.json();
  }).then(function (data) {
    return (data.features || []).filter(function (f) {
      return f.properties.countrycode === "DE";
    }).map(function (f) {
      return { label: labelOf(f.properties), lat: f.geometry.coordinates[1], lon: f.geometry.coordinates[0] };
    });
  });
}

function tomtomSearch(query) {
  var s = CONFIG.services;
  var url = s.backupSearch + encodeURIComponent(query) + ".json?typeahead=true&limit=5&countrySet=DE&lat=48.78&lon=9.18&language=" + (lang === "de" ? "de-DE" : "en-GB") + "&key=" + encodeURIComponent(s.trafficKey);
  return fetch(url).then(function (r) {
    if (!r.ok) throw new Error("search");
    return r.json();
  }).then(function (data) {
    return (data.results || []).map(function (r) {
      var address = r.address.freeformAddress;
      return {
        label: r.poi && r.poi.name ? r.poi.name + ", " + address : address,
        lat: r.position.lat, lon: r.position.lon,
        street: r.type === "Street" ? r.address.streetName : null,
        number: r.address.streetNumber || null
      };
    });
  });
}

// TomTom gives the best German addresses; Photon steps in if TomTom fails.
// Stuttgart results come first, and a typed house number is kept when only the street is known.
function lookup(query) {
  var number = (query.match(/\b(\d+\s?[a-zA-Z]?)\s*$/) || query.match(/\b(\d+\s?[a-zA-Z]?)\b/) || [])[1];
  return tomtomSearch(query).catch(function () { return []; }).then(function (places) {
    return places.length ? places : photonSearch(query).catch(function () { return []; });
  }).then(function (places) {
    var seen = {};
    return places.map(function (place, i) {
      var inCity = /Stuttgart/.test(place.label) ? 0 : 1;
      if (number && place.street && !place.number) {
        place.label = place.label.replace(place.street, place.street + " " + number.replace(/\s/g, ""));
      }
      return { place: place, rank: inCity * 100 + i };
    }).sort(function (a, b) { return a.rank - b.rank; }).map(function (r) { return r.place; }).filter(function (place) {
      if (!place.label || seen[place.label]) return false;
      seen[place.label] = true;
      return true;
    }).slice(0, 5);
  });
}

function search(key, query) {
  var input = document.getElementById(key);
  lookup(query).then(function (places) {
    if (input.value !== query || document.activeElement !== input) return;
    showList(key, places);
  }).catch(function () { closeList(key); });
}

// A typed address that was not tapped in the list still gets a route and a price.
function resolveTyped(key, force) {
  var input = document.getElementById(key);
  var query = input.value;
  if (picked[key] || !query.trim()) return Promise.resolve();
  return lookup(query).then(function (places) {
    if (picked[key] || input.value !== query || (!force && document.activeElement === input)) return;
    if (places.length) choose(key, places[0]);
    else statusEl.textContent = TEXT[lang].noAddress;
  }).catch(function () {
    if (input.value === query) statusEl.textContent = TEXT[lang].noAddress;
  });
}

["from", "to"].forEach(function (key) {
  var input = document.getElementById(key);
  var timer;
  input.addEventListener("input", function () {
    if (picked[key]) {
      picked[key] = null;
      updateRoute();
    }
    clearTimeout(timer);
    if (!input.value.trim()) { closeList(key); return; }
    timer = setTimeout(function () { if (input.value.trim().length >= 3) search(key, input.value); }, 280);
  });
  // A pasted address (copied from a message or a map app) is looked up at once and taken as it is.
  // The text is taken from the clipboard ourselves: a field drops line breaks, which glues
  // "Tübinger Straße 15" and "70178 Stuttgart" into one wrong number.
  input.addEventListener("paste", function (e) {
    var raw = e.clipboardData && e.clipboardData.getData("text");
    if (raw) {
      e.preventDefault();
      input.value = raw.replace(/\s*[\r\n]+\s*/g, ", ").replace(/,?\s*(Deutschland|Germany|Γερμανία)\s*$/i, "").replace(/\s+/g, " ").trim();
    }
    setTimeout(function () {
      var query = input.value.trim();
      if (query.length < 5) return;
      clearTimeout(timer);
      if (picked[key]) { picked[key] = null; updateRoute(); }
      lookup(query).then(function (places) {
        if (input.value !== query || !places.length) return;
        choose(key, places[0]);
      }).catch(function () {});
    }, 0);
  });
  input.addEventListener("keydown", function (e) {
    var list = document.getElementById(key + "-list");
    var items = Array.prototype.slice.call(list.children);
    if (!items.length) return;
    var at = items.findIndex(function (li) { return li.getAttribute("aria-selected") === "true"; });
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (at >= 0) items[at].removeAttribute("aria-selected");
      at = e.key === "ArrowDown" ? (at + 1) % items.length : (at - 1 + items.length) % items.length;
      items[at].setAttribute("aria-selected", "true");
    } else if (e.key === "Enter" && at >= 0) {
      e.preventDefault();
      items[at].dispatchEvent(new MouseEvent("mousedown", { cancelable: true }));
    } else if (e.key === "Escape") {
      closeList(key);
    }
  });
  input.addEventListener("blur", function () {
    setTimeout(function () {
      closeList(key);
      resolveTyped(key);
    }, 120);
  });
});

document.querySelectorAll("[data-place]").forEach(function (b) {
  b.addEventListener("click", function () {
    // Fills the empty field; with both filled, a tap replaces the destination.
    choose(b.getAttribute("data-target") || (document.getElementById("from").value.trim() ? "to" : "from"), PLACES[b.getAttribute("data-place")]);
    if (b.getAttribute("data-target")) {
      document.getElementById("fahrt").scrollIntoView();
      document.getElementById(picked.from ? "send" : "from").focus({ preventScroll: true });
    }
  });
});

document.getElementById("swap").addEventListener("click", function () {
  var from = document.getElementById("from"), to = document.getElementById("to");
  var place = picked.from, text = from.value;
  picked.from = picked.to;
  from.value = to.value;
  picked.to = place;
  to.value = text;
  updateRoute();
});

Array.prototype.forEach.call(form.elements.mode, function (radio) {
  radio.addEventListener("change", function () {
    document.getElementById("later-row").hidden = form.mode.value !== "later";
    updateRoute();
  });
});

document.getElementById("locate").addEventListener("click", function () {
  var fail = function () { statusEl.textContent = TEXT[lang].noLocation; };
  if (!navigator.geolocation) { fail(); return; }
  navigator.geolocation.getCurrentPosition(function (pos) {
    var lat = pos.coords.latitude, lon = pos.coords.longitude;
    var place = { label: TEXT[lang].myLocation, lat: lat, lon: lon };
    fetch(CONFIG.services.reverse + "?lat=" + lat + "&lon=" + lon + "&lang=" + (lang === "de" ? "de" : "en")).then(function (r) { return r.json(); }).then(function (data) {
      if (data.features && data.features[0]) place.label = labelOf(data.features[0].properties);
    }).catch(function () {}).then(function () { choose("from", place); });
  }, fail, { timeout: 8000 });
});

document.querySelectorAll("[data-feature=parcels]").forEach(function (el) { el.hidden = !CONFIG.parcels; });
// Hidden options still show in Safari's picker, so the option is removed instead.
if (!CONFIG.paypalMe) document.querySelectorAll("[data-feature=online-pay]").forEach(function (el) { el.remove(); });

form.parcel.addEventListener("change", function () {
  form.people.disabled = form.parcel.checked;
});
form.parking.addEventListener("change", function () {
  document.getElementById("return-row").hidden = !form.parking.checked;
  form.returnDate.min = form.date.value || form.date.min;
  showPrice();
});
form.returnDate.addEventListener("change", showPrice);

// With live traffic the price depends on when the ride starts.
form.date.addEventListener("change", function () { if (CONFIG.services.trafficKey) updateRoute(); });
// The rush hour surcharge also follows the clock for a ride "as soon as possible".
setInterval(function () { if (trip && form.mode.value !== "later") showPrice(); }, 60000);
form.time.addEventListener("change", function () { if (CONFIG.services.trafficKey) updateRoute(); });

(function presetTime() {
  var d = new Date(Date.now() + 60 * 60 * 1000);
  var pad = function (n) { return String(n).padStart(2, "0"); };
  var day = d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  form.date.min = day;
  form.date.value = day;
  form.time.value = pad(d.getHours()) + ":" + pad(d.getMinutes());
})();

// "lh123", "LH 123" and "lh  0123" all become "LH 123"; anything else is passed on as typed.
function flightCode() {
  var raw = form.flight.value.trim().toUpperCase();
  if (!raw) return null;
  var m = raw.replace(/\s+/g, "").match(/^([A-Z0-9]{2}|[A-Z]{3})(\d{1,4}[A-Z]?)$/);
  if (!m) return { label: raw, slug: encodeURIComponent(raw.replace(/\s+/g, "").toLowerCase()) };
  var num = m[2].replace(/^0+(?=\d)/, "");
  return { label: m[1] + " " + num, slug: (m[1] + num).toLowerCase() };
}
form.flight.addEventListener("input", function () {
  document.getElementById("flight-note").hidden = !form.flight.value.trim();
});
form.flight.addEventListener("blur", function () {
  var fl = flightCode();
  if (fl) form.flight.value = fl.label;
});

function sendRequest() {
  var t = TEXT[lang];
  var later = form.mode.value === "later";
  var lines = [
    t.request,
    t.name + ": " + form.name.value.trim(),
    t.phone + ": " + form.phone.value.trim(),
    t.from + ": " + form.from.value.trim(),
    t.to + ": " + form.to.value.trim()
  ];
  if (later) {
    lines.push(t.date + ": " + form.date.value, t.time + ": " + form.time.value);
  } else {
    lines.push(t.whenLabel + ": " + t.asap);
  }
  if (form.parcel.checked) lines.push(t.parcelService);
  else lines.push(t.people + ": " + form.people.value);
  var fl = flightCode();
  if (fl) lines.push(t.flight + ": " + fl.label + " (" + t.flightLive + ": https://www.flightradar24.com/data/flights/" + fl.slug + ")");
  if (form.childseat.checked) lines.push(t.childseat);
  var park = parkingCost();
  if (form.parking.checked) lines.push(t.parkWish + (form.returnDate.value ? " " + t.until + " " + form.returnDate.value : "") + (park ? ": " + t.parkLine.replace("{n}", park.days).replace("{sum}", money(park.sum)) : ""));
  lines.push(t.payLabel + ": " + t.payNames[form.pay.value]);
  if (trip && priceOn) {
    var fare = priceFor(trip);
    lines.push(t.price + ": " + money(fare));
    if (form.pay.value === "online" && CONFIG.paypalMe) lines.push(t.payLink + ": https://paypal.me/" + CONFIG.paypalMe + "/" + (fare + (park ? park.sum : 0)).toFixed(2) + "EUR");
    if (park) lines.push(t.total + ": " + money(fare + park.sum));
    if (isPeak()) lines.push(t.peakMsg);
    if (trip.km > CONFIG.pricing.longKm) lines.push(t.longMsg);
  }
  var message = lines.join("\n");
  var wa = waLink(message);
  if (!CONFIG.bookingsEndpoint) { location.href = wa; return; }

  var button = document.getElementById("send");
  button.disabled = true;
  setStatus(t.sending);
  sendToApp(later, fl, park).then(function (answer) {
    button.disabled = false;
    setStatus("");
    window.tLiveStart(answer.token, {
      name: form.name.value.trim(), phone: form.phone.value.trim(), wa: wa,
      when: later ? form.date.value + "T" + form.time.value : "asap"
    });
  }, function () {
    button.disabled = false;
    setStatus(t.sendFail);
    setTimeout(function () { location.href = wa; }, 1500);
  });
}

function setStatus(text) {
  var el = document.getElementById("status");
  if (el) el.textContent = text;
}

// The booking goes straight into the driver app. Resolves once the server has stored it.
function sendToApp(later, fl, park) {
  var data = {
    createdAt: new Date().toISOString(),
    lang: lang,
    name: form.name.value.trim(),
    phone: form.phone.value.trim(),
    note: [window.tClassNote ? window.tClassNote() : null, form.offer && form.offer.checked ? TEXT[lang].offerNote : null,
           form.forOther && form.forOther.checked && form.paxName.value.trim()
             ? "Fahrgast / Passenger: " + form.paxName.value.trim() + (form.paxPhone.value.trim() ? ", " + form.paxPhone.value.trim() : "") : null]
          .filter(Boolean).join(" · ") || null,
    from: { text: form.from.value.trim(), lat: picked.from && picked.from.lat, lon: picked.from && picked.from.lon },
    to: { text: form.to.value.trim(), lat: picked.to && picked.to.lat, lon: picked.to && picked.to.lon },
    when: later ? form.date.value + "T" + form.time.value : "asap",
    people: Number(form.people.value),
    flight: fl ? fl.label : null,
    childSeat: form.childseat.checked,
    parcel: form.parcel.checked,
    parking: park ? { returnDate: form.returnDate.value, days: park.days, sum: park.sum } : null,
    payment: form.pay.value,
    km: trip ? trip.km : null,
    minutes: trip ? trip.minutes : null,
    price: trip && priceOn ? priceFor(trip) : null
  };
  var abort = "AbortController" in window ? new AbortController() : null;
  if (abort) setTimeout(function () { abort.abort(); }, 12000);
  // text/plain keeps this a simple request, so no CORS preflight is needed.
  return fetch(CONFIG.bookingsEndpoint, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(data),
    signal: abort ? abort.signal : undefined
  }).then(function (res) {
    if (!res.ok) throw new Error("HTTP " + res.status);
    return res.json();
  }).then(function (answer) {
    if (!answer || !answer.token) throw new Error("no token");
    return answer;
  });
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  // A typed address may still be on its way to a route: wait briefly so the price is in the message.
  var ready = Promise.all([resolveTyped("from", true), resolveTyped("to", true)]).then(function () { return routeDone; });
  var limit = new Promise(function (done) { setTimeout(done, 4000); });
  Promise.race([ready, limit]).then(sendRequest, sendRequest);
});

var sendInView = false;
// While the keyboard is up (a field has focus) the bottom bar hides, so it never covers name or phone.
var typing = false;
document.addEventListener("focusin", function (e) { if (e.target.matches("input, textarea, select")) { typing = true; stickySync(); } });
document.addEventListener("focusout", function () { typing = false; setTimeout(stickySync, 150); });
function stickySync() {
  document.getElementById("sticky").hidden = !trip || sendInView || form.hidden || typing;
}
if ("IntersectionObserver" in window) {
  new IntersectionObserver(function (entries) {
    sendInView = entries[entries.length - 1].isIntersecting;
    stickySync();
  }).observe(document.getElementById("send"));
}

var bizForm = document.getElementById("biz");
if (bizForm) bizForm.addEventListener("submit", function (event) {
  event.preventDefault();
  var t = TEXT[lang];
  location.href = waLink([
    t.bizReq,
    t.company + ": " + bizForm.company.value.trim(),
    t.contact + ": " + bizForm.name.value.trim(),
    t.email + ": " + bizForm.email.value.trim(),
    t.rides + ": " + bizForm.rides.value
  ].join("\n"));
});

/* Page */

document.querySelectorAll("[data-lang]").forEach(function (b) {
  b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
});

document.querySelectorAll("[data-copy]").forEach(function (b) {
  b.addEventListener("click", function () { copy(b.getAttribute("data-copy")); });
});

var shareBtn = document.getElementById("share");
if (shareBtn) shareBtn.addEventListener("click", function () {
  if (navigator.share) {
    navigator.share({ title: "Transfer", url: location.origin + location.pathname }).catch(function () {});
  } else {
    copy(location.origin + location.pathname);
  }
});

function setLicensed(value) {
  body.setAttribute("data-licensed", String(value));
}

setLicensed(CONFIG.licensed);

if (CONFIG.preview) {
  document.getElementById("preview-bar").hidden = false;
  var box = document.getElementById("preview-licensed");
  box.addEventListener("change", function () { setLicensed(box.checked); });
  if (params.get("licensed") === "1") { box.checked = true; setLicensed(true); }
  var priceBox = document.getElementById("preview-price");
  if (params.get("price") === "0") priceOn = false;
  priceBox.checked = priceOn;
  priceBox.addEventListener("change", function () { priceOn = priceBox.checked; updateRoute(); });
}

var preferred = params.get("lang") || store("t-lang") || ((navigator.language || "de").slice(0, 2));
if (!TEXT[preferred]) preferred = "en";
setLang(preferred);

/* Booking for someone else: the passenger's name and phone go to the driver with the ride. */
(function () {
  var box = document.getElementById("for-other"), pax = document.getElementById("pax");
  if (!box || !pax) return;
  var sync = function () { pax.hidden = !box.checked; form.paxName.required = box.checked; if (box.checked) form.paxName.focus(); };
  box.addEventListener("change", sync);
})();

/* Installable on the phone's home screen; the page itself also opens without signal. */
if ("serviceWorker" in navigator && location.protocol === "https:") {
  window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
}
