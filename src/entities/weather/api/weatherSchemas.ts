import { z } from 'zod';

// OpenWeatherMap One Call API 3.0 응답 스키마
export const OWMOneCallSchema = z.object({
  current: z.object({
    dt: z.number(),
    sunrise: z.number(),
    sunset: z.number(),
    temp: z.number(),
    feels_like: z.number(),
    humidity: z.number(),
    wind_speed: z.number(),
    uvi: z.number(),
    weather: z.array(
      z.object({
        id: z.number(),
        description: z.string(),
        icon: z.string(),
      })
    ).min(1),
  }),
  hourly: z.array(
    z.object({
      dt: z.number(),
      temp: z.number(),
      weather: z.array(z.object({ icon: z.string() })).min(1),
      pop: z.number(),
    })
  ),
  daily: z.array(
    z.object({
      dt: z.number(),
      temp: z.object({ min: z.number(), max: z.number() }),
      weather: z.array(z.object({ icon: z.string() })).min(1),
      pop: z.number(),
    })
  ).min(1),
});

// Air Pollution API 응답 스키마 (pm10, pm2_5는 누락 가능)
export const OWMAirPollutionSchema = z.object({
  list: z.array(
    z.object({
      components: z.object({
        pm2_5: z.number().optional(),
        pm10: z.number().optional(),
      }),
    })
  ),
});

// Reverse Geocoding API 응답 스키마
export const OWMReverseGeoSchema = z.array(
  z.object({
    name: z.string(),
    local_names: z.object({ ko: z.string().optional() }).optional(),
  })
);

export type OWMOneCall = z.infer<typeof OWMOneCallSchema>;
export type OWMAirPollution = z.infer<typeof OWMAirPollutionSchema>;
