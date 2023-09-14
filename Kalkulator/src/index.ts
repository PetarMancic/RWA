
import {from,interval,  fromEvent,map,
  switchMap,debounceTime,
  Observable,of,EMPTY,
  catchError,combineLatest,
   mergeMap} from 'rxjs';

import { Groceries } from './Groceries';
import * as $ from 'jquery';
import 'bootstrap';
import { ExportovaneFunkcije, } from './ExportovaneFunkcije';
import { MakroNutrienti } from './MakroNutrienti';
import { calculateBMR, getTDE } from './TdeeRacunanje';
import { getImeNamirnice, nacrtajInfoPage, setImeNamirnice } from './InfoPage';





const slikaNamirnice = document.getElementById('slika') as HTMLImageElement;
const brojeviObservable = interval(3000);
brojeviObservable
  .pipe(
    map( () => {
      
      const randomBroj = Math.floor(Math.random() * 16);
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
        case 8:
             return 'slike2/fast-food.png'
        case 9:
             return 'slike2/fish.png'
        case 10:
             return 'slike2/hamburger.png'
        case 11:
             return 'slike2/honey.png'
        case 12:
             return 'slike2/pancakes.png'
        case 13:
             return 'slike2/salad.png'
        case 14:
             return 'slike2/spaguetti.png'
        case 15:
             return 'slike2/steak.png'

      }
    })
  )
  .subscribe({
    next: (putanjaDoSlike) => {
      // Postavite novu putanju do slike u src atribut slike
      slikaNamirnice.src = putanjaDoSlike;
    },
    complete: () => {
      console.log('Observable je završio emitovanje.');
    }
  });
// let tokSlike$:Observable<any>=interval(5000).pipe();

// tokSlike$.subscribe(x=>{
//   switch(x)
//   {
//     case 0:
//       return 'slike/calculator.png'
      
//   }
// })

// Kude pozivas fje iz onaj index2acili
//epa na dugme izracunaj 
//ja u sustini treba samo da pozovem funkicju calculate bmr, ona poziva sve ostalo sto treba
// Tjt, ali ovo mora jos mng mng da se razbija i instaliraj baj onaj Stipendijasev pretijer
//cek samo da vidim radi li ovo
//radi
//kako jos da sredjujem kod 
// Nzm ni kvo se desava, ali uvedi slobodno klase i jos iz razbijaj, ce ripi Petko
//a kazi mi za ovaj html gore, pogle ovo

function zatvoriPopup() {
  const popup = document.getElementById('popup');
  popup.style.display = 'none'; // Sakrijemo pop-up prozor
}


const dugmeOK=document.getElementById("ZatvoriPopupBtn");
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

 //sad ce ti pokazem na sta se odnosi to 

// const URLAdr="http://localhost:3000/groceries";
//  export function getFood(foodName: string): Observable<Groceries> {
//     const promise = fetch(URLAdr + "/" + foodName)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error("Food not found!");
//             }
//             // Prvo pročitajte telo odgovora kao JSON i sačuvajte ga u promenljivu
//             return response.json();
//         })
//         .catch(err => {

//             console.error(err);
//             throw err;
//            // return ;
//         });

//     return from(promise);
// }

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







const nazivNamirniceInput = document.querySelector('.labelUnos') as HTMLInputElement;
const kolicinaInput = document.querySelector('.labelGrami') as HTMLInputElement;

const nazivNamirniceObservable = fromEvent(nazivNamirniceInput, 'input').pipe(
  debounceTime(500),
  map(event => (event.target as HTMLInputElement).value)
);
const kolicinaObservable = fromEvent(kolicinaInput, 'input').pipe(
  debounceTime(500),
  map(event => parseFloat((event.target as HTMLInputElement).value))
);

let proteinNa100g:number=0, hidratNa100g:number=0, mastNa100g:number=0, kalorijeNa100g:number=0;
const makroNutrienti= new MakroNutrienti();
combineLatest([nazivNamirniceObservable, kolicinaObservable]).pipe(
  mergeMap(([nazivNamirnice, kolicina]) => {
    return from(ExportovaneFunkcije.getFood(nazivNamirnice)).pipe(
      catchError(err => {
        console.error(err);
        // Ovde možete vratiti neku podrazumevanu vrednost ili EMPTY observable
        return EMPTY;
      }),
      map(foodData => {
        

        makroNutrienti.proteini=parseFloat(((kolicina/100)*foodData.P).toFixed(2));
        makroNutrienti.ugljeniHidrati = parseFloat(((kolicina / 100) * foodData.UH).toFixed(2) );
        makroNutrienti.masti = parseFloat(((kolicina / 100) * foodData.M).toFixed(2) );
        makroNutrienti.kalorije = parseFloat(((kolicina / 100) * foodData.Kcal).toFixed(2));


        proteinNa100g =  makroNutrienti.proteini;
        hidratNa100g = makroNutrienti.ugljeniHidrati
        mastNa100g =makroNutrienti.masti
        kalorijeNa100g =  makroNutrienti.kalorije
        

        return {
          proteinNa100g:filterNaN(proteinNa100g),      
          hidratNa100g: filterNaN(hidratNa100g),
           mastNa100g: filterNaN(mastNa100g),
           kalorijeNa100g: filterNaN(kalorijeNa100g),
        };
      })
    );
  })
).subscribe(nutritionalValues => {
  // Sada možete ažurirati UI sa izračunatim nutritivnim vrednostima
  prikazProteina.innerHTML=proteinNa100g.toString() + "g";
  prikazHidrata.innerHTML=hidratNa100g.toString() + "g";
  prikazMasti.innerHTML=mastNa100g.toString() + "g";
  prikazKalorija.innerHTML=kalorijeNa100g.toString() + "g";
});

function filterNaN(kolicina:number): String
{
   if(isNaN(kolicina)){
    console.log(" vracao 0  ");
   return "0"
   }
  else
  {
    console.log(kolicina);
    console.log(" U else sam ");
    return kolicina.toString();
  }
}





   
  nextPageButton.addEventListener('click', ()=>
  {
    const URLAdr="http://localhost:3002/groceries";
    const inputImeInfo= document.getElementById('infoNamirnica') as HTMLInputElement;
    const vrednostInputImeInfo=inputImeInfo.value;

console.log(vrednostInputImeInfo);    

    if(vrednostInputImeInfo!=""){  // ako je korisnik nesto uneo
   
        const promise = fetch(URLAdr+`/${vrednostInputImeInfo}`)
        .then(response => {
        if (!response.ok) {
          throw new Error("Food not found!");
      }
        return response.json();
        })
        promise.then(data=>
          {
            //nalazi se u bazi i onda koristimo set 
            setImeNamirnice(vrednostInputImeInfo); //i ovde treba da pozovemo funkciju koja ce da iscrta sve to 
            nacrtajInfoPage();
              console.log(getImeNamirnice);
         //   const encodedValue= encodeURIComponent(vrednostInputImeInfo);
         //  window.location.href = `groceries-info.html?value=${encodedValue}`;

          })
          .catch(error=>
            {
              console.log(error);
              const divMoreInfo= document.getElementById('moreInfo');
              const h3InfoNamirnice= document.getElementById('infoNamirnice');
              h3InfoNamirnice.textContent=`Namirnica ${vrednostInputImeInfo} ne postoji u bazi`;
              divMoreInfo.style.display='block';
            })
        }
        else  // ovo znaci da je polje prazno 
        {
              const divMoreInfo= document.getElementById('moreInfo');
              const h3InfoNamirnice= document.getElementById('infoNamirnice');
              h3InfoNamirnice.textContent=`Input polje ne sme da bude prazno!`;
              divMoreInfo.style.display='block';
        }


})
  
   
 const btnZatvoriMoreInfo=document.getElementById('zatvoriMoreInfo') as HTMLButtonElement;
 btnZatvoriMoreInfo.addEventListener('click',  ()=>
 {
  const divMoreInfo= document.getElementById('moreInfo');
  divMoreInfo.style.display='none';
 })
   
  
  


   if(inputzaIme){
   inputzaIme.addEventListener('input', () => {
       vrednost= inputzaIme.value;
    console.log(vrednost);//provera
   })
} else {

    console.error('Element sa ID-om "labelUnos" nije pronađen.');
}





// 
    const labelaPrikaz=document.querySelector(".labelP") as HTMLDivElement;

   if(labelaPrikaz)
    console.log("Pronadjen je element");
    
  

    

    

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
        prikaziModal("uspesno", vrednost);
        setTimeout(zatvoriModal, 3000);
        }
        else
        {
          prikaziModal("neuspesno", "");
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
            const divBrisanjeSvihNamirnica=document.getElementById('brisanjeSvihNamirnica') as HTMLElement;
           const naslov=document.getElementById('naslovObrisanenamirnice');
            if(localStorage.length==0)
            {
              naslov.textContent="Korpa je vec prazna!"
            }
            else
            {
            localStorage.clear();
            naslov.textContent="Namirnice su obrisane!"
            }

            divBrisanjeSvihNamirnica.style.display='block';
            setTimeout( ()=>
            {divBrisanjeSvihNamirnica.style.display='none'} 
              ,2000)
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

let zbirProteina = 0;
let zbirMasti = 0;
let zbirUgljenihHidrata = 0;
let zbirKalorija = 0;


for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);


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


const bmrResults = document.querySelector('.bmr') as HTMLElement;
popupNamirnice.innerHTML +=`  <span style="color: red;"> Vas TDEE: </span> ${getTDE()}`;
popupNamirnice.innerHTML += `<div> <span style="color: red;">Proteini:</span> ${zbirProteina}, <span style="color: red;">Masti:</span> ${zbirMasti}, <span style="color: red;">Ugljeni hidrati:</span> ${zbirUgljenihHidrata}, Kcal: ${zbirKalorija}</div>`;
// Ovo se desava jednom ili kad se menja tdePublic?



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

function prikaziModal(flag:String,  naziv:String) {
    const modal = document.getElementById('modal');
    let naslov=document.getElementById('dodavanjeNamirnice');
    let imeNamirnice=document.getElementById('.labelUnos') as HTMLInputElement;
    let imgDodavanje=document.getElementById('slikaDodavanje') as HTMLImageElement;
   // console.log(flag);
      console.log(imeNamirnice);
    if(flag=="uspesno")
    {
      console.log("Usao sam u uspesno");
      naslov.textContent=`Uspesno ste dodali ${naziv}`
      imgDodavanje.src='slike/checked.png';
    }
    else
    {
      console.log(imeNamirnice);
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

  async function vratiSveNamirnice()  {
    try {
      const response = await fetch('../groceries-db.json');
      const data = await response.json();
      return data.groceries;
    } catch (error) {
      console.error('Error fetching groceries:', error);
      return [];
    }
}


async function getAndPrintGroceries(tabela:HTMLElement, flag:number) {
  try {

  if (tabela.style.display==="block") {
          tabela.style.display = 'none';
            return;
    }
    else
    {
      if(flag===1){
        flag=2;
        nacrtajTabelu();
      
      }
    else
    {
    
     tabela.style.width = '100%';
      tabela.style.display="block"

    }
   
  }
 
   
    
  } catch (error) {
    console.error('Error fetching and printing groceries:', error);
  }
}



 async function   nacrtajTabelu()
 {
  //flag=2;
  flag=2;
  console.log(tabelaNamirnica);
  console.log("Uso sam nacrtajTabelu")
  const sveNamirnice: Groceries[] = await vratiSveNamirnice();
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

tabela.style.display="block"

 }


 let flag=1;
let tabelaNamirnica = false;
 const vratiNamirnice= document.getElementById('dugmeVratiSveNamirnice');
 const tabela = document.getElementById('tabela-namirnica');
 if(vratiNamirnice)
 {
    vratiNamirnice.addEventListener( 'click', ()=>
    {
      console.log(`Flag kad se klikne je : ${flag}`);
        getAndPrintGroceries( tabela,flag);
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
            prikaziDivUspesnoBrisanje();
              else
              {
                prikaziDivNeuspesnoBrisanje();
              }
           


        })
      }
function prikaziDivUspesnoBrisanje()
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

function prikaziDivNeuspesnoBrisanje()
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


  




napraviDugme();




//do tu bi hteo da mi bude jedan fajl, a na dole drugi fajl 
let dugmeIzracunaj = document.getElementById('calculate') as HTMLButtonElement;
  
if(dugmeIzracunaj)
{
   dugmeIzracunaj.addEventListener('click', ()=>
   {
     console.log("Pozivam calculate  bmr");
     calculateBMR();

   })
}
//kako njega da resimo, tuja promenljivu jer mi treba da setujem na jedno mesto
// Problem je sto nesmemo da uvezemo inex u index2 jer cemo napraviti kruznu zavisnost, al ce ga opravimo preko nekvutu fju




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                //TDE CALCULATOR///////////////






















