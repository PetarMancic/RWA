import { from } from 'rxjs';
import  myService  from './myService'; // Prilagodite putanju prema vašem servisu
import myServiceInstance from './myService';


const foodName = 'ovsene';
console.log("ijaooooo");
const URLAdr="http://localhost:3000/groceries";
function getFood(foodName:string ) {
    const promise = fetch(URLAdr + "/" + foodName)
      .then(response => {
        if (!response.ok) {
          throw new Error("Food not found!");
        }
        return response.json();
      })
      .catch(err => {
        console.error(err);
        return null; // Vratite null ili neku drugu odgovarajuću vrijednost u slučaju pogreške
      });

    return from(promise);
  }


  getFood(foodName).subscribe(
    foodData => {
      console.log('Food data:', foodData);
      // Ovdje možete manipulirati HTML-om ili prikazati podatke na drugi način
    },
    error => {
      console.error('Error fetching food:', error);
    }
  );
  