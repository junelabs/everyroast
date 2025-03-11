import { supabase } from "@/integrations/supabase/client";
import { Roaster } from "@/components/roasters/RoasterCard";

// Fetch all roasters from Supabase
export const fetchRoasters = async (): Promise<Roaster[]> => {
  try {
    const { data, error } = await supabase
      .from('roasters')
      .select('*');
    
    if (error) {
      console.error('Error fetching roasters:', error);
      throw error;
    }
    
    // Transform the data to match the Roaster interface
    const roasters: Roaster[] = data.map(item => ({
      id: item.id,
      name: item.name,
      location: item.location,
      description: item.description,
      website: item.website,
      instagram: item.instagram,
      logo_url: item.logo_url,
      coffeeCount: Math.floor(Math.random() * 15) + 1 // Temporary random count until we implement coffee counting
    }));
    
    return roasters;
  } catch (error) {
    console.error('Error in fetchRoasters:', error);
    // Fall back to mock data if there's an error
    return roasterData;
  }
};

// Fetch a single roaster by ID from Supabase
export const fetchRoasterById = async (id: string): Promise<Roaster | null> => {
  try {
    const { data, error } = await supabase
      .from('roasters')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching roaster by ID:', error);
      throw error;
    }
    
    if (!data) return null;
    
    // Transform the data to match the Roaster interface
    const roaster: Roaster = {
      id: data.id,
      name: data.name,
      location: data.location,
      description: data.description,
      website: data.website,
      instagram: data.instagram,
      logo_url: data.logo_url,
      coffeeCount: Math.floor(Math.random() * 15) + 1 // Temporary random count until we implement coffee counting
    };
    
    return roaster;
  } catch (error) {
    console.error('Error in fetchRoasterById:', error);
    // Fall back to mock data if there's an error
    const roaster = roasterData.find(r => r.id === id);
    return roaster || null;
  }
};

// Keep the mock data as a fallback
const roasterData: Roaster[] = [
  {
    id: "1",
    name: "La Colombe Coffee Roasters",
    location: "Philadelphia, PA",
    website: "https://www.lacolombe.com",
    instagram: "@lacolombe",
    coffeeCount: 12
  },
  {
    id: "2",
    name: "Elixr Coffee Roasters",
    location: "Philadelphia, PA",
    website: "https://elixrcoffee.com",
    instagram: "@elixrcoffee",
    coffeeCount: 8
  },
  {
    id: "3",
    name: "ReAnimator Coffee",
    location: "Philadelphia, PA",
    website: "https://www.reanimatorcoffee.com",
    instagram: "@reanimatorcoffee",
    coffeeCount: 10
  },
  {
    id: "4",
    name: "Square One Coffee Roasters",
    location: "Lancaster, PA",
    website: "https://www.squareonecoffee.com",
    instagram: "@squareonecoffee",
    coffeeCount: 6
  },
  {
    id: "5",
    name: "Passenger Coffee",
    location: "Lancaster, PA",
    website: "https://www.passengercoffee.com",
    instagram: "@passengercoffee",
    coffeeCount: 9
  },
  {
    id: "6",
    name: "Elementary Coffee Co.",
    location: "Harrisburg, PA",
    website: "https://www.elementarycoffee.co",
    instagram: "@elementarycoffeeco",
    coffeeCount: 5
  },
  {
    id: "7",
    name: "Commonplace Coffee",
    location: "Pittsburgh, PA",
    website: "https://commonplacecoffee.com",
    instagram: "@commonplacecoffee",
    coffeeCount: 7
  },
  {
    id: "8",
    name: "Allegheny Coffee & Tea Exchange",
    location: "Pittsburgh, PA",
    website: "https://www.alleghenycoffee.com",
    instagram: "@alleghenycoffee",
    coffeeCount: 4
  },
  {
    id: "9",
    name: "Rothrock Coffee",
    location: "State College, PA",
    website: "https://www.rothrockcoffee.com",
    instagram: "@rothrockcoffee",
    coffeeCount: 6
  },
  {
    id: "10",
    name: "One Village Coffee",
    location: "Souderton, PA",
    website: "https://onevillagecoffee.com",
    instagram: "@onevillagecoffee",
    coffeeCount: 8
  },
  {
    id: "11",
    name: "Backyard Beans",
    location: "Lansdale, PA",
    website: "https://backyardbeans.com",
    instagram: "@backyardbeans",
    coffeeCount: 7
  },
  {
    id: "12",
    name: "Blind Tiger Coffee",
    location: "Philadelphia, PA",
    website: "https://www.blindtigercoffee.com",
    instagram: "@blindtigercoffee",
    coffeeCount: 5
  },
  {
    id: "13",
    name: "Ceremony Coffee Roasters",
    location: "Annapolis, MD",
    website: "https://ceremonycoffee.com",
    instagram: "@ceremonycoffee",
    coffeeCount: 11
  },
  {
    id: "14",
    name: "Vigilante Coffee",
    location: "Hyattsville, MD",
    website: "https://www.vigilantecoffee.com",
    instagram: "@vigilantecoffee",
    coffeeCount: 9
  },
  {
    id: "15",
    name: "Zeke's Coffee",
    location: "Baltimore, MD",
    website: "https://www.zekescoffee.com",
    instagram: "@zekescoffeebaltimore",
    coffeeCount: 8
  },
  {
    id: "16",
    name: "Vagrant Coffee",
    location: "Baltimore, MD",
    website: "https://vagrantcoffee.co",
    instagram: "@vagrantcoffee",
    coffeeCount: 6
  },
  {
    id: "17",
    name: "Thread Coffee Roasters",
    location: "Baltimore, MD",
    website: "https://www.threadcoffee.com",
    instagram: "@threadcoffee",
    coffeeCount: 5
  },
  {
    id: "18",
    name: "Chesapeake Bay Roasting Company",
    location: "Crofton, MD",
    website: "https://www.cbrccoffee.com",
    instagram: "@chesapeakebayroastingcompany",
    coffeeCount: 7
  },
  {
    id: "19",
    name: "Rise Up Coffee Roasters",
    location: "Easton, MD",
    website: "https://www.riseupcoffee.com",
    instagram: "@riseupcoffee",
    coffeeCount: 9
  },
  {
    id: "20",
    name: "Quartermaine Coffee Roasters",
    location: "Rockville, MD",
    website: "https://www.quartermaine.com",
    instagram: "@quartermainecoffee",
    coffeeCount: 6
  },
  {
    id: "21",
    name: "Caffe Pronto",
    location: "Annapolis, MD",
    website: "https://caffepronto.com",
    instagram: "@caffepronto",
    coffeeCount: 4
  },
  {
    id: "22",
    name: "Open Seas Coffee",
    location: "Ocean City, MD",
    website: "https://www.openseascoffee.com",
    instagram: "@openseascoffee",
    coffeeCount: 5
  },
  {
    id: "23",
    name: "Ceremony Coffee Roasters",
    location: "Baltimore, MD",
    website: "https://ceremonycoffee.com",
    instagram: "@ceremonycoffee",
    coffeeCount: 10
  },
  {
    id: "24",
    name: "Rook Coffee",
    location: "Long Branch, NJ",
    website: "https://www.rookcoffee.com",
    instagram: "@rookcoffee",
    coffeeCount: 8
  },
  {
    id: "25",
    name: "Mod Cup Coffee",
    location: "Jersey City, NJ",
    website: "https://modcup.com",
    instagram: "@modcupcoffee",
    coffeeCount: 7
  },
  {
    id: "26",
    name: "Small World Coffee",
    location: "Princeton, NJ",
    website: "https://smallworldcoffee.com",
    instagram: "@smallworldcoffee",
    coffeeCount: 9
  },
  {
    id: "27",
    name: "Black River Roasters",
    location: "Whitehouse Station, NJ",
    website: "https://blackriverroasters.com",
    instagram: "@blackriverroasters",
    coffeeCount: 6
  },
  {
    id: "28",
    name: "Java Love Coffee Roasting Co.",
    location: "Montclair, NJ",
    website: "https://javaloveroasters.com",
    instagram: "@javaloverockers",
    coffeeCount: 8
  },
  {
    id: "29",
    name: "Booskerdoo Coffee",
    location: "Asbury Park, NJ",
    website: "https://www.booskerdoo.com",
    instagram: "@booskerdoo",
    coffeeCount: 7
  },
  {
    id: "30",
    name: "OQ Coffee Company",
    location: "Highland Park, NJ",
    website: "https://www.oqcoffee.com",
    instagram: "@oqcoffee",
    coffeeCount: 5
  },
  {
    id: "31",
    name: "Penstock Coffee Roasters",
    location: "Highland Park, NJ",
    website: "https://penstockcoffee.com",
    instagram: "@penstockcoffee",
    coffeeCount: 6
  },
  {
    id: "32",
    name: "Hidden Grounds Coffee",
    location: "New Brunswick, NJ",
    website: "https://hiddengrounds.com",
    instagram: "@hiddengrounds",
    coffeeCount: 7
  },
  {
    id: "33",
    name: "Revolution Coffee Roasters",
    location: "Collingswood, NJ",
    website: "https://www.revolutioncoffeeroasters.com",
    instagram: "@revolutioncoffeeroasters",
    coffeeCount: 5
  },
  {
    id: "34",
    name: "Reggie's Roast",
    location: "Brick, NJ",
    website: "https://reggiesroast.com",
    instagram: "@reggiesroast",
    coffeeCount: 4
  },
  {
    id: "35",
    name: "Stumptown Coffee Roasters",
    location: "Brooklyn, NY",
    website: "https://www.stumptowncoffee.com",
    instagram: "@stumptowncoffee",
    coffeeCount: 12
  },
  {
    id: "36",
    name: "Sey Coffee",
    location: "Brooklyn, NY",
    website: "https://www.seycoffee.com",
    instagram: "@seycoffee",
    coffeeCount: 10
  },
  {
    id: "37",
    name: "Partners Coffee",
    location: "Brooklyn, NY",
    website: "https://www.partnerscoffee.com",
    instagram: "@partnerscoffee",
    coffeeCount: 9
  },
  {
    id: "38",
    name: "Cafe Grumpy",
    location: "Brooklyn, NY",
    website: "https://cafegrumpy.com",
    instagram: "@cafegrumpy",
    coffeeCount: 8
  },
  {
    id: "39",
    name: "Gimme! Coffee",
    location: "Ithaca, NY",
    website: "https://gimmecoffee.com",
    instagram: "@gimmecoffee",
    coffeeCount: 11
  },
  {
    id: "40",
    name: "Irving Farm Coffee Roasters",
    location: "New York, NY",
    website: "https://irvingfarm.com",
    instagram: "@irvingfarm",
    coffeeCount: 10
  },
  {
    id: "41",
    name: "Joe Coffee Company",
    location: "New York, NY",
    website: "https://joecoffeecompany.com",
    instagram: "@joecoffeenyc",
    coffeeCount: 9
  },
  {
    id: "42",
    name: "Counter Culture Coffee",
    location: "New York, NY",
    website: "https://counterculturecoffee.com",
    instagram: "@counterculturecoffee",
    coffeeCount: 14
  },
  {
    id: "43",
    name: "Forty Weight Coffee Roasters",
    location: "Ithaca, NY",
    website: "https://fortyweightcoffee.com",
    instagram: "@fortyweightcoffee",
    coffeeCount: 7
  },
  {
    id: "44",
    name: "Plowshares Coffee Roasters",
    location: "New York, NY",
    website: "https://www.plowsharescoffee.com",
    instagram: "@plowsharescoffee",
    coffeeCount: 8
  },
  {
    id: "45",
    name: "Driftaway Coffee",
    location: "Brooklyn, NY",
    website: "https://driftaway.coffee",
    instagram: "@driftawaycoffee",
    coffeeCount: 10
  },
  {
    id: "46",
    name: "City of Saints Coffee Roasters",
    location: "Brooklyn, NY",
    website: "https://cityofsaintscoffee.com",
    instagram: "@cityofsaintscoffee",
    coffeeCount: 7
  },
  {
    id: "47",
    name: "Birch Coffee",
    location: "New York, NY",
    website: "https://www.birchcoffee.com",
    instagram: "@birchcoffee",
    coffeeCount: 9
  },
  {
    id: "48",
    name: "Parlor Coffee",
    location: "Brooklyn, NY",
    website: "https://www.parlorcoffee.com",
    instagram: "@parlorcoffee",
    coffeeCount: 8
  },
  {
    id: "49",
    name: "Oslo Coffee Roasters",
    location: "Brooklyn, NY",
    website: "https://oslocoffee.com",
    instagram: "@oslocoffeeny",
    coffeeCount: 6
  },
  {
    id: "50",
    name: "Neat Coffee",
    location: "Darien, NY",
    website: "https://neatcoffee.com",
    instagram: "@neat_coffee",
    coffeeCount: 5
  },
  {
    id: "51",
    name: "For Five Coffee Roasters",
    location: "Queens, NY",
    website: "https://www.forfivecoffee.com",
    instagram: "@forfivecoffee",
    coffeeCount: 7
  },
  {
    id: "52",
    name: "Southdown Coffee",
    location: "Huntington, NY",
    website: "https://www.southdowncoffee.com",
    instagram: "@southdowncoffee",
    coffeeCount: 6
  },
  {
    id: "53",
    name: "Path Coffee Roasters",
    location: "Port Chester, NY",
    website: "https://pathcoffees.com",
    instagram: "@pathcoffee",
    coffeeCount: 5
  },
  {
    id: "54",
    name: "Stone Street Coffee Company",
    location: "Brooklyn, NY",
    website: "https://www.stonestreetcoffee.com",
    instagram: "@stonestreetcoffee",
    coffeeCount: 8
  },
  {
    id: "55",
    name: "Copper Horse Coffee",
    location: "Ithaca, NY",
    website: "https://copperhorsecoffee.com",
    instagram: "@copperhorsecoffee",
    coffeeCount: 6
  },
  {
    id: "56",
    name: "Poglut Roasting",
    location: "Webster, NY",
    website: "https://poglutroasting.com",
    instagram: "@poglutroasting",
    coffeeCount: 4
  }
];
