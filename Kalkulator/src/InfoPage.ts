export let imeNamirnice:String='prazan';

export function  getImeNamirnice() :String
{
 return imeNamirnice;
}

export function setImeNamirnice(value:String)
{
    imeNamirnice=value;
}


export function nacrtajInfoPage()
{ 
    const urlParams = new URLSearchParams(window.location.search);
const receivedValue = urlParams.get('value');
console.log(`receiveedValue:${receivedValue}`);
// Postavimo vrednost u element na stranici
const receivedValueElement = document.getElementById('receivedValue');

const Naslov=document.getElementById('imeNamirnice');


// receivedValueElement.textContent = `Preneta vrednost: ${receivedValue}`;
console.log("ej")
const URLAdr="http://localhost:3002/groceries";



const promise = fetch(URLAdr+`/${imeNamirnice}`) //bilo je receivedValue
   .then(response => {
    if (!response.ok) {
      throw new Error("Food not found!");
  }
   return response.json();
   })

    promise.then(data=>
    {
        const divPrikazInfo=document.getElementById('divInfoPage') as HTMLDivElement;
      
        console.log("Usao sam u promise.then")
        
        const opisArea=document.getElementById('opis-namirnice') as HTMLTextAreaElement;
        opisArea.readOnly = true;
       
        opisArea.textContent=data.Opis;
        const slikaNamirnice=document.getElementById('SlikaNamirnice')  as HTMLImageElement;
        slikaNamirnice.src=data.Slika;
       console.log(data.Masti);

       Naslov.textContent=data.naziv;
        const tabela = document.getElementById('tabela-namirnice');
        tabela.innerHTML = `
            <thead>
                <tr>
                    <th> </th>
                    <th style="text-align:center" >Naziv</th>
                    <th style="text-align:center">Proteini (g)</th>
                    <th style="text-align:center">Ugljeni hidrati (g)</th>
                    <th style="text-align:center">Masti (g)</th>
                    <th style="text-align:center" >Kcal/100g</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td> </td>
                    <td style="text-align:center">${data.naziv}</td>
                    <td style="text-align:center">${data.Proteini}</td>
                    <td style="text-align:center">${data['Ugljeni hidrati']}</td>
                    <td style="text-align:center">${data.Masti}</td>
                    <td style="text-align:center" >${data.Kalorije}</td>
                </tr>
            </tbody>
        `
       


divPrikazInfo.style.display='block';
//divPrikazInfo.style.visibility='true';
 })


}
