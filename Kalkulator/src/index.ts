
import {from,  fromEvent,map,switchMap,debounceTime,Observable,of} from 'rxjs';
import { Groceries } from './Groceries';
import * as $ from 'jquery';
import 'bootstrap';

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
   const prikazProteina= document.querySelector('.prikazProteina');
   const prikazHidrata= document.querySelector('.prikazHidrata');
   const prikazMasti= document.querySelector('.prikazMasti');
   const prikazKalorija= document.querySelector('.prikazKalorija');

  const nextPageButton=document.getElementById('nextPageButton');
  nextPageButton.addEventListener('click', ()=>
  {
    const valueToPass= inputzaIme.value;
    const encodedValue= encodeURIComponent(valueToPass);
    window.location.href = `groceries-info.html?value=${encodedValue}`;
  })
   

   
  
   let kolicina:number =0;
   let vrednost: string="";


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
    if (dugmeDodaj) {
        dugmeDodaj.addEventListener('click', () => {
          const unos:Groceries = {
            id: vrednost,
            name:vrednost,
            P: parseFloat(prikazProteina.innerHTML),
            UH: parseFloat(prikazHidrata.innerHTML),
            M: parseFloat(prikazMasti.innerHTML),
            Kcal: parseFloat(prikazKalorija.innerHTML),
            Opis:''
          };

          console.log("Upisano je! "+ unos.id + unos.P + unos.UH );
          upisiULocalStorage(unos); // Prosleđivanje objekta unos u funkciju upisiULocalStorage
          prikaziModal(); // Poziv funkcije za prikazivanje modalnog prozora
          setTimeout(zatvoriModal, 3000);
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
    console.log(`Pozvana je fja upisiUlocalstorage i vrenodsti obj su 
        ${obj.P}, ${obj.id}`);

    localStorage.setItem(obj.id, JSON.stringify(obj));
    }





function procitajIzLocalStorage()
{
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        console.log(key);
       
         const value = localStorage.getItem(key);
         console.log(value);
     
      }
      
}


function izbaciNamirnicu(imeNamirnice: string )
{
    console.log( imeNamirnice);
    localStorage.removeItem(imeNamirnice);

}

function prikaziModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'block';
  }
  
  function zatvoriModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
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

async function getAndPrintGroceries() {
    try {
      const sveNamirnice:Groceries [] = await getGroceries();
     
      let nizImena: string[]=[];
      let i=1;
      sveNamirnice.map((namirnica) => {
        nizImena.push(  `${i.toString()}.${namirnica.id} `);
        i++
    }
       );
      
      const rezultatDiv = document.getElementById('sveNamirnice');
      rezultatDiv.innerHTML = nizImena.join('<br>');

      

      
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
            console.log("pozivamo fju za brisanje namirnice");
            izbaciNamirnicu(namirnicaZaBrisanje);

        })
      }
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
    case "Sedentary":
      tdee = Math.round(bmr * 1.2)
      break;
    case "Lightly Active":
      tdee = Math.round(bmr * 1.375)
      break;
    case "Moderately Active":
      tdee = Math.round(bmr * 1.55)
      break;
    case "Very Active":
      tdee = Math.round(bmr * 1.725)
      break;
    case "Extremely Active":
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

// Append results
if (bmrResults && bmr !== undefined) {
  bmrResults.innerHTML += `  BMR:  ${bmr}`;
}
if (tdeeResults && tdee !== undefined) {
  tdeeResults.innerHTML += `  TDEE: ${tdee}`;
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
}

// Convert weight to kg and height to cm
function weightHeightConversions(weight: string | undefined, heightFt: number | undefined, heightIn: number | undefined) {
if (weight !== undefined) {
  weightInKg =  parseFloat((parseFloat(weight) / 2.2).toFixed(2));
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




















