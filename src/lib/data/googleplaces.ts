"use server";
import { NextResponse } from "next/server";
import { string } from "zod";

interface PlaceData {
  business_status: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    viewport: {
      northeast: {
        lat: number;
        lng: number;
      };
      southwest: {
        lat: number;
        lng: number;
      };
    };
  };

  icon: string;
  icon_background_color: string;
  icon_mask_base_uri: string;
  name: string;
  opening_hours?: { open_now: boolean }; // Optional property
  photos?: Photo[]; // Optional property
  place_id: string;
  plus_code: {
    compound_code: string;
    global_code: string;
  };
  rating: number;
  reference: string;
  types: string[];
  user_ratings_total: number;
}

interface Photo {
  height: number;
  html_attributions: string[];
  photo_reference: string;
  width: number;
}

interface PlaceSearchResult {
  html_attributions: string[];
  next_page_token: string;
  results: PlaceData[];
  status: "OK";
}

interface PlacesAPIError {
  error_message: string;
  html_attributions: string[];
  status: "REQUEST_DENIED"; // Allows for future error codes
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

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? "";

export async function getNearestMcDonalds(
  lat: string,
  lng: string,
): Promise<SearchResult | ErrorResponse> {
  try {
    const searchParams = new URLSearchParams({
      location: `${lat},${lng}`,
      key: API_KEY,
      query: "McDonald in Singapore",
    });

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?${searchParams.toString()}`,
    );

    // console.log(
    //   `https://maps.googleapis.com/maps/api/place/textsearch/json?${searchParams.toString()}`,
    // );

    const data: PlaceSearchResult | PlacesAPIError = await response.json();

    if (data.status === "REQUEST_DENIED") {
      const { error_message } = data;

      const errResp: ErrorResponse = {
        status: "REQUEST_DENIED",
        error_message: "Error",
      };

      return errResp;
    }

    if (data.status === "OK") {
      if ("results" in data) {
        const results = data.results.map((result) => {
          const { formatted_address, geometry } = result;
          const { location } = geometry;
          const { lat, lng } = location;

          return { formatted_address, lat, lng };
        });

        const searchResult: SearchResult = {
          status: "OK",
          results,
        };

        return searchResult;
      } else {
        const errResp: ErrorResponse = {
          status: "REQUEST_DENIED",
          error_message: "No results found",
        };

        return errResp;
      }
    }
  } catch (error) {
    const errResp: ErrorResponse = {
      status: "REQUEST_DENIED",
      error_message: "Error",
    };

    return errResp;
  }

  const errResp: ErrorResponse = {
    status: "REQUEST_DENIED",
    error_message: "Error",
  };

  return errResp;
}

interface PlaceIdResult {
  status: "OK";
  result: {
    place_id: string;
    rating: number;
    photo_reference: string;
  };
}

export async function getGooglePlaceId(
  query: string,
): Promise<PlaceIdResult | ErrorResponse> {
  try {
    const searchParams = new URLSearchParams({
      key: API_KEY,
      query: query,
    });

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?${searchParams.toString()}`,
    );

    const data: PlaceSearchResult | PlacesAPIError = await response.json();

    if (data.status === "REQUEST_DENIED") {
      const { error_message } = data;

      const errResp: ErrorResponse = {
        status: "REQUEST_DENIED",
        error_message: "Error",
      };

      return errResp;
    }

    if (data.status === "OK") {
      if ("results" in data) {
        const { place_id, rating, photos } = data.results[0];

        const photo_reference = photos ? photos[0].photo_reference : "";

        const result = { place_id, rating, photo_reference };

        const searchResult: PlaceIdResult = {
          status: "OK",
          result,
        };

        return searchResult;
      } else {
        const errResp: ErrorResponse = {
          status: "REQUEST_DENIED",
          error_message: "No results found",
        };

        return errResp;
      }
    }
  } catch (error) {
    const errResp: ErrorResponse = {
      status: "REQUEST_DENIED",
      error_message: "Error",
    };

    return errResp;
  }

  const errResp: ErrorResponse = {
    status: "REQUEST_DENIED",
    error_message: "Error",
  };

  return errResp;
}

export interface Review {
  author_name: string;
  author_url: string;
  language: string;
  original_language: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number; // Likely a Unix timestamp
  translated: boolean;
}

interface DetailsReviewsResult {
  html_attributions: any[]; // Type depends on context
  result: {
    reviews: Review[];
  };
  status: "OK";
}

interface ReviewsResult {
  status: "OK";
  result: {
    reviews: Review[];
  };
}

export async function getGooglePlaceReviews(
  placeId: string,
): Promise<ReviewsResult | ErrorResponse> {
  try {
    const searchParams = new URLSearchParams({
      key: API_KEY,
      fields: "reviews",
      placeid: `${placeId}`,
    });

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?${searchParams.toString()}`,
    );

    const data: DetailsReviewsResult | PlacesAPIError = await response.json();

    if (data.status === "REQUEST_DENIED") {
      const { error_message } = data;

      const errResp: ErrorResponse = {
        status: "REQUEST_DENIED",
        error_message: "Error",
      };

      return errResp;
    }

    if (data.status === "OK") {
      if ("result" in data) {
        const reviews = data.result.reviews;

        const searchResult: ReviewsResult = {
          status: "OK",
          result: {
            reviews,
          },
        };

        return searchResult;
      } else {
        const errResp: ErrorResponse = {
          status: "REQUEST_DENIED",
          error_message: "No results found",
        };

        return errResp;
      }
    }
  } catch (error) {
    const errResp: ErrorResponse = {
      status: "REQUEST_DENIED",
      error_message: "Error",
    };

    return errResp;
  }

  const errResp: ErrorResponse = {
    status: "REQUEST_DENIED",
    error_message: "Error",
  };

  return errResp;
}

interface ImageResult {
  status: "OK";
  result: {
    image: string;
  };
}

export async function getGooglePlaceImage(
  photo_reference: string,
): Promise<ImageResult | ErrorResponse> {
  try {
    const searchParams = new URLSearchParams({
      key: API_KEY,
      maxwidth: "1600",
      photo_reference: photo_reference,
    });

    const response: ImageResult | ErrorResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/photo?${searchParams.toString()}`,
    ).then(async (response) => {
      if (response.status === 200) {
        const result: ImageResult = {
          status: "OK",
          result: {
            image: `https://maps.googleapis.com/maps/api/place/photo?${searchParams.toString()}`,
          },
        };

        return result;
      } else {
        const errResp: ErrorResponse = {
          status: "REQUEST_DENIED",
          error_message: "Error",
        };

        return errResp;
      }
    });

    return response;
  } catch (error) {
    const errResp: ErrorResponse = {
      status: "REQUEST_DENIED",
      error_message: "Error",
    };

    return errResp;
  }
}

interface DetailsWebsiteResult {
  html_attributions: string[]; // Usually empty, but include for completeness
  result: Web;
  status: "OK"; // Assuming the status will always be "OK" for successful responses
}

interface Web {
  website: string;
}

interface WebsiteResult {
  status: "OK";
  result: {
    website: string;
  };
}

export async function getGooglePlaceWebsite(
  placeId: string,
): Promise<WebsiteResult | ErrorResponse> {
  try {
    const searchParams = new URLSearchParams({
      key: API_KEY,
      fields: "reviews",
      placeid: `${placeId}`,
    });

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?${searchParams.toString()}`,
    );

    const data: DetailsWebsiteResult | PlacesAPIError = await response.json();

    if (data.status === "REQUEST_DENIED") {
      const { error_message } = data;

      const errResp: ErrorResponse = {
        status: "REQUEST_DENIED",
        error_message: "Error",
      };

      return errResp;
    }

    if (data.status === "OK") {
      if ("result" in data) {
        const website = data.result.website;

        const searchResult: WebsiteResult = {
          status: "OK",
          result: {
            website,
          },
        };

        return searchResult;
      } else {
        const errResp: ErrorResponse = {
          status: "REQUEST_DENIED",
          error_message: "No results found",
        };

        return errResp;
      }
    }
  } catch (error) {
    const errResp: ErrorResponse = {
      status: "REQUEST_DENIED",
      error_message: "Error",
    };

    return errResp;
  }

  const errResp: ErrorResponse = {
    status: "REQUEST_DENIED",
    error_message: "Error",
  };

  return errResp;
}

// interface AddressComponent {
//   long_name: string;
//   short_name: string;
//   types: string[];
// }

// interface Geometry {
//   bounds: {
//     northeast: { lat: number; lng: number };
//     southwest: { lat: number; lng: number };
//   };
//   location: { lat: number; lng: number };
//   location_type: "ROOFTOP" | string; // Allow additional location_types
//   viewport: {
//     northeast: { lat: number; lng: number };
//     southwest: { lat: number; lng: number };
//   };
// }

// interface GeocodingResult {
//   address_components: AddressComponent[];
//   formatted_address: string;
//   geometry: Geometry;
//   place_id: string;
//   types: string[];
// }

// interface GeocodingResponse {
//   results: GeocodingResult[];
//   status: "OK" | string; // Allow additional statuses
// }

// interface GeocodingError {
//   error_message?: string; // Error messages might not be provided for all statuses
//   results: [];
//   status: "REQUEST_DENIED" | "ZERO_RESULTS" | string;
// }

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface Geometry {
  bounds: {
    northeast: {
      lat: number;
      lng: number;
    };
    southwest: {
      lat: number;
      lng: number;
    };
  };
  location: {
    lat: number;
    lng: number;
  };
  location_type: string;
  viewport: {
    northeast: {
      lat: number;
      lng: number;
    };
    southwest: {
      lat: number;
      lng: number;
    };
  };
}

interface Result {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
  types: string[];
}

interface GeocodingResponse {
  results: Result[];
  status: string;
}

interface GeoCodeResult {
  status: "OK";
  result: {
    lat: number;
    lng: number;
  };
}

export async function getLocationCord(
  address: string,
): Promise<GeoCodeResult | ErrorResponse> {
  try {
    const modifiedAddress = address.replace(/[#,]/g, "");
    const parsableAddress = modifiedAddress.replace(/[ ]/g, "+");

    const searchParams = new URLSearchParams({
      key: API_KEY,
      address: parsableAddress,
    });

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?${searchParams.toString()}`,
    );

    const data: GeocodingResponse = await response.json();

    if (data.status === "REQUEST_DENIED") {
      const errResp: ErrorResponse = {
        status: "REQUEST_DENIED",
        error_message: "Error",
      };

      return errResp;
    }

    if (data.status === "OK") {
      if ("results" in data) {
        const { lat, lng } = data.results[0].geometry.location;

        const result: GeoCodeResult = {
          status: "OK",
          result: {
            lat,
            lng,
          },
        };

        return result;
      } else {
        const errResp: ErrorResponse = {
          status: "REQUEST_DENIED",
          error_message: "No results found",
        };

        return errResp;
      }
    }
  } catch (error) {
    const errResp: ErrorResponse = {
      status: "REQUEST_DENIED",
      error_message: "Error",
    };

    return errResp;
  }

  const errResp: ErrorResponse = {
    status: "REQUEST_DENIED",
    error_message: "Error",
  };

  return errResp;
}

// async function main() {
//   // const test = await getNearestMcDonalds(
//   //   "1.32148166492796",
//   //   "103.66095280564",
//   // ).then((result) => {
//   //   console.log(result);
//   // });

//   const googlePlaceId = await getGooglePlaceId(
//     "ACUMED MEDICAL GROUP Blk 24 RAFFLES PLACE, 02, #05, CLIFFORD CENTRE, Singapore 048621",
//   );

//   if (googlePlaceId.status === "OK") {
//     const googlePlaceImage = await getGooglePlaceImage(
//       googlePlaceId.result.photo_reference,
//     );

//     const googlePlaceReviews = await getGooglePlaceReviews(
//       googlePlaceId.result.place_id,
//     );
//   }
// }

// main();
