import { Observable, from } from 'rxjs';

const URLAdr="http://localhost:3000/groceries";
class MyService {
    
   getFood(foodName:string ) {
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
}

const myServiceInstance = new MyService();

export default myServiceInstance;

