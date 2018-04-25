
import { environment } from '../environments/environment';

export class myGlobals {
	public static environmentName = environment.envName;
	public static host = environment.url;
	public static searchNearBy = "https://www.mapquestapi.com/search/v2/radius?key=hQozj3KhmzxAmwVATlpKEjpML2CneMB7&origin=39.750307,-104.999472&maxMatches=15&radius=20&ambiguities=ignore&hostedData=mqap.ntpois|name ILIKE ?|";	
}


