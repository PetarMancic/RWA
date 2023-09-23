import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

// UI Vars
export let age: number | undefined,
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

let tdePublic = 0;
let tdePublicKopija=0;
export function getTDE() {
    return tdePublic;
}

let gornjaGranicaProteina=0;
let gornjaGranicaUH=0;
let gornjaGranicaMasti=0;

export function getGornjaGranicaProteina() : number
{
  return gornjaGranicaProteina;
}

export function setGornjaGranicaProteina(proteini:number)
{
    gornjaGranicaProteina=proteini;
    console.log(`Proteini: ${proteini}`);
}


export function getGornjaGranicaUH() : number
{
  return gornjaGranicaUH;
}

export function setGornjaGranicaUH( UH:number): void 
{
  gornjaGranicaUH=UH;
  console.log(`UH: ${UH}`);
}

export function getgornjaGranicaMasti() : number
{
  return gornjaGranicaMasti;
}

export function setgornjaGranicaMasti(masti: number) : void
{
   gornjaGranicaMasti=masti;
   console.log(`MASsti: ${masti}`);
}

export function getKilogrami()
{
  return weightInKg;
}


function izracunajGornjeVrednostiNutrienata()
{



let localKg=getKilogrami();
let preostaleKalorijeZaUH=0;

setGornjaGranicaProteina(2*localKg);
setgornjaGranicaMasti(1*localKg);
preostaleKalorijeZaUH=tdee-(getGornjaGranicaProteina()*4 + getgornjaGranicaMasti()*9);
setGornjaGranicaUH(preostaleKalorijeZaUH/4);


//sada smo postavili vrednosti 



}




// Calculate BMR
export async function calculateBMR() {
// Get values from form
getFormValues();

// Convert values
weightHeightConversions(weight, heightFt);

// Validate fields
if (isNaN(age) || weight === undefined) {
  // Display error if fields are empty
  showError('Please fill out all fields before submitting');
} else {
  const submitButton = document.querySelector('.submit') as HTMLButtonElement;
  if (gender === "Zenski") {
    let femaleBmr = 655 + (9.6 * weightInKg) + (1.8 * heightInCm);
    
    bmr = (femaleBmr) - (4.7 * age);
    bmr = Math.round(bmr);

    if (breastfeeding === "Da") {
      bmr += 450;
      calculateTDEE(bmr);
    } else {
      calculateTDEE(bmr);
    }
    izracunajGornjeVrednostiNutrienata();
    // Show Results
    showResults(bmr, tdee);
  } else {
    console.log(gender, age, weight, weightInKg, heightInCm);
    let maleBmr = 66 + (13.7 * weightInKg) + (5 * heightInCm);
    bmr = (maleBmr) - (6.8 * age);
    bmr = Math.round(bmr);

    // Calculate TDEE
     await calculateTDEE(bmr);

     console.log("zavrsio sam calculateTdee i pozivam izracunaj gornje vrednosti nutrienata");
     izracunajGornjeVrednostiNutrienata();
    // Show Results
    showResults(bmr, tdee);
  }
}
}


export async function calculateTDEE(bmr:number){  //mozda smeta async 
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
      case "Veoma aktivan":
      tdee = Math.round(bmr * 1.725)
      break;
    case "Ekstremno aktivan":
      tdee = Math.round(bmr * 1.9)
      break;
  }

  //ovde cemo da pozovemo funkciju 
  console.log("zavrsio sam calculateTdee sada")
  
}

export function showResults(bmr: number | undefined, tdee: number | undefined) {
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

const gain1Lb = document.querySelector('.gain-1lb');
const gain1HalfLb = document.querySelector('.gain-oneandhalflb');
const gain2Lbs = document.querySelector('.gain-2lb');


if (bmrResults) {
  bmrResults.innerHTML = ''; 
}
if (tdeeResults) {
  tdeeResults.innerHTML = ''; 
}
if (maintain) {
  maintain.innerHTML = ''; 
}
if (lose1Lb) {
  lose1Lb.innerHTML = '';  
}
if (lose1HalfLb) {
  lose1HalfLb.innerHTML = ''; 
}
if (lose2Lbs) {
  lose2Lbs.innerHTML = ''; 
}


if (gain1Lb) {
  gain1Lb.innerHTML = '';  
}
if (gain1HalfLb) {
  gain1HalfLb.innerHTML = ''; 
}
if (gain2Lbs) {
  gain2Lbs.innerHTML = ''; 
}



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
  tdePublicKopija=tdee;
}

//gubljenje

if (tdeeResults && tdee !== undefined) {
  maintain.innerHTML += ` ${tdee} Calories`;
}

if (tdeeResults && tdee !== undefined) {
  lose1Lb.innerHTML += ` ${tdee-500} Calories`;
}

if (tdeeResults && tdee !== undefined) {
  lose1HalfLb.innerHTML += ` ${tdee-750} Calories`;
}


//dodavanje
if (tdeeResults && tdee !== undefined) {
  lose2Lbs.innerHTML += ` ${tdee-1000} Calories`;
}

if (tdeeResults && tdee !== undefined) {
  gain1Lb.innerHTML += ` ${tdee+500} Calories`;
}

if (tdeeResults && tdee !== undefined) {
  gain1HalfLb.innerHTML += ` ${tdee+750} Calories`;
}
if (tdeeResults && tdee !== undefined) {
  lose2Lbs.innerHTML += ` ${tdee+1000} Calories`;
}


}




export function getFormValues() {
age = parseInt((document.getElementById('age') as HTMLInputElement).value);
weight = (document.getElementById('weight') as HTMLInputElement).value;
heightFt = parseInt((document.getElementById('height-feet') as HTMLInputElement).value);
//heightIn = parseInt((document.getElementById('height-inch') as HTMLInputElement).value);
gender = (document.getElementById('gender') as HTMLSelectElement).value;
activity = (document.getElementById('activity') as HTMLSelectElement).value;
breastfeeding = (document.getElementById('breast-feeding') as HTMLSelectElement).value;


}

// Convert weight to kg and height to cm
export function weightHeightConversions(weight: string | undefined, heightFt: number | undefined, /*heightIn: number | undefined*/) {
if (weight !== undefined) {
  weightInKg=parseFloat(weight) ; //=  parseFloat((parseFloat(weight) / 2.2).toFixed(2));
  console.log(weightInKg);
}
if (heightFt !== undefined) {
  heightInCm =heightFt; //((heightFt * 12) + heightIn);
  //heightInCm = heightToCm * 2.54;
}
}

// Show error
export function showError(error: string) {
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
export function clearError() {
const error = document.querySelector('.alert');
if (error) {
  error.remove();
}
}


const radioButtons = document.querySelectorAll('input[name="opcije"]');


const radioChange$ = fromEvent(radioButtons, 'change').pipe(
  map(event => (event.target as HTMLInputElement).value) // Koristite asertivni operator za tip HTMLInputElement
);



let izabranaOpcija = '';

radioChange$.subscribe(izabranaVrednost => {
  izabranaOpcija = izabranaVrednost;
  
  switch (izabranaVrednost) {
    case 'gubim05':
     tdePublic=tdePublicKopija-500;
     break;
    case 'gubim075':
      tdePublic=tdePublicKopija-750;
      break;
      case'gubim1':
      tdePublic=tdePublicKopija-1000;
      break;
    case 'dodajem05':
      tdePublic=tdePublicKopija+500;
      break;
    case 'dodajem075':
      tdePublic=tdePublicKopija+750;
      break;
    case 'dodajem1':
      tdePublic=tdePublicKopija+1000;
      break;
    case 'odrzavanje':
      tdePublic=tdePublicKopija;
      
    

  }


  console.log("Sada je vrednost za tdePublic:", tdePublic);
});