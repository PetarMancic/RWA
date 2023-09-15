
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
//import { nacrtajPrviDiv } from './Namirnice';



ExportovaneFunkcije.prikaziSlike();



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



let inputImeNamirniceZaBrisanje=document.getElementById('namirnicaInput') as HTMLInputElement;
const dugmeObrisiNamirnicu= document.getElementById('dugmeObrisiNamirnicu');
let namirnicaZaBrisanje:string= "";
function nacrtajMainDiv( )
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
    
  

    

    
  inputImeNamirniceZaBrisanje.addEventListener('input', ()=>
  {
      namirnicaZaBrisanje=inputImeNamirniceZaBrisanje.value;
      
      console.log(namirnicaZaBrisanje);
      
  })

    const dugmeDodaj = document.getElementById('dugmeDodaj');


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
         
          
const URLAadr="http://localhost:3000/groceries";
const modal = document.getElementById('modal');
let naslov=document.getElementById('dodavanjeNamirnice');
let imeNamirnice=document.getElementById('.labelUnos') as HTMLInputElement;
let imgDodavanje=document.getElementById('slikaDodavanje') as HTMLImageElement;

        if(vrednost!="" && inputZaKolicinu.value!="" ){  // ako je korisnik uneo oba input polja 

          const promise = fetch(URLAadr+`/${vrednost}`)
        .then(response => {
        if (!response.ok) {
          throw new Error("Food not found!");
      }
        return response.json();
        })
        promise.then(data=>
          {
            //nalazi se u bazi i onda koristimo cemo da ubacimo u localstorage 
            upisiULocalStorage(unos);
            console.log("Usao sam u uspesno");
            naslov.textContent=`Uspesno ste dodali ${vrednost}`;
            imgDodavanje.src='slike/checked.png';

           
           
            setTimeout(zatvoriModal, 3000);
        

          })
          .catch(error=>
            { //ne nalazi se u bazi 

              naslov.textContent=`Namirnica ${vrednost} se ne nalazi u bazi`;
              imgDodavanje.src='slike/close.png';

              
            })
        }
        else  // ovo znaci da je polje prazno 
        {

          naslov.textContent=`Input polja ne smeju da budu prazna!`;
          imgDodavanje.src='slike/close.png';
        }  
        //prikazivanje bloka 
        modal.style.display = 'block';
    })
    ;}

      const dugmeProcitaj= document.getElementById('dugmeProcitaj');

      if(dugmeProcitaj)  // ako je uspesno dohvaceno 
      {
            dugmeProcitaj.addEventListener('click', ()=>
            {
                ExportovaneFunkcije.procitajIzLocalStorage();
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
                  obrisanDiv.style.display = 'block'; 
                  setTimeout(() => {
                    obrisanDiv.style.display = 'none';
                  }, 3000); 
                }
        })
      }
      
      const dugmeObrisiCeluSvesku= document.getElementById('dugmeObrisiSveIzSveske');
      if(dugmeObrisiCeluSvesku)
      {
        console.log("radi")
        dugmeObrisiCeluSvesku.addEventListener('click', ()=>{
          ExportovaneFunkcije.ocistiKorpu();

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

// function prikaziModal(flag:String,  nazivNamirnice:String, FlagDaLiPostojiUBazi:String) {
//     const modal = document.getElementById('modal');
//     let naslov=document.getElementById('dodavanjeNamirnice');
//     let imeNamirnice=document.getElementById('.labelUnos') as HTMLInputElement;
//     let imgDodavanje=document.getElementById('slikaDodavanje') as HTMLImageElement;
//    // console.log(flag);
//       console.log(imeNamirnice);
//     if(flag=="uspesno")
//     {
//       console.log("Usao sam u uspesno");
//       naslov.textContent=`Uspesno ste dodali ${nazivNamirnice}`
//       imgDodavanje.src='slike/checked.png';
//     }
//     else
//     {
//       console.log(imeNamirnice);
//       console.log("Usao sam u neuspesno");
//       naslov.textContent=`Namirnica ${nazivNamirnice} se ne nalazi u bazi`;
//       imgDodavanje.src='slike/close.png';
      
      
//     }

//     modal.style.display = 'block';
//   }

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
            ExportovaneFunkcije.prikaziDivUspesnoBrisanje();
              else
              {
                // prikaziDivNeuspesnoBrisanje();
                ExportovaneFunkcije.prikaziDivNeuspesnoBrisanje();
              }
           


        })
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


  




nacrtajMainDiv();



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























