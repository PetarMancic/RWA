export class MakroNutrienti
{
    private _proteini:number=0;
    private _ugljeniHidrati:number=0;
    private _masti:number=0;
    private _kalorije:number=0;


    get proteini(): number {
        return this._proteini;
      }
    
      // Setter za proteine
      set proteini(value: number) {
        this._proteini = value;
      }
    
      // Getter za ugljene hidrate
      get ugljeniHidrati(): number {
        return this._ugljeniHidrati;
      }
    
      // Setter za ugljene hidrate
      set ugljeniHidrati(value: number) {
        this._ugljeniHidrati = value;
      }
    
      // Getter za masti
      get masti(): number {
        return this._masti;
      }
    
      // Setter za masti
      set masti(value: number) {
        this._masti = value;
      }
    
      // Getter za kalorije
      get kalorije(): number {
        return this._kalorije;
      }
    
      // Setter za kalorije
      set kalorije(value: number) {
        this._kalorije = value;
      }
}