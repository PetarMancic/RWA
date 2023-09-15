import { Observable, from, interval,map } from "rxjs";
import { Groceries } from "./Groceries";
import { calculateBMR, getTDE } from './TdeeRacunanje';
export class ExportovaneFunkcije{

 //URLAdr="http://localhost:3000/groceries";


    static   getFood(foodName: string): Observable<Groceries> {
    const promise = fetch("http://localhost:3000/groceries" + "/" + foodName)
        .then(response => {
            if (!response.ok) {
                throw new Error("Food not found!");
            }
           
            return response.json();
        })
        .catch(err => {

            console.error(err);
            throw err;
           // return ;
        });

    return from(promise);
}


    static  prikaziDivNeuspesnoBrisanje()
    {
        let inputImeNamirniceZaBrisanje=document.getElementById('namirnicaInput') as HTMLInputElement;
        let namirnicaZaBrisanje= inputImeNamirniceZaBrisanje.value;
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


    static  prikaziDivUspesnoBrisanje()
    {
      
    let inputImeNamirniceZaBrisanje=document.getElementById('namirnicaInput') as HTMLInputElement;
    let namirnicaZaBrisanje= inputImeNamirniceZaBrisanje.value;
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



    static prikaziSlike(){
    const slikaNamirnice = document.getElementById('slika') as HTMLImageElement;
    const brojeviObservable:Observable<number> = interval(3000);
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

    }



    static ocistiKorpu()
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
          
        
    }



    static procitajIzLocalStorage()
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
            let keyPrvoVeliko=this.prvoVelikoSLovo(key);
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

    static   prvoVelikoSLovo(ime:string):String{
        return ime.charAt(0).toUpperCase() +ime.slice(1);
      }
}