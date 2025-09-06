"use server";
import { getNearestMcDonalds } from "./googleplaces";

interface AuthData {
  api_key_private: string;
  api_key_public: string;
  status: "OK"; // We can set a literal type here since the value is always "OK"
  active: boolean;
  credits_forecast: number;
  credits_query: number;
  valid: boolean;
  restricted_website_public: string; // Use string for wildcard value "*"
  restricted_website_private: string; // Use string for wildcard value "*"
}

interface AuthError {
  api_key_private?: string; // Optional property since it might not be present
  status: "Error"; // We can set a literal type here
  valid: false; // We can set a literal type here
  message: string;
}
interface ForecastError {
  status: "Error"; // Can potentially be extended with more specific error codes
  message: string;
  venue_name?: string; // Optional property
  venue_address?: string; // Optional property
}

interface ForecastData {
  analysis: {
    venue_forecasted_busyness: number;
    venue_live_busyness: number;
    venue_live_busyness_available: boolean;
    venue_forecast_busyness_available: boolean;
    venue_live_forecasted_delta: number;
  };

  status: "OK"; // We can set a literal type here since the value is always "OK"
  venue_info: {
    venue_current_gmttime: string;
    venue_current_localtime: string;
    venue_id: string;
    venue_name: string;
    venue_timezone: string;
    venue_dwell_time_min: number;
    venue_dwell_time_max: number;
    venue_dwell_time_avg: number;
  };
}

interface ErrorResponse {
  status: "REQUEST_DENIED";
  error_message: string;
}

interface SearchResult {
  status: "OK";
  results: {
    formatted_address: string;
    lat: number;
    lng: number;
  }[];
}

const API_KEY = process.env.NEXT_PUBLIC_BESTTIME_PRIVATE_KEY ?? "";

const convertToColour = (busyness: number): string => {
  if (busyness <= 33) {
    return "g";
  } else if (busyness <= 66) {
    return "y";
  } else {
    return "r";
  }
};

export async function auth(): Promise<Boolean> {
  try {
    const response = await fetch(`https://besttime.app/api/v1/keys/${API_KEY}`);

    const data: AuthData | AuthError = await response.json();

    if (data.status === "Error" || data.valid === false) {
      return false;
    }

    if (data.credits_forecast === 0 || data.credits_query === 0) {
      return false;
    }
  } catch (error) {
    return false;
  }
  return true;
}

export async function getForecast(
  venue_name: string,
  venue_address: string,
  venue_lat: string,
  venue_lng: string,
): Promise<string> {
  const response = await auth().then(async (result) => {
    if (result === false) {
      return "There is an error or the API key ran out of calls";
    } else {
      try {
        const searchParams = new URLSearchParams({
          api_key_private: API_KEY,
          venue_name: venue_name,
          venue_address: venue_address,
        });

        const response = await fetch(
          `https://besttime.app/api/v1/forecasts/live?` +
            searchParams.toString(),
          {
            method: "POST",
          },
        );

        const data: ForecastData | ForecastError = await response.json();

        // Check not error
        if (data.status === "OK") {
          return convertToColour(data.analysis.venue_live_busyness);
        } else {
          const venue_name = "McDonald in Singapore";

          const venue_addresses: SearchResult | ErrorResponse =
            await getNearestMcDonalds(venue_lat, venue_lng);

          if (venue_addresses.status === "REQUEST_DENIED") {
            return "There is an error or the API key ran out of calls";
          }

          if (venue_addresses.status === "OK") {
            for (let address of venue_addresses.results) {
              const searchParams = new URLSearchParams({
                api_key_private: API_KEY,
                venue_name: venue_name,
                venue_address: address.formatted_address,
              });

              const response = await fetch(
                `https://besttime.app/api/v1/forecasts/live?` +
                  searchParams.toString(),
                {
                  method: "POST",
                },
              );

              const data: ForecastData | ForecastError = await response.json();
              if (data.status === "OK") {
                return convertToColour(data.analysis.venue_live_busyness);
              } else {
                continue;
              }
            }
          }
        }
      } catch (error) {
        return "There is an error or the API key ran out of calls";
      }
    }
  });

  return response ?? "error";
}

// class BestTimeAPI {
//   // Function to get density at location. Returns color: 'g', 'y', 'r'
//   async getDensity(
//     clinicName: string[],
//     clinicLocation: string[],
//   ): Promise<string[]> {
//     const result: string[] = [];
//     let count: number = 0;
//     for (let i: number = 0; i < clinicLocation.length; i++) {
//       // API has limit of 10 calls per second
//       if (count === 9) {
//         count = 0;
//         await new Promise((resolve) => setTimeout(resolve, 1000));
//       }
//       try {
//         //request for data of location
//         const data = await this.request(clinicName[i], clinicLocation[i]);
//         //get the busyness value of location
//         // console.log(JSON.stringify(data, null, 2));
//         let busynessValue: number = this.getBusynessValue(data);
//         // translate busyness value to colour
//         console.log(busynessValue);
//         let colour: string = this.translateToColour(busynessValue);
//         result[i] = colour;
//         count++;
//       } catch (error) {
//         console.error(
//           "Error fetching data for clinic:",
//           clinicLocation[i],
//           error,
//         );
//         result[i] = "error";
//       }
//     }
//     return result;
//   }

//   // API call
//   async request(clinicName: string, clinicLocation: string): Promise<any> {
//     try {
//       const params = new URLSearchParams({
//         api_key_private: process.env.NEXT_PUBLIC_BESTTIME_PRIVATE_KEY ?? "",
//         venue_name: clinicName,
//         venue_address: clinicLocation,
//       });
//       const response = await fetch(
//         `https://besttime.app/api/v1/forecasts/live?${params}`,
//         {
//           method: "POST",
//         },
//       );
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error("Error:", error);
//       throw error;
//     }
//   }

//   // Manipulate data to get busyness value
//   getBusynessValue(data: {
//     analysis: { venue_live_busyness: number };
//   }): number {
//     return data.analysis.venue_live_busyness;
//   }

//   // Translate busyness value to colour
//   translateToColour(busyness: number): string {
//     if (isNaN(busyness)) {
//       throw new Error("Invalid busyness value. Must be a number");
//     }
//     if (busyness <= 33) {
//       return "g";
//     } else if (busyness <= 66) {
//       return "y";
//     } else {
//       return "r";
//     }
//   }
// }

// //Test
// class Test {
//   name: string[] = ["McDonald's Tampines Green View"];
//   address: string[] = ["1 Tampines Street 41, Singapore 529203"];

//   bestTimeAPI: BestTimeAPI = new BestTimeAPI();
//   async callBestTimeAPI() {
//     try {
//       const result = await this.bestTimeAPI.getDensity(this.name, this.address);
//       console.log("Result:", result);
//     } catch (error) {
//       console.error("Error calling BestTimeAPI:", error);
//     }
//   }
// }

// const testInstance = new Test();
// testInstance.callBestTimeAPI();
