
import {from,interval,  fromEvent,map,switchMap,debounceTime,Observable,of} from 'rxjs';
import { Groceries } from './Groceries';
import * as $ from 'jquery';
import 'bootstrap';
//dohvatim image element 

const p=document.getElementById('jegaRadi');

const slikaElement = document.getElementById('slika') as HTMLImageElement;
const brojeviObservable = interval(2000);
brojeviObservable
  .pipe(
   
    map( () => {
      // Ovde možete implementirati logiku za odabir slike na osnovu emitovanog broja
      // Na primer, ako broj ima određeni značaj, postavite odgovarajuću putanju do slike
      const randomBroj = Math.floor(Math.random() * 7);
      console.log(randomBroj);
      switch (randomBroj) {
        case 0:
          return 'slike/oats.png';
        case 1:
          return 'slike1/bananas.png';
          case 2:
          return 'slike1/pancakes.png';
        case 3:
          return 'slike1/potato.png';
        case 4:
          return 'slike1/rice.png';
        case 5:
          return 'slike1/turkey.png'
        case 6:
          return 'slike1/trout.png'
        case 7:
          return 'slike1/pizza.png'
      }
    })
  )
  .subscribe({
    next: (putanjaDoSlike) => {
      // Postavite novu putanju do slike u src atribut slike
      slikaElement.src = putanjaDoSlike;
    },
    complete: () => {
      console.log('Observable je završio emitovanje.');
    }
  });
let tokSlike$:Observable<any>=interval(3000).pipe();

tokSlike$.subscribe(x=>{
  switch(x)
  {
    case 0:
      return 'slike/calculator.png'
      
  }
})
let tdePublic:number;

function zatvoriPopup() {
  const popup = document.getElementById('popup');
  console.log("uso sam u zsatvori popup");
  
  popup.style.display = 'none'; // Sakrijemo pop-up prozor
}


const dugmeOK=document.getElementById("ZatvoriPopup");
const x=document.getElementById("ZatvoriPopup1");

x.addEventListener('click',()=>
{
  zatvoriPopup();
})

dugmeOK.addEventListener('click',()=>
{
  console.log("aaa");
    zatvoriPopup();
})


const URLAdr="http://localhost:3000/groceries";
 export function getFood(foodName: string): Observable<Groceries> {
    const promise = fetch(URLAdr + "/" + foodName)
        .then(response => {
            if (!response.ok) {
                throw new Error("Food not found!");
            }
            // Prvo pročitajte telo odgovora kao JSON i sačuvajte ga u promenljivu
            return response.json();
        })
        .catch(err => {
            console.error(err);
            return ;
        });

    return from(promise);
}

let inputImeNamirniceZaBrisanje=document.getElementById('namirnicaInput') as HTMLInputElement;
const dugmeObrisiNamirnicu= document.getElementById('dugmeObrisiNamirnicu');
let namirnicaZaBrisanje:string= "";
function napraviDugme( )
{




let inputzaIme=document.querySelector('.labelUnos') as HTMLInputElement;
let inputZaKolicinu= document.querySelector('.labelGrami') as HTMLInputElement;
let kolicina:number =0;
let vrednost: string="";
const prikazProteina= document.querySelector('.prikazProteina');
const prikazHidrata= document.querySelector('.prikazHidrata');
const prikazMasti= document.querySelector('.prikazMasti');
const prikazKalorija= document.querySelector('.prikazKalorija');

const nextPageButton=document.getElementById('nextPageButton');




if (inputzaIme && inputZaKolicinu) {
 // Pratite promene u inputUnos polju
 fromEvent(inputzaIme, 'input')
   .pipe(
     debounceTime(500), // Odložite obradu događaja unosa za 500ms (polovina sekunde)
     map((ev) => (ev.target as HTMLInputElement).value.trim()),
     switchMap((unetaVrednost) => {
       // Ovde možete da obradite unetu vrednost
       if (unetaVrednost !== '') {
         return getFood(unetaVrednost); // Ovo je vaša funkcija za dobijanje podataka na osnovu unete vrednosti
       } else {
         return of(null); // Ako je vrednost prazna, vratite null (ili odgovarajuću vrednost)
       }
     })
   )
   .subscribe((x) => {
     if (x) {
       // Ovde možete da ažurirate prikaz na osnovu podataka koje dobijete
       vrednost= inputzaIme.value;
       console.log('Podaci:', x);
     }
   }, (error) => {
     console.error('Greška pri dobijanju podataka sa servera:', error);
   });

 // Pratite promene u inputGrami polju (možete ponoviti sličan postupak)
}







   
  nextPageButton.addEventListener('click', ()=>
  {
    
    const inputImeInfo= document.getElementById('infoNamirnica') as HTMLInputElement;
    const vrednostInputImeInfo=inputImeInfo.value;

    //const valueToPass= inputzaIme.value;
    const encodedValue= encodeURIComponent(vrednostInputImeInfo);
    window.location.href = `groceries-info.html?value=${encodedValue}`;
  })
   

   
  
  


   if(inputzaIme){
   inputzaIme.addEventListener('input', () => {
       vrednost= inputzaIme.value;
    console.log(vrednost);//provera
   })
} else {

    console.error('Element sa ID-om "labelUnos" nije pronađen.');
}


if (inputZaKolicinu) {
   
    fromEvent(inputZaKolicinu, 'input')
      .pipe(
        debounceTime(500), // Odloži obradu događaja unosa za 500ms (polovina sekunde)
        map((ev: InputEvent) => (<HTMLInputElement>ev.target).value.trim()),
        switchMap(unetaKolicina => {
          const parsedKolicina = parseInt(unetaKolicina, 10);
          if (!isNaN(parsedKolicina)) {
            kolicina = parsedKolicina;
           
            console.log(kolicina);
            if(unetaKolicina !=='')
            return getFood(vrednost);
          } else {
            console.error('Unesena količina nije validan broj.');
            kolicina = 0;
            prikazProteina.innerHTML = "0g";
            prikazHidrata.innerHTML = "0g";
            prikazMasti.innerHTML = "0g";
            prikazKalorija.innerHTML = "0g";
            return of(null); // Ako je količina nevalidna, prekinite lanac i vratite null
          }
        })
      )
      .subscribe((x: Groceries | null) => {
        if (x) {
          // Izračunajte i prikažite vrednosti proteina, hidrata, masti i kalorija samo ako postoje validni podaci
          let proteinNa100g = (kolicina / 100) * x.P;
          let hidratNa100g = (kolicina / 100) * x.UH;
          let mastNa100g = (kolicina / 100) * x.M;
          let kalorijeNa100g = (kolicina / 100) * x.Kcal;

          prikazProteina.innerHTML = proteinNa100g.toFixed(2) + "g";
          prikazHidrata.innerHTML = hidratNa100g.toFixed(2) + "g";
          prikazMasti.innerHTML = mastNa100g.toFixed(2) + "g";
          prikazKalorija.innerHTML = kalorijeNa100g.toFixed(2) + "Kcal";
        }
      }, (error: any) => {
        console.error('Greška pri dobijanju podataka sa servera:', error);
      });
  } else {
    console.error('Element sa ID-om "labelKolicina" nije pronađen.');
  }



// 
    const labelaPrikaz=document.querySelector(".labelP") as HTMLDivElement;

   if(labelaPrikaz)
    console.log("Pronadjen je element");
    
  

    fromEvent(inputzaIme, 'input').pipe(
        debounceTime(500),
        map((ev: InputEvent) => (<HTMLInputElement>ev.target).value),
        switchMap(title => getFood(title))
    ).subscribe((x: Groceries) => {
        // Ovde možete koristiti x kao JSON objekat
       let proteinNa100g= kolicina/100 *x.P;
       let hidratNa100g= (kolicina/100)*x.UH;
       let mastNa100g= (kolicina/100)*x.M;
       let kalorijeNa100g= (kolicina/100)*x.Kcal;

       
    //    prikazProteina.innerHTML=proteinNa100g.toString() + "g";
      
    //    prikazHidrata.innerHTML=hidratNa100g.toString() + "g";
    //    prikazMasti.innerHTML=mastNa100g.toString() + "g";
    //    prikazKalorija.innerHTML=kalorijeNa100g.toString() + "g";
        
    
        // Ovde možete koristiti x za dodatne manipulacije podacima
        console.log('Podaci:', x.P, x.UH, x.M ,  x.Kcal, kolicina);
    }, (error: any) => {
        // Ovde možete obraditi grešku, ako se pojavi
        console.error('Greška pri dobijanju podataka sa servera:', error);
    });

    

    const dugmeDodaj = document.getElementById('dugmeDodaj');

    inputImeNamirniceZaBrisanje.addEventListener('input', ()=>
    {
        namirnicaZaBrisanje=inputImeNamirniceZaBrisanje.value;
        
        console.log(namirnicaZaBrisanje);
        
    })

    if (dugmeDodaj) {
      console.log(`Input za kolicinu : ${inputZaKolicinu.value}`);

      fromEvent(dugmeDodaj, 'click').subscribe(() => {
         const unos:Groceries= {
           id: vrednost,
          name: namirnicaZaBrisanje,
           P: parseFloat(prikazProteina.innerHTML),

          UH: parseFloat(prikazHidrata.innerHTML),
          M: parseFloat(prikazMasti.innerHTML),
          Kcal: parseFloat(prikazKalorija.innerHTML),
          Opis: '',
          Gramaza:parseFloat(inputZaKolicinu.value)        
          };
         
    console.log(` Vrednosti koje ce da se upisu u local storage su ${unos}`);

       // console.log("Upisano je! " + unos.id + unos.P + unos.UH);
       console.log(`Vrednost je : ${vrednost}`);
       console.log(`Vrednost za gramazu je  je : ${inputZaKolicinu.value}`);
        if(vrednost!="" && inputZaKolicinu.value!=""){
        upisiULocalStorage(unos);
        prikaziModal("uspesno");
        setTimeout(zatvoriModal, 3000);
        }
        else
        {
          prikaziModal("neuspesno");
        }
      });
    } else {
      console.error('Element sa ID-om "dugmeDodaj" nije pronađen.');
    }

      const dugmeProcitaj= document.getElementById('dugmeProcitaj');

      if(dugmeProcitaj)  // ako je uspesno dohvaceno 
      {
            dugmeProcitaj.addEventListener('click', ()=>
            {
                procitajIzLocalStorage();
            })
      }
    
      const dugmeObrisiKonzolu= document.getElementById('obrisiKonzolu');
      if(dugmeObrisiKonzolu)
      {
        dugmeObrisiKonzolu.addEventListener( 'click', () =>
        {
                console.clear();
                const obrisanDiv = document.getElementById('obrisanaPoruka');
               
                if (obrisanDiv) {
                  obrisanDiv.style.display = 'block'; // Prikazi poruku
                  setTimeout(() => {
                    obrisanDiv.style.display = 'none'; // Sakrij poruku nakon nekog vremena (npr. 3 sekunde)
                  }, 3000); // Promenite 3000 na vrednost koja odgovara dužini prikazivanja poruke (u milisekundama)
                }
        })
      }
      

      const dugmeObrisiCeluSvesku= document.getElementById('dugmeObrisiSveIzSveske');
      if(dugmeObrisiCeluSvesku)
      {
        dugmeObrisiCeluSvesku.addEventListener('click', ()=>
        {
            localStorage.clear();

        })
      }

     

}

function upisiULocalStorage(obj:Groceries)
{
    console.log(`Pozvana je fja upisiUlocalstorage i vrenodsti objekta su  
    ${obj.id}   ${obj.name}, ${obj.P} ${obj.UH} ${obj.M} ${obj.Kcal} `);

    localStorage.setItem(obj.id, JSON.stringify(obj));
    }


    function prvoVelikoSLovo(ime:string):String{
      return ime.charAt(0).toUpperCase() +ime.slice(1);
    }



function procitajIzLocalStorage()
{

  const popup = document.getElementById('popup');
const popupNamirnice = document.getElementById('popup-namirnice');
popupNamirnice.innerHTML = '';

// Inicijalizujemo promenljive za zbir vrednosti
let zbirProteina = 0;
let zbirMasti = 0;
let zbirUgljenihHidrata = 0;
let zbirKalorija = 0;

// Očekujemo da su podaci u lokalnom skladištu JSON objekti
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);

 
    // Pokušavamo parsirati vrednost kao JSON objekat
  try {
    const parsedValue = JSON.parse(value);

    // Izvlačimo samo one atribute koji vas interesuju
    const interesantniAtributi = {
      'Proteini': parsedValue.P,
      'Masti': parsedValue.M,
      'Ugljeni hidrati': parsedValue.UH,
      'Kcal': parsedValue.Kcal,
      'Kolicina': parsedValue.Gramaza + " g"
    };

    // Kreiramo string sa prikazom ovih atributa
    let keyPrvoVeliko=prvoVelikoSLovo(key);
    let prikaz = keyPrvoVeliko + ': ';
    for (const [nazivAtributa, vrednostAtributa] of Object.entries(interesantniAtributi)) {
      prikaz += `${nazivAtributa}: ${vrednostAtributa}, `;
    }

    // Dodajemo prikaz u popupNamirnice
    popupNamirnice.innerHTML += `<div>${prikaz}</div>`;

    // Dodajemo vrednosti atributa u zbir
    zbirProteina += interesantniAtributi['Proteini'];
    zbirMasti += interesantniAtributi['Masti'];
    zbirUgljenihHidrata += interesantniAtributi['Ugljeni hidrati'];
    zbirKalorija += interesantniAtributi['Kcal'];
  } catch (error) {
    // Ako parsiranje nije uspelo, prikažite originalni ključ i vrednost
    popupNamirnice.innerHTML += `<div>${key}: ${value}</div>`;
  }
}

// Prikazujemo zbir vrednosti na dnu
popupNamirnice.innerHTML+= '<hr>';
zbirProteina = parseFloat(zbirProteina.toFixed(2));
zbirMasti = parseFloat(zbirMasti.toFixed(2));
zbirUgljenihHidrata = parseFloat(zbirUgljenihHidrata.toFixed(2));
zbirKalorija = parseFloat(zbirKalorija.toFixed(2));

//popupNamirnice.innerHTML += `<div>Zbir: Proteini: ${zbirProteina}, Masti: ${zbirMasti}, Ugljeni hidrati: ${zbirUgljenihHidrata}, Kcal: ${zbirKalorija}</div>`;
// Prikazujemo zbir vrednosti na dnu sa stilizacijom za određene delove teksta
const bmrResults = document.querySelector('.bmr') as HTMLElement;
popupNamirnice.innerHTML +=`  <span style="color: red;"> Vas TDEE: </span> ${tdePublic}`;
popupNamirnice.innerHTML += `<div> <span style="color: red;">Proteini:</span> ${zbirProteina}, <span style="color: red;">Masti:</span> ${zbirMasti}, <span style="color: red;">Ugljeni hidrati:</span> ${zbirUgljenihHidrata}, Kcal: ${zbirKalorija}</div>`;


popup.style.display = 'block'; 
}




function izbaciNamirnicu(imeNamirnice: string) :Boolean
{
    console.log( imeNamirnice);
    const prethodnaVrednost = localStorage.getItem(imeNamirnice);
    localStorage.removeItem(imeNamirnice);

    if (prethodnaVrednost !== null) {
      return true;
    } else {
      return false;
    }

}

function prikaziModal(flag:String) {
    const modal = document.getElementById('modal');
    let naslov=document.getElementById('dodavanjeNamirnice');
    let imeNamirnice=document.getElementById('labelUnos');
    let imgDodavanje=document.getElementById('slikaDodavanje') as HTMLImageElement;
    console.log(flag);

    if(flag=="uspesno")
    {
      console.log("Usao sam u uspesno");
      naslov.textContent=`Uspesno ste dodali ${imeNamirnice}`
      imgDodavanje.src='slike/checked.png';
    }
    else
    {
      console.log("Usao sam u neuspesno");
      naslov.textContent=`Naziv namirnice i kolicina su obavezna input polja`;
      imgDodavanje.src='slike/close.png';
    }

    modal.style.display = 'block';
  }

  const zatvoriDodavanjeNamirnicaBtn=document.getElementById('zatvoriDodavanjeNamirnica');
  zatvoriDodavanjeNamirnicaBtn.addEventListener('click',()=>
  {
    zatvoriModal();
  })
  
  function zatvoriModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
  }
  
  const span=document.getElementById('close');
  if(span){
  span.addEventListener('click',()=>
  {
    zatvoriModal();
  })
}

  async function getGroceries()  {
    try {
      const response = await fetch('../groceries-db.json');
      const data = await response.json();
      return data.groceries;
    } catch (error) {
      console.error('Error fetching groceries:', error);
      return [];
    }
}
function odstpamajPetar()
{
  const tabela=document.getElementById('tabela-namirnica');
  tabela.addEventListener('click',()=>
  {
    console.log("sofiaj!!");
  })
}

async function getAndPrintGroceries() {
  try {
    const sveNamirnice: Groceries[] = await getGroceries();

    // Pronađite tabelu u HTML-u
    const tabela = document.getElementById('tabela-namirnica');

    // Kreirajte zaglavlje tabele
    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');
    trHead.innerHTML = `
      <th> </>
      <th>Naziv</th>
      <th>Proteini (g)</th>
      <th>Ugljeni hidrati (g)</th>
      <th>Masti (g)</th>
      <th>Kcal/100g</th>
    `;
    thead.appendChild(trHead);
    tabela.appendChild(thead);

    // Kreirajte telo tabele
    const tbody = document.createElement('tbody');
    sveNamirnice.forEach((namirnica, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td >${index  + 1 +"."}</td>
       
        <td>${namirnica.name}</td>
        <td>${namirnica.P}</td>
        <td>${namirnica.UH}</td>
        <td>${namirnica.M}</td>
        <td>${namirnica.Kcal}</td>
      `;
      tbody.appendChild(tr);
    });
    tabela.appendChild(tbody);

    tbody.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const tr = target.closest('tr');
      if (tr) {
        const nazivNamirnice = tr.getAttribute('data-name');
        if (nazivNamirnice) {
          // Pozovite funkciju i prosledite nazivNamirnice kao argument
          console.log(nazivNamirnice);
        }
      }
    });

  } catch (error) {
    console.error('Error fetching and printing groceries:', error);
  }
}



 const vratiNamirnice= document.getElementById('dugmeVratiSveNamirnice');
 if(vratiNamirnice)
 {
    vratiNamirnice.addEventListener( 'click', ()=>
    {
        getAndPrintGroceries();
    })
 }
  
 if (inputImeNamirniceZaBrisanje)
 {
    inputImeNamirniceZaBrisanje.addEventListener('input', ()=>
    {
        namirnicaZaBrisanje=inputImeNamirniceZaBrisanje.value;
        console.log(namirnicaZaBrisanje);
    
 }
 )}
  
 if(dugmeObrisiNamirnicu)
      {
        dugmeObrisiNamirnicu.addEventListener('click', ()=>{
           
            let daLiJeObrisano= izbaciNamirnicu(namirnicaZaBrisanje);
            if(daLiJeObrisano==true)
            prikaziUspesnoBrisanje();
              else
              {
                prikaziNeuspesnoBrisanje();
              }
           // setTimeout(zatvoriUspesnoBrisanje,3000);


        })
      }
function prikaziUspesnoBrisanje()
{
  
  let uspesnoBrisanje=document.getElementById('uspesnoBrisanje');
  let slikaZaBrisanje= document.getElementById('slikaZaBrisanje') as HTMLImageElement;
  let naslov=document.getElementById('BrisanjeNamirniceh3') as  HTMLElement;
  naslov.textContent=`Obrisali ste namirnicu ${namirnicaZaBrisanje}`;
  slikaZaBrisanje.src='slike/checked.png';
  if(uspesnoBrisanje)
  uspesnoBrisanje.style.display = 'block';
else
{
  console.log("Nije pronadjen ");
}
}

function prikaziNeuspesnoBrisanje()
{
  let uspesnoBrisanje=document.getElementById('uspesnoBrisanje');
  let slikaZaBrisanje= document.getElementById('slikaZaBrisanje') as HTMLImageElement;
  slikaZaBrisanje.src='slike/close.png';
  let naslov=document.getElementById('BrisanjeNamirniceh3') as  HTMLElement;
  console.log(`Namirnica za brisanje ima vrednost : ${namirnicaZaBrisanje} `);
  if(namirnicaZaBrisanje=="" )
     naslov.textContent=`Unesite naziv namirnice koju zelite da izbacite iz korpe`;
  else
     naslov.textContent=`Namirnica ${namirnicaZaBrisanje} se ne nalazi u korpi`;

    if(uspesnoBrisanje)
  uspesnoBrisanje.style.display = 'block';
}
function zatvoriUspesnoBrisanje()
{
  let uspesnoBrisanje=document.getElementById('uspesnoBrisanje');
  uspesnoBrisanje.style.display = 'none';
}

let dugmeZatvoriUspesnoBrisanje= document.getElementById('zatvoriUspesnoBrisanjeBtn');
dugmeZatvoriUspesnoBrisanje.addEventListener('click', ()=>
{
  zatvoriUspesnoBrisanje();
})

      // Funkcija za prikazivanje/skrivanje sekcije na osnovu stanja radio button-a
      var radio = document.getElementById("hideSectionRadio");
  var section = document.querySelector(".zaPrikaz");
  
 // script.ts

(window as any).toggleSection = function(sectionId: string) {
  const sections = document.querySelectorAll(".zaPrikaz");

  // Sakrij sve sekcije
  sections.forEach(function (section) {
      (section as HTMLElement).style.display = "none";
  });

  // Prikazi odabranu sekciju
  const selectedSection = document.getElementById(sectionId);
  if (selectedSection instanceof HTMLElement) {
      selectedSection.style.display = "block";
  }
}


  

// Dodajte događaj slušanja za promene u statusu radio button-a


napraviDugme();



/*
//Enable tooltips and popovers
declare interface JQuery {
  popover(options?: any): any;
}
declare interface JQuery {
  tooltip(options?: any): any;
}

$(function () {
  $('[data-toggle="popover"]').popover()
})

$('.popup-marker').popover({
    html: true,
    trigger: 'manual'
}).click(function(e:any) {
    $('.popup-marker').not(this).popover('hide');
    $(this).popover('toggle');
});
$(document).click(function(e) {
    if (!$(e.target).is('.popup-marker, .popover-title, .popover-content')) {
        $('.popup-marker').popover('hide');
    }
});

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})
*/

// UI Vars
let age: number | undefined,
  weight: string | undefined,
  heightFt: number | undefined,
  heightIn: number | undefined,
  gender: string | undefined,
  activity: string | undefined,
  bmr: number | undefined,
  tdee: number | undefined,
  weightInKg: number = 0,
  heightToCm: number = 0,
  heightInCm: number = 0,
  breastfeeding: string | undefined;

  let dugmeIzracunaj = document.getElementById('calculate') as HTMLButtonElement;
  
 if(dugmeIzracunaj)
 {
    dugmeIzracunaj.addEventListener('click', ()=>
    {
      console.log("Pozivam calculate  bmr");
      calculateBMR();

    })
 }

// Form Event Listener
/*
document.querySelector('.myForm')?.addEventListener('submit', function (e) {
  // Prevent the form from submitting and reloading the page
  e.preventDefault();

  // Hide results
  const resultsElement = document.getElementById('results');
  if (resultsElement) {
    resultsElement.style.display = "none";
  }

  // Show Loader
  const loading = document.getElementById('loading');
  if (loading) {
    loading.style.display = 'block';
    loading.style.margin = 'auto';
  }

  calculateBMR();
  //setTimeout(calculateBMR, 2000);
});
*/


// Calculate BMR
function calculateBMR() {
// Get values from form
getFormValues();

// Convert values
weightHeightConversions(weight, heightFt, heightIn);

// Validate fields
if (isNaN(age) || weight === undefined) {
  // Display error if fields are empty
  showError('Please fill out all fields before submitting');
} else {
  const submitButton = document.querySelector('.submit') as HTMLButtonElement;
  if (gender === "Female") {
    let femaleBmr = 655 + (9.6 * weightInKg) + (1.8 * heightInCm);
    bmr = (femaleBmr) - (4.7 * age);
    bmr = Math.round(bmr);

    if (breastfeeding === "Yes") {
      bmr += 450;
      calculateTDEE(bmr);
    } else {
      calculateTDEE(bmr);
    }

    // Show Results
    showResults(bmr, tdee);
  } else {
    console.log(gender, age, weight, weightInKg, heightInCm);
    let maleBmr = 66 + (13.7 * weightInKg) + (5 * heightInCm);
    bmr = (maleBmr) - (6.8 * age);
    bmr = Math.round(bmr);

    // Calculate TDEE
    calculateTDEE(bmr);

    // Show Results
    showResults(bmr, tdee);
  }
}
}


function calculateTDEE(bmr:number){
  switch(activity) {
    case "Neaktivan":
      tdee = Math.round(bmr * 1.2)
      break;
    case "Slabo aktivan":
      tdee = Math.round(bmr * 1.375)
      break;
    case "Umereno aktivan":
      tdee = Math.round(bmr * 1.55)
      break;
      case "Veeoma aktivan":
      tdee = Math.round(bmr * 1.725)
      break;
    case "Ekstremno aktivan":
      tdee = Math.round(bmr * 1.9)
      break;
  }
}

// Show results
function showResults(bmr: number | undefined, tdee: number | undefined) {
// Display results div
console.log("Usao sam u fju!");
const results = document.getElementById('results');
if (results) {
  results.style.display = 'block';
}

// Grab divs
const bmrResults = document.querySelector('.bmr');
const tdeeResults = document.querySelector('.tdee');
const maintain = document.querySelector('.maintain');
const lose1Lb = document.querySelector('.lose-1lb');
const lose1HalfLb = document.querySelector('.lose-oneandhalflb');
const lose2Lbs = document.querySelector('.lose-2lb');

// Hide loader
const loading = document.getElementById('loading');
if (loading) {
  loading.style.display = 'none';
}
console.log(tdee);
console.log(bmr);
// Append results
if (bmrResults && bmr !== undefined) {
  bmrResults.innerHTML += `  BMR:  ${bmr}`;
}
if (tdeeResults && tdee !== undefined) {
  tdeeResults.innerHTML += `  TDEE: ${tdee}`;
  tdePublic=tdee;
}

if (tdeeResults && tdee !== undefined) {
  maintain.innerHTML += ` ${tdee} Calories`;
}

if (tdeeResults && tdee !== undefined) {
  lose1Lb.innerHTML += ` ${tdee-500} Calories`;
}

if (tdeeResults && tdee !== undefined) {
  lose1HalfLb.innerHTML += ` ${tdee-750} Calories`;
}


if (tdeeResults && tdee !== undefined) {
  lose2Lbs.innerHTML += ` ${tdee-1000} Calories`;
}






// Implement the logic to fill other result fields
}

// Get values from form
function getFormValues() {
age = parseInt((document.getElementById('age') as HTMLInputElement).value);
weight = (document.getElementById('weight') as HTMLInputElement).value;
heightFt = parseInt((document.getElementById('height-feet') as HTMLInputElement).value);
heightIn = parseInt((document.getElementById('height-inch') as HTMLInputElement).value);
gender = (document.getElementById('gender') as HTMLSelectElement).value;
activity = (document.getElementById('activity') as HTMLSelectElement).value;
breastfeeding = (document.getElementById('breast-feeding') as HTMLSelectElement).value;

console.log(weight);
}

// Convert weight to kg and height to cm
function weightHeightConversions(weight: string | undefined, heightFt: number | undefined, heightIn: number | undefined) {
if (weight !== undefined) {
  weightInKg=parseFloat(weight) ; //=  parseFloat((parseFloat(weight) / 2.2).toFixed(2));
  console.log(weightInKg);
}
if (heightFt !== undefined && heightIn !== undefined) {
  heightToCm = ((heightFt * 12) + heightIn);
  heightInCm = heightToCm * 2.54;
}
}

// Show error
function showError(error: string) {
// Hide results
const results = document.getElementById('results');
if (results) {
  results.style.display = 'none';
}

// Hide loader
const loading = document.getElementById('loading');
if (loading) {
  loading.style.display = 'none';
}

// Create an error div
const errorDiv = document.createElement('div');

// Grab elements to put error between
const form = document.querySelector('.myForm');
const heading = document.querySelector('.field');

// Give error bootstrap error class
errorDiv.className = 'alert alert-danger';

// Append error message to error div
errorDiv.appendChild(document.createTextNode(error));

// Insert error
if (form && heading) {
  form.insertBefore(errorDiv, heading);
}

setTimeout(clearError, 5000);
}

// Clear error
function clearError() {
const error = document.querySelector('.alert');
if (error) {
  error.remove();
}
}



















