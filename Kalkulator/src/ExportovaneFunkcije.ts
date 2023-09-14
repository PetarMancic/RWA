import { Observable, from } from "rxjs";
import { Groceries } from "./Groceries";

export class ExportovaneFunkcije{

 //URLAdr="http://localhost:3000/groceries";


    static  getFood(foodName: string): Observable<Groceries> {
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

}