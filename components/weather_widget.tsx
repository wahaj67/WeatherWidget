"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react";

interface WeatherData {
  temprature: number;
  description: string;
  location: string;
  unit: string;
}
export default function WeatherWidget() {
  const [location, setLocation] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedLocation = location.trim();
    if (trimmedLocation === "") {
      setError("please enter a valid location");
      setWeather(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`
      );
      if (!response.ok) {
        throw new Error("city not found");
      }
      const data = await response.json();
      const weatherData: WeatherData = {
        temprature: data.current.temp_c,
        description: data.current.condition.text,
        location: data.location.name,
        unit: "C",
      };
      setWeather(weatherData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("city not found please try again");
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  };

  function getTempratureMessage(temperature: number, unit: string): string {
    if (unit === "C") {
      if (temperature < 0) {
        return `It's freezing at ${temperature}°C! Bundle up!`;
      } else if (temperature < 10) {
        return `It's quite cold at ${temperature}°C. Wear warm clothes.`;
      } else if (temperature < 20) {
        return `The temperature is ${temperature}°C. Comfortable for a light jacket. `;
      } else if (temperature < 30) {
        return `It's a pleasent ${temperature}°C Enjoy the nice weather! `;
      } else {
        return `It's hot at ${temperature}°C Stay hydrated!`;
      }
    } else {
      return `${temperature}°${unit}`;
    }
  }
  function getWeatherMessage(description: string): string {
    switch (description.toLowerCase()) {
      case "sunny":
        return "It's a beautiful sunny day!";
      case "cloudy":
        return "It's cloudy today .";
      case "overcast":
        return "The sky is overcast .";
      case "rain":
        return "Don't forget Umbrella! It's raining .";
      case "thunderstorm":
        return "Thunderstorms are expected today . ";
      case "snowing":
        return "Bundle up! It's snowing .";
      case "mist":
        return "It's misty outside .";
      case "fog":
        return "Be careful, there's fog outside .";
      default:
        return description;
    }
  }

  function getLocationMessage(location: string): string {
    const currentHours = new Date().getHours();
    const isNight = currentHours >= 18 || currentHours < 6;
    return `${location} ${isNight ? "at Night" : "During the day"}`;
  }

  return (
    <div className=" flex  justify-center items-center  min-h-screen bg-gray-100 p-4 " >
      <Card className="w-full mx-w-md mx-auto shadow-lg  p-4  sm:p-6 md:p-8 text-center">
        <CardHeader>
          <CardTitle >Weather Widget</CardTitle>
          <CardDescription>
            {" "}
            Search for the current weather conditions in your city
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex  items-center gap-2">
            <Input
              type="text"
              placeholder="Enter a city name "
              value={location}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setLocation(e.target.value)
              }
            />
            <Button type="submit" disabled={isLoading} >
              {isLoading ? "Loading..." : "Search"}{" "}
            </Button>
          </form>
          {error && <div className="mt-4 text-red-500"> {error}</div>}
          {weather && (
            <div className="mt-6 grid gap-4 ">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <ThermometerIcon className="w-6 h-6" />
                  {getTempratureMessage(weather.temprature, weather.unit)}
                </div>
              </div >
              <div className="flex items-center gap-2 ">
                <CloudIcon className="w-6 h-6" />
                <div>{getWeatherMessage(weather.description)}</div>
              </div>
              <div className="flex items-center gap-2 ">
                <MapPinIcon className="w-6 h-6" />
                <div>{getLocationMessage(weather.location)}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
 
