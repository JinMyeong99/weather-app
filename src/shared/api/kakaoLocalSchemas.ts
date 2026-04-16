import { z } from 'zod';

export const KakaoAddressSearchSchema = z.object({
  documents: z.array(
    z.object({
      address_name: z.string(),
      x: z.string(),
      y: z.string(),
    })
  ),
});

export const KakaoCoord2RegionCodeSchema = z.object({
  documents: z.array(
    z.object({
      region_type: z.enum(['B', 'H']),
      address_name: z.string(),
      region_1depth_name: z.string(),
      region_2depth_name: z.string(),
      region_3depth_name: z.string(),
    })
  ),
});

export type KakaoAddressSearch = z.infer<typeof KakaoAddressSearchSchema>;
export type KakaoCoord2RegionCode = z.infer<typeof KakaoCoord2RegionCodeSchema>;
