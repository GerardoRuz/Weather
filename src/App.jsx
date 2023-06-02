import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

const API_KEY = "4490f3b5fd564a37ac8143640232405";
const API_WEATHER = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&aqi=no`;

export default function App() {
  const [city, setCity] = useState("");
  const [error, setError] = useState({
    error: false,
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState({
    city: "",
    country: "",
    temperature: 0,
    condition: "",
    conditionText: "",
    icon: "",
  });
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    const fetchWeather = async () => {
      if (city.trim()) {
        try {
          const res = await fetch(`${API_WEATHER}&q=${encodeURIComponent(city)}`);
          const data = await res.json();

          if (data.error) {
            throw new Error(data.error.message);
          }

          const newWeather = {
            city: data.location.name,
            country: data.location.country,
            temperature: data.current.temp_c,
            condition: data.current.condition.code,
            conditionText: data.current.condition.text,
            icon: data.current.condition.icon,
          };

          setWeather(newWeather);
          setSearchHistory((prevSearches) => [...prevSearches, newWeather]);
        } catch (error) {
          setError({ error: true, message: error.message });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchWeather();
  }, [city]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError({ error: false, message: "" });
    setLoading(true);
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 2 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom sx={{ color: "#333" }}>
        Aplicacion Clima
      </Typography>
      <Box
        sx={{ display: "grid", gap: 2 }}
        component="form"
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <TextField
          id="city"
          label="Estado"
          variant="outlined"
          size="small"
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          error={error.error}
          helperText={error.message}
          sx={{ backgroundColor: "#fff", borderRadius: 4 }}
        />

        <LoadingButton
          type="submit"
          variant="contained"
          loading={loading}
          loadingIndicator="Buscando..."
          sx={{ backgroundColor: "#008000", color: "#FFFF00" }}
        >
          Buscar
        </LoadingButton>
      </Box>

      {weather.city && (
        <Box sx={{ mt: 2 }}>
          <Card>
            <CardContent>
              <Typography variant="h4" component="h2">
                {weather.city}, {weather.country}
              </Typography>
              <Box
                component="img"
                alt={weather.conditionText}
                src={weather.icon}
                sx={{ margin: "0 auto" }}
              />
              <Typography variant="h5" component="h3">
                {weather.temperature} °C
              </Typography>
              <Typography variant="h6" component="h4">
                {weather.conditionText}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}

      {searchHistory.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h4" component="h2" sx={{ color: "#333" }}>
            Busquedas Recientes
          </Typography>
          {searchHistory.map((weatherData, index) => (
            <Card key={index} sx={{ backgroundColor: "#f5f5f5" }}>
              <CardContent>
                <Typography variant="h5" component="h3">
                  {weatherData.city}, {weatherData.country}
                </Typography>
                <Box
                  component="img"
                  alt={weatherData.conditionText}
                  src={weatherData.icon}
                  sx={{ margin: "0 auto" }}
                />
                <Typography variant="body1" component="p">
                  {weatherData.temperature} °C
                </Typography>
                <Typography variant="body2" component="p">
                  {weatherData.conditionText}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Typography textAlign="center" sx={{ mt: 2, fontSize: "10px", color: "#777" }}>
        Autor: [Gerardo Ismael Ruz Can]
      </Typography>
    </Container>
  );
}
